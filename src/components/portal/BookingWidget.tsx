'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { Clock, Loader2 } from 'lucide-react'
import { bookMeeting, getSlots } from '@/app/portal/collab'
import { displayName, roleLine } from '@/lib/portal/people'
import { cn } from '@/lib/utils'
import Avatar from './Avatar'
import SubmitButton from './SubmitButton'
import { Field, inputClass } from './ui'
import type { Person } from '@/lib/portal/types'

const LAGOS = 'Africa/Lagos'

function nextDays(n: number) {
  const out: string[] = []
  const base = new Date(Date.now() + 60 * 60_000) // Lagos "today"
  for (let i = 0; i < n; i++) out.push(new Date(base.getTime() + i * 86_400_000).toISOString().slice(0, 10))
  return out
}

export default function BookingWidget({
  hosts, projects, clients, isTeam, initialHost,
}: {
  hosts: Person[]
  projects: { id: string; title: string; client_id: string }[]
  clients: Person[]
  isTeam: boolean
  initialHost?: string
}) {
  const days = useMemo(() => nextDays(14), [])
  const [host, setHost] = useState(hosts.find((h) => h.id === initialHost)?.id ?? hosts[0]?.id)
  const [minutes, setMinutes] = useState(30)
  const [date, setDate] = useState(days[0])
  const [slots, setSlots] = useState<string[] | null>(null)
  const [slot, setSlot] = useState<string | null>(null)
  const [pending, start] = useTransition()

  useEffect(() => {
    if (!host) return
    setSlot(null)
    start(async () => setSlots(await getSlots(host, date, minutes)))
  }, [host, date, minutes])

  const localTz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : LAGOS
  const t = (iso: string, tz: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz })

  return (
    <form action={bookMeeting} className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
      <input type="hidden" name="host_id" value={host ?? ''} />
      <input type="hidden" name="minutes" value={minutes} />
      <input type="hidden" name="starts_at" value={slot ?? ''} />

      <div className="space-y-6">
        <section className="rounded-[24px] border border-navy/[0.07] bg-white p-5 shadow-soft">
          <h2 className="mb-3 font-display text-[16px] font-semibold text-navy">Who would you like to meet?</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {hosts.map((h) => (
              <button type="button" key={h.id} onClick={() => setHost(h.id)} className={cn('flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors', host === h.id ? 'border-gold-400 bg-gold-400/[0.06] ring-2 ring-gold-400/20' : 'border-navy/10 hover:border-navy/25')}>
                <Avatar person={h} size="md" />
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-semibold text-navy">{displayName(h)}</span>
                  <span className="block truncate text-[12px] text-navy/50">{roleLine(h)}</span>
                </span>
              </button>
            ))}
          </div>
          <h2 className="mb-2 mt-5 font-display text-[16px] font-semibold text-navy">How long?</h2>
          <div className="flex flex-wrap gap-2">
            {[15, 30, 45, 60].map((m) => (
              <button type="button" key={m} onClick={() => setMinutes(m)} className={cn('inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold', minutes === m ? 'border-navy bg-navy text-white' : 'border-navy/12 text-navy/70')}>
                <Clock className="h-3.5 w-3.5" /> {m} min
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-[24px] border border-navy/[0.07] bg-white p-5 shadow-soft">
          <Field label="Meeting title"><input name="title" required maxLength={140} defaultValue="Project check-in" className={inputClass} /></Field>
          <Field label="Project (optional)">
            <select name="project_id" className={inputClass}>
              <option value="">General</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </Field>
          {isTeam && (
            <Field label="Invite client">
              <select name="client_id" className={inputClass}>
                <option value="">Internal (no client)</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{displayName(c)}{c.company ? ` · ${c.company}` : ''}</option>)}
              </select>
            </Field>
          )}
          <Field label="What would you like to cover?"><textarea name="agenda" rows={3} className={inputClass} /></Field>
        </section>
      </div>

      <section className="rounded-[24px] border border-navy/[0.07] bg-white p-5 shadow-soft">
        <h2 className="mb-3 font-display text-[16px] font-semibold text-navy">Choose a day</h2>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
          {days.map((d) => {
            const dt = new Date(`${d}T12:00:00Z`)
            return (
              <button type="button" key={d} onClick={() => setDate(d)} className={cn('flex w-[62px] flex-none flex-col items-center rounded-2xl border py-2.5', date === d ? 'border-navy bg-navy text-white shadow-navy' : 'border-navy/10 text-navy hover:border-navy/25')}>
                <span className={cn('text-[11px] font-semibold uppercase', date === d ? 'text-gold-300' : 'text-navy/45')}>{dt.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' })}</span>
                <span className="font-display text-[19px] font-semibold">{dt.getUTCDate()}</span>
                <span className={cn('text-[10.5px]', date === d ? 'text-white/60' : 'text-navy/40')}>{dt.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' })}</span>
              </button>
            )
          })}
        </div>

        <h2 className="mb-3 mt-4 font-display text-[16px] font-semibold text-navy">Available times <span className="text-[12px] font-normal text-navy/45">(Lagos time{localTz !== LAGOS ? ` · your time in brackets` : ''})</span></h2>
        {pending || slots === null ? (
          <div className="flex items-center gap-2 py-8 text-[13.5px] text-navy/50"><Loader2 className="h-4 w-4 animate-spin" /> Checking availability…</div>
        ) : slots.length ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((s) => (
              <button type="button" key={s} onClick={() => setSlot(s)} className={cn('rounded-2xl border px-2 py-2.5 text-center text-[13.5px] font-semibold', slot === s ? 'border-gold-500 bg-gold-400 text-white shadow-gold' : 'border-navy/12 text-navy hover:border-gold-400/50')}>
                {t(s, LAGOS)}
                {localTz !== LAGOS && <span className={cn('block text-[10.5px] font-normal', slot === s ? 'text-white/80' : 'text-navy/40')}>({t(s, localTz)})</span>}
              </button>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-[#f6f8fc] px-4 py-6 text-center text-[13.5px] text-navy/55">No free times that day — try another day.</p>
        )}

        <div className="mt-6 border-t border-navy/[0.07] pt-5">
          <SubmitButton pendingText="Booking…" className={cn('w-full py-3', !slot && 'pointer-events-none opacity-40')}>
            {slot ? `Book ${new Date(slot).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: LAGOS })} at ${t(slot, LAGOS)}` : 'Pick a time'}
          </SubmitButton>
        </div>
      </section>
    </form>
  )
}
