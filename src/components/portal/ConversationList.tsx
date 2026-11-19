import Link from 'next/link'
import { cn } from '@/lib/utils'
import { timeAgo } from '@/lib/portal/format'
import type { SupabaseClient } from '@supabase/supabase-js'

type Row = { id: string; title: string; last?: { body: string; created_at: string; mine: boolean } | null; unread: number }

/** One conversation per project (the project's team channel), newest activity first. */
export async function loadConversations(supabase: SupabaseClient, viewerId: string): Promise<Row[]> {
  const [{ data: projects }, { data: unread }, { data: recent }] = await Promise.all([
    supabase.from('projects').select('id, title, updated_at').order('updated_at', { ascending: false }),
    supabase.rpc('unread_message_counts'),
    supabase.from('messages').select('project_id, body, created_at, author_id, attachments').is('deleted_at', null).order('created_at', { ascending: false }).limit(300),
  ])
  const unreadMap = new Map(((unread ?? []) as { project_id: string; unread: number }[]).map((u) => [u.project_id, Number(u.unread)]))
  const lastMap = new Map<string, { body: string; created_at: string; mine: boolean }>()
  for (const m of recent ?? []) {
    if (!lastMap.has(m.project_id)) {
      lastMap.set(m.project_id, { body: m.body || ((m.attachments as unknown[])?.length ? 'Sent a file' : ''), created_at: m.created_at, mine: m.author_id === viewerId })
    }
  }
  return (projects ?? [])
    .map((p) => ({ id: p.id, title: p.title, last: lastMap.get(p.id) ?? null, unread: unreadMap.get(p.id) ?? 0 }))
    .sort((a, b) => (b.last?.created_at ?? '').localeCompare(a.last?.created_at ?? ''))
}

export default function ConversationList({ rows, activeId }: { rows: Row[]; activeId?: string }) {
  if (!rows.length) return <p className="p-6 text-center text-[13.5px] text-navy/50">Conversations open once a project is set up.</p>
  return (
    <ul className="space-y-1 p-2">
      {rows.map((r) => (
        <li key={r.id}>
          <Link
            href={`/portal/messages/${r.id}`}
            className={cn('flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors', r.id === activeId ? 'bg-navy text-white' : 'hover:bg-canvas')}
          >
            <span className={cn('flex h-11 w-11 flex-none items-center justify-center rounded-2xl font-display text-[15px] font-semibold', r.id === activeId ? 'bg-surface/15 text-white' : 'bg-gold-400/12 text-gold-600')}>
              {r.title.slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className={cn('truncate text-[14px] font-semibold', r.id === activeId ? 'text-white' : 'text-navy')}>{r.title}</span>
                {r.last && <span className={cn('flex-none text-[11px]', r.id === activeId ? 'text-white/60' : 'text-navy/40')}>{timeAgo(r.last.created_at)}</span>}
              </span>
              <span className="flex items-center justify-between gap-2">
                <span className={cn('truncate text-[12.5px]', r.id === activeId ? 'text-white/70' : r.unread ? 'font-semibold text-navy/80' : 'text-navy/50')}>
                  {r.last ? `${r.last.mine ? 'You: ' : ''}${r.last.body}` : 'No messages yet. Say hello'}
                </span>
                {r.unread > 0 && r.id !== activeId && (
                  <span className="flex h-5 min-w-[20px] flex-none items-center justify-center rounded-full bg-gold-400 px-1.5 text-[10.5px] font-bold text-white">{r.unread}</span>
                )}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
