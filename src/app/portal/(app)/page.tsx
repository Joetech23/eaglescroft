import Link from 'next/link'
import { ArrowRight, CalendarClock } from 'lucide-react'
import { getViewer } from '@/lib/portal/session'
import { serviceLabel } from '@/lib/portal/templates'
import { formatDate, formatMoney, invoiceBalance, projectStatusLabel, timeAgo } from '@/lib/portal/format'
import { Badge, Card, Empty, PageHeader, ProgressBar, Stat, statusTone } from '@/components/portal/ui'
import type { Currency, Invoice, Milestone, Project, ProjectUpdate } from '@/lib/portal/types'

export default async function PortalHome() {
  const { supabase, profile } = await getViewer()

  const [{ data: projects }, { data: invoices }, { count: openTickets }, { data: milestones }, { data: updates }] = await Promise.all([
    supabase.from('projects').select('*').order('created_at', { ascending: false }),
    supabase.from('invoices').select('*, invoice_items(quantity, unit_minor), payments(amount_minor, status), projects(title)').eq('status', 'sent').order('due_date'),
    supabase.from('tickets').select('id', { count: 'exact', head: true }).neq('status', 'resolved'),
    supabase.from('milestones').select('*').neq('status', 'done').order('due_date', { ascending: true, nullsFirst: false }),
    supabase.from('project_updates').select('*, projects(title)').order('created_at', { ascending: false }).limit(6),
  ])

  const list = (projects ?? []) as Project[]
  const due = (invoices ?? []) as (Invoice & { projects: { title: string } | null })[]
  const nextMilestones = (milestones ?? []) as Milestone[]
  const feed = (updates ?? []) as (ProjectUpdate & { projects: { title: string } | null })[]

  const outstanding = due.reduce<Record<Currency, number>>(
    (acc, inv) => ({ ...acc, [inv.currency]: (acc[inv.currency] ?? 0) + invoiceBalance(inv) }),
    {} as Record<Currency, number>,
  )
  const outstandingText = Object.entries(outstanding).filter(([, v]) => v > 0).map(([c, v]) => formatMoney(v, c as Currency)).join(' + ') || formatMoney(0, list[0]?.currency ?? 'USD')
  const active = list.filter((p) => p.status !== 'completed')
  const firstName = (profile.full_name || '').split(' ')[0]

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={firstName ? `Welcome back, ${firstName}.` : 'Welcome back.'}
        intro="Here’s where every project stands today — progress, what’s next, and anything that needs you."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active projects" value={active.length} hint={`${list.length} in total`} />
        <Stat label="Balance due" value={outstandingText} hint={`${due.length} open invoice${due.length === 1 ? '' : 's'}`} />
        <Stat label="Open tickets" value={openTickets ?? 0} hint="Reviews & revision requests" />
        <Stat
          label="Next milestone"
          value={nextMilestones[0] ? formatDate(nextMilestones[0].due_date) : '—'}
          hint={nextMilestones[0]?.title ?? 'Nothing scheduled'}
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card title="Your projects">
          {list.length ? (
            <div className="space-y-3">
              {list.map((p) => {
                const next = nextMilestones.find((m) => m.project_id === p.id)
                return (
                  <Link
                    key={p.id}
                    href={`/portal/projects/${p.id}`}
                    className="group block rounded-2xl border border-navy/10 p-4 transition-all hover:border-gold-400/40 hover:shadow-soft sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-mono text-[10.5px] uppercase tracking-wider text-navy/45">{serviceLabel(p.service)}</div>
                        <div className="mt-1 font-display text-[17px] font-semibold text-navy">{p.title}</div>
                      </div>
                      <Badge tone={statusTone[p.status]}>{projectStatusLabel[p.status]}</Badge>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <ProgressBar value={p.progress} className="flex-1" />
                      <span className="w-10 text-right font-display text-[14px] font-semibold text-navy">{p.progress}%</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[13px] text-navy/55">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarClock className="h-4 w-4 text-gold-500" />
                        {next ? `Next: ${next.title} · ${formatDate(next.due_date)}` : p.due_date ? `Due ${formatDate(p.due_date)}` : 'Timeline coming soon'}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-gold-600">
                        Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <Empty>Your projects will appear here as soon as we set them up.</Empty>
          )}
        </Card>

        <div className="space-y-6">
          <Card title="Invoices due" action={<Link href="/portal/billing" className="text-[13px] font-semibold text-gold-600 hover:underline">Billing</Link>}>
            {due.length ? (
              <ul className="divide-y divide-navy/[0.07]">
                {due.map((inv) => (
                  <li key={inv.id}>
                    <Link href={`/portal/invoices/${inv.id}`} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <div className="text-[14px] font-semibold text-navy">{inv.number}</div>
                        <div className="truncate text-[12.5px] text-navy/50">{inv.projects?.title} · due {formatDate(inv.due_date)}</div>
                      </div>
                      <span className="font-display text-[15px] font-semibold text-navy">{formatMoney(invoiceBalance(inv), inv.currency)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>You’re all paid up.</Empty>
            )}
          </Card>

          <Card title="Latest activity">
            {feed.length ? (
              <ol className="space-y-4">
                {feed.map((u) => (
                  <li key={u.id} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-gold-400" />
                    <div className="min-w-0">
                      <p className="text-[14px] leading-snug text-navy/80">{u.body}</p>
                      <div className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-navy/40">
                        {u.projects?.title} · {timeAgo(u.created_at)}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <Empty>Daily updates from the team will show up here.</Empty>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
