import type { Metadata } from 'next'
import Link from 'next/link'
import { getViewer } from '@/lib/portal/session'
import { personSelect } from '@/lib/portal/people'
import TaskBoard, { NewTaskForm } from '@/components/portal/TaskBoard'
import { PageHeader } from '@/components/portal/ui'
import { cn } from '@/lib/utils'
import type { Person, Task } from '@/lib/portal/types'

export const metadata: Metadata = { title: 'Tasks' }

export default async function TasksPage({ searchParams }: { searchParams: { view?: string } }) {
  const { supabase, profile, isTeam } = await getViewer()
  const view = searchParams.view === 'all' ? 'all' : 'mine'

  let q = supabase.from('tasks').select('*, projects(title)').order('sort')
  if (view === 'mine') q = isTeam ? q.eq('assignee_id', profile.id) : q.or(`assignee_id.eq.${profile.id},created_by.eq.${profile.id}`)
  const [{ data: rows }, { data: projects }, { data: team }] = await Promise.all([
    q,
    supabase.from('projects').select('id, title, client_id').neq('status', 'completed').order('title'),
    supabase.from('profiles').select(personSelect).in('role', ['admin', 'staff']),
  ])
  const tasks = (rows ?? []) as (Task & { projects: { title: string } | null })[]
  const clientIds = Array.from(new Set((projects ?? []).map((p) => p.client_id)))
  const { data: clients } = isTeam && clientIds.length ? await supabase.from('profiles').select(personSelect).in('id', clientIds) : { data: [] }
  const assigneeIds = Array.from(new Set(tasks.map((t) => t.assignee_id).filter(Boolean))) as string[]
  const { data: extra } = assigneeIds.length ? await supabase.from('profiles').select(personSelect).in('id', assigneeIds) : { data: [] }
  const people = new Map(([...(team ?? []), ...(clients ?? []), ...(extra ?? [])] as Person[]).map((p) => [p.id, p]))

  return (
    <>
      <PageHeader
        eyebrow="Tasks"
        title="Tasks & progress."
        intro={isTeam ? 'Your assignments across every project. Switch to all tasks to see the whole board.' : 'Things we need from you, and anything you’ve asked of us, in one board.'}
        actions={
          <div className="flex rounded-full border border-navy/10 bg-white p-1 shadow-soft">
            {(['mine', 'all'] as const).map((v) => (
              <Link key={v} href={`/portal/tasks${v === 'all' ? '?view=all' : ''}`} className={cn('rounded-full px-4 py-1.5 text-[13px] font-semibold', view === v ? 'bg-navy text-white' : 'text-navy/60')}>
                {v === 'mine' ? 'My tasks' : 'All tasks'}
              </Link>
            ))}
          </div>
        }
      />
      <div className="space-y-5">
        <NewTaskForm projects={projects ?? []} assignees={Array.from(people.values())} isTeam={isTeam} back={`/portal/tasks${view === 'all' ? '?view=all' : ''}`} />
        <TaskBoard tasks={tasks} people={people} viewerId={profile.id} isTeam={isTeam} showProject />
      </div>
    </>
  )
}
