import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, Circle, CircleDot, Download, FileText, MessageSquare, MessagesSquare, Star, Target } from 'lucide-react'
import TaskBoard, { NewTaskForm } from '@/components/portal/TaskBoard'
import { personSelect } from '@/lib/portal/people'
import { cn } from '@/lib/utils'
import { getViewer } from '@/lib/portal/session'
import { getTemplate, serviceLabel } from '@/lib/portal/templates'
import {
  formatDate, formatMoney, invoiceBalance, invoicePaid, invoiceStatusLabel, invoiceTotal,
  projectStatusLabel, ticketStatusLabel, timeAgo,
} from '@/lib/portal/format'
import { createTicket, submitBrief, submitReview } from '@/app/portal/actions'
import SubmitButton from '@/components/portal/SubmitButton'
import {
  Badge, Card, Empty, Field, Notice, PageHeader, ProgressBar, inputClass, invoiceTone, statusTone, ticketTone,
} from '@/components/portal/ui'
import type { Invoice, Milestone, Person, Project, ProjectDocument, ProjectUpdate, Review, Task, Ticket } from '@/lib/portal/types'

export const metadata: Metadata = { title: 'Project' }

const notices: Record<string, { tone: 'green' | 'red'; text: string }> = {
  'saved=brief': { tone: 'green', text: 'Thanks! Your brief is with the team.' },
  'saved=review': { tone: 'green', text: 'Thank you for your feedback.' },
  'error=brief': { tone: 'red', text: 'We couldn’t save your brief. Please try again.' },
  'error=ticket': { tone: 'red', text: 'Please add a short title and a description of what you need.' },
  'error=quota': { tone: 'red', text: 'You’ve used all included revision rounds. Raise it as a normal ticket and we’ll quote any extra work.' },
  'error=review': { tone: 'red', text: 'Please choose a rating from 1 to 5.' },
}

export default async function ProjectPage({ params, searchParams }: { params: { id: string }; searchParams: Record<string, string> }) {
  const { supabase, user, isTeam } = await getViewer()
  const tab = searchParams.tab === 'tasks' ? 'tasks' : 'overview'

  const { data: projectRow } = await supabase.from('projects').select('*').eq('id', params.id).maybeSingle()
  if (!projectRow) notFound()
  const project = projectRow as Project

  const [{ data: ms }, { data: ups }, { data: tks }, { data: invs }, { data: docs }, { data: rev }] = await Promise.all([
    supabase.from('milestones').select('*').eq('project_id', project.id).order('sort'),
    supabase.from('project_updates').select('*').eq('project_id', project.id).order('created_at', { ascending: false }).limit(20),
    supabase.from('tickets').select('*').eq('project_id', project.id).order('created_at', { ascending: false }),
    supabase.from('invoices').select('*, invoice_items(quantity, unit_minor), payments(amount_minor, status)').eq('project_id', project.id).neq('status', 'draft').order('created_at'),
    supabase.from('documents').select('*').eq('project_id', project.id).order('created_at', { ascending: false }),
    supabase.from('reviews').select('*').eq('project_id', project.id).maybeSingle(),
  ])
  const milestones = (ms ?? []) as Milestone[]
  const updates = (ups ?? []) as ProjectUpdate[]
  const tickets = (tks ?? []) as Ticket[]
  const invoices = ((invs ?? []) as Invoice[]).filter((i) => i.status !== 'void')
  const documents = (docs ?? []) as ProjectDocument[]
  const review = rev as Review | null

  const template = getTemplate(project.service)
  const revisionsUsed = tickets.filter((t) => t.is_revision).length
  const revisionsLeft = Math.max(0, project.revision_quota - revisionsUsed)
  const invoiced = invoices.reduce((s, i) => s + invoiceTotal(i.invoice_items), 0)
  const paid = invoices.reduce((s, i) => s + invoicePaid(i.payments), 0)
  const deposit = Math.round((project.budget_minor * project.deposit_percent) / 100)
  const showBriefForm = (!project.brief_submitted_at || searchParams.edit === 'brief') && project.status !== 'completed'
  const notice = Object.entries(searchParams).map(([k, v]) => notices[`${k}=${v}`]).find(Boolean)
  const googleReviewUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL

  let tasks: Task[] = []
  let people = new Map<string, Person>()
  if (tab === 'tasks') {
    const [{ data: t }, { data: team }, { data: client }] = await Promise.all([
      supabase.from('tasks').select('*').eq('project_id', project.id).order('sort'),
      supabase.from('profiles').select(personSelect).in('role', ['admin', 'staff']),
      supabase.from('profiles').select(personSelect).eq('id', project.client_id),
    ])
    tasks = (t ?? []) as Task[]
    people = new Map(([...(team ?? []), ...(client ?? [])] as Person[]).map((p) => [p.id, p]))
  }

  return (
    <>
      <PageHeader
        eyebrow={serviceLabel(project.service)}
        title={project.title}
        intro={project.summary ?? undefined}
        actions={
          <>
            <Badge tone={statusTone[project.status]}>{projectStatusLabel[project.status]}</Badge>
            <Link href={`/portal/messages/${project.id}`} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#3b76f0] to-[#1d4ed8] px-4 py-2 text-sm font-semibold text-white shadow-gold">
              <MessagesSquare className="h-4 w-4" /> Message the team
            </Link>
          </>
        }
      />

      {notice && <div className="mb-6"><Notice tone={notice.tone}>{notice.text}</Notice></div>}

      <div className="mb-6 rounded-[22px] border border-navy/10 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#7a86a3]">Overall progress</div>
            <div className="mt-1 font-display text-[2rem] font-semibold leading-none text-navy">{project.progress}%</div>
          </div>
          <div className="flex gap-6 text-[13px] text-navy/60">
            <span>Started <strong className="text-navy">{formatDate(project.start_date)}</strong></span>
            <span>Target launch <strong className="text-navy">{formatDate(project.due_date)}</strong></span>
          </div>
        </div>
        <ProgressBar value={project.progress} className="mt-4 h-2.5" />
      </div>

      <nav className="mb-6 flex gap-1 overflow-x-auto rounded-full border border-navy/[0.07] bg-white p-1 shadow-soft [scrollbar-width:none] sm:inline-flex">
        {([['overview', 'Overview'], ['tasks', 'Tasks']] as const).map(([key, label]) => (
          <Link key={key} href={`/portal/projects/${project.id}${key === 'tasks' ? '?tab=tasks' : ''}`} className={cn('flex-none rounded-full px-5 py-2 text-[13.5px] font-semibold', tab === key ? 'bg-navy text-white' : 'text-navy/60 hover:text-navy')}>{label}</Link>
        ))}
        <Link href={`/portal/messages/${project.id}`} className="flex-none rounded-full px-5 py-2 text-[13.5px] font-semibold text-navy/60 hover:text-navy">Chat</Link>
      </nav>

      {tab === 'tasks' ? (
        <div className="space-y-5">
          <NewTaskForm projects={[{ id: project.id, title: project.title }]} assignees={Array.from(people.values())} isTeam={isTeam} back={`/portal/projects/${project.id}?tab=tasks`} fixedProjectId={project.id} />
          <TaskBoard tasks={tasks} people={people} viewerId={user.id} isTeam={isTeam} />
        </div>
      ) : (
      <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <div className="min-w-0 space-y-6">
          {(project.goals.length > 0 || project.features.length > 0) && (
            <Card title="Goals & scope">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-navy/50">Goals & targets</h3>
                  {project.goals.length ? (
                    <ul className="space-y-3">
                      {project.goals.map((g) => (
                        <li key={g.title} className="flex gap-3">
                          <Target className="mt-0.5 h-4 w-4 flex-none text-gold-500" />
                          <div>
                            <div className="text-[14px] font-semibold text-navy">{g.title}</div>
                            {g.target && <div className="text-[13px] text-navy/55">Target: {g.target}</div>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-[14px] text-navy/50">Set together at kick-off.</p>}
                </div>
                <div>
                  <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-navy/50">Features in scope</h3>
                  {project.features.length ? (
                    <ul className="space-y-2">
                      {project.features.map((f) => (
                        <li key={f} className="flex gap-2.5 text-[14px] text-navy/80">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-gold-500" /> {f}
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-[14px] text-navy/50">Confirmed in your proposal.</p>}
                </div>
              </div>
            </Card>
          )}

          {template && (
            <div id="brief" className="scroll-mt-6">
              <Card
                title="Project brief"
                action={project.brief_submitted_at && !showBriefForm ? (
                  <Link href={`/portal/projects/${project.id}?edit=brief#brief`} className="text-[13px] font-semibold text-gold-600 hover:underline">Edit</Link>
                ) : undefined}
              >
                {showBriefForm ? (
                  <form action={submitBrief.bind(null, project.id)} className="space-y-5">
                    <p className="text-[14px] text-navy/60">A few questions so we build exactly what you need. Short answers are fine. We’ll talk it through at kick-off.</p>
                    {template.intake.map((q) => (
                      <Field key={q.id} label={q.label}>
                        {q.type === 'textarea' ? (
                          <textarea name={q.id} rows={3} defaultValue={project.brief[q.id] ?? ''} placeholder={q.placeholder} className={inputClass} />
                        ) : q.type === 'select' ? (
                          <select name={q.id} defaultValue={project.brief[q.id] ?? ''} className={inputClass}>
                            <option value="">Choose…</option>
                            {q.options?.map((o) => <option key={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input name={q.id} defaultValue={project.brief[q.id] ?? ''} placeholder={q.placeholder} className={inputClass} />
                        )}
                      </Field>
                    ))}
                    <SubmitButton pendingText="Sending…">{project.brief_submitted_at ? 'Update brief' : 'Send brief to the team'}</SubmitButton>
                  </form>
                ) : (
                  <dl className="space-y-4">
                    {template.intake.filter((q) => project.brief[q.id]).map((q) => (
                      <div key={q.id}>
                        <dt className="text-[13px] font-semibold text-navy/55">{q.label}</dt>
                        <dd className="mt-1 whitespace-pre-line text-[14.5px] text-navy/85">{project.brief[q.id]}</dd>
                      </div>
                    ))}
                    <p className="font-mono text-[10.5px] uppercase tracking-wider text-navy/40">Submitted {formatDate(project.brief_submitted_at)}</p>
                  </dl>
                )}
              </Card>
            </div>
          )}

          <Card title="Timeline">
            {milestones.length ? (
              <ol className="relative space-y-5 border-l border-navy/10 pl-6">
                {milestones.map((m) => (
                  <li key={m.id} className="relative">
                    <span className="absolute -left-[33px] top-0.5 rounded-full bg-white">
                      {m.status === 'done' ? (
                        <CheckCircle2 className="h-[18px] w-[18px] text-[#28c840]" />
                      ) : m.status === 'in_progress' ? (
                        <CircleDot className="h-[18px] w-[18px] text-gold-500" />
                      ) : (
                        <Circle className="h-[18px] w-[18px] text-navy/25" />
                      )}
                    </span>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className={`text-[14.5px] font-semibold ${m.status === 'done' ? 'text-navy/60' : 'text-navy'}`}>{m.title}</span>
                      <span className="font-mono text-[11px] text-navy/45">{formatDate(m.due_date)}</span>
                    </div>
                    {m.description && <p className="mt-1 text-[13.5px] text-navy/60">{m.description}</p>}
                  </li>
                ))}
              </ol>
            ) : <Empty>Your day-by-day timeline will appear here after kick-off.</Empty>}
          </Card>

          <div id="tickets" className="scroll-mt-6">
            <Card
              title="Reviews, tickets & revisions"
              action={<span className="text-[12.5px] font-semibold text-navy/55">Revisions: {revisionsUsed} of {project.revision_quota} used</span>}
            >
              {tickets.length ? (
                <ul className="mb-6 divide-y divide-navy/[0.07]">
                  {tickets.map((t) => (
                    <li key={t.id}>
                      <Link href={`/portal/projects/${project.id}/tickets/${t.id}`} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 flex-none text-gold-500" />
                            <span className="truncate text-[14.5px] font-semibold text-navy">{t.title}</span>
                          </div>
                          <div className="mt-0.5 pl-6 text-[12.5px] text-navy/50">
                            {t.is_revision ? 'Revision request' : 'Ticket'} · {timeAgo(t.created_at)}
                          </div>
                        </div>
                        <Badge tone={ticketTone[t.status]}>{ticketStatusLabel[t.status]}</Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}

              {project.status !== 'completed' && (
                <form action={createTicket.bind(null, project.id)} className="space-y-4 rounded-2xl bg-[#f6f8fc] p-4 sm:p-5">
                  <h3 className="font-display text-[15px] font-semibold text-navy">Raise a ticket</h3>
                  <Field label="Title">
                    <input name="title" required minLength={3} maxLength={140} placeholder="e.g. Make the hero headline bigger" className={inputClass} />
                  </Field>
                  <Field label="What do you need?" hint="Be as specific as you can. Links and page names help.">
                    <textarea name="body" required minLength={5} rows={4} className={inputClass} />
                  </Field>
                  <label className={`flex items-center gap-2.5 text-[14px] ${revisionsLeft ? 'text-navy/80' : 'text-navy/40'}`}>
                    <input type="checkbox" name="is_revision" disabled={!revisionsLeft} className="h-4 w-4 rounded border-navy/30 accent-[#2563EB]" />
                    Count this as a revision round ({revisionsLeft} left)
                  </label>
                  <SubmitButton pendingText="Sending…">Submit ticket</SubmitButton>
                </form>
              )}
            </Card>
          </div>

          {project.status === 'completed' && (
            <div id="review" className="scroll-mt-6">
              <Card title="Final review">
                <p className="text-[14.5px] text-navy/70">
                  Your project is complete. Thank you for flying with us. We’d love to hear how it went.
                </p>
                <form action={submitReview.bind(null, project.id)} className="mt-5 space-y-4">
                  <fieldset>
                    <legend className="mb-2 text-[13px] font-semibold text-navy/80">How would you rate working with us?</legend>
                    <div className="star-rating flex flex-row-reverse justify-end gap-1">
                      {[5, 4, 3, 2, 1].map((n) => (
                        <label key={n} className="cursor-pointer">
                          <input type="radio" name="rating" value={n} defaultChecked={review?.rating === n} className="sr-only" required />
                          <Star className="h-7 w-7 text-navy/20 transition-colors" />
                          <span className="sr-only">{n} stars</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <Field label="Anything you’d like to share? (optional)">
                    <textarea name="comment" rows={3} defaultValue={review?.comment ?? ''} className={inputClass} />
                  </Field>
                  <SubmitButton pendingText="Sending…">{review ? 'Update feedback' : 'Send feedback'}</SubmitButton>
                </form>
                {googleReviewUrl && (
                  <div className="mt-6 rounded-2xl border border-gold-400/25 bg-gold-400/[0.06] p-4 sm:p-5">
                    <div className="font-display text-[15px] font-semibold text-navy">Would you share a public review?</div>
                    <p className="mt-1 text-[13.5px] text-navy/60">A short Google review helps other businesses find us. It takes under a minute.</p>
                    <a
                      href={googleReviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-navy hover:-translate-y-0.5"
                    >
                      <Star className="h-4 w-4 fill-gold-300 text-gold-300" /> Review us on Google
                    </a>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-6">
          <Card title="Payments">
            <dl className="space-y-2.5 text-[14px]">
              <div className="flex justify-between"><dt className="text-navy/60">Project fee</dt><dd className="font-semibold text-navy">{formatMoney(project.budget_minor, project.currency)}</dd></div>
              <div className="flex justify-between"><dt className="text-navy/60">Deposit ({project.deposit_percent}%)</dt><dd className="font-semibold text-navy">{formatMoney(deposit, project.currency)}</dd></div>
              <div className="flex justify-between"><dt className="text-navy/60">Invoiced</dt><dd className="font-semibold text-navy">{formatMoney(invoiced, project.currency)}</dd></div>
              <div className="flex justify-between"><dt className="text-navy/60">Paid</dt><dd className="font-semibold text-[#178a3c]">{formatMoney(paid, project.currency)}</dd></div>
              {project.retainer_minor ? (
                <div className="flex justify-between border-t border-navy/[0.07] pt-2.5"><dt className="text-navy/60">Monthly retainer</dt><dd className="font-semibold text-navy">{formatMoney(project.retainer_minor, project.currency)}/mo</dd></div>
              ) : null}
            </dl>
            <div className="mt-5 space-y-2">
              {invoices.length ? invoices.map((inv) => (
                <Link key={inv.id} href={`/portal/invoices/${inv.id}`} className="flex items-center justify-between gap-3 rounded-2xl border border-navy/10 px-4 py-3 transition-colors hover:border-gold-400/40">
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-navy">{inv.number}</div>
                    <div className="text-[12px] capitalize text-navy/50">{inv.kind} · {formatMoney(invoiceTotal(inv.invoice_items), inv.currency)}</div>
                  </div>
                  <Badge tone={invoiceTone[inv.status]}>{inv.status === 'sent' && invoiceBalance(inv) === 0 ? 'Paid' : invoiceStatusLabel[inv.status]}</Badge>
                </Link>
              )) : <Empty>No invoices yet.</Empty>}
            </div>
          </Card>

          <Card title="Files & handover">
            {documents.length ? (
              <ul className="space-y-2">
                {documents.map((d) => (
                  <li key={d.id}>
                    <a href={`/portal/documents/${d.id}`} className="flex items-center gap-3 rounded-2xl border border-navy/10 px-4 py-3 transition-colors hover:border-gold-400/40">
                      <FileText className="h-5 w-5 flex-none text-gold-500" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[14px] font-semibold text-navy">{d.title}</div>
                        <div className="text-[12px] capitalize text-navy/50">{d.kind} · {formatDate(d.created_at)}</div>
                      </div>
                      <Download className="h-4 w-4 flex-none text-navy/40" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : <Empty>Deliverables and your handover pack will appear here.</Empty>}
          </Card>

          <Card title="Daily updates">
            {updates.length ? (
              <ol className="space-y-4">
                {updates.map((u) => (
                  <li key={u.id} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-gold-400" />
                    <div className="min-w-0">
                      <p className="whitespace-pre-line text-[14px] leading-snug text-navy/80">{u.body}</p>
                      <div className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-navy/40">
                        {u.author_id === user.id ? 'You' : 'Eaglescroft team'} · {timeAgo(u.created_at)}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            ) : <Empty>Updates from the team will appear here as work progresses.</Empty>}
          </Card>
        </div>
      </div>
      )}
    </>
  )
}
