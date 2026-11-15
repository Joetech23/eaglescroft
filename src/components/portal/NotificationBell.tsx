'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, CheckCheck, MessagesSquare, ListChecks, CalendarClock, Receipt, Ticket, Sparkles } from 'lucide-react'
import { browserSupabase, realtimeClient } from '@/lib/portal/browser'
import { cn } from '@/lib/utils'
import type { Notification } from '@/lib/portal/types'

const kindIcon: Record<string, typeof Bell> = {
  message: MessagesSquare, task: ListChecks, meeting: CalendarClock, invoice: Receipt, payment: Receipt, ticket: Ticket,
}

function ago(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 60) return 'now'
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  return `${Math.floor(s / 86400)}d`
}

/** Live bell: realtime inserts bump the count and pop a toast; the panel lists the latest 20. */
export default function NotificationBell({ userId, initialUnread }: { userId: string; initialUnread: number }) {
  const router = useRouter()
  const [unread, setUnread] = useState(initialUnread)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notification[] | null>(null)
  const [toast, setToast] = useState<Notification | null>(null)
  const box = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    const { data } = await browserSupabase().from('notifications').select('*').order('created_at', { ascending: false }).limit(20)
    setItems((data ?? []) as Notification[])
  }, [])

  useEffect(() => {
    let cancelled = false
    let cleanup = () => {}
    realtimeClient().then((sb) => {
      if (cancelled) return
      const channel = sb
      .channel(`notifications:${userId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, (payload) => {
        const n = payload.new as Notification
        setUnread((u) => u + 1)
        setItems((list) => (list ? [n, ...list].slice(0, 20) : list))
        setToast(n)
        router.refresh()
      })
      .subscribe()
      cleanup = () => {
        sb.removeChannel(channel)
      }
    })
    return () => {
      cancelled = true
      cleanup()
    }
  }, [userId, router])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  async function toggle() {
    setOpen((o) => !o)
    if (!items) await load()
  }

  async function markAll() {
    await browserSupabase().from('notifications').update({ read_at: new Date().toISOString() }).eq('user_id', userId).is('read_at', null)
    setUnread(0)
    setItems((list) => list?.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })) ?? list)
  }

  async function openItem(n: Notification) {
    if (!n.read_at) {
      await browserSupabase().from('notifications').update({ read_at: new Date().toISOString() }).eq('id', n.id)
      setUnread((u) => Math.max(0, u - 1))
    }
    setOpen(false)
    setToast(null)
    if (n.link) router.push(n.link)
  }

  return (
    <div ref={box} className="relative">
      <button
        onClick={toggle}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-navy/10 bg-white text-navy shadow-soft transition-colors hover:border-navy/25"
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
      >
        <Bell className="h-[19px] w-[19px]" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-white bg-gold-400 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(92vw,380px)] overflow-hidden rounded-[22px] border border-navy/10 bg-white shadow-large">
          <div className="flex items-center justify-between border-b border-navy/[0.07] px-4 py-3">
            <span className="font-display text-[15px] font-semibold text-navy">Notifications</span>
            {unread > 0 && (
              <button onClick={markAll} className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-gold-600 hover:underline">
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {items === null ? (
              <p className="p-6 text-center text-[13px] text-navy/50">Loading…</p>
            ) : items.length === 0 ? (
              <p className="p-6 text-center text-[13px] text-navy/50">You&rsquo;re all caught up.</p>
            ) : (
              items.map((n) => {
                const Icon = kindIcon[n.kind] ?? Sparkles
                return (
                  <button key={n.id} onClick={() => openItem(n)} className={cn('flex w-full gap-3 border-b border-navy/[0.05] px-4 py-3 text-left hover:bg-[#f6f8fc]', !n.read_at && 'bg-gold-400/[0.05]')}>
                    <span className={cn('mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-xl', n.read_at ? 'bg-navy/[0.05] text-navy/50' : 'bg-gold-400 text-white')}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold text-navy">{n.title}</span>
                      {n.body && <span className="line-clamp-2 block text-[12.5px] text-navy/60">{n.body}</span>}
                    </span>
                    <span className="flex-none text-[11px] text-navy/40">{ago(n.created_at)}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}

      {toast && !open && (
        <button
          onClick={() => openItem(toast)}
          className="fixed left-1/2 top-4 z-[60] flex w-[min(92vw,380px)] -translate-x-1/2 items-start gap-3 rounded-[20px] border border-navy/10 bg-white p-3.5 text-left shadow-large lg:left-auto lg:right-6 lg:translate-x-0"
        >
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-gold-400 text-white"><Bell className="h-4 w-4" /></span>
          <span className="min-w-0">
            <span className="block truncate text-[13.5px] font-semibold text-navy">{toast.title}</span>
            {toast.body && <span className="line-clamp-2 block text-[12.5px] text-navy/60">{toast.body}</span>}
          </span>
        </button>
      )}
    </div>
  )
}
