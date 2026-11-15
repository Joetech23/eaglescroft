import Link from 'next/link'
import { requireTeam } from '@/lib/portal/session'
import { serviceLabel } from '@/lib/portal/templates'
import { formatDate, formatMoney, invoiceBalance, projectStatusLabel, timeAgo } from '@/lib/portal/format'
import { Badge, ButtonLink, Card, Empty, PageHeader, ProgressBar, Stat, statusTone } from '@/components/portal/ui'
import type { Currency, Invoice, Profile, Project, Ticket } from '@/lib/portal/types'

export default async function AdminHome() {
  const { supabase } = await requireTeam()
  const [{ data: ps }, { data: cs }, { data: ts }, { data: is }] = await Promise.all([
    supabase.from('projects').select('*').order('updated_at', { ascending: false }),
    supabase.from('profiles').select('*').eq('role', 'client'),
    supabase.from('tickets').select('*, projects(title)').neq('status', 'resolved').order('created_at', { ascending: false }),
    supabase.from('invoices').select('*, invoice_items(quantity, unit_minor), payments(amount_minor, status), projects(title)').eq('status', 'sent').order('due_date'),
  ])
  const projects = (ps ?? []) as Project[]
  const clients = (cs ?? []) as Profile[]
  const tickets = (ts ?? []) as (Ticket & { projects: { title: string } | null })[]
  const unpaid = ((is ?? []) as (Invoice & { projects: { title: string } | null })[]).filter((i) => invoiceBalance(i) > 0)
  const clientName = (id: string) => {
    const c = clients.find((x) => x.id === id)
    return c?.company || c?.full_name || c?.email || '—'
  }
  const owed = unpaid.reduce<Record<string, number>>((acc, i) => ({ ...acc, [i.currency]: (acc[i.currency] ?? 0) + invoiceBalance(i) }), {})
  const owedText = Object.entries(owed).map(([c, v]) => formatMoney(v, c as Currency)).join(' + ') || formatMoney(0, 'USD')
  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Mission control."
        intro="Every client project, open ticket and unpaid invoice in one view."
        actions={<ButtonLink href="/admin/projects/new">New project</ButtonLink>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active projects" value={projects.filter((p) => p.status !== 'completed').length} hint={`${projects.length} total`} />
        <Stat label="Clients" value={clients.length} />
        <Stat label="Open tickets" value={tickets.length} hint={`${tickets.filter((t) => t.is_revision).length} revision requests`} />
        <Stat label="Outstanding" value={owedText} hint={`${unpaid.length} unpaid invoice${unpaid.length === 1 ? '' : 's'}`} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card title="Projects" padded={false}>
          {projects.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-[14px]">
                <thead className="font-mono text-[10.5px] uppercase tracking-wider text-navy/45">
                  <tr>
                    <th className="px-6 py-3 font-medium">Project</th>
                    <th className="px-3 py-3 font-medium">Client</th>
                    <th className="px-3 py-3 font-medium">Progress</th>
                    <th className="px-3 py-3 font-medium">Due</th>
                    <th className="px-6 py-3 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/[0.07]">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-[#f6f8fc]">
                      <td className="px-6 py-3.5">
                        <Link href={`/admin/projects/${p.id}`} className="font-semibold text-navy hover:text-gold-600">{p.title}</Link>
                        <div className="text-[12px] text-navy/50">{serviceLabel(p.service)}</div>
                      </td>
                      <td className="px-3 py-3.5 text-navy/65">{clientName(p.client_id)}</td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2"><ProgressBar value={p.progress} className="w-20" /><span className="text-[12.5px] text-navy/60">{p.progress}%</span></div>
                      </td>
                      <td className={`px-3 py-3.5 ${p.due_date && p.due_date < today && p.status !== 'completed' ? 'font-semibold text-[#c2262b]' : 'text-navy/65'}`}>{formatDate(p.due_date)}</td>
                      <td className="px-6 py-3.5 text-right"><Badge tone={statusTone[p.status]}>{projectStatusLabel[p.status]}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div className="p-6"><Empty>No projects yet — create a client, then a project.</Empty></div>}
        </Card>

        <div className="space-y-6">
          <Card title="Open tickets">
            {tickets.length ? (
              <ul className="divide-y divide-navy/[0.07]">
                {tickets.slice(0, 8).map((t) => (
                  <li key={t.id}>
                    <Link href={`/portal/projects/${t.project_id}/tickets/${t.id}`} className="block py-3 first:pt-0 last:pb-0">
                      <div className="truncate text-[14px] font-semibold text-navy">{t.title}</div>
                      <div className="text-[12px] text-navy/50">{t.projects?.title} · {t.is_revision ? 'Revision' : 'Ticket'} · {timeAgo(t.created_at)}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <Empty>Inbox zero.</Empty>}
          </Card>

          <Card title="Unpaid invoices">
            {unpaid.length ? (
              <ul className="divide-y divide-navy/[0.07]">
                {unpaid.map((i) => (
                  <li key={i.id}>
                    <Link href={`/admin/projects/${i.project_id}#billing`} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <div className="text-[14px] font-semibold text-navy">{i.number}</div>
                        <div className={`text-[12px] ${i.due_date && i.due_date < today ? 'font-semibold text-[#c2262b]' : 'text-navy/50'}`}>
                          {i.projects?.title} · due {formatDate(i.due_date)}
                        </div>
                      </div>
                      <span className="font-display text-[15px] font-semibold text-navy">{formatMoney(invoiceBalance(i), i.currency)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <Empty>Nothing outstanding.</Empty>}
          </Card>
        </div>
      </div>
    </>
  )
}
