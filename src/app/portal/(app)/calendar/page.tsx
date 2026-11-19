import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getViewer } from '@/lib/portal/session'
import { formatTime } from '@/lib/portal/slots'
import { ButtonLink, PageHeader } from '@/components/portal/ui'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Calendar' }

type Event = { date: string; label: string; kind: 'meeting' | 'milestone' | 'task'; href: string; time?: string }
const kindStyle = { meeting: 'bg-navy text-white', milestone: 'bg-gold-400/15 text-gold-600', task: 'bg-indigo-ink/10 text-indigo-ink' }
const lagosDate = (iso: string) => new Date(new Date(iso).getTime() + 60 * 60_000).toISOString().slice(0, 10)

export default async function CalendarPage({ searchParams }: { searchParams: { m?: string } }) {
  const { supabase, profile, isTeam } = await getViewer()
  const todayIso = lagosDate(new Date().toISOString())
  const month = /^\d{4}-\d{2}$/.test(searchParams.m ?? '') ? searchParams.m! : todayIso.slice(0, 7)
  const [y, mo] = month.split('-').map(Number)
  const first = new Date(Date.UTC(y, mo - 1, 1))
  const last = new Date(Date.UTC(y, mo, 0))
  const from = first.toISOString().slice(0, 10)
  const to = last.toISOString().slice(0, 10)
  const prev = new Date(Date.UTC(y, mo - 2, 1)).toISOString().slice(0, 7)
  const next = new Date(Date.UTC(y, mo, 1)).toISOString().slice(0, 7)

  let taskQ = supabase.from('tasks').select('id, title, due_date, project_id, status').gte('due_date', from).lte('due_date', to).neq('status', 'done')
  if (isTeam) taskQ = taskQ.eq('assignee_id', profile.id)
  const [{ data: meetings }, { data: milestones }, { data: tasks }] = await Promise.all([
    supabase.from('meetings').select('id, title, starts_at, status').eq('status', 'scheduled')
      .gte('starts_at', new Date(first.getTime() - 3_600_000).toISOString()).lte('starts_at', new Date(last.getTime() + 86_400_000).toISOString()),
    supabase.from('milestones').select('id, title, due_date, project_id, status').gte('due_date', from).lte('due_date', to),
    taskQ,
  ])
  const events: Event[] = [
    ...(meetings ?? []).map((m) => ({ date: lagosDate(m.starts_at), label: m.title, kind: 'meeting' as const, href: '/portal/meetings', time: formatTime(m.starts_at) })),
    ...(milestones ?? []).map((m) => ({ date: m.due_date!, label: m.title, kind: 'milestone' as const, href: isTeam ? `/admin/projects/${m.project_id}#timeline` : `/portal/projects/${m.project_id}` })),
    ...(tasks ?? []).map((t) => ({ date: t.due_date!, label: t.title, kind: 'task' as const, href: `/portal/projects/${t.project_id}?tab=tasks` })),
  ]
  const byDay = new Map<string, Event[]>()
  for (const e of events) byDay.set(e.date, [...(byDay.get(e.date) ?? []), e])

  const lead = (first.getUTCDay() + 6) % 7 // Monday-first grid
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: last.getUTCDate() }, (_, i) => new Date(Date.UTC(y, mo - 1, i + 1)).toISOString().slice(0, 10))]
  while (cells.length % 7) cells.push(null)
  const agenda = Array.from(byDay.entries()).filter(([d]) => d >= (month === todayIso.slice(0, 7) ? todayIso : from)).sort(([a], [b]) => a.localeCompare(b))

  return (
    <>
      <PageHeader
        eyebrow="Calendar"
        title={first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
        intro="Meetings, milestones and task deadlines, all in one view."
        actions={
          <>
            <Link href={`/portal/calendar?m=${prev}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/12 bg-surface text-navy" aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></Link>
            <Link href="/portal/calendar" className="rounded-full border border-navy/12 bg-surface px-4 py-2 text-[13px] font-semibold text-navy">Today</Link>
            <Link href={`/portal/calendar?m=${next}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/12 bg-surface text-navy" aria-label="Next month"><ChevronRight className="h-4 w-4" /></Link>
            <ButtonLink href="/portal/meetings/book">Book</ButtonLink>
          </>
        }
      />

      <div className="flex flex-wrap gap-3 pb-4 text-[12px] text-navy/60">
        {(['meeting', 'milestone', 'task'] as const).map((k) => (
          <span key={k} className="inline-flex items-center gap-1.5 capitalize"><span className={cn('h-2.5 w-2.5 rounded-full', k === 'meeting' ? 'bg-navy' : k === 'milestone' ? 'bg-gold-400' : 'bg-indigo-ink')} />{k === 'task' ? 'Task due' : k}</span>
        ))}
      </div>

      <section className="hidden overflow-hidden rounded-[24px] border border-navy/[0.07] bg-surface shadow-soft md:block">
        <div className="grid grid-cols-7 border-b border-navy/[0.07] bg-subtle">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <div key={d} className="px-3 py-2.5 font-mono text-[10.5px] uppercase tracking-wider text-navy/45">{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            const items = d ? byDay.get(d) ?? [] : []
            return (
              <div key={i} className={cn('min-h-[112px] border-b border-r border-navy/[0.05] p-2', !d && 'bg-subtle', (i + 1) % 7 === 0 && 'border-r-0')}>
                {d && (
                  <>
                    <div className={cn('mb-1 flex h-7 w-7 items-center justify-center rounded-full text-[12.5px] font-semibold', d === todayIso ? 'bg-gold-400 text-white' : 'text-navy/60')}>{Number(d.slice(8))}</div>
                    <div className="space-y-1">
                      {items.slice(0, 3).map((e, j) => (
                        <Link key={j} href={e.href} className={cn('block truncate rounded-lg px-1.5 py-1 text-[11.5px] font-semibold', kindStyle[e.kind])}>
                          {e.time ? `${e.time} ` : ''}{e.label}
                        </Link>
                      ))}
                      {items.length > 3 && <div className="px-1.5 text-[11px] text-navy/45">+{items.length - 3} more</div>}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-5 rounded-[24px] border border-navy/[0.07] bg-surface p-5 shadow-soft md:mt-6">
        <h2 className="mb-3 font-display text-[16px] font-semibold text-navy">Agenda</h2>
        {agenda.length ? (
          <ol className="space-y-4">
            {agenda.map(([d, items]) => (
              <li key={d} className="flex gap-4">
                <div className="w-14 flex-none text-center">
                  <div className="text-[11px] font-semibold uppercase text-gold-600">{new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' })}</div>
                  <div className="font-display text-[20px] font-semibold text-navy">{Number(d.slice(8))}</div>
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  {items.map((e, j) => (
                    <Link key={j} href={e.href} className={cn('block truncate rounded-xl px-3 py-2 text-[13px] font-semibold', kindStyle[e.kind])}>
                      {e.time ? `${e.time} · ` : ''}{e.label}
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        ) : <p className="text-[13.5px] text-navy/50">Nothing scheduled{month === todayIso.slice(0, 7) ? ' for the rest of this month' : ' this month'}.</p>}
      </section>
    </>
  )
}
