'use client'

import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUp, FileText, Loader2, Paperclip, Trash2, X } from 'lucide-react'
import { browserSupabase, realtimeClient } from '@/lib/portal/browser'
import { attachmentUrl, deleteMessage, markConversationRead, sendMessage } from '@/app/portal/collab'
import { displayName, roleLine } from '@/lib/portal/people'
import { cn } from '@/lib/utils'
import Avatar from './Avatar'
import type { Attachment, Message, Person } from '@/lib/portal/types'

type Pending = Message & { pending?: boolean; failed?: boolean }

function dayLabel(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const yest = new Date(Date.now() - 86_400_000)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yest.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
}
const time = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
const sizeLabel = (n: number) => (n > 1_048_576 ? `${(n / 1_048_576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`)

/** Realtime project chat: optimistic sends, live inserts/edits, typing indicator, files, team signatures. */
export default function ChatThread({
  projectId, viewer, initialMessages, initialPeople,
}: {
  projectId: string
  viewer: Person
  initialMessages: Message[]
  initialPeople: Person[]
}) {
  const [messages, setMessages] = useState<Pending[]>(initialMessages)
  const [people, setPeople] = useState(() => new Map(initialPeople.map((p) => [p.id, p])))
  const [text, setText] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [sending, setSending] = useState(false)
  const [typing, setTyping] = useState<Record<string, number>>({})
  const scroller = useRef<HTMLDivElement>(null)
  const area = useRef<HTMLTextAreaElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const channelRef = useRef<ReturnType<ReturnType<typeof browserSupabase>['channel']> | null>(null)
  const lastTypingSent = useRef(0)

  const scrollDown = (smooth = true) => requestAnimationFrame(() => scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: smooth ? 'smooth' : 'auto' }))
  useEffect(() => {
    scrollDown(false)
  }, [])

  // Realtime: new / edited messages + typing broadcasts
  useEffect(() => {
    let cancelled = false
    let cleanup = () => {}
    realtimeClient().then((sb) => {
      if (cancelled) return
      const channel = sb
      .channel(`chat:${projectId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${projectId}` }, async (payload) => {
        const m = payload.new as Message
        setMessages((list) => (list.some((x) => x.id === m.id) ? list : [...list, m]))
        if (m.author_id && !people.has(m.author_id)) {
          const { data } = await sb.from('profiles').select('id, full_name, email, role, title, signature, avatar_url, company').eq('id', m.author_id).maybeSingle()
          if (data) setPeople((p) => new Map(p).set(data.id, data as Person))
        }
        if (m.author_id !== viewer.id) {
          setTyping((t) => { const n = { ...t }; delete n[m.author_id ?? '']; return n })
          if (document.visibilityState === 'visible') markConversationRead(projectId)
        }
        scrollDown()
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages', filter: `project_id=eq.${projectId}` }, (payload) => {
        const m = payload.new as Message
        setMessages((list) => list.map((x) => (x.id === m.id ? m : x)))
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.id !== viewer.id) setTyping((t) => ({ ...t, [payload.id]: Date.now() }))
      })
      .subscribe()
      channelRef.current = channel
      cleanup = () => {
        sb.removeChannel(channel)
      }
    })
    return () => {
      cancelled = true
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, viewer.id])

  // expire typing indicators
  useEffect(() => {
    const t = setInterval(() => setTyping((cur) => Object.fromEntries(Object.entries(cur).filter(([, at]) => Date.now() - at < 4000))), 1500)
    return () => clearInterval(t)
  }, [])

  function onType(v: string) {
    setText(v)
    const el = area.current
    if (el) { el.style.height = 'auto'; el.style.height = `${Math.min(160, el.scrollHeight)}px` }
    if (Date.now() - lastTypingSent.current > 2000) {
      lastTypingSent.current = Date.now()
      channelRef.current?.send({ type: 'broadcast', event: 'typing', payload: { id: viewer.id } })
    }
  }

  async function uploadAll(list: File[]): Promise<Attachment[]> {
    const sb = browserSupabase()
    const out: Attachment[] = []
    for (const f of list) {
      const safe = f.name.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(-80)
      const path = `${projectId}/chat/${crypto.randomUUID()}-${safe}`
      const { error } = await sb.storage.from('project-files').upload(path, f, { contentType: f.type || undefined })
      if (!error) out.push({ path, name: f.name, size: f.size, type: f.type })
    }
    return out
  }

  async function send() {
    const body = text.trim()
    if ((!body && !files.length) || sending) return
    setSending(true)
    const tempId = `temp-${crypto.randomUUID()}`
    const optimistic: Pending = {
      id: tempId, project_id: projectId, author_id: viewer.id, body,
      attachments: files.map((f) => ({ path: '', name: f.name, size: f.size, type: f.type })),
      reply_to: null, created_at: new Date().toISOString(), edited_at: null, deleted_at: null, pending: true,
    }
    setMessages((l) => [...l, optimistic])
    setText('')
    if (area.current) area.current.style.height = 'auto'
    const toUpload = files
    setFiles([])
    scrollDown()
    try {
      const attachments = toUpload.length ? await uploadAll(toUpload) : []
      const res = await sendMessage(projectId, { body, attachments })
      setMessages((l) => {
        if (!res.ok) return l.map((m) => (m.id === tempId ? { ...m, pending: false, failed: true } : m))
        const withoutTemp = l.filter((m) => m.id !== tempId)
        return withoutTemp.some((m) => m.id === res.message.id) ? withoutTemp : [...withoutTemp, res.message as Message]
      })
    } catch {
      setMessages((l) => l.map((m) => (m.id === tempId ? { ...m, pending: false, failed: true } : m)))
    } finally {
      setSending(false)
      area.current?.focus()
    }
  }

  async function openAttachment(a: Attachment) {
    if (!a.path) return
    const url = await attachmentUrl(a.path)
    if (url) window.open(url, '_blank', 'noopener')
  }

  async function remove(id: string) {
    setMessages((l) => l.map((m) => (m.id === id ? { ...m, body: '', attachments: [], deleted_at: new Date().toISOString() } : m)))
    await deleteMessage(id)
  }

  const typingNames = Object.keys(typing).map((id) => displayName(people.get(id))).filter(Boolean)

  const rendered = useMemo(() => {
    return messages.map((m, i) => {
      const prev = messages[i - 1]
      const newDay = !prev || new Date(prev.created_at).toDateString() !== new Date(m.created_at).toDateString()
      const grouped = !newDay && prev && prev.author_id === m.author_id && new Date(m.created_at).getTime() - new Date(prev.created_at).getTime() < 5 * 60_000
      const next = messages[i + 1]
      const lastInGroup = !next || next.author_id !== m.author_id || new Date(next.created_at).getTime() - new Date(m.created_at).getTime() >= 5 * 60_000 || new Date(next.created_at).toDateString() !== new Date(m.created_at).toDateString()
      return { m, newDay, grouped, lastInGroup }
    })
  }, [messages])

  return (
    <>
      <div ref={scroller} className="flex-1 overflow-y-auto bg-[#f7f9fd] px-3 py-4 sm:px-5">
        {messages.length === 0 && (
          <div className="mx-auto mt-10 max-w-sm text-center">
            <p className="font-display text-[16px] font-semibold text-navy">Start the conversation.</p>
            <p className="mt-1 text-[13.5px] text-navy/50">Everyone on this project will see it and get a notification.</p>
          </div>
        )}
        {rendered.map(({ m, newDay, grouped, lastInGroup }) => {
          const author = m.author_id ? people.get(m.author_id) ?? (m.author_id === viewer.id ? viewer : null) : null
          const mine = m.author_id === viewer.id
          const team = author?.role === 'admin' || author?.role === 'staff'
          return (
            <Fragment key={m.id}>
              {newDay && (
                <div className="my-4 flex items-center gap-3">
                  <span className="h-px flex-1 bg-navy/10" />
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-navy/40">{dayLabel(m.created_at)}</span>
                  <span className="h-px flex-1 bg-navy/10" />
                </div>
              )}
              <div className={cn('group flex gap-2.5', mine ? 'flex-row-reverse' : '', grouped ? 'mt-1' : 'mt-4')}>
                <div className="w-8 flex-none">{!grouped && !mine && <Avatar person={author} size="sm" />}</div>
                <div className={cn('flex min-w-0 max-w-[82%] flex-col sm:max-w-[70%]', mine ? 'items-end' : 'items-start')}>
                  {!grouped && !mine && (
                    <div className="mb-1 flex flex-wrap items-center gap-1.5 px-1">
                      <span className="text-[13px] font-semibold text-navy">{displayName(author)}</span>
                      {team ? (
                        <span className="rounded-full bg-navy px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-white">{author?.title || 'Team'} · Eaglescroft</span>
                      ) : (
                        <span className="text-[11.5px] text-navy/45">{roleLine(author)}</span>
                      )}
                    </div>
                  )}
                  {m.deleted_at ? (
                    <div className="rounded-2xl border border-dashed border-navy/15 px-3.5 py-2 text-[13px] italic text-navy/40">Message deleted</div>
                  ) : (
                    <div className={cn('relative rounded-[18px] px-3.5 py-2.5 text-[14.5px] leading-relaxed shadow-sm',
                      mine ? 'rounded-tr-md bg-navy text-white' : team ? 'rounded-tl-md border border-gold-400/20 bg-white text-navy/90' : 'rounded-tl-md bg-white text-navy/90',
                      m.pending && 'opacity-70', m.failed && 'ring-2 ring-[#e5484d]/50')}>
                      {m.body && <p className="whitespace-pre-wrap break-words">{m.body}</p>}
                      {m.attachments?.length > 0 && (
                        <div className={cn('flex flex-col gap-1.5', m.body && 'mt-2')}>
                          {m.attachments.map((a, i) => (
                            <button key={i} type="button" onClick={() => openAttachment(a)} className={cn('flex items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[12.5px]', mine ? 'bg-white/10 hover:bg-white/15' : 'bg-[#f1f4fa] hover:bg-[#e8edf7]')}>
                              <FileText className="h-4 w-4 flex-none" />
                              <span className="min-w-0 flex-1 truncate font-semibold">{a.name}</span>
                              <span className="flex-none opacity-60">{sizeLabel(a.size)}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {mine && !m.pending && !m.id.startsWith('temp-') && (
                        <button onClick={() => remove(m.id)} className="absolute -left-8 top-1/2 hidden -translate-y-1/2 rounded-full p-1.5 text-navy/30 hover:bg-white hover:text-[#c2262b] group-hover:block" aria-label="Delete message">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                  {lastInGroup && (
                    <div className={cn('mt-1 px-1 text-[11px] text-navy/40', mine && 'text-right')}>
                      {m.failed ? <span className="font-semibold text-[#c2262b]">Not sent. Check your connection</span> : m.pending ? 'Sending…' : `${time(m.created_at)}${m.edited_at ? ' · edited' : ''}`}
                      {team && !mine && !m.deleted_at && (author?.signature || author?.title) && (
                        <div className="mt-0.5 italic text-navy/45">{author?.signature || `${displayName(author)}, ${author?.title}, Eaglescroft`}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Fragment>
          )
        })}
      </div>

      <div className="border-t border-navy/[0.07] bg-white px-3 py-3 sm:px-4" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}>
        <div className="h-4 px-2 text-[11.5px] text-navy/45">{typingNames.length ? `${typingNames.join(', ')} ${typingNames.length > 1 ? 'are' : 'is'} typing…` : ''}</div>
        {files.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {files.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f4fa] py-1 pl-3 pr-1.5 text-[12px] text-navy">
                <FileText className="h-3.5 w-3.5" /> <span className="max-w-[160px] truncate">{f.name}</span>
                <button onClick={() => setFiles((l) => l.filter((_, j) => j !== i))} className="rounded-full p-0.5 hover:bg-navy/10" aria-label="Remove file"><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2 rounded-[22px] border border-navy/12 bg-[#f7f9fd] p-1.5 focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-400/15">
          <input ref={fileInput} type="file" multiple hidden onChange={(e) => { setFiles((l) => [...l, ...Array.from(e.target.files ?? [])].slice(0, 10)); e.target.value = '' }} />
          <button type="button" onClick={() => fileInput.current?.click()} className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-navy/50 hover:bg-white hover:text-navy" aria-label="Attach files">
            <Paperclip className="h-[18px] w-[18px]" />
          </button>
          <textarea
            ref={area}
            value={text}
            onChange={(e) => onType(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send() } }}
            rows={1}
            placeholder="Write a message…"
            aria-label="Message"
            className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2.5 text-[14.5px] text-navy placeholder:text-navy/35 focus:outline-none"
          />
          <button
            type="button"
            onClick={send}
            disabled={sending || (!text.trim() && !files.length)}
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-b from-[#3b76f0] to-[#1d4ed8] text-white shadow-gold transition-opacity disabled:opacity-40"
            aria-label="Send"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>
    </>
  )
}
