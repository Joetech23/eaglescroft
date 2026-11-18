import webpush from 'web-push'
import { createServiceClient } from './supabase'
import { brandedEmail, emailEnabled, sendEmail } from './email'

type Notice = {
  userIds: string[]
  kind: 'message' | 'task' | 'ticket' | 'invoice' | 'payment' | 'meeting' | 'update' | 'project'
  title: string
  body?: string
  link?: string
  /** Email even if the person is active in the app (invoices, meetings…). Messages only email when they're away. */
  emailAlways?: boolean
}

const AWAY_MS = 10 * 60_000

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'
}

let vapidReady = false
function pushReady() {
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const priv = process.env.VAPID_PRIVATE_KEY
  if (!pub || !priv) return false
  if (!vapidReady) {
    webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:hello@eaglescroft.com.ng', pub, priv)
    vapidReady = true
  }
  return true
}

/**
 * One event → in-app notification (realtime bell), web push to every installed device, and a
 * branded email via Resend. Never throws: a failed channel must not break the action that triggered it.
 */
export async function notify(n: Notice) {
  const userIds = Array.from(new Set(n.userIds.filter(Boolean)))
  if (!userIds.length || !process.env.SUPABASE_SERVICE_ROLE_KEY) return
  try {
    const db = createServiceClient()
    await db.from('notifications').insert(userIds.map((user_id) => ({ user_id, kind: n.kind, title: n.title, body: n.body ?? null, link: n.link ?? null })))

    if (pushReady()) {
      const { data: subs } = await db.from('push_subscriptions').select('id, endpoint, p256dh, auth').in('user_id', userIds)
      const payload = JSON.stringify({ title: n.title, body: n.body ?? '', url: n.link ?? '/portal', tag: n.kind })
      await Promise.all(
        (subs ?? []).map(async (s) => {
          try {
            await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 60 * 60 * 24 })
          } catch (err) {
            const code = (err as { statusCode?: number }).statusCode
            if (code === 404 || code === 410) await db.from('push_subscriptions').delete().eq('id', s.id)
          }
        }),
      )
    }

    if (emailEnabled()) {
      const { data: people } = await db.from('profiles').select('email, notify_email, last_seen_at').in('id', userIds)
      const recipients = (people ?? []).filter(
        (p) => p.notify_email && (n.emailAlways || !p.last_seen_at || Date.now() - new Date(p.last_seen_at).getTime() > AWAY_MS),
      )
      await Promise.all(
        recipients.map((p) =>
          sendEmail({
            to: p.email,
            subject: n.title,
            html: brandedEmail({ title: n.title, body: n.body ?? '', cta: n.link ? { label: 'Open in portal', url: `${siteUrl()}${n.link}` } : undefined }),
          }),
        ),
      )
    }
  } catch (err) {
    console.error('notify failed', err)
  }
}

/** Everyone on a project except the actor: the client, assigned team members, and admins when no one is assigned. */
export async function projectAudience(projectId: string, exceptUserId?: string) {
  const db = createServiceClient()
  const [{ data: project }, { data: members }] = await Promise.all([
    db.from('projects').select('client_id').eq('id', projectId).single(),
    db.from('project_members').select('user_id').eq('project_id', projectId),
  ])
  let team = (members ?? []).map((m) => m.user_id as string)
  if (!team.length) {
    const { data: admins } = await db.from('profiles').select('id').eq('role', 'admin')
    team = (admins ?? []).map((a) => a.id as string)
  }
  return [project?.client_id as string, ...team].filter((id) => id && id !== exceptUserId)
}

/** Team side only (for things clients do that the team must act on). */
export async function projectTeam(projectId: string, exceptUserId?: string) {
  const all = await projectAudience(projectId, exceptUserId)
  const db = createServiceClient()
  const { data: project } = await db.from('projects').select('client_id').eq('id', projectId).single()
  return all.filter((id) => id !== project?.client_id)
}
