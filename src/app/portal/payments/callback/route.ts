import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/portal/supabase'
import { verifyTransaction } from '@/lib/portal/paystack'
import { recordPayment } from '@/lib/portal/payments'
import type { Currency } from '@/lib/portal/types'

/**
 * Paystack sends the payer back here. We never trust the redirect itself — the transaction is
 * re-verified with Paystack server-side before anything is recorded (the webhook does the same).
 */
export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get('reference')
  if (!reference) return NextResponse.redirect(new URL('/portal/billing', request.url))

  try {
    const tx = await verifyTransaction(reference)
    const invoiceId = tx.metadata?.invoice_id
    if (!invoiceId) return NextResponse.redirect(new URL('/portal/billing', request.url))

    if (tx.status === 'success') {
      await recordPayment(createServiceClient(), {
        invoiceId,
        amountMinor: tx.amount,
        currency: tx.currency as Currency,
        provider: 'paystack',
        reference: tx.reference,
        paidAt: tx.paid_at,
        raw: tx,
      })
      return NextResponse.redirect(new URL(`/portal/invoices/${invoiceId}?status=paid`, request.url))
    }
    const status = tx.status === 'abandoned' || tx.status === 'failed' ? 'failed' : 'pending'
    return NextResponse.redirect(new URL(`/portal/invoices/${invoiceId}?status=${status}`, request.url))
  } catch {
    return NextResponse.redirect(new URL('/portal/billing', request.url))
  }
}
