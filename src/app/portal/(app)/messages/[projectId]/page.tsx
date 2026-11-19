import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, FolderOpen } from 'lucide-react'
import { getViewer } from '@/lib/portal/session'
import { personSelect } from '@/lib/portal/people'
import ConversationList, { loadConversations } from '@/components/portal/ConversationList'
import ChatThread from '@/components/portal/ChatThread'
import Avatar from '@/components/portal/Avatar'
import { markConversationRead } from '@/app/portal/collab'
import type { Message, Person } from '@/lib/portal/types'

export const metadata: Metadata = { title: 'Messages' }

export default async function ThreadPage({ params }: { params: { projectId: string } }) {
  const { supabase, user, profile, isTeam } = await getViewer()
  const { data: project } = await supabase.from('projects').select('id, title, client_id').eq('id', params.projectId).maybeSingle()
  if (!project) notFound()

  const [{ data: msgs }, { data: members }, rows] = await Promise.all([
    supabase.from('messages').select('*').eq('project_id', project.id).order('created_at', { ascending: false }).limit(120),
    supabase.from('project_members').select('user_id, role').eq('project_id', project.id),
    loadConversations(supabase, user.id),
  ])
  const messages = ((msgs ?? []) as Message[]).reverse()
  const ids = Array.from(new Set([project.client_id, ...(members ?? []).map((m) => m.user_id), ...messages.map((m) => m.author_id)].filter(Boolean))) as string[]
  const { data: peopleRows } = await supabase.from('profiles').select(personSelect).in('id', ids)
  const people = (peopleRows ?? []) as Person[]
  const participants = people.filter((p) => p.id === project.client_id || (members ?? []).some((m) => m.user_id === p.id))

  await markConversationRead(project.id)

  return (
    <div className="grid gap-5 lg:h-[calc(100dvh-140px)] lg:grid-cols-[340px_1fr]">
      <section className="hidden overflow-y-auto rounded-[24px] border border-navy/[0.07] bg-surface shadow-soft lg:block">
        <div className="border-b border-navy/[0.07] px-5 py-4">
          <h1 className="font-display text-[20px] font-semibold text-navy">Messages</h1>
        </div>
        <ConversationList rows={rows.map((r) => (r.id === project.id ? { ...r, unread: 0 } : r))} activeId={project.id} />
      </section>

      <section className="-mx-4 -mt-4 flex h-[calc(100dvh-64px-76px)] flex-col overflow-hidden bg-surface sm:mx-0 sm:mt-0 sm:rounded-[24px] sm:border sm:border-navy/[0.07] sm:shadow-soft lg:h-auto">
        <header className="flex items-center gap-3 border-b border-navy/[0.07] px-4 py-3 sm:px-5">
          <Link href="/portal/messages" className="rounded-full p-1.5 text-navy/60 hover:bg-navy/5 lg:hidden" aria-label="All conversations"><ArrowLeft className="h-5 w-5" /></Link>
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-[16px] font-semibold text-navy">{project.title}</div>
            <div className="truncate text-[12px] text-navy/50">{participants.length ? participants.map((p) => p.full_name || p.email).join(', ') : 'Project channel'}</div>
          </div>
          <div className="hidden -space-x-2 sm:flex">
            {participants.slice(0, 4).map((p) => <Avatar key={p.id} person={p} size="sm" />)}
          </div>
          <Link href={isTeam ? `/admin/projects/${project.id}` : `/portal/projects/${project.id}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-navy/10 text-navy/60 hover:text-navy" aria-label="Open project">
            <FolderOpen className="h-4 w-4" />
          </Link>
        </header>
        <ChatThread projectId={project.id} viewer={{ id: profile.id, full_name: profile.full_name, email: profile.email, role: profile.role, title: profile.title, signature: profile.signature, avatar_url: profile.avatar_url, company: profile.company }} initialMessages={messages} initialPeople={people} />
      </section>
    </div>
  )
}
