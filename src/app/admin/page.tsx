import Link from 'next/link'
import { requireTeam } from '@/lib/portal/session'
import { formatDate, formatMoney, invoiceBalance, timeAgo } from '@/lib/portal/format'
import { ButtonLink, Card, Empty, PageHeader, Stat } from '@/components/portal/ui'
import ProjectCards from '@/components/portal/ProjectCards'
import type { Currency, Invoice, Profile, Project, Ticket } from '@/lib/portal/types'

export default async function AdminHome() {
  const { supabase } = await requireTeam()
  const [{ data: ps }, { data: cs }, { data: ts }, { data: is }, { data: us }] = await Promise.all([
    supabase.from('projects').select('*').order('updated_at', { ascending: false }),
    supabase.from('profiles').select('*').eq('role', 'client'),
    supabase.from('tickets').select('*, projects(title)').neq('status', 'resolved').order('created_at', { ascending: false }),
    supabase.from('invoices').select('*, invoice_items(quantity, unit_minor), payments(amount_minor, status), projects(title)').eq('status', 'sent').order('due_date'),
    supabase.from('project_updates').select('project_id, created_at').order('created_at', { ascending: false }).limit(1000),
  ])
  const projects = (ps ?? []) as Project[]
  const clients = (cs ?? []) as Profile[]
  const tickets = (ts ?? []) as (Ticket & { projects: { title: string } | null })[]
  const unpaid = ((is ?? []) as (Invoice & { projects: { title: string } | null })[]).filter((i) => invoiceBalance(i) > 0)
  const clientName = (id: string) => {
    const c = clients.find((x) => x.id === id)
    return c?.company || c?.full_name || c?.email || 'Unknown'
  }
  const owed = unpaid.reduce<Record<string, number>>((acc, i) => ({ ...acc, [i.currency]: (acc[i.currency] ?? 0) + invoiceBalance(i) }), {})
  const owedText = Object.entries(owed).map(([c, v]) => formatMoney(v, c as Currency)).join(' + ') || formatMoney(0, 'USD')
  const today = new Date().toISOString().slice(0, 10)
  const active = projects.filter((p) => p.status !== 'completed')
  const clientNames = Object.fromEntries(clients.map((c) => [c.id, clientName(c.id)]))
  const lastUpdate: Record<string, string> = {}
  for (const u of (us ?? []) as { project_id: string; created_at: string }[]) lastUpdate[u.project_id] ??= u.created_at

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Mission control."
        intro="Every client project, open ticket and unpaid invoice in one view."
        actions={<ButtonLink href="/admin/projects/new">New project</ButtonLink>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active projects" value={active.length} hint={`${projects.length} total`} />
        <Stat label="Clients" value={clients.length} />
        <Stat label="Open tickets" value={tickets.length} hint={`${tickets.filter((t) => t.is_revision).length} revision requests`} />
        <Stat label="Outstanding" value={owedText} hint={`${unpaid.length} unpaid invoice${unpaid.length === 1 ? '' : 's'}`} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-[18px] font-semibold text-navy">Active projects</h2>
            <Link href="/admin/projects" className="text-[13px] font-semibold text-gold-600 hover:underline">All projects</Link>
          </div>
          {active.length ? (
            <ProjectCards projects={active.slice(0, 6)} clientNames={clientNames} lastUpdate={lastUpdate} />
          ) : <Empty>No active projects. Create a client, then a project.</Empty>}
        </div>

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
                        <div className={`text-[12px] ${i.due_date && i.due_date < today ? 'font-semibold text-danger' : 'text-navy/50'}`}>
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
