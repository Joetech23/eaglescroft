import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewer } from '@/lib/portal/session'
import { formatDate, formatMoney, invoiceBalance, invoiceStatusLabel, invoiceTotal } from '@/lib/portal/format'
import { Badge, Card, Empty, PageHeader, invoiceTone } from '@/components/portal/ui'
import type { Invoice, Payment } from '@/lib/portal/types'

export const metadata: Metadata = { title: 'Billing' }

export default async function BillingPage() {
  const { supabase } = await getViewer()
  const [{ data: invs }, { data: pays }] = await Promise.all([
    supabase.from('invoices').select('*, invoice_items(quantity, unit_minor), payments(amount_minor, status), projects(title)').neq('status', 'draft').order('created_at', { ascending: false }),
    supabase.from('payments').select('*, invoices(number)').eq('status', 'success').order('paid_at', { ascending: false }),
  ])
  const invoices = (invs ?? []) as (Invoice & { projects: { title: string } | null })[]
  const payments = (pays ?? []) as (Payment & { invoices: { number: string } | null })[]

  return (
    <>
      <PageHeader eyebrow="Billing" title="Invoices & payments." intro="Every invoice for your projects, and a full history of what you’ve paid." />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card title="Invoices" padded={false}>
          {invoices.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-[14px]">
                <thead className="font-mono text-[10.5px] uppercase tracking-wider text-navy/45">
                  <tr>
                    <th className="px-6 py-3 font-medium">Invoice</th>
                    <th className="px-3 py-3 font-medium">Project</th>
                    <th className="px-3 py-3 font-medium">Due</th>
                    <th className="px-3 py-3 text-right font-medium">Amount</th>
                    <th className="px-6 py-3 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/[0.07]">
                  {invoices.map((inv) => {
                    const settled = inv.status === 'paid' || (inv.status === 'sent' && invoiceBalance(inv) === 0)
                    return (
                      <tr key={inv.id} className="hover:bg-subtle">
                        <td className="px-6 py-3.5"><Link href={`/portal/invoices/${inv.id}`} className="font-semibold text-navy hover:text-gold-600">{inv.number}</Link></td>
                        <td className="px-3 py-3.5 text-navy/65">{inv.projects?.title}</td>
                        <td className="px-3 py-3.5 text-navy/65">{formatDate(inv.due_date)}</td>
                        <td className="px-3 py-3.5 text-right font-semibold text-navy">{formatMoney(invoiceTotal(inv.invoice_items), inv.currency)}</td>
                        <td className="px-6 py-3.5 text-right"><Badge tone={settled ? 'green' : invoiceTone[inv.status]}>{settled ? 'Paid' : invoiceStatusLabel[inv.status]}</Badge></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : <div className="p-6"><Empty>No invoices yet.</Empty></div>}
        </Card>

        <Card title="Transaction history">
          {payments.length ? (
            <ul className="divide-y divide-navy/[0.07]">
              {payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-navy">{p.invoices?.number}</div>
                    <div className="text-[12.5px] capitalize text-navy/50">{p.provider === 'manual' ? 'Bank transfer' : p.provider} · {formatDate(p.paid_at, true)}</div>
                  </div>
                  <span className="font-display text-[15px] font-semibold text-success">{formatMoney(p.amount_minor, p.currency)}</span>
                </li>
              ))}
            </ul>
          ) : <Empty>Payments you make will be listed here.</Empty>}
        </Card>
      </div>
    </>
  )
}
