import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getViewer } from '@/lib/portal/session'
import { formatDate, ticketStatusLabel } from '@/lib/portal/format'
import { postTicketMessage } from '@/app/portal/actions'
import SubmitButton from '@/components/portal/SubmitButton'
import { Badge, Card, PageHeader, inputClass, ticketTone } from '@/components/portal/ui'
import type { Ticket, TicketMessage } from '@/lib/portal/types'

export const metadata: Metadata = { title: 'Ticket' }

export default async function TicketPage({ params }: { params: { id: string; ticketId: string } }) {
  const { supabase, user, profile } = await getViewer()
  const [{ data: t }, { data: msgs }, { data: project }] = await Promise.all([
    supabase.from('tickets').select('*').eq('id', params.ticketId).eq('project_id', params.id).maybeSingle(),
    supabase.from('ticket_messages').select('*').eq('ticket_id', params.ticketId).order('created_at'),
    supabase.from('projects').select('title, client_id').eq('id', params.id).maybeSingle(),
  ])
  if (!t || !project) notFound()
  const ticket = t as Ticket
  const thread = (msgs ?? []) as TicketMessage[]

  // Clients can't read staff profiles, so label by side of the conversation.
  const who = (authorId: string | null) =>
    authorId === user.id ? 'You' : authorId === project.client_id ? 'Client' : 'Eaglescroft team'
  const backHref = profile.role === 'admin' ? `/admin/projects/${params.id}#tickets` : `/portal/projects/${params.id}#tickets`

  return (
    <>
      <Link href={backHref} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-navy/60 hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> {project.title}
      </Link>
      <PageHeader
        eyebrow={ticket.is_revision ? 'Revision request' : 'Ticket'}
        title={ticket.title}
        actions={<Badge tone={ticketTone[ticket.status]}>{ticketStatusLabel[ticket.status]}</Badge>}
      />

      <div className="max-w-3xl space-y-4">
        <Card>
          <div className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-navy/45">
            {who(ticket.author_id)} · {formatDate(ticket.created_at, true)}
          </div>
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-navy/85">{ticket.body}</p>
        </Card>

        {thread.map((m, i) => {
          const mine = m.author_id === user.id
          return (
            <div key={m.id} id={i === thread.length - 1 ? 'latest' : undefined} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-[20px] px-5 py-4 ${mine ? 'bg-navy text-white' : 'border border-navy/10 bg-surface text-navy/85 shadow-soft'}`}>
                <div className={`mb-1 font-mono text-[10.5px] uppercase tracking-wider ${mine ? 'text-white/50' : 'text-navy/45'}`}>
                  {who(m.author_id)} · {formatDate(m.created_at, true)}
                </div>
                <p className="whitespace-pre-line text-[14.5px] leading-relaxed">{m.body}</p>
              </div>
            </div>
          )
        })}

        {ticket.status !== 'resolved' ? (
          <form action={postTicketMessage.bind(null, params.id, ticket.id)} className="space-y-3 pt-2">
            <textarea name="body" required rows={3} placeholder="Write a reply…" aria-label="Reply" className={inputClass} />
            <SubmitButton pendingText="Sending…">Send reply</SubmitButton>
          </form>
        ) : (
          <p className="text-center text-[13.5px] text-navy/50">This ticket is resolved. Raise a new one from the project page if you need anything else.</p>
        )}
      </div>
    </>
  )
}
