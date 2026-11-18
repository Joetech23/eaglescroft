import { ChevronLeft, ChevronRight, Check, EyeOff, Trash2 } from 'lucide-react'
import { setTaskStatus, deleteTask, createTask } from '@/app/portal/collab'
import { formatDate } from '@/lib/portal/format'
import { displayName } from '@/lib/portal/people'
import { cn } from '@/lib/utils'
import Avatar from './Avatar'
import SubmitButton from './SubmitButton'
import { Field, inputClass } from './ui'
import type { Person, Task, TaskStatus } from '@/lib/portal/types'

export const taskColumns: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'To do' },
  { status: 'in_progress', label: 'In progress' },
  { status: 'review', label: 'Review' },
  { status: 'done', label: 'Done' },
]
const order: TaskStatus[] = taskColumns.map((c) => c.status)
const priorityStyle = { high: 'bg-[#e5484d]/10 text-[#c2262b]', medium: 'bg-gold-400/10 text-gold-600', low: 'bg-navy/[0.05] text-navy/50' }

type Row = Task & { projects?: { title: string } | null }

/** Kanban on desktop, stacked sections on phones. Buttons move a card one column at a time. */
export default function TaskBoard({
  tasks, people, viewerId, isTeam, showProject,
}: {
  tasks: Row[]
  people: Map<string, Person>
  viewerId: string
  isTeam: boolean
  showProject?: boolean
}) {
  const today = new Date().toISOString().slice(0, 10)
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {taskColumns.map((col) => {
        const items = tasks.filter((t) => t.status === col.status).sort((a, b) => (a.due_date ?? '9999').localeCompare(b.due_date ?? '9999'))
        return (
          <section key={col.status} className="min-w-0 rounded-[22px] bg-[#eef2f9] p-3">
            <div className="mb-3 flex items-center justify-between px-1.5">
              <h3 className="font-display text-[14px] font-semibold text-navy">{col.label}</h3>
              <span className="rounded-full bg-white px-2 py-0.5 text-[11.5px] font-semibold text-navy/55">{items.length}</span>
            </div>
            <div className="space-y-2.5">
              {items.length === 0 && <p className="rounded-2xl border border-dashed border-navy/15 px-3 py-5 text-center text-[12.5px] text-navy/40">Nothing here</p>}
              {items.map((t) => {
                const assignee = t.assignee_id ? people.get(t.assignee_id) : null
                const canMove = isTeam || t.assignee_id === viewerId || t.created_by === viewerId
                const idx = order.indexOf(t.status)
                return (
                  <article key={t.id} className="rounded-2xl border border-navy/[0.07] bg-white p-3.5 shadow-soft">
                    {showProject && t.projects && <div className="mb-1 truncate font-mono text-[10px] uppercase tracking-wider text-navy/40">{t.projects.title}</div>}
                    <div className="flex items-start gap-2">
                      <p className={cn('min-w-0 flex-1 text-[14px] font-semibold leading-snug text-navy', t.status === 'done' && 'text-navy/45 line-through')}>{t.title}</p>
                      {!t.client_visible && <span title="Internal — clients can't see this"><EyeOff className="mt-0.5 h-3.5 w-3.5 flex-none text-navy/35" /></span>}
                    </div>
                    {t.description && <p className="mt-1 line-clamp-2 text-[12.5px] text-navy/55">{t.description}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className={cn('rounded-full px-2 py-0.5 text-[10.5px] font-semibold capitalize', priorityStyle[t.priority])}>{t.priority}</span>
                      {t.due_date && <span className={cn('rounded-full bg-navy/[0.05] px-2 py-0.5 text-[10.5px] font-semibold', t.due_date < today && t.status !== 'done' ? 'text-[#c2262b]' : 'text-navy/55')}>{formatDate(t.due_date)}</span>}
                      <span className="ml-auto flex items-center gap-1.5" title={assignee ? displayName(assignee) : 'Unassigned'}>
                        {assignee ? <Avatar person={assignee} size="xs" /> : <span className="text-[11px] text-navy/35">Unassigned</span>}
                      </span>
                    </div>
                    {canMove && (
                      <div className="mt-3 flex items-center gap-1 border-t border-navy/[0.06] pt-2.5">
                        {idx > 0 && (
                          <form action={setTaskStatus.bind(null, t.id, order[idx - 1])}>
                            <button className="rounded-full p-1.5 text-navy/45 hover:bg-navy/5 hover:text-navy" aria-label={`Move back to ${taskColumns[idx - 1].label}`}><ChevronLeft className="h-4 w-4" /></button>
                          </form>
                        )}
                        {idx < order.length - 1 && (
                          <form action={setTaskStatus.bind(null, t.id, order[idx + 1])} className="flex-1">
                            <button className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold text-gold-600 hover:bg-gold-400/10">
                              {order[idx + 1] === 'done' ? <><Check className="h-3.5 w-3.5" /> Done</> : <>{taskColumns[idx + 1].label} <ChevronRight className="h-3.5 w-3.5" /></>}
                            </button>
                          </form>
                        )}
                        {(isTeam || t.created_by === viewerId) && (
                          <form action={deleteTask.bind(null, t.id)} className="ml-auto">
                            <button className="rounded-full p-1.5 text-navy/30 hover:bg-[#e5484d]/10 hover:text-[#c2262b]" aria-label="Delete task"><Trash2 className="h-3.5 w-3.5" /></button>
                          </form>
                        )}
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export function NewTaskForm({
  projects, assignees, isTeam, back, fixedProjectId,
}: {
  projects: { id: string; title: string }[]
  assignees: Person[]
  isTeam: boolean
  back: string
  fixedProjectId?: string
}) {
  if (!projects.length) return null
  return (
    <form action={createTask} className="grid gap-3 rounded-[22px] border border-navy/[0.07] bg-white p-4 shadow-soft sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end">
      <input type="hidden" name="back" value={back} />
      {fixedProjectId ? <input type="hidden" name="project_id" value={fixedProjectId} /> : null}
      <div className="sm:col-span-2 lg:col-span-1"><Field label="New task"><input name="title" required maxLength={200} placeholder={isTeam ? 'e.g. Send homepage draft for review' : 'e.g. Upload our logo files'} className={inputClass} /></Field></div>
      {!fixedProjectId && (
        <Field label="Project">
          <select name="project_id" required className={inputClass}>{projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}</select>
        </Field>
      )}
      <Field label="Due"><input type="date" name="due_date" className={inputClass} /></Field>
      <Field label="Priority">
        <select name="priority" defaultValue="medium" className={inputClass}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
      </Field>
      {isTeam && (
        <Field label="Assign to">
          <select name="assignee_id" className={inputClass}>
            <option value="">Unassigned</option>
            {assignees.map((a) => <option key={a.id} value={a.id}>{displayName(a)}{a.role === 'client' ? ' (client)' : a.title ? ` · ${a.title}` : ''}</option>)}
          </select>
        </Field>
      )}
      <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1">
        {isTeam && (
          <label className="flex items-center gap-1.5 text-[12.5px] text-navy/60" title="Hidden from the client">
            <input type="checkbox" name="internal" className="h-4 w-4 accent-[#2563EB]" /> Internal
          </label>
        )}
        <SubmitButton pendingText="Adding…" className="flex-1 lg:flex-none">Add task</SubmitButton>
      </div>
    </form>
  )
}
