import type { Currency, Invoice, InvoiceItem, Payment, ProjectStatus, InvoiceStatus, TicketStatus, MilestoneStatus } from './types'

/** Amounts are stored in minor units (cents / kobo). */
export function formatMoney(minor: number, currency: Currency) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: minor % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(minor / 100)
}

/** "1,250.50" typed by an admin → 125050 */
export function toMinor(input: string | number) {
  const n = typeof input === 'number' ? input : Number(String(input).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

export function invoiceTotal(items: Pick<InvoiceItem, 'quantity' | 'unit_minor'>[] = []) {
  return items.reduce((sum, i) => sum + Math.round(Number(i.quantity) * i.unit_minor), 0)
}

export function invoicePaid(payments: Pick<Payment, 'amount_minor' | 'status'>[] = []) {
  return payments.filter((p) => p.status === 'success').reduce((sum, p) => sum + p.amount_minor, 0)
}

export function invoiceBalance(inv: Pick<Invoice, 'invoice_items' | 'payments'>) {
  return Math.max(0, invoiceTotal(inv.invoice_items) - invoicePaid(inv.payments))
}

export function formatDate(iso: string | null | undefined, withTime = false) {
  if (!iso) return '—'
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    timeZone: 'UTC',
  })
}

/** "today", "3 days ago" — for the activity feed */
export function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  return formatDate(iso)
}

export function addDays(isoDate: string, days: number) {
  const d = new Date(`${isoDate}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export const projectStatusLabel: Record<ProjectStatus, string> = {
  onboarding: 'Onboarding',
  in_progress: 'In progress',
  in_review: 'In review',
  completed: 'Completed',
  on_hold: 'On hold',
}

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Due',
  paid: 'Paid',
  void: 'Void',
}

export const ticketStatusLabel: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
}

export const milestoneStatusLabel: Record<MilestoneStatus, string> = {
  upcoming: 'Upcoming',
  in_progress: 'In progress',
  done: 'Done',
}
