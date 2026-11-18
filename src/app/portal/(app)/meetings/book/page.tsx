import type { Metadata } from 'next'
import { getViewer } from '@/lib/portal/session'
import { personSelect } from '@/lib/portal/people'
import BookingWidget from '@/components/portal/BookingWidget'
import { Notice, PageHeader } from '@/components/portal/ui'
import type { Person } from '@/lib/portal/types'

export const metadata: Metadata = { title: 'Book a meeting' }

export default async function BookPage({ searchParams }: { searchParams: { error?: string; host?: string } }) {
  const { supabase, isTeam } = await getViewer()
  const [{ data: team }, { data: avail }, { data: projects }] = await Promise.all([
    supabase.from('profiles').select(personSelect).in('role', ['admin', 'staff']).order('full_name'),
    supabase.from('availability').select('user_id'),
    supabase.from('projects').select('id, title, client_id').order('title'),
  ])
  const bookable = new Set((avail ?? []).map((a) => a.user_id))
  const hosts = ((team ?? []) as Person[]).filter((p) => bookable.has(p.id))
  const clientIds = Array.from(new Set((projects ?? []).map((p) => p.client_id)))
  const { data: clients } = isTeam && clientIds.length ? await supabase.from('profiles').select(personSelect).in('id', clientIds) : { data: [] }

  return (
    <>
      <PageHeader eyebrow="Book a meeting" title="Pick a time that works." intro="Choose who you'd like to speak with, then a day and time. You'll both get a notification and a video link." />
      {searchParams.error === 'taken' && <div className="mb-5"><Notice tone="red">Someone just took that slot. Please pick another time.</Notice></div>}
      {searchParams.error === 'failed' && <div className="mb-5"><Notice tone="red">We couldn’t book that meeting. Please try again.</Notice></div>}
      {hosts.length ? (
        <BookingWidget hosts={hosts} projects={(projects ?? []).map((p) => ({ id: p.id, title: p.title, client_id: p.client_id }))} clients={(clients ?? []) as Person[]} isTeam={isTeam} initialHost={searchParams.host} />
      ) : (
        <Notice tone="blue">Booking opens once our team publishes their availability. In the meantime, send us a message and we’ll arrange a time.</Notice>
      )}
    </>
  )
}
