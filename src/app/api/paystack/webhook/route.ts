import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/portal/supabase'
import { isValidSignature, verifyTransaction } from '@/lib/portal/paystack'
import { recordPayment } from '@/lib/portal/payments'
import type { Currency } from '@/lib/portal/types'

/** Paystack webhook — the source of truth for payments. Set the URL to /api/paystack/webhook in the Paystack dashboard. */
export async function POST(request: NextRequest) {
  const raw = await request.text()
  if (!isValidSignature(raw, request.headers.get('x-paystack-signature'))) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const event = JSON.parse(raw) as { event: string; data: { reference: string } }
  if (event.event === 'charge.success') {
    // Re-verify rather than trusting the payload's amount.
    const tx = await verifyTransaction(event.data.reference)
    const invoiceId = tx.metadata?.invoice_id
    if (tx.status === 'success' && invoiceId) {
      await recordPayment(createServiceClient(), {
        invoiceId,
        amountMinor: tx.amount,
        currency: tx.currency as Currency,
        provider: 'paystack',
        reference: tx.reference,
        paidAt: tx.paid_at,
        raw: tx,
      })
    }
  }
  return NextResponse.json({ ok: true })
}
