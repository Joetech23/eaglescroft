import Link from 'next/link'
import { ArrowRight, CalendarClock, Check, FileText, ListChecks, MessagesSquare, Receipt, Video } from 'lucide-react'
import { getViewer } from '@/lib/portal/session'
import { serviceLabel } from '@/lib/portal/templates'
import { formatDate, formatMoney, invoiceBalance, projectStatusLabel, timeAgo } from '@/lib/portal/format'
import { displayName, personSelect, roleLine } from '@/lib/portal/people'
import { formatDay, formatTime } from '@/lib/portal/slots'
import { setTaskStatus } from '@/app/portal/collab'
import Avatar from '@/components/portal/Avatar'
import { GettingStarted } from '@/components/portal/Onboarding'
import { Badge, Empty, statusTone } from '@/components/portal/ui'
import { cn } from '@/lib/utils'
import type { Currency, Invoice, Meeting, Message, Milestone, Person, Project, ProjectDocument, Task } from '@/lib/portal/types'

function greeting() {
  const h = Number(new Date().toLocaleString('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Africa/Lagos' }))
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

const tiles = [
  { href: '/portal/messages', label: 'Messages', icon: MessagesSquare },
  { href: '/portal/tasks', label: 'Tasks & progress', icon: ListChecks },
  { href: '/portal/meetings/book', label: 'Book a meeting', icon: CalendarClock },
  { href: '/portal/billing', label: 'Invoices', icon: Receipt },
]

export default async function PortalHome() {
  const { supabase, profile, isTeam } = await getViewer()
  const nowIso = new Date().toISOString()

  const [projectsQ, invoicesQ, milestonesQ, tasksQ, messagesQ, meetingsQ, docsQ, availabilityQ] = await Promise.all([
    supabase.from('projects').select('*').order('updated_at', { ascending: false }),
    supabase.from('invoices').select('*, invoice_items(quantity, unit_minor), payments(amount_minor, status), projects(title)').eq('status', 'sent').order('due_date'),
    supabase.from('milestones').select('*').order('sort'),
    supabase.from('tasks').select('*, projects(title)').neq('status', 'done')
      .or(isTeam ? `assignee_id.eq.${profile.id}` : `assignee_id.eq.${profile.id},created_by.eq.${profile.id},assignee_id.is.null`)
      .order('due_date', { ascending: true, nullsFirst: false }).limit(6),
    supabase.from('messages').select('*, projects(title)').is('deleted_at', null).order('created_at', { ascending: false }).limit(4),
    supabase.from('meetings').select('*').eq('status', 'scheduled').gte('ends_at', nowIso).order('starts_at').limit(3),
    supabase.from('documents').select('*, projects(title)').order('created_at', { ascending: false }).limit(4),
    isTeam ? supabase.from('availability').select('weekday', { count: 'exact', head: true }).eq('user_id', profile.id) : Promise.resolve({ count: 0 }),
  ])
  const projects = (projectsQ.data ?? []) as Project[]
  const invoices = ((invoicesQ.data ?? []) as (Invoice & { projects: { title: string } | null })[]).filter((i) => invoiceBalance(i) > 0)
  const milestones = (milestonesQ.data ?? []) as Milestone[]
  const tasks = (tasksQ.data ?? []) as (Task & { projects: { title: string } | null })[]
  const messages = (messagesQ.data ?? []) as (Message & { projects: { title: string } | null })[]
  const meetings = (meetingsQ.data ?? []) as Meeting[]
  const docs = (docsQ.data ?? []) as (ProjectDocument & { projects: { title: string } | null })[]

  const peopleIds = Array.from(new Set([...messages.map((m) => m.author_id), ...meetings.map((m) => m.host_id)].filter(Boolean))) as string[]
  const { data: peopleRows } = peopleIds.length ? await supabase.from('profiles').select(personSelect).in('id', peopleIds) : { data: [] }
  const people = new Map(((peopleRows ?? []) as Person[]).map((p) => [p.id, p]))

  const owed = invoices.reduce<Record<string, number>>((acc, i) => ({ ...acc, [i.currency]: (acc[i.currency] ?? 0) + invoiceBalance(i) }), {})
  const owedText = Object.entries(owed).map(([c, v]) => formatMoney(v, c as Currency)).join(' + ') || formatMoney(0, projects[0]?.currency ?? 'USD')
  const active = projects.filter((p) => p.status !== 'completed')
  const focus = active[0] ?? projects[0]
  const focusSteps = focus ? milestones.filter((m) => m.project_id === focus.id) : []
  const firstName = displayName(profile).split(' ')[0]
  const needsBrief = isTeam ? null : projects.find((p) => !p.brief_submitted_at && p.status !== 'completed')

  return (
    <div className="space-y-6">
      {/* hero */}
      <section className="pt-2 text-center lg:pt-4">
        <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold-600">
          <span aria-hidden className="flight-marker" /> {isTeam ? 'Team workspace' : 'Client portal'}
        </div>
        <h1 className="mt-3 font-display font-semibold leading-[1.08] tracking-tight text-navy" style={{ fontSize: 'clamp(1.9rem,4.2vw,3rem)' }}>
          {greeting()}, <span className="text-transparent" style={{ background: 'var(--portal-name-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>{firstName}.</span>
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-[15px] text-navy/70">
          {active.length ? `You have ${active.length} active project${active.length === 1 ? '' : 's'}${tasks.length ? ` and ${tasks.length} open task${tasks.length === 1 ? '' : 's'}` : ''}.` : 'Everything you need for your projects, in one place.'}
        </p>
      </section>

      <GettingStarted
        isTeam={isTeam}
        hasPhoto={Boolean(profile.avatar_url)}
        signatureSet={Boolean(profile.signature)}
        availabilitySet={(availabilityQ.count ?? 0) > 0}
        briefHref={needsBrief ? `/portal/projects/${needsBrief.id}#brief` : null}
      />

      {/* quick actions */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="group flex flex-col items-center gap-3 rounded-[22px] border border-navy/[0.07] bg-surface p-5 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-medium">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white shadow-navy transition-colors group-hover:bg-gold-500">
              <t.icon className="h-5 w-5" />
            </span>
            <span className="font-display text-[14px] font-semibold text-navy">{t.label}</span>
          </Link>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <div className="min-w-0 space-y-6">
          {/* stats */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="col-span-2 rounded-[22px] bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] p-5 text-white shadow-gold md:col-span-1">
              <div className="text-[13px] text-white/75">Balance due</div>
              <div className="mt-3 font-display text-[1.7rem] font-semibold leading-none">{owedText}</div>
              <Link href="/portal/billing" className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-white/85 hover:text-white">
                {invoices.length} open invoice{invoices.length === 1 ? '' : 's'} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {[
              ['Active projects', active.length],
              ['Open tasks', tasks.length],
              ['Upcoming meetings', meetings.length],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[22px] border border-navy/[0.07] bg-surface p-5 shadow-soft">
                <div className="text-[13px] text-navy/55">{label}</div>
                <div className="mt-3 font-display text-[1.7rem] font-semibold leading-none text-navy">{value}</div>
              </div>
            ))}
          </div>

          {/* project progress */}
          <section className="rounded-[24px] border border-navy/[0.07] bg-surface p-5 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-display text-[18px] font-semibold text-navy">Project progress</h2>
                {focus && <p className="mt-0.5 truncate text-[14px] text-navy/55">{focus.title} · {serviceLabel(focus.service)}</p>}
              </div>
              {focus && <Badge tone={statusTone[focus.status]}>{projectStatusLabel[focus.status]}</Badge>}
            </div>
            {focus ? (
              <>
                <ol className="mt-6 flex items-start overflow-x-auto pb-2 [scrollbar-width:thin]">
                  {focusSteps.map((m, i) => {
                    const done = m.status === 'done'
                    const current = m.status === 'in_progress'
                    return (
                      <li key={m.id} className="relative flex min-w-[96px] flex-1 flex-col items-center text-center">
                        {i > 0 && <span className={cn('absolute right-1/2 top-[13px] h-[3px] w-full', done || current ? 'bg-navy' : 'bg-navy/10')} />}
                        <span className={cn('relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold',
                          done ? 'border-navy bg-navy text-white' : current ? 'border-gold-400 bg-surface text-gold-600 ring-4 ring-gold-400/15' : 'border-navy/15 bg-surface text-navy/40')}>
                          {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                        </span>
                        <span className={cn('mt-2 px-1 text-[12px] leading-tight', done ? 'text-navy/70' : current ? 'font-semibold text-navy' : 'text-navy/40')}>{m.title}</span>
                      </li>
                    )
                  })}
                </ol>
                <div className="mt-4 flex flex-wrap gap-2">
                  {projects.map((p) => (
                    <Link key={p.id} href={`/portal/projects/${p.id}`} className={cn('rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors', p.id === focus.id ? 'border-navy bg-navy text-white' : 'border-navy/12 text-navy/70 hover:border-navy/30')}>
                      {p.title} · {p.progress}%
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-4"><Empty>Your projects will appear here as soon as we set them up.</Empty></div>
            )}
          </section>

          {/* tasks */}
          <section className="rounded-[24px] border border-navy/[0.07] bg-surface p-5 shadow-soft sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-[18px] font-semibold text-navy">{isTeam ? 'My tasks' : 'Your tasks'}</h2>
              <Link href="/portal/tasks" className="text-[13px] font-semibold text-gold-600 hover:underline">All tasks</Link>
            </div>
            {tasks.length ? (
              <ul className="divide-y divide-navy/[0.06]">
                {tasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-3 py-3">
                    <form action={setTaskStatus.bind(null, t.id, 'done')}>
                      <button className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-navy/20 text-transparent transition-colors hover:border-gold-500 hover:text-gold-500" aria-label={`Complete ${t.title}`}>
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    </form>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14.5px] font-medium text-navy">{t.title}</div>
                      <div className="truncate text-[12px] text-navy/45">{t.projects?.title}</div>
                    </div>
                    {t.priority === 'high' && <Badge tone="red">High</Badge>}
                    <span className={cn('flex-none text-[12px]', t.due_date && t.due_date < nowIso.slice(0, 10) ? 'font-semibold text-danger' : 'text-navy/45')}>{t.due_date ? formatDate(t.due_date) : ''}</span>
                  </li>
                ))}
              </ul>
            ) : <Empty>No open tasks. Nice work.</Empty>}
          </section>
        </div>

        <div className="min-w-0 space-y-6">
          {/* chat preview */}
          <section className="rounded-[24px] border border-navy/[0.07] bg-surface p-5 shadow-soft sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-[18px] font-semibold text-navy">Chat</h2>
              <Link href="/portal/messages" className="text-[13px] font-semibold text-gold-600 hover:underline">Open messages</Link>
            </div>
            {messages.length ? (
              <ul className="space-y-4">
                {[...messages].reverse().map((m) => {
                  const author = m.author_id ? people.get(m.author_id) : null
                  const mine = m.author_id === profile.id
                  return (
                    <li key={m.id}>
                      <Link href={`/portal/messages/${m.project_id}`} className={cn('flex gap-2.5', mine && 'flex-row-reverse')}>
                        <Avatar person={author} size="sm" />
                        <div className={cn('min-w-0 max-w-[80%]', mine && 'text-right')}>
                          <div className={cn('inline-block rounded-2xl px-3.5 py-2 text-left text-[13.5px] leading-snug', mine ? 'rounded-tr-md bg-navy text-white' : 'rounded-tl-md bg-canvas text-navy/85')}>
                            {m.body || 'Sent a file'}
                          </div>
                          <div className="mt-1 truncate text-[11px] text-navy/45">{mine ? 'You' : `${displayName(author)} · ${roleLine(author)}`} · {timeAgo(m.created_at)}</div>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : <Empty>Start a conversation with your team.</Empty>}
          </section>

          {/* meetings */}
          <section className="rounded-[24px] border border-navy/[0.07] bg-surface p-5 shadow-soft sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-[18px] font-semibold text-navy">Upcoming meetings</h2>
              <Link href="/portal/meetings/book" className="text-[13px] font-semibold text-gold-600 hover:underline">Book</Link>
            </div>
            {meetings.length ? (
              <ul className="space-y-3">
                {meetings.map((m) => {
                  const host = people.get(m.host_id)
                  return (
                    <li key={m.id} className="flex items-center gap-3 rounded-2xl bg-subtle p-3">
                      <div className="flex h-12 w-12 flex-none flex-col items-center justify-center rounded-xl bg-surface text-navy shadow-soft">
                        <span className="text-[10px] font-semibold uppercase text-gold-600">{new Date(m.starts_at).toLocaleDateString('en-GB', { month: 'short', timeZone: 'Africa/Lagos' })}</span>
                        <span className="font-display text-[17px] font-semibold leading-none">{new Date(m.starts_at).toLocaleDateString('en-GB', { day: 'numeric', timeZone: 'Africa/Lagos' })}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[14px] font-semibold text-navy">{m.title}</div>
                        <div className="truncate text-[12px] text-navy/50">{formatTime(m.starts_at)} · with {displayName(host)}</div>
                      </div>
                      {m.meeting_url && (
                        <a href={m.meeting_url} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-navy text-white" aria-label="Join call">
                          <Video className="h-4 w-4" />
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            ) : <Empty>No meetings booked. <Link href="/portal/meetings/book" className="font-semibold text-gold-600">Book a call</Link></Empty>}
          </section>

          {/* docs + invoices */}
          <section className="rounded-[24px] border border-navy/[0.07] bg-surface p-5 shadow-soft sm:p-6">
            <h2 className="mb-4 font-display text-[18px] font-semibold text-navy">Latest files</h2>
            {docs.length ? (
              <ul className="space-y-2">
                {docs.map((d) => (
                  <li key={d.id}>
                    <a href={`/portal/documents/${d.id}`} className="flex items-center gap-3 rounded-2xl border border-navy/[0.08] px-3.5 py-2.5 hover:border-gold-400/40">
                      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-navy text-white"><FileText className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-semibold text-navy">{d.title}</span>
                        <span className="block truncate text-[11.5px] text-navy/45">{d.projects?.title}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : <Empty>Deliverables will appear here.</Empty>}
            {invoices.length > 0 && (
              <div className="mt-5 space-y-2 border-t border-navy/[0.07] pt-4">
                {invoices.slice(0, 3).map((inv) => (
                  <Link key={inv.id} href={`/portal/invoices/${inv.id}`} className="flex items-center justify-between gap-3 text-[13.5px]">
                    <span className="min-w-0 truncate"><span className="font-semibold text-navy">{inv.number}</span> <span className="text-navy/45">due {formatDate(inv.due_date)}</span></span>
                    <span className="font-display font-semibold text-navy">{formatMoney(invoiceBalance(inv), inv.currency)}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <p className="text-center text-[12px] text-navy/35">Meeting times are shown in Lagos time (WAT). {formatDay(new Date())}</p>
    </div>
  )
}
