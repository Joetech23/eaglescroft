import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { getViewer } from '@/lib/portal/session'
import { formatDate, formatMoney, invoiceBalance, invoicePaid, invoiceStatusLabel, invoiceTotal } from '@/lib/portal/format'
import { paystackEnabled } from '@/lib/portal/paystack'
import { payInvoice } from '@/app/portal/actions'
import SubmitButton from '@/components/portal/SubmitButton'
import PrintButton from '@/components/portal/PrintButton'
import { Badge, Notice, invoiceTone } from '@/components/portal/ui'
import { siteConfig } from '@/lib/site'
import type { Invoice, Profile } from '@/lib/portal/types'

export const metadata: Metadata = { title: 'Invoice' }

const notices: Record<string, { tone: 'green' | 'red' | 'blue'; text: string }> = {
  paid: { tone: 'green', text: 'Payment received — thank you. A receipt is in your transaction history.' },
  pending: { tone: 'blue', text: 'We’re confirming your payment with the bank. This page will update shortly.' },
  'payments-off': { tone: 'blue', text: 'Card payments are being set up. Please pay by bank transfer using the details below.' },
  'payment-start': { tone: 'red', text: 'We couldn’t start the payment. Please try again or contact us.' },
  failed: { tone: 'red', text: 'The payment didn’t go through. No money was taken — please try again.' },
}

export default async function InvoicePage({ params, searchParams }: { params: { id: string }; searchParams: { status?: string; error?: string } }) {
  const { supabase, profile } = await getViewer()
  const { data } = await supabase
    .from('invoices')
    .select('*, invoice_items(*), payments(*), projects(title, client_id)')
    .eq('id', params.id)
    .maybeSingle()
  if (!data) notFound()
  const invoice = data as Invoice & { projects: { title: string; client_id: string } | null }

  // Bill-to details: the client sees their own profile; an admin looks up the project's client.
  let billTo: Pick<Profile, 'full_name' | 'company' | 'email'> = profile
  if (profile.role === 'admin' && invoice.projects?.client_id && invoice.projects.client_id !== profile.id) {
    const { data: client } = await supabase.from('profiles').select('full_name, company, email').eq('id', invoice.projects.client_id).maybeSingle()
    if (client) billTo = client
  }

  const items = [...(invoice.invoice_items ?? [])].sort((a, b) => a.sort - b.sort)
  const total = invoiceTotal(items)
  const paid = invoicePaid(invoice.payments)
  const balance = invoiceBalance(invoice)
  const settled = invoice.status === 'paid' || (invoice.status === 'sent' && balance === 0)
  const notice = notices[searchParams.status ?? ''] ?? notices[searchParams.error ?? '']
  const canPay = invoice.status === 'sent' && balance > 0 && profile.role !== 'admin'

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/portal/billing" className="inline-flex items-center gap-2 text-sm font-semibold text-navy/60 hover:text-navy">
          <ArrowLeft className="h-4 w-4" /> Billing
        </Link>
        <PrintButton />
      </div>

      {notice && <div className="mb-6 print:hidden"><Notice tone={notice.tone}>{notice.text}</Notice></div>}

      <article className="mx-auto max-w-3xl rounded-[24px] border border-navy/10 bg-white p-6 shadow-medium sm:p-10 print:border-0 print:shadow-none">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-navy/[0.08] pb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/brand/eagle-gold.png" alt="" width={34} height={34} className="h-8 w-auto object-contain" />
              <span className="font-display text-[17px] font-semibold tracking-[0.14em] text-navy">EAGLESCROFT</span>
            </div>
            <div className="mt-3 text-[13px] leading-relaxed text-navy/55">
              {siteConfig.legalName}<br />{siteConfig.location}<br />{siteConfig.email}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy/45">Invoice</div>
            <div className="mt-1 font-display text-[1.6rem] font-semibold text-navy">{invoice.number}</div>
            <div className="mt-2"><Badge tone={settled ? 'green' : invoiceTone[invoice.status]}>{settled ? 'Paid' : invoiceStatusLabel[invoice.status]}</Badge></div>
          </div>
        </header>

        <div className="grid gap-6 py-8 sm:grid-cols-3">
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-wider text-navy/45">Billed to</div>
            <div className="mt-1.5 text-[14px] font-semibold text-navy">{billTo.company || billTo.full_name}</div>
            <div className="text-[13px] text-navy/55">{billTo.company ? billTo.full_name : null}</div>
            <div className="text-[13px] text-navy/55">{billTo.email}</div>
          </div>
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-wider text-navy/45">Project</div>
            <div className="mt-1.5 text-[14px] font-semibold text-navy">{invoice.projects?.title}</div>
            <div className="text-[13px] capitalize text-navy/55">{invoice.kind} invoice</div>
          </div>
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-wider text-navy/45">Dates</div>
            <div className="mt-1.5 text-[13px] text-navy/70">Issued {formatDate(invoice.issued_at ?? invoice.created_at)}</div>
            <div className="text-[13px] text-navy/70">Due {formatDate(invoice.due_date)}</div>
          </div>
        </div>

        <table className="w-full text-left text-[14px]">
          <thead className="border-y border-navy/[0.08] font-mono text-[10.5px] uppercase tracking-wider text-navy/45">
            <tr>
              <th className="py-3 font-medium">Description</th>
              <th className="py-3 text-right font-medium">Qty</th>
              <th className="py-3 text-right font-medium">Unit</th>
              <th className="py-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/[0.06]">
            {items.map((it) => (
              <tr key={it.id}>
                <td className="py-3.5 pr-3 text-navy/85">{it.description}</td>
                <td className="py-3.5 text-right text-navy/65">{Number(it.quantity)}</td>
                <td className="py-3.5 text-right text-navy/65">{formatMoney(it.unit_minor, invoice.currency)}</td>
                <td className="py-3.5 text-right font-semibold text-navy">{formatMoney(Math.round(Number(it.quantity) * it.unit_minor), invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="ml-auto mt-6 max-w-xs space-y-2 text-[14px]">
          <div className="flex justify-between"><dt className="text-navy/60">Total</dt><dd className="font-semibold text-navy">{formatMoney(total, invoice.currency)}</dd></div>
          <div className="flex justify-between"><dt className="text-navy/60">Paid</dt><dd className="font-semibold text-[#178a3c]">{formatMoney(paid, invoice.currency)}</dd></div>
          <div className="flex justify-between border-t border-navy/[0.08] pt-2 text-[16px]"><dt className="font-semibold text-navy">Balance due</dt><dd className="font-display font-semibold text-navy">{formatMoney(balance, invoice.currency)}</dd></div>
        </dl>

        {invoice.notes && <p className="mt-8 whitespace-pre-line rounded-2xl bg-[#f6f8fc] p-4 text-[13.5px] text-navy/70">{invoice.notes}</p>}

        {invoice.status === 'sent' && balance > 0 && (
          <div className="mt-8 rounded-2xl border border-navy/10 p-5">
            <div className="font-mono text-[10.5px] uppercase tracking-wider text-navy/45">Pay by bank transfer</div>
            <dl className="mt-3 grid gap-3 text-[14px] sm:grid-cols-3">
              <div><dt className="text-[12px] text-navy/50">Account name</dt><dd className="font-semibold text-navy">{siteConfig.bank.accountName}</dd></div>
              <div><dt className="text-[12px] text-navy/50">Bank</dt><dd className="font-semibold text-navy">{siteConfig.bank.bank}</dd></div>
              <div><dt className="text-[12px] text-navy/50">Account number</dt><dd className="font-mono text-[15px] font-semibold tracking-wider text-navy">{siteConfig.bank.accountNumber}</dd></div>
            </dl>
            <p className="mt-3 text-[12.5px] text-navy/55">Use <strong className="text-navy">{invoice.number}</strong> as the payment reference. We&rsquo;ll mark it paid as soon as it lands.</p>
          </div>
        )}

        {canPay && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold-400/25 bg-gold-400/[0.06] p-5 print:hidden">
            <div>
              <div className="font-display text-[15px] font-semibold text-navy">Pay {formatMoney(balance, invoice.currency)} securely</div>
              <div className="text-[13px] text-navy/60">{paystackEnabled() ? 'Card, bank or transfer via Paystack.' : 'Card payments are coming soon. Pay by bank transfer using the details above.'}</div>
            </div>
            {paystackEnabled() && (
              <form action={payInvoice.bind(null, invoice.id)}>
                <SubmitButton pendingText="Opening checkout…"><CreditCard className="h-4 w-4" /> Pay now</SubmitButton>
              </form>
            )}
          </div>
        )}
      </article>
    </>
  )
}
