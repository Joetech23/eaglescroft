'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { createClient } from '@/lib/portal/supabase'
import { getViewer } from '@/lib/portal/session'
import { getTemplate } from '@/lib/portal/templates'
import { invoiceBalance } from '@/lib/portal/format'
import { initializeTransaction, paystackEnabled } from '@/lib/portal/paystack'
import { notify, projectAudience, projectTeam } from '@/lib/portal/notify'
import { displayName } from '@/lib/portal/people'
import type { Invoice } from '@/lib/portal/types'

const LOGIN_EMAIL_COOKIE = 'es_portal_login'

function origin() {
  const h = headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? (host?.startsWith('localhost') ? 'http' : 'https')
  return process.env.NEXT_PUBLIC_SITE_URL && !host?.startsWith('localhost') ? process.env.NEXT_PUBLIC_SITE_URL : `${proto}://${host}`
}

/* ─── Sign in: email → 6-digit code ─────────────────────────────────────── */

export async function sendLoginCode(formData: FormData) {
  const email = z.string().trim().toLowerCase().email().safeParse(formData.get('email'))
  if (!email.success) redirect('/portal/login?error=email')

  const supabase = createClient()
  // shouldCreateUser: false — portal accounts are created by Eaglescroft, never self-registered.
  // The response is ignored on purpose so the page never reveals whether an email has an account.
  await supabase.auth.signInWithOtp({
    email: email.data,
    options: { shouldCreateUser: false, emailRedirectTo: `${origin()}/auth/callback?next=/portal` },
  })

  cookies().set(LOGIN_EMAIL_COOKIE, email.data, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 30, path: '/portal' })
  const next = String(formData.get('next') || '')
  redirect(`/portal/login?step=code${next.startsWith('/') ? `&next=${encodeURIComponent(next)}` : ''}`)
}

export async function verifyLoginCode(formData: FormData) {
  const email = cookies().get(LOGIN_EMAIL_COOKIE)?.value
  const token = String(formData.get('code') || '').replace(/\D/g, '')
  if (!email) redirect('/portal/login?error=expired')
  if (token.length !== 6) redirect('/portal/login?step=code&error=code')

  const supabase = createClient()
  const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
  if (error) redirect('/portal/login?step=code&error=code')

  cookies().delete({ name: LOGIN_EMAIL_COOKIE, path: '/portal' })
  const next = String(formData.get('next') || '')
  redirect(next.startsWith('/portal') || next.startsWith('/admin') ? next : '/portal')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/portal/login')
}

/* ─── Brief ─────────────────────────────────────────────────────────────── */

export async function submitBrief(projectId: string, formData: FormData) {
  const { supabase, user, profile } = await getViewer()
  const { data: project } = await supabase.from('projects').select('service, title').eq('id', projectId).single()
  if (!project) redirect('/portal')

  const template = getTemplate(project.service)
  const brief: Record<string, string> = {}
  for (const q of template?.intake ?? []) {
    const v = String(formData.get(q.id) ?? '').trim().slice(0, 4000)
    if (v) brief[q.id] = v
  }
  const { error } = await supabase
    .from('projects')
    .update({ brief, brief_submitted_at: new Date().toISOString() })
    .eq('id', projectId)
  if (error) redirect(`/portal/projects/${projectId}?error=brief`)
  await notify({ userIds: await projectTeam(projectId, user.id), kind: 'project', title: `${displayName(profile)} submitted the brief`, body: project.title, link: `/admin/projects/${projectId}` })

  revalidatePath(`/portal/projects/${projectId}`)
  redirect(`/portal/projects/${projectId}?saved=brief#brief`)
}

/* ─── Tickets & revisions ───────────────────────────────────────────────── */

const ticketSchema = z.object({
  title: z.string().trim().min(3).max(140),
  body: z.string().trim().min(5).max(6000),
})

export async function createTicket(projectId: string, formData: FormData) {
  const { supabase, user, profile } = await getViewer()
  const parsed = ticketSchema.safeParse({ title: formData.get('title'), body: formData.get('body') })
  if (!parsed.success) redirect(`/portal/projects/${projectId}?error=ticket#tickets`)

  const isRevision = formData.get('is_revision') === 'on'
  if (isRevision) {
    // Revision allowance is enforced here, not just in the UI.
    const [{ data: project }, { count }] = await Promise.all([
      supabase.from('projects').select('revision_quota').eq('id', projectId).single(),
      supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('project_id', projectId).eq('is_revision', true),
    ])
    if (project && (count ?? 0) >= project.revision_quota) {
      redirect(`/portal/projects/${projectId}?error=quota#tickets`)
    }
  }

  const { data: ticket, error } = await supabase
    .from('tickets')
    .insert({ project_id: projectId, author_id: user.id, title: parsed.data.title, body: parsed.data.body, is_revision: isRevision })
    .select('id')
    .single()
  if (error || !ticket) redirect(`/portal/projects/${projectId}?error=ticket#tickets`)
  await notify({
    userIds: await projectTeam(projectId, user.id),
    kind: 'ticket',
    title: `${displayName(profile)} raised ${isRevision ? 'a revision request' : 'a ticket'}`,
    body: parsed.data.title,
    link: `/portal/projects/${projectId}/tickets/${ticket.id}`,
  })

  revalidatePath(`/portal/projects/${projectId}`)
  redirect(`/portal/projects/${projectId}/tickets/${ticket.id}`)
}

export async function postTicketMessage(projectId: string, ticketId: string, formData: FormData) {
  const { supabase, user, profile } = await getViewer()
  const body = String(formData.get('body') || '').trim().slice(0, 6000)
  if (body.length < 1) redirect(`/portal/projects/${projectId}/tickets/${ticketId}`)
  await supabase.from('ticket_messages').insert({ ticket_id: ticketId, author_id: user.id, body })
  await notify({ userIds: await projectAudience(projectId, user.id), kind: 'ticket', title: `${displayName(profile)} replied to a ticket`, body: body.slice(0, 180), link: `/portal/projects/${projectId}/tickets/${ticketId}` })
  revalidatePath(`/portal/projects/${projectId}/tickets/${ticketId}`)
  redirect(`/portal/projects/${projectId}/tickets/${ticketId}#latest`)
}

/* ─── Final review ──────────────────────────────────────────────────────── */

export async function submitReview(projectId: string, formData: FormData) {
  const { supabase, user, profile } = await getViewer()
  const rating = Number(formData.get('rating'))
  if (!(rating >= 1 && rating <= 5)) redirect(`/portal/projects/${projectId}?error=review#review`)
  const comment = String(formData.get('comment') || '').trim().slice(0, 3000) || null

  const { data: existing } = await supabase.from('reviews').select('id').eq('project_id', projectId).maybeSingle()
  const { error } = existing
    ? await supabase.from('reviews').update({ rating, comment }).eq('id', existing.id)
    : await supabase.from('reviews').insert({ project_id: projectId, author_id: user.id, rating, comment })
  if (error) redirect(`/portal/projects/${projectId}?error=review#review`)
  await notify({ userIds: await projectTeam(projectId, user.id), kind: 'project', title: `${displayName(profile)} left a ${rating}-star review`, body: comment ?? undefined, link: `/admin/projects/${projectId}` })

  revalidatePath(`/portal/projects/${projectId}`)
  redirect(`/portal/projects/${projectId}?saved=review#review`)
}

/* ─── Pay an invoice (Paystack) ─────────────────────────────────────────── */

export async function payInvoice(invoiceId: string) {
  const { supabase, user, profile } = await getViewer()
  if (!paystackEnabled()) redirect(`/portal/invoices/${invoiceId}?error=payments-off`)

  const { data } = await supabase
    .from('invoices')
    .select('*, invoice_items(*), payments(*)')
    .eq('id', invoiceId)
    .single()
  const invoice = data as Invoice | null
  if (!invoice || invoice.status !== 'sent') redirect(`/portal/invoices/${invoiceId}`)

  const amount = invoiceBalance(invoice)
  if (amount <= 0) redirect(`/portal/invoices/${invoiceId}`)

  let authorizationUrl: string
  try {
    const tx = await initializeTransaction({
      email: profile.email || user.email!,
      amountMinor: amount,
      currency: invoice.currency,
      reference: `${invoice.number}-${randomUUID().slice(0, 8)}`,
      callbackUrl: `${origin()}/portal/payments/callback`,
      metadata: { invoice_id: invoice.id, invoice_number: invoice.number },
    })
    authorizationUrl = tx.authorization_url
  } catch {
    redirect(`/portal/invoices/${invoiceId}?error=payment-start`)
  }
  redirect(authorizationUrl)
}
