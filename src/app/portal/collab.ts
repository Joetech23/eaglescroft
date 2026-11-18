'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getViewer } from '@/lib/portal/session'
import { createServiceClient } from '@/lib/portal/supabase'
import { notify, projectAudience, projectTeam } from '@/lib/portal/notify'
import { displayName } from '@/lib/portal/people'
import { freeSlots, formatDay, formatTime, lagosToday, meetingRoomUrl } from '@/lib/portal/slots'
import type { Attachment, TaskPriority, TaskStatus } from '@/lib/portal/types'

const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim()

/* ─── Push subscriptions ────────────────────────────────────────────────── */

export async function savePushSubscription(sub: { endpoint: string; p256dh: string; auth: string; userAgent?: string }) {
  const { supabase, user } = await getViewer()
  await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
  await supabase.from('push_subscriptions').insert({ user_id: user.id, endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth, user_agent: sub.userAgent?.slice(0, 300) ?? null })
}

export async function removePushSubscription(endpoint: string) {
  const { supabase } = await getViewer()
  await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint)
}

/* ─── Chat ──────────────────────────────────────────────────────────────── */

const attachmentSchema = z.array(z.object({ path: z.string(), name: z.string().max(200), size: z.number(), type: z.string().max(120) })).max(10)

export async function sendMessage(projectId: string, input: { body: string; attachments?: Attachment[]; replyTo?: string | null }) {
  const { supabase, user, profile } = await getViewer()
  const body = input.body.trim().slice(0, 8000)
  const attachments = attachmentSchema.parse(input.attachments ?? []).filter((a) => a.path.startsWith(`${projectId}/chat/`))
  if (!body && !attachments.length) return { ok: false as const }

  const { data, error } = await supabase
    .from('messages')
    .insert({ project_id: projectId, author_id: user.id, body, attachments, reply_to: input.replyTo ?? null })
    .select('*')
    .single()
  if (error || !data) return { ok: false as const }

  await supabase.from('conversation_reads').upsert({ project_id: projectId, user_id: user.id, last_read_at: data.created_at })

  const { data: project } = await supabase.from('projects').select('title').eq('id', projectId).single()
  await notify({
    userIds: await projectAudience(projectId, user.id),
    kind: 'message',
    title: `${displayName(profile)} · ${project?.title ?? 'Project chat'}`,
    body: body ? body.slice(0, 180) : `Sent ${attachments.length} file${attachments.length === 1 ? '' : 's'}`,
    link: `/portal/messages/${projectId}`,
  })
  return { ok: true as const, message: data }
}

export async function markConversationRead(projectId: string) {
  const { supabase, user } = await getViewer()
  await supabase.from('conversation_reads').upsert({ project_id: projectId, user_id: user.id, last_read_at: new Date().toISOString() })
  await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('user_id', user.id).eq('link', `/portal/messages/${projectId}`).is('read_at', null)
}

export async function editMessage(messageId: string, body: string) {
  const { supabase } = await getViewer()
  await supabase.from('messages').update({ body: body.trim().slice(0, 8000), edited_at: new Date().toISOString() }).eq('id', messageId)
}

export async function deleteMessage(messageId: string) {
  const { supabase } = await getViewer()
  await supabase.from('messages').update({ body: '', attachments: [], deleted_at: new Date().toISOString() }).eq('id', messageId)
}

/** Signed link for a chat attachment (storage RLS decides access). */
export async function attachmentUrl(path: string) {
  const { supabase } = await getViewer()
  const { data } = await supabase.storage.from('project-files').createSignedUrl(path, 300)
  return data?.signedUrl ?? null
}

/* ─── Tasks ─────────────────────────────────────────────────────────────── */

export async function createTask(formData: FormData) {
  const { supabase, user, profile, isTeam } = await getViewer()
  const projectId = str(formData, 'project_id')
  const title = str(formData, 'title').slice(0, 200)
  const back = str(formData, 'back') || `/portal/projects/${projectId}?tab=tasks`
  if (!projectId || !title) redirect(back)

  const assignee = str(formData, 'assignee_id') || null
  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      project_id: projectId,
      title,
      description: str(formData, 'description') || null,
      priority: (str(formData, 'priority') || 'medium') as TaskPriority,
      due_date: str(formData, 'due_date') || null,
      assignee_id: isTeam ? assignee : assignee ?? null,
      client_visible: isTeam ? formData.get('internal') !== 'on' : true,
      created_by: user.id,
    })
    .select('id, assignee_id')
    .single()
  if (!error && task) {
    const recipients = task.assignee_id && task.assignee_id !== user.id ? [task.assignee_id] : isTeam ? [] : await projectTeam(projectId, user.id)
    await notify({
      userIds: recipients,
      kind: 'task',
      title: task.assignee_id && task.assignee_id !== user.id ? `New task for you: ${title}` : `${displayName(profile)} added a task`,
      body: title,
      link: `/portal/projects/${projectId}?tab=tasks`,
    })
  }
  revalidatePath('/portal/tasks')
  redirect(back)
}

export async function setTaskStatus(taskId: string, status: TaskStatus) {
  const { supabase, user, profile } = await getViewer()
  const { data: task } = await supabase.from('tasks').update({ status }).eq('id', taskId).select('project_id, title, created_by, assignee_id').single()
  if (task && status === 'done') {
    const others = [task.created_by, task.assignee_id].filter((id): id is string => Boolean(id) && id !== user.id)
    await notify({ userIds: others, kind: 'task', title: `${displayName(profile)} completed a task`, body: task.title, link: `/portal/projects/${task.project_id}?tab=tasks` })
  }
  revalidatePath('/portal/tasks')
  if (task) revalidatePath(`/portal/projects/${task.project_id}`)
}

export async function updateTask(taskId: string, formData: FormData) {
  const { supabase, user, isTeam } = await getViewer()
  if (!isTeam) return
  const assignee = str(formData, 'assignee_id') || null
  const { data: before } = await supabase.from('tasks').select('assignee_id').eq('id', taskId).single()
  const { data: task } = await supabase
    .from('tasks')
    .update({
      title: str(formData, 'title').slice(0, 200),
      description: str(formData, 'description') || null,
      priority: (str(formData, 'priority') || 'medium') as TaskPriority,
      due_date: str(formData, 'due_date') || null,
      assignee_id: assignee,
      client_visible: formData.get('internal') !== 'on',
    })
    .eq('id', taskId)
    .select('project_id, title')
    .single()
  if (task && assignee && assignee !== before?.assignee_id && assignee !== user.id) {
    await notify({ userIds: [assignee], kind: 'task', title: `Task assigned to you: ${task.title}`, link: `/portal/projects/${task.project_id}?tab=tasks` })
  }
  revalidatePath('/portal/tasks')
  if (task) revalidatePath(`/portal/projects/${task.project_id}`)
}

export async function deleteTask(taskId: string) {
  const { supabase } = await getViewer()
  const { data } = await supabase.from('tasks').delete().eq('id', taskId).select('project_id').maybeSingle()
  revalidatePath('/portal/tasks')
  if (data) revalidatePath(`/portal/projects/${data.project_id}`)
}

/* ─── Meetings ──────────────────────────────────────────────────────────── */

/** Free slots for a host on a Lagos date — busy times read with the service key so clients never see others' meetings. */
export async function getSlots(hostId: string, date: string, minutes: number) {
  await getViewer()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < lagosToday()) return []
  const db = createServiceClient()
  const dayStart = new Date(`${date}T00:00:00Z`)
  const dayEnd = new Date(dayStart.getTime() + 2 * 86_400_000)
  const [{ data: blocks }, { data: busy }] = await Promise.all([
    db.from('availability').select('weekday, start_minute, end_minute').eq('user_id', hostId),
    db.from('meetings').select('starts_at, ends_at').eq('host_id', hostId).eq('status', 'scheduled')
      .gte('starts_at', new Date(dayStart.getTime() - 86_400_000).toISOString()).lt('starts_at', dayEnd.toISOString()),
  ])
  return freeSlots({ date, blocks: blocks ?? [], busy: busy ?? [], minutes: Math.min(120, Math.max(15, minutes)) }).map((d) => d.toISOString())
}

export async function bookMeeting(formData: FormData) {
  const { supabase, user, profile, isTeam } = await getViewer()
  const hostId = str(formData, 'host_id')
  const startsAt = str(formData, 'starts_at')
  const minutes = Number(str(formData, 'minutes') || 30)
  const title = str(formData, 'title').slice(0, 140) || 'Project call'
  const projectId = str(formData, 'project_id') || null
  const clientId = isTeam ? str(formData, 'client_id') || null : user.id

  // Re-check the slot is still free right before booking.
  const date = new Date(new Date(startsAt).getTime() + 60 * 60_000).toISOString().slice(0, 10)
  const open = await getSlots(hostId, date, minutes)
  if (!open.includes(new Date(startsAt).toISOString())) redirect('/portal/meetings/book?error=taken')

  const id = crypto.randomUUID()
  const start = new Date(startsAt)
  const end = new Date(start.getTime() + minutes * 60_000)
  const { error } = await supabase.from('meetings').insert({
    id,
    host_id: hostId,
    client_id: clientId,
    project_id: projectId,
    title,
    agenda: str(formData, 'agenda') || null,
    starts_at: start.toISOString(),
    ends_at: end.toISOString(),
    meeting_url: meetingRoomUrl(id),
    created_by: user.id,
  })
  if (error) redirect(`/portal/meetings/book?error=${error.code === '23P01' ? 'taken' : 'failed'}`)

  const when = `${formatDay(start)} at ${formatTime(start)} (Lagos time)`
  await notify({
    userIds: [hostId, clientId].filter((id): id is string => Boolean(id) && id !== user.id),
    kind: 'meeting',
    title: `Meeting booked: ${title}`,
    body: `${displayName(profile)} booked ${minutes} minutes on ${when}.`,
    link: `/portal/meetings`,
    emailAlways: true,
  })
  revalidatePath('/portal/meetings')
  redirect(`/portal/meetings?booked=${id}`)
}

export async function cancelMeeting(meetingId: string) {
  const { supabase, user, profile } = await getViewer()
  const { data: m } = await supabase.from('meetings').update({ status: 'cancelled' }).eq('id', meetingId).select('host_id, client_id, title, starts_at').single()
  if (m) {
    await notify({
      userIds: [m.host_id, m.client_id].filter((id): id is string => Boolean(id) && id !== user.id),
      kind: 'meeting',
      title: `Meeting cancelled: ${m.title}`,
      body: `${displayName(profile)} cancelled the ${formatDay(m.starts_at)} ${formatTime(m.starts_at)} meeting.`,
      link: '/portal/meetings',
      emailAlways: true,
    })
  }
  revalidatePath('/portal/meetings')
  redirect('/portal/meetings?cancelled=1')
}

/* ─── Settings ──────────────────────────────────────────────────────────── */

export async function updateProfile(formData: FormData) {
  const { supabase, user, isTeam } = await getViewer()
  const patch: Record<string, unknown> = {
    full_name: str(formData, 'full_name').slice(0, 120) || null,
    phone: str(formData, 'phone').slice(0, 40) || null,
    notify_email: formData.get('notify_email') === 'on',
  }
  if (isTeam) patch.signature = str(formData, 'signature').slice(0, 280) || null
  else patch.company = str(formData, 'company').slice(0, 120) || null
  const { error } = await supabase.from('profiles').update(patch).eq('id', user.id)
  revalidatePath('/portal', 'layout')
  redirect(`/portal/settings?${error ? 'error=profile' : 'saved=profile'}`)
}

export async function setAvatar(url: string | null) {
  const { supabase, user } = await getViewer()
  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${user.id}/`
  if (url && !url.startsWith(base)) return
  await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id)
  revalidatePath('/portal', 'layout')
}

export async function saveAvailability(formData: FormData) {
  const { supabase, user, isTeam } = await getViewer()
  if (!isTeam) redirect('/portal/settings')
  const rows: { user_id: string; weekday: number; start_minute: number; end_minute: number }[] = []
  for (let d = 0; d < 7; d++) {
    if (formData.get(`day_${d}`) !== 'on') continue
    const [sh, sm] = str(formData, `start_${d}`).split(':').map(Number)
    const [eh, em] = str(formData, `end_${d}`).split(':').map(Number)
    const start = sh * 60 + (sm || 0)
    const end = eh * 60 + (em || 0)
    if (Number.isFinite(start) && Number.isFinite(end) && end > start) rows.push({ user_id: user.id, weekday: d, start_minute: start, end_minute: end })
  }
  await supabase.from('availability').delete().eq('user_id', user.id)
  if (rows.length) await supabase.from('availability').insert(rows)
  revalidatePath('/portal/settings')
  redirect('/portal/settings?saved=availability#availability')
}
