import type { AvailabilityBlock } from './types'

/** Team availability is stored in Lagos wall-clock time (WAT, UTC+1, no DST). */
export const TEAM_TZ = 'Africa/Lagos'
const LAGOS_OFFSET_MIN = 60

export const MEETING_LENGTHS = [15, 30, 45, 60] as const

/** UTC instant for a Lagos date (YYYY-MM-DD) + minutes after Lagos midnight. */
export function lagosToUtc(date: string, minute: number) {
  const d = new Date(`${date}T00:00:00Z`)
  return new Date(d.getTime() + (minute - LAGOS_OFFSET_MIN) * 60_000)
}

export function lagosWeekday(date: string) {
  return new Date(`${date}T12:00:00Z`).getUTCDay()
}

export function lagosToday() {
  return new Date(Date.now() + LAGOS_OFFSET_MIN * 60_000).toISOString().slice(0, 10)
}

/**
 * Free start times for one host on one Lagos date: availability blocks minus busy meetings,
 * stepped every 30 minutes, never in the past (with a 2-hour booking lead).
 */
export function freeSlots({
  date, blocks, busy, minutes,
}: {
  date: string
  blocks: Pick<AvailabilityBlock, 'weekday' | 'start_minute' | 'end_minute'>[]
  busy: { starts_at: string; ends_at: string }[]
  minutes: number
}) {
  const weekday = lagosWeekday(date)
  const earliest = Date.now() + 2 * 60 * 60_000
  const slots: Date[] = []
  for (const b of blocks.filter((x) => x.weekday === weekday)) {
    for (let m = b.start_minute; m + minutes <= b.end_minute; m += 30) {
      const start = lagosToUtc(date, m)
      const end = new Date(start.getTime() + minutes * 60_000)
      if (start.getTime() < earliest) continue
      const clash = busy.some((x) => new Date(x.starts_at) < end && new Date(x.ends_at) > start)
      if (!clash) slots.push(start)
    }
  }
  return slots.sort((a, b) => a.getTime() - b.getTime())
}

export function formatTime(d: Date | string, tz = TEAM_TZ) {
  return new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz })
}

export function formatDay(d: Date | string, tz = TEAM_TZ) {
  return new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: tz })
}

/** Free, no-account video room — every meeting gets its own link. */
export function meetingRoomUrl(id: string) {
  return `https://meet.jit.si/eaglescroft-${id.replace(/-/g, '').slice(0, 16)}`
}

export function minutesToLabel(m: number) {
  const h = Math.floor(m / 60)
  const mm = String(m % 60).padStart(2, '0')
  return `${String(h).padStart(2, '0')}:${mm}`
}

export const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
