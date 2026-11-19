import Link from 'next/link'
import { CalendarDays, Megaphone } from 'lucide-react'
import { serviceLabel } from '@/lib/portal/templates'
import { formatDate, projectStatusLabel, timeAgo } from '@/lib/portal/format'
import { Badge, ProgressBar, statusTone } from './ui'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/portal/types'

/** Lagos calendar date (YYYY-MM-DD) for "updated today" checks. */
export function lagosDate(d: Date | string = new Date()) {
  return new Date(d).toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' })
}

/** Team project cards: phone-friendly, with daily-update status and a one-tap "Post update". */
export default function ProjectCards({
  projects, clientNames, lastUpdate,
}: {
  projects: Project[]
  clientNames: Record<string, string>
  /** project id → ISO time of the latest update */
  lastUpdate: Record<string, string | undefined>
}) {
  const today = lagosDate()
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {projects.map((p) => {
        const last = lastUpdate[p.id]
        const updatedToday = last ? lagosDate(last) === today : false
        const live = p.status === 'in_progress' || p.status === 'in_review' || p.status === 'onboarding'
        const overdue = p.due_date && p.due_date < today && p.status !== 'completed'
        return (
          <li key={p.id} className="flex flex-col rounded-[22px] border border-navy/10 bg-surface p-4 shadow-soft sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/admin/projects/${p.id}`} className="min-w-0 flex-1">
                <span className="block truncate font-display text-[16px] font-semibold text-navy hover:text-gold-600">{p.title}</span>
                <span className="block truncate text-[12.5px] text-navy/50">{clientNames[p.client_id] ?? 'Client'} · {serviceLabel(p.service)}</span>
              </Link>
              <Badge tone={statusTone[p.status]}>{projectStatusLabel[p.status]}</Badge>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <ProgressBar value={p.progress} className="flex-1" />
              <span className="w-10 text-right text-[13px] font-semibold text-navy/70">{p.progress}%</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px]">
              <span className={cn('inline-flex items-center gap-1.5', overdue ? 'font-semibold text-danger' : 'text-navy/55')}>
                <CalendarDays className="h-3.5 w-3.5" /> {p.due_date ? `Due ${formatDate(p.due_date)}` : 'No due date'}
              </span>
              <span className={cn('inline-flex items-center gap-1.5', updatedToday ? 'font-semibold text-success' : live && last ? 'text-navy/55' : 'text-navy/45')}>
                <span className={cn('h-2 w-2 rounded-full', updatedToday ? 'bg-success' : live ? 'bg-gold-400' : 'bg-navy/20')} />
                {updatedToday ? 'Updated today' : last ? `Last update ${timeAgo(last)}` : 'No updates yet'}
              </span>
            </div>

            <div className="mt-4 flex gap-2 border-t border-navy/[0.07] pt-3.5">
              <Link
                href={`/admin/projects/${p.id}#updates`}
                className={cn(
                  'inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold',
                  live && !updatedToday ? 'bg-gradient-to-b from-[#3b76f0] to-[#1d4ed8] text-white shadow-gold' : 'border border-navy/15 text-navy hover:border-navy/30',
                )}
              >
                <Megaphone className="h-4 w-4" /> {updatedToday ? 'Add another update' : 'Post today’s update'}
              </Link>
              <Link href={`/admin/projects/${p.id}`} className="inline-flex items-center justify-center rounded-full border border-navy/15 px-4 py-2.5 text-[13px] font-semibold text-navy hover:border-navy/30">
                Manage
              </Link>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
