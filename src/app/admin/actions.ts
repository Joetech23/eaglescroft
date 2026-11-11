'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { requireAdmin } from '@/lib/portal/session'
import { createAnonClient, createServiceClient } from '@/lib/portal/supabase'
import { getTemplate } from '@/lib/portal/templates'
import { addDays, toMinor } from '@/lib/portal/format'
import { recordPayment } from '@/lib/portal/payments'
import type { Currency, DocumentKind, InvoiceKind, MilestoneStatus, ProjectStatus, TicketStatus } from '@/lib/portal/types'

const str = (fd: FormData, key: string) => String(fd.get(key) ?? '').trim()

/** "Goal | target" per line → [{ title, target }] */
function parseGoals(text: string) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [title, target] = l.split('|').map((s) => s.trim())
      return target ? { title, target } : { title }
    })
}
const parseLines = (text: string) => text.split('\n').map((l) => l.trim()).filter(Boolean)

/* ─── Clients ───────────────────────────────────────────────────────────── */

export async function createClientAccount(formData: FormData) {
  await requireAdmin()
  const email = z.string().trim().toLowerCase().email().safeParse(formData.get('email'))
  if (!email.success) redirect('/admin/clients?error=email')

  const service = createServiceClient()
  const { error } = await service.auth.admin.createUser({
    email: email.data,
    email_confirm: true,
    user_metadata: { full_name: str(formData, 'full_name'), company: str(formData, 'company'), phone: str(formData, 'phone') },
  })
  if (error) redirect(`/admin/clients?error=${error.message.toLowerCase().includes('already') ? 'exists' : 'create'}`)

  if (formData.get('send_code') === 'on') {
    await createAnonClient().auth.signInWithOtp({ email: email.data, options: { shouldCreateUser: false } })
  }
  revalidatePath('/admin/clients')
  redirect(`/admin/clients?created=${formData.get('send_code') === 'on' ? 'sent' : '1'}`)
}

/* ─── Projects ──────────────────────────────────────────────────────────── */

export async function createProject(formData: FormData) {
  const { supabase, user } = await requireAdmin()
  const template = getTemplate(str(formData, 'service'))
  const clientId = str(formData, 'client_id')
  const title = str(formData, 'title')
  if (!template || !clientId || !title) redirect('/admin/projects/new?error=missing')

  const start = str(formData, 'start_date') || new Date().toISOString().slice(0, 10)
  const lastOffset = Math.max(...template.milestones.map((m) => m.dayOffset))
  const currency = (str(formData, 'currency') === 'NGN' ? 'NGN' : 'USD') as Currency
  const retainer = toMinor(str(formData, 'retainer'))

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      client_id: clientId,
      title,
      service: template.key,
      summary: str(formData, 'summary') || null,
      goals: parseGoals(str(formData, 'goals')),
      features: parseLines(str(formData, 'features')),
      start_date: start,
      due_date: str(formData, 'due_date') || addDays(start, lastOffset),
      currency,
      budget_minor: toMinor(str(formData, 'budget')),
      deposit_percent: Number(str(formData, 'deposit_percent') || 50),
      revision_quota: Number(str(formData, 'revision_quota') || template.revisionQuota),
      retainer_minor: retainer || null,
    })
    .select('id, budget_minor, deposit_percent')
    .single()
  if (error || !project) redirect('/admin/projects/new?error=create')

  await supabase.from('milestones').insert(
    template.milestones.map((m, i) => ({
      project_id: project.id,
      title: m.title,
      description: m.description ?? null,
      due_date: addDays(start, m.dayOffset),
      sort: i,
      status: i === 0 ? 'in_progress' : 'upcoming',
    })),
  )
  await supabase.from('project_updates').insert({
    project_id: project.id,
    author_id: user.id,
    body: 'Welcome aboard. Your project is set up — please complete your brief so we can get moving.',
  })

  if (formData.get('deposit_invoice') === 'on' && project.budget_minor > 0) {
    const { data: inv } = await supabase
      .from('invoices')
      .insert({ project_id: project.id, kind: 'deposit', status: 'draft', currency, due_date: addDays(start, 3) })
      .select('id')
      .single()
    if (inv) {
      await supabase.from('invoice_items').insert({
        invoice_id: inv.id,
        description: `${title} — ${project.deposit_percent}% deposit`,
        quantity: 1,
        unit_minor: Math.round((project.budget_minor * project.deposit_percent) / 100),
      })
    }
  }
  redirect(`/admin/projects/${project.id}?saved=created`)
}

export async function updateProject(projectId: string, formData: FormData) {
  const { supabase } = await requireAdmin()
  const retainer = toMinor(str(formData, 'retainer'))
  const { error } = await supabase
    .from('projects')
    .update({
      title: str(formData, 'title'),
      status: str(formData, 'status') as ProjectStatus,
      progress: Math.max(0, Math.min(100, Number(str(formData, 'progress') || 0))),
      summary: str(formData, 'summary') || null,
      goals: parseGoals(str(formData, 'goals')),
      features: parseLines(str(formData, 'features')),
      start_date: str(formData, 'start_date') || null,
      due_date: str(formData, 'due_date') || null,
      budget_minor: toMinor(str(formData, 'budget')),
      deposit_percent: Number(str(formData, 'deposit_percent') || 50),
      revision_quota: Number(str(formData, 'revision_quota') || 0),
      retainer_minor: retainer || null,
    })
    .eq('id', projectId)
  revalidatePath(`/admin/projects/${projectId}`)
  redirect(`/admin/projects/${projectId}?${error ? 'error=update' : 'saved=project'}`)
}

/* ─── Timeline ──────────────────────────────────────────────────────────── */

export async function addMilestone(projectId: string, formData: FormData) {
  const { supabase } = await requireAdmin()
  const title = str(formData, 'title')
  if (title) {
    const { count } = await supabase.from('milestones').select('id', { count: 'exact', head: true }).eq('project_id', projectId)
    await supabase.from('milestones').insert({ project_id: projectId, title, due_date: str(formData, 'due_date') || null, sort: count ?? 0 })
  }
  revalidatePath(`/admin/projects/${projectId}`)
  redirect(`/admin/projects/${projectId}#timeline`)
}

export async function setMilestoneStatus(projectId: string, milestoneId: string, status: MilestoneStatus) {
  const { supabase } = await requireAdmin()
  await supabase.from('milestones').update({ status }).eq('id', milestoneId)
  revalidatePath(`/admin/projects/${projectId}`)
  redirect(`/admin/projects/${projectId}#timeline`)
}

export async function deleteMilestone(projectId: string, milestoneId: string) {
  const { supabase } = await requireAdmin()
  await supabase.from('milestones').delete().eq('id', milestoneId)
  revalidatePath(`/admin/projects/${projectId}`)
  redirect(`/admin/projects/${projectId}#timeline`)
}

export async function postUpdate(projectId: string, formData: FormData) {
  const { supabase, user } = await requireAdmin()
  const body = str(formData, 'body').slice(0, 4000)
  if (body) await supabase.from('project_updates').insert({ project_id: projectId, author_id: user.id, body })
  revalidatePath(`/admin/projects/${projectId}`)
  redirect(`/admin/projects/${projectId}#updates`)
}

/* ─── Tickets ───────────────────────────────────────────────────────────── */

export async function setTicketStatus(projectId: string, ticketId: string, status: TicketStatus) {
  const { supabase } = await requireAdmin()
  await supabase.from('tickets').update({ status }).eq('id', ticketId)
  revalidatePath(`/admin/projects/${projectId}`)
  redirect(`/admin/projects/${projectId}#tickets`)
}

/* ─── Invoices & payments ───────────────────────────────────────────────── */

export async function createInvoice(projectId: string, formData: FormData) {
  const { supabase } = await requireAdmin()
  const descriptions = formData.getAll('item_description').map(String)
  const amounts = formData.getAll('item_amount').map(String)
  const items = descriptions
    .map((d, i) => ({ description: d.trim(), unit_minor: toMinor(amounts[i] ?? '') }))
    .filter((it) => it.description && it.unit_minor > 0)
  if (!items.length) redirect(`/admin/projects/${projectId}?error=invoice#billing`)

  const send = formData.get('intent') === 'send'
  const { data: project } = await supabase.from('projects').select('currency').eq('id', projectId).single()
  const { data: inv, error } = await supabase
    .from('invoices')
    .insert({
      project_id: projectId,
      kind: (str(formData, 'kind') || 'milestone') as InvoiceKind,
      status: send ? 'sent' : 'draft',
      currency: project?.currency ?? 'USD',
      due_date: str(formData, 'due_date') || null,
      issued_at: send ? new Date().toISOString() : null,
      notes: str(formData, 'notes') || null,
    })
    .select('id')
    .single()
  if (error || !inv) redirect(`/admin/projects/${projectId}?error=invoice#billing`)

  await supabase.from('invoice_items').insert(items.map((it, i) => ({ ...it, invoice_id: inv.id, quantity: 1, sort: i })))
  revalidatePath(`/admin/projects/${projectId}`)
  redirect(`/admin/projects/${projectId}?saved=invoice#billing`)
}

export async function setInvoiceStatus(projectId: string, invoiceId: string, status: 'sent' | 'void') {
  const { supabase } = await requireAdmin()
  await supabase
    .from('invoices')
    .update(status === 'sent' ? { status, issued_at: new Date().toISOString() } : { status })
    .eq('id', invoiceId)
  revalidatePath(`/admin/projects/${projectId}`)
  redirect(`/admin/projects/${projectId}#billing`)
}

export async function recordManualPayment(projectId: string, invoiceId: string, formData: FormData) {
  const { supabase, user } = await requireAdmin()
  const amount = toMinor(str(formData, 'amount'))
  const { data: inv } = await supabase.from('invoices').select('currency').eq('id', invoiceId).single()
  if (amount > 0 && inv) {
    await recordPayment(supabase, {
      invoiceId,
      amountMinor: amount,
      currency: inv.currency as Currency,
      provider: 'manual',
      reference: str(formData, 'reference') || `manual-${randomUUID().slice(0, 8)}`,
      authorId: user.id,
    })
  }
  revalidatePath(`/admin/projects/${projectId}`)
  redirect(`/admin/projects/${projectId}?saved=payment#billing`)
}

/* ─── Documents (file goes browser → storage; this records it) ──────────── */

export async function addDocument(projectId: string, doc: { title: string; kind: DocumentKind; storagePath: string; size: number }) {
  const { supabase, user } = await requireAdmin()
  if (!doc.storagePath.startsWith(`${projectId}/`)) throw new Error('Invalid path')
  const { error } = await supabase.from('documents').insert({
    project_id: projectId,
    title: doc.title.slice(0, 200),
    kind: doc.kind,
    storage_path: doc.storagePath,
    size_bytes: doc.size,
    uploaded_by: user.id,
  })
  if (error) throw error
  revalidatePath(`/admin/projects/${projectId}`)
}

export async function deleteDocument(projectId: string, documentId: string) {
  const { supabase } = await requireAdmin()
  const { data: doc } = await supabase.from('documents').select('storage_path').eq('id', documentId).single()
  if (doc) {
    await supabase.storage.from('project-files').remove([doc.storage_path])
    await supabase.from('documents').delete().eq('id', documentId)
  }
  revalidatePath(`/admin/projects/${projectId}`)
  redirect(`/admin/projects/${projectId}#files`)
}
