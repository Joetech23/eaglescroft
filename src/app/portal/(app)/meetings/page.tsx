import type { Metadata } from 'next'
import { CalendarPlus, Video, X } from 'lucide-react'
import { getViewer } from '@/lib/portal/session'
import { displayName, personSelect, roleLine } from '@/lib/portal/people'
import { formatDay, formatTime } from '@/lib/portal/slots'
import { cancelMeeting } from '@/app/portal/collab'
import Avatar from '@/components/portal/Avatar'
import SubmitButton from '@/components/portal/SubmitButton'
import { ButtonLink, Empty, Notice, PageHeader } from '@/components/portal/ui'
import type { Meeting, Person } from '@/lib/portal/types'

export const metadata: Metadata = { title: 'Meetings' }

function googleCalendarUrl(m: Meeting) {
  const fmt = (d: string) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: m.title,
    dates: `${fmt(m.starts_at)}/${fmt(m.ends_at)}`,
    details: `${m.agenda ? `${m.agenda}\n\n` : ''}Join: ${m.meeting_url ?? ''}`,
    location: m.meeting_url ?? '',
  })
  return `https://calendar.google.com/calendar/render?${p}`
}

export default async function MeetingsPage({ searchParams }: { searchParams: { booked?: string; cancelled?: string } }) {
  const { supabase, profile } = await getViewer()
  const { data } = await supabase.from('meetings').select('*').order('starts_at', { ascending: false }).limit(60)
  const meetings = (data ?? []) as Meeting[]
  const ids = Array.from(new Set(meetings.flatMap((m) => [m.host_id, m.client_id]).filter(Boolean))) as string[]
  const { data: ppl } = ids.length ? await supabase.from('profiles').select(personSelect).in('id', ids) : { data: [] }
  const people = new Map(((ppl ?? []) as Person[]).map((p) => [p.id, p]))
  const now = Date.now()
  const upcoming = meetings.filter((m) => m.status === 'scheduled' && new Date(m.ends_at).getTime() >= now).reverse()
  const past = meetings.filter((m) => !upcoming.includes(m)).slice(0, 15)

  const Card = ({ m, live }: { m: Meeting; live?: boolean }) => {
    const other = people.get(m.host_id === profile.id ? m.client_id ?? '' : m.host_id)
    const startsSoon = new Date(m.starts_at).getTime() - now < 15 * 60_000
    return (
      <li className="flex flex-col gap-4 rounded-[22px] border border-navy/[0.07] bg-surface p-4 shadow-soft sm:flex-row sm:items-center sm:p-5">
        <div className="flex h-16 w-16 flex-none flex-col items-center justify-center rounded-2xl bg-navy text-white shadow-navy">
          <span className="text-[10.5px] font-semibold uppercase text-gold-300">{new Date(m.starts_at).toLocaleDateString('en-GB', { month: 'short', timeZone: 'Africa/Lagos' })}</span>
          <span className="font-display text-[22px] font-semibold leading-none">{new Date(m.starts_at).toLocaleDateString('en-GB', { day: 'numeric', timeZone: 'Africa/Lagos' })}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-[16px] font-semibold text-navy">{m.title}</span>
            {m.status === 'cancelled' && <span className="rounded-full bg-[#e5484d]/10 px-2 py-0.5 text-[10.5px] font-semibold text-danger">Cancelled</span>}
          </div>
          <div className="mt-0.5 text-[13px] text-navy/55">{formatDay(m.starts_at)} · {formatTime(m.starts_at)}–{formatTime(m.ends_at)} WAT</div>
          {other && (
            <div className="mt-2 flex items-center gap-2">
              <Avatar person={other} size="xs" />
              <span className="text-[12.5px] text-navy/70">{displayName(other)} · {roleLine(other)}</span>
            </div>
          )}
          {m.agenda && <p className="mt-2 line-clamp-2 text-[13px] text-navy/55">{m.agenda}</p>}
        </div>
        {live && (
          <div className="flex flex-wrap gap-2">
            {m.meeting_url && (
              <a href={m.meeting_url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold ${startsSoon ? 'bg-gradient-to-b from-[#3b76f0] to-[#1d4ed8] text-white shadow-gold' : 'border border-navy/15 text-navy'}`}>
                <Video className="h-4 w-4" /> Join
              </a>
            )}
            <a href={googleCalendarUrl(m)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-navy/15 px-4 py-2.5 text-sm font-semibold text-navy" aria-label="Add to Google Calendar">
              <CalendarPlus className="h-4 w-4" />
            </a>
            <form action={cancelMeeting.bind(null, m.id)}>
              <SubmitButton variant="danger" pendingText="…" className="px-3.5"><X className="h-4 w-4" /></SubmitButton>
            </form>
          </div>
        )}
      </li>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Meetings"
        title="Calls with your team."
        intro="Book a time that suits you. Every meeting gets its own video room. Times shown in Lagos time (WAT)."
        actions={<ButtonLink href="/portal/meetings/book">Book a meeting</ButtonLink>}
      />
      {searchParams.booked && <div className="mb-5"><Notice tone="green">You’re booked. We’ve sent a notification to everyone invited.</Notice></div>}
      {searchParams.cancelled && <div className="mb-5"><Notice tone="blue">Meeting cancelled. Everyone has been notified.</Notice></div>}

      <h2 className="mb-3 font-display text-[17px] font-semibold text-navy">Upcoming</h2>
      {upcoming.length ? <ul className="space-y-3">{upcoming.map((m) => <Card key={m.id} m={m} live />)}</ul> : <Empty>No upcoming meetings.</Empty>}

      {past.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 font-display text-[17px] font-semibold text-navy">Past & cancelled</h2>
          <ul className="space-y-3 opacity-80">{past.map((m) => <Card key={m.id} m={m} />)}</ul>
        </>
      )}
    </>
  )
}
