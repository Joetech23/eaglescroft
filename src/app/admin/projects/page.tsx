import type { Metadata } from 'next'
import Link from 'next/link'
import { requireTeam } from '@/lib/portal/session'
import ProjectCards, { lagosDate } from '@/components/portal/ProjectCards'
import { ButtonLink, Empty, PageHeader } from '@/components/portal/ui'
import { cn } from '@/lib/utils'
import type { Profile, Project } from '@/lib/portal/types'

export const metadata: Metadata = { title: 'Projects' }

const filters = [
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'all', label: 'All' },
] as const

export default async function AdminProjects({ searchParams }: { searchParams: { show?: string } }) {
  const { supabase } = await requireTeam()
  const show = filters.some((f) => f.key === searchParams.show) ? searchParams.show! : 'active'

  const [{ data: ps }, { data: cs }, { data: us }] = await Promise.all([
    supabase.from('projects').select('*').order('updated_at', { ascending: false }),
    supabase.from('profiles').select('id, full_name, company, email').eq('role', 'client'),
    supabase.from('project_updates').select('project_id, created_at').order('created_at', { ascending: false }).limit(1000),
  ])
  const all = (ps ?? []) as Project[]
  const projects = all.filter((p) => (show === 'all' ? true : show === 'completed' ? p.status === 'completed' : p.status !== 'completed'))
  const clientNames = Object.fromEntries(((cs ?? []) as Pick<Profile, 'id' | 'full_name' | 'company' | 'email'>[]).map((c) => [c.id, c.company || c.full_name || c.email]))
  const lastUpdate: Record<string, string> = {}
  for (const u of (us ?? []) as { project_id: string; created_at: string }[]) lastUpdate[u.project_id] ??= u.created_at

  const today = lagosDate()
  const working = all.filter((p) => p.status === 'in_progress' || p.status === 'in_review')
  const updatedToday = working.filter((p) => lastUpdate[p.id] && lagosDate(lastUpdate[p.id]) === today).length

  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="Projects."
        intro={working.length ? `${updatedToday} of ${working.length} projects in progress have today’s update.` : 'Every client project in one place.'}
        actions={<ButtonLink href="/admin/projects/new">New project</ButtonLink>}
      />
      <div className="mb-5 flex gap-2 overflow-x-auto">
        {filters.map((f) => {
          const count = f.key === 'all' ? all.length : all.filter((p) => (f.key === 'completed' ? p.status === 'completed' : p.status !== 'completed')).length
          return (
            <Link
              key={f.key}
              href={f.key === 'active' ? '/admin/projects' : `/admin/projects?show=${f.key}`}
              className={cn('flex-none rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors', show === f.key ? 'border-navy bg-navy text-white' : 'border-navy/12 text-navy/70 hover:border-navy/30')}
            >
              {f.label} <span className="opacity-60">{count}</span>
            </Link>
          )
        })}
      </div>
      {projects.length ? (
        <ProjectCards projects={projects} clientNames={clientNames} lastUpdate={lastUpdate} />
      ) : (
        <Empty>{show === 'completed' ? 'No completed projects yet.' : 'No projects here yet. Create a client, then a project.'}</Empty>
      )}
    </>
  )
}
