import type { SupabaseClient } from '@supabase/supabase-js'
import { formatMoney, invoicePaid, invoiceTotal } from './format'
import type { Currency, InvoiceItem, Payment } from './types'

type RecordArgs = {
  invoiceId: string
  amountMinor: number
  currency: Currency
  provider: 'paystack' | 'stripe' | 'manual'
  reference: string
  paidAt?: string | null
  raw?: unknown
  authorId?: string | null
}

/**
 * Records a successful payment once (the unique reference makes repeat webhooks/redirects no-ops),
 * then marks the invoice paid when the balance reaches zero and logs it on the project timeline.
 * Pass the service client for provider callbacks, or an admin's own client for manual payments.
 */
export async function recordPayment(db: SupabaseClient, args: RecordArgs) {
  const { data: existing } = await db.from('payments').select('id').eq('reference', args.reference).maybeSingle()
  if (existing) return { duplicate: true }

  const paidAt = args.paidAt ?? new Date().toISOString()
  const { error } = await db.from('payments').insert({
    invoice_id: args.invoiceId,
    amount_minor: args.amountMinor,
    currency: args.currency,
    provider: args.provider,
    reference: args.reference,
    status: 'success',
    paid_at: paidAt,
    raw: args.raw ?? null,
  })
  if (error) {
    if (error.code === '23505') return { duplicate: true } // raced another delivery of the same event
    throw error
  }

  const { data: invoice } = await db
    .from('invoices')
    .select('id, number, project_id, currency, status, invoice_items(quantity, unit_minor), payments(amount_minor, status)')
    .eq('id', args.invoiceId)
    .single()
  if (!invoice) return { duplicate: false }

  const total = invoiceTotal(invoice.invoice_items as Pick<InvoiceItem, 'quantity' | 'unit_minor'>[])
  const paid = invoicePaid(invoice.payments as Pick<Payment, 'amount_minor' | 'status'>[])
  if (paid >= total && invoice.status !== 'paid') {
    await db.from('invoices').update({ status: 'paid', paid_at: paidAt }).eq('id', invoice.id)
  }

  await db.from('project_updates').insert({
    project_id: invoice.project_id,
    author_id: args.authorId ?? null,
    body: `Payment of ${formatMoney(args.amountMinor, args.currency)} received for invoice ${invoice.number}.`,
  })
  return { duplicate: false }
}
