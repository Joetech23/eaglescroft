import type { Metadata } from 'next'
import { MessagesSquare } from 'lucide-react'
import { getViewer } from '@/lib/portal/session'
import ConversationList, { loadConversations } from '@/components/portal/ConversationList'

export const metadata: Metadata = { title: 'Messages' }

export default async function MessagesPage() {
  const { supabase, user } = await getViewer()
  const rows = await loadConversations(supabase, user.id)
  return (
    <div className="grid gap-5 lg:h-[calc(100dvh-140px)] lg:grid-cols-[340px_1fr]">
      <section className="overflow-hidden rounded-[24px] border border-navy/[0.07] bg-surface shadow-soft lg:overflow-y-auto">
        <div className="border-b border-navy/[0.07] px-5 py-4">
          <h1 className="font-display text-[20px] font-semibold text-navy">Messages</h1>
          <p className="text-[12.5px] text-navy/50">One conversation per project, with everyone on it.</p>
        </div>
        <ConversationList rows={rows} />
      </section>
      <section className="hidden items-center justify-center rounded-[24px] border border-navy/[0.07] bg-surface/60 text-center shadow-soft lg:flex">
        <div>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-white shadow-navy"><MessagesSquare className="h-6 w-6" /></span>
          <p className="mt-4 font-display text-[17px] font-semibold text-navy">Pick a conversation.</p>
          <p className="text-[13.5px] text-navy/50">Messages, files and decisions, all in one thread per project.</p>
        </div>
      </section>
    </div>
  )
}
