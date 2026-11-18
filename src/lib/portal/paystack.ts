import { createHmac, timingSafeEqual } from 'crypto'

const API = 'https://api.paystack.co'
const secret = () => process.env.PAYSTACK_SECRET_KEY ?? ''

/** Online card payment shows only once a Paystack secret key is configured. */
export const paystackEnabled = () => Boolean(secret())

type InitArgs = {
  email: string
  amountMinor: number
  currency: string
  reference: string
  callbackUrl: string
  metadata: Record<string, unknown>
}

export async function initializeTransaction(args: InitArgs) {
  const res = await fetch(`${API}/transaction/initialize`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: args.email,
      amount: args.amountMinor,
      currency: args.currency,
      reference: args.reference,
      callback_url: args.callbackUrl,
      metadata: args.metadata,
    }),
    cache: 'no-store',
  })
  const json = await res.json()
  if (!res.ok || !json.status) throw new Error(json.message || 'Paystack could not start the payment')
  return json.data as { authorization_url: string; reference: string }
}

export type PaystackTransaction = {
  status: string
  reference: string
  amount: number
  currency: string
  paid_at: string | null
  metadata: { invoice_id?: string } | null
}

export async function verifyTransaction(reference: string) {
  const res = await fetch(`${API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret()}` },
    cache: 'no-store',
  })
  const json = await res.json()
  if (!res.ok || !json.status) throw new Error(json.message || 'Could not verify the payment')
  return json.data as PaystackTransaction
}

/** Webhooks are signed with HMAC-SHA512 of the raw body using the secret key. */
export function isValidSignature(rawBody: string, signature: string | null) {
  if (!signature || !secret()) return false
  const expected = createHmac('sha512', secret()).update(rawBody).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  return a.length === b.length && timingSafeEqual(a, b)
}
