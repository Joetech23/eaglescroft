import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink, FileText, Star, Trash2 } from 'lucide-react'
import { requireTeam } from '@/lib/portal/session'
import { getTemplate, serviceLabel } from '@/lib/portal/templates'
import {
  formatDate, formatMoney, invoiceBalance, invoiceStatusLabel, invoiceTotal, milestoneStatusLabel,
  projectStatusLabel, ticketStatusLabel, timeAgo,
} from '@/lib/portal/format'
import {
  addMilestone, createInvoice, deleteDocument, deleteMilestone, postUpdate, recordManualPayment,
  setInvoiceStatus, setMilestoneStatus, setProjectMembers, setTicketStatus, updateProject,
} from '../../actions'
import Avatar from '@/components/portal/Avatar'
import { displayName, personSelect } from '@/lib/portal/people'
import SubmitButton from '@/components/portal/SubmitButton'
import DocumentUploader from '@/components/portal/DocumentUploader'
import { Badge, Card, Empty, Field, Notice, PageHeader, inputClass, invoiceTone, statusTone, ticketTone } from '@/components/portal/ui'
import type {
  Invoice, Milestone, MilestoneStatus, Person, Profile, Project, ProjectDocument, ProjectStatus, ProjectUpdate, Review, Ticket,
} from '@/lib/portal/types'

export const metadata: Metadata = { title: 'Manage project' }

const statuses: ProjectStatus[] = ['onboarding', 'in_progress', 'in_review', 'completed', 'on_hold']
const nextMilestoneStatus: Record<MilestoneStatus, MilestoneStatus> = { upcoming: 'in_progress', in_progress: 'done', done: 'upcoming' }
const messages: Record<string, { tone: 'green' | 'red'; text: string }> = {
  'saved=created': { tone: 'green', text: 'Project created with its template timeline. Review the deposit invoice under Billing, then send it.' },
  'saved=project': { tone: 'green', text: 'Project details saved.' },
  'saved=invoice': { tone: 'green', text: 'Invoice saved.' },
  'saved=payment': { tone: 'green', text: 'Payment recorded.' },
  'saved=team': { tone: 'green', text: 'Project team updated. They’ll get notifications for this project.' },
  'error=update': { tone: 'red', text: 'Couldn’t save the project.' },
  'error=invoice': { tone: 'red', text: 'Add at least one line item with an amount.' },
}

export default async function AdminProjectPage({ params, searchParams }: { params: { id: string }; searchParams: Record<string, string> }) {
  const { supabase, profile: viewer } = await requireTeam()
  const isAdmin = viewer.role === 'admin'
  const { data: row } = await supabase.from('projects').select('*').eq('id', params.id).maybeSingle()
  if (!row) notFound()
  const project = row as Project

  const [{ data: client }, { data: ms }, { data: ups }, { data: tks }, { data: invs }, { data: docs }, { data: rev }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', project.client_id).single(),
    supabase.from('milestones').select('*').eq('project_id', project.id).order('sort'),
    supabase.from('project_updates').select('*').eq('project_id', project.id).order('created_at', { ascending: false }).limit(15),
    supabase.from('tickets').select('*').eq('project_id', project.id).order('created_at', { ascending: false }),
    supabase.from('invoices').select('*, invoice_items(*), payments(*)').eq('project_id', project.id).order('created_at'),
    supabase.from('documents').select('*').eq('project_id', project.id).order('created_at', { ascending: false }),
    supabase.from('reviews').select('*').eq('project_id', project.id).maybeSingle(),
  ])
  const owner = client as Profile
  const milestones = (ms ?? []) as Milestone[]
  const updates = (ups ?? []) as ProjectUpdate[]
  const tickets = (tks ?? []) as Ticket[]
  const invoices = (invs ?? []) as Invoice[]
  const documents = (docs ?? []) as ProjectDocument[]
  const review = rev as Review | null
  const [{ data: teamRows }, { data: memberRows }] = await Promise.all([
    supabase.from('profiles').select(personSelect).in('role', ['admin', 'staff']).order('full_name'),
    supabase.from('project_members').select('user_id, role').eq('project_id', project.id),
  ])
  const team = (teamRows ?? []) as Person[]
  const memberRole = new Map((memberRows ?? []).map((m) => [m.user_id as string, (m.role as string | null) ?? '']))
  const template = getTemplate(project.service)
  const money = (minor: number | null) => (minor ? (minor / 100).toFixed(2) : '')
  const msg = Object.entries(searchParams).map(([k, v]) => messages[`${k}=${v}`]).find(Boolean)

  return (
    <>
      <PageHeader
        eyebrow={`${serviceLabel(project.service)} · ${owner?.company || owner?.full_name || owner?.email}`}
        title={project.title}
        actions={
          <>
            <Badge tone={statusTone[project.status]}>{projectStatusLabel[project.status]}</Badge>
            <Link href={`/portal/projects/${project.id}`} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gold-600 hover:underline">
              Client view <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </>
        }
      />
      {msg && <div className="mb-6"><Notice tone={msg.tone}>{msg.text}</Notice></div>}

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="min-w-0 space-y-6">
          <Card title="Project details">
            <form action={updateProject.bind(null, project.id)} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Field label="Title"><input name="title" defaultValue={project.title} required className={inputClass} /></Field></div>
              <Field label="Status">
                <select name="status" defaultValue={project.status} className={inputClass}>
                  {statuses.map((s) => <option key={s} value={s}>{projectStatusLabel[s]}</option>)}
                </select>
              </Field>
              <Field label="Progress %"><input name="progress" type="number" min={0} max={100} defaultValue={project.progress} className={inputClass} /></Field>
              <div className="sm:col-span-2"><Field label="Summary"><textarea name="summary" rows={2} defaultValue={project.summary ?? ''} className={inputClass} /></Field></div>
              <div className="sm:col-span-2">
                <Field label="Goals & targets" hint="Goal | target, one per line">
                  <textarea name="goals" rows={3} defaultValue={project.goals.map((g) => (g.target ? `${g.title} | ${g.target}` : g.title)).join('\n')} className={inputClass} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Features in scope" hint="One per line">
                  <textarea name="features" rows={3} defaultValue={project.features.join('\n')} className={inputClass} />
                </Field>
              </div>
              <Field label="Start"><input type="date" name="start_date" defaultValue={project.start_date ?? ''} className={inputClass} /></Field>
              <Field label="Target launch"><input type="date" name="due_date" defaultValue={project.due_date ?? ''} className={inputClass} /></Field>
              <Field label={`Project fee (${project.currency})`}><input name="budget" inputMode="decimal" defaultValue={money(project.budget_minor)} className={inputClass} /></Field>
              <Field label="Deposit %"><input name="deposit_percent" type="number" min={0} max={100} defaultValue={project.deposit_percent} className={inputClass} /></Field>
              <Field label="Revision rounds"><input name="revision_quota" type="number" min={0} defaultValue={project.revision_quota} className={inputClass} /></Field>
              <Field label="Monthly retainer"><input name="retainer" inputMode="decimal" defaultValue={money(project.retainer_minor)} className={inputClass} /></Field>
              <div className="sm:col-span-2"><SubmitButton>Save details</SubmitButton></div>
            </form>
          </Card>

          <div id="timeline" className="scroll-mt-6">
            <Card title="Timeline" action={<span className="text-[12px] text-navy/50">Click a status to advance it</span>}>
              {milestones.length ? (
                <ul className="mb-5 divide-y divide-navy/[0.07]">
                  {milestones.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <div className="truncate text-[14px] font-semibold text-navy">{m.title}</div>
                        <div className="text-[12px] text-navy/50">{formatDate(m.due_date)}</div>
                      </div>
                      <div className="flex flex-none items-center gap-2">
                        <form action={setMilestoneStatus.bind(null, project.id, m.id, nextMilestoneStatus[m.status])}>
                          <button title="Advance status">
                            <Badge tone={m.status === 'done' ? 'green' : m.status === 'in_progress' ? 'blue' : 'muted'}>{milestoneStatusLabel[m.status]}</Badge>
                          </button>
                        </form>
                        <form action={deleteMilestone.bind(null, project.id, m.id)}>
                          <button title="Delete milestone" className="p-1 text-navy/30 hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                        </form>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <div className="mb-5"><Empty>No milestones yet.</Empty></div>}
              <form action={addMilestone.bind(null, project.id)} className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                <input name="title" placeholder="New milestone" aria-label="Milestone title" required className={inputClass} />
                <input name="due_date" type="date" aria-label="Due date" className={inputClass} />
                <SubmitButton variant="ghost">Add</SubmitButton>
              </form>
            </Card>
          </div>

          <div id="updates" className="scroll-mt-6">
            <Card title="Daily updates">
              <form action={postUpdate.bind(null, project.id)} className="mb-5 space-y-3">
                <textarea name="body" rows={3} required placeholder="What moved today? The client sees this on their dashboard." aria-label="Update" className={inputClass} />
                <SubmitButton pendingText="Posting…">Post update</SubmitButton>
              </form>
              {updates.length ? (
                <ol className="space-y-3">
                  {updates.map((u) => (
                    <li key={u.id} className="border-l-2 border-gold-400/40 pl-3">
                      <p className="whitespace-pre-line text-[14px] text-navy/80">{u.body}</p>
                      <div className="font-mono text-[10.5px] uppercase tracking-wider text-navy/40">{timeAgo(u.created_at)}</div>
                    </li>
                  ))}
                </ol>
              ) : <Empty>No updates yet.</Empty>}
            </Card>
          </div>

          <div id="tickets" className="scroll-mt-6">
            <Card title="Tickets & revisions" action={<span className="text-[12px] text-navy/50">{tickets.filter((t) => t.is_revision).length} of {project.revision_quota} revisions used</span>}>
              {tickets.length ? (
                <ul className="divide-y divide-navy/[0.07]">
                  {tickets.map((t) => (
                    <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <Link href={`/portal/projects/${project.id}/tickets/${t.id}`} className="min-w-0">
                        <div className="truncate text-[14px] font-semibold text-navy hover:text-gold-600">{t.title}</div>
                        <div className="text-[12px] text-navy/50">{t.is_revision ? 'Revision' : 'Ticket'} · {timeAgo(t.created_at)}</div>
                      </Link>
                      <div className="flex items-center gap-2">
                        <Badge tone={ticketTone[t.status]}>{ticketStatusLabel[t.status]}</Badge>
                        {t.status !== 'resolved' ? (
                          <form action={setTicketStatus.bind(null, project.id, t.id, t.status === 'open' ? 'in_progress' : 'resolved')}>
                            <SubmitButton variant="ghost" className="px-3 py-1.5 text-[12px]">{t.status === 'open' ? 'Start' : 'Resolve'}</SubmitButton>
                          </form>
                        ) : (
                          <form action={setTicketStatus.bind(null, project.id, t.id, 'open')}>
                            <SubmitButton variant="ghost" className="px-3 py-1.5 text-[12px]">Reopen</SubmitButton>
                          </form>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <Empty>No tickets yet.</Empty>}
            </Card>
          </div>
        </div>

        <div className="min-w-0 space-y-6">
          <div id="team" className="scroll-mt-6">
            <Card title="Project team" action={<Link href={`/portal/messages/${project.id}`} className="text-[13px] font-semibold text-gold-600 hover:underline">Open chat</Link>}>
              <form action={setProjectMembers.bind(null, project.id)} className="space-y-2">
                {team.map((m) => (
                  <label key={m.id} className="flex items-center gap-3 rounded-2xl border border-navy/[0.08] p-2.5">
                    <input type="checkbox" name="member" value={m.id} defaultChecked={memberRole.has(m.id)} className="h-4 w-4 accent-[#2563EB]" />
                    <Avatar person={m} size="sm" />
                    <span className="min-w-0 flex-1"><span className="block truncate text-[13.5px] font-semibold text-navy">{displayName(m)}</span><span className="block truncate text-[11.5px] text-navy/45">{m.title || m.role}</span></span>
                    <input name={`role_${m.id}`} defaultValue={memberRole.get(m.id) ?? ''} placeholder="Role on project" aria-label={`Role for ${displayName(m)}`} className="w-36 rounded-xl border border-navy/12 bg-surface px-2.5 py-1.5 text-[12.5px]" />
                  </label>
                ))}
                <p className="text-[12px] text-navy/45">Assigned members get this project&rsquo;s notifications. With nobody assigned, admins get them.</p>
                <SubmitButton variant="ghost">Save project team</SubmitButton>
              </form>
            </Card>
          </div>

          {isAdmin && (
          <div id="billing" className="scroll-mt-6">
            <Card title="Billing">
              <div className="space-y-3">
                {invoices.length ? invoices.map((inv) => {
                  const balance = invoiceBalance(inv)
                  return (
                    <div key={inv.id} className="rounded-2xl border border-navy/10 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link href={`/portal/invoices/${inv.id}`} className="text-[14px] font-semibold text-navy hover:text-gold-600">{inv.number}</Link>
                          <div className="text-[12px] capitalize text-navy/50">{inv.kind} · {formatMoney(invoiceTotal(inv.invoice_items), inv.currency)} · due {formatDate(inv.due_date)}</div>
                        </div>
                        <Badge tone={invoiceTone[inv.status]}>{invoiceStatusLabel[inv.status]}</Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {inv.status === 'draft' && (
                          <form action={setInvoiceStatus.bind(null, project.id, inv.id, 'sent')}><SubmitButton className="px-3.5 py-1.5 text-[12.5px]">Send to client</SubmitButton></form>
                        )}
                        {(inv.status === 'draft' || inv.status === 'sent') && (
                          <form action={setInvoiceStatus.bind(null, project.id, inv.id, 'void')}><SubmitButton variant="danger" className="px-3.5 py-1.5 text-[12.5px]">Void</SubmitButton></form>
                        )}
                      </div>
                      {inv.status === 'sent' && balance > 0 && (
                        <form action={recordManualPayment.bind(null, project.id, inv.id)} className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                          <input name="amount" inputMode="decimal" defaultValue={(balance / 100).toFixed(2)} aria-label="Amount received" className={inputClass} />
                          <input name="reference" placeholder="Bank ref (optional)" aria-label="Reference" className={inputClass} />
                          <SubmitButton variant="ghost" className="px-3.5">Record transfer</SubmitButton>
                        </form>
                      )}
                    </div>
                  )
                }) : <Empty>No invoices yet.</Empty>}
              </div>

              <form action={createInvoice.bind(null, project.id)} className="mt-5 space-y-3 rounded-2xl bg-subtle p-4">
                <h3 className="font-display text-[15px] font-semibold text-navy">New invoice ({project.currency})</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <select name="kind" aria-label="Invoice type" className={inputClass}>
                    <option value="milestone">Milestone</option>
                    <option value="deposit">Deposit</option>
                    <option value="balance">Final balance</option>
                    <option value="retainer">Monthly retainer</option>
                    <option value="upsell">Extra work / upgrade</option>
                  </select>
                  <input type="date" name="due_date" aria-label="Due date" className={inputClass} />
                </div>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="grid grid-cols-[1fr_120px] gap-2">
                    <input name="item_description" placeholder={i === 0 ? 'Line item' : 'Another item (optional)'} aria-label={`Item ${i + 1}`} required={i === 0} className={inputClass} />
                    <input name="item_amount" inputMode="decimal" placeholder="0.00" aria-label={`Amount ${i + 1}`} required={i === 0} className={inputClass} />
                  </div>
                ))}
                <textarea name="notes" rows={2} placeholder="Notes / bank transfer details (shown on the invoice)" aria-label="Notes" className={inputClass} />
                <div className="flex flex-wrap gap-2">
                  <button name="intent" value="send" className="rounded-full bg-gradient-to-b from-[#3b76f0] to-[#1d4ed8] px-5 py-2.5 text-sm font-semibold text-white shadow-gold">Create & send</button>
                  <button name="intent" value="draft" className="rounded-full border border-navy/15 bg-surface px-5 py-2.5 text-sm font-semibold text-navy">Save draft</button>
                </div>
              </form>
            </Card>
          </div>
          )}

          <div id="files" className="scroll-mt-6">
            <Card title="Files & handover">
              {documents.length ? (
                <ul className="mb-4 space-y-2">
                  {documents.map((d) => (
                    <li key={d.id} className="flex items-center gap-3 rounded-2xl border border-navy/10 px-4 py-2.5">
                      <FileText className="h-4 w-4 flex-none text-gold-500" />
                      <a href={`/portal/documents/${d.id}`} className="min-w-0 flex-1 truncate text-[14px] font-semibold text-navy hover:text-gold-600">{d.title}</a>
                      <span className="text-[11px] capitalize text-navy/45">{d.kind}</span>
                      <form action={deleteDocument.bind(null, project.id, d.id)}>
                        <button title="Delete file" className="p-1 text-navy/30 hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                      </form>
                    </li>
                  ))}
                </ul>
              ) : null}
              <DocumentUploader projectId={project.id} />
            </Card>
          </div>

          <Card title="Brief">
            {project.brief_submitted_at && template ? (
              <dl className="space-y-3">
                {template.intake.filter((q) => project.brief[q.id]).map((q) => (
                  <div key={q.id}>
                    <dt className="text-[12.5px] font-semibold text-navy/55">{q.label}</dt>
                    <dd className="whitespace-pre-line text-[14px] text-navy/85">{project.brief[q.id]}</dd>
                  </div>
                ))}
              </dl>
            ) : <Empty>Waiting for the client to submit their brief.</Empty>}
          </Card>

          {review && (
            <Card title="Client review">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'fill-gold-400 text-gold-400' : 'text-navy/20'}`} />
                ))}
              </div>
              {review.comment && <p className="mt-2 whitespace-pre-line text-[14px] text-navy/80">{review.comment}</p>}
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
