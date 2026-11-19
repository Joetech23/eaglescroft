'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, Bell, CalendarClock, Check, CheckCircle2, Circle, FolderKanban, MessagesSquare, Moon, Smartphone, Sparkles, X,
  type LucideIcon,
} from 'lucide-react'
import { InstallButton, PushToggle } from './Pwa'
import { ThemePicker } from './Theme'
import { cn } from '@/lib/utils'

const TOUR_KEY = 'es-tour-v1'
const CHECKLIST_KEY = 'es-checklist-hidden'
const OPEN_EVENT = 'es-open-tour'

const store = {
  get(k: string) {
    try { return localStorage.getItem(k) } catch { return null }
  },
  set(k: string, v: string) {
    try { localStorage.setItem(k, v) } catch {}
  },
}

export function openTour() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
}

/** Installed on this device? (running as the app, or installed from our prompt) */
function useInstalled() {
  const [installed, setInstalled] = useState(false)
  useEffect(() => {
    const check = () => setInstalled(isStandalone() || store.get('es-installed') === '1')
    check()
    window.addEventListener('appinstalled', check)
    return () => window.removeEventListener('appinstalled', check)
  }, [])
  return installed
}

function usePushOn() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    let alive = true
    const check = () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
      navigator.serviceWorker.ready
        .then((r) => r.pushManager.getSubscription())
        .then((s) => alive && setOn(Boolean(s)))
        .catch(() => {})
    }
    check()
    const t = window.setInterval(check, 4000)
    return () => {
      alive = false
      window.clearInterval(t)
    }
  }, [])
  return on
}

/** Install instructions that work everywhere, plus the one-tap button where the browser offers it. */
function InstallHelp() {
  const installed = useInstalled()
  if (installed)
    return (
      <p className="inline-flex items-center gap-2 rounded-2xl bg-success/10 px-4 py-3 text-[14px] font-semibold text-success">
        <Check className="h-4 w-4" /> Installed on this device
      </p>
    )
  return (
    <div className="space-y-3">
      <InstallButton />
      <ul className="space-y-1.5 text-[13px] leading-relaxed text-navy/65">
        <li><strong className="text-navy">iPhone / iPad:</strong> open this page in Safari, tap Share, then Add to Home Screen.</li>
        <li><strong className="text-navy">Android:</strong> in Chrome, tap the menu (three dots), then Install app.</li>
        <li><strong className="text-navy">Computer:</strong> in Chrome or Edge, click the install icon at the right of the address bar.</li>
      </ul>
    </div>
  )
}

type Step = { icon: LucideIcon; title: string; body: React.ReactNode; extra?: React.ReactNode }

function steps(isTeam: boolean, firstName: string): Step[] {
  const welcome: Step = {
    icon: Sparkles,
    title: isTeam ? `Welcome to the team workspace, ${firstName}.` : `Welcome to your portal, ${firstName}.`,
    body: isTeam
      ? 'This is where Eaglescroft runs every client project: updates, messages, tasks, meetings and billing. Here is a quick look around.'
      : 'Everything about your project with Eaglescroft lives here, updated as we build. Here is a one-minute look around.',
  }
  const install: Step = {
    icon: Smartphone,
    title: 'Install the app',
    body: 'Add the portal to your home screen or desktop for one-tap access. It opens like an app and makes notifications reliable, especially on iPhone.',
    extra: <InstallHelp />,
  }
  const notify: Step = {
    icon: Bell,
    title: 'Turn on notifications',
    body: isTeam
      ? 'Get an instant alert when a client messages you, raises a ticket or books a call, even when the portal is closed.'
      : 'Get an instant alert when we post an update, reply to you, share a file or send an invoice, even when the portal is closed.',
    extra: <PushToggle />,
  }
  const look: Step = {
    icon: Moon,
    title: 'Pick your look',
    body: 'Light, dark, or match your device. You can change this any time from the moon button at the top or in Settings.',
    extra: <ThemePicker />,
  }
  if (isTeam)
    return [
      welcome,
      {
        icon: FolderKanban,
        title: 'Projects and daily updates',
        body: 'Open Projects (in the bottom bar on your phone) to post the day’s update, tick off milestones, answer tickets, upload files and manage invoices. Clients are notified straight away.',
      },
      {
        icon: MessagesSquare,
        title: 'Messages and tasks',
        body: 'Reply to clients in Messages. Your name, title and signature appear under every message, so clients always know who they are talking to. Use Tasks to track what is due.',
      },
      {
        icon: CalendarClock,
        title: 'Set your meeting hours',
        body: 'Clients can only book calls with you inside your availability. Set it once in Settings and existing meetings are blocked out automatically.',
        extra: <Link href="/portal/settings#availability" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-gold-600 hover:underline">Set availability <ArrowRight className="h-4 w-4" /></Link>,
      },
      install,
      notify,
      look,
    ]
  return [
    welcome,
    {
      icon: FolderKanban,
      title: 'Follow your project',
      body: 'See the timeline and progress, read our updates, download files, and raise a ticket or revision request whenever you need a change.',
    },
    {
      icon: MessagesSquare,
      title: 'Messages and meetings',
      body: 'Chat with the team in Messages. You will always see who is replying and their role. Need to talk? Book a call in Meetings at a time that suits you.',
    },
    install,
    notify,
    look,
  ]
}

/** First-run walkthrough. Shows once per device; reopen it any time with openTour(). */
export function WelcomeTour({ isTeam, firstName }: { isTeam: boolean; firstName: string }) {
  const [open, setOpen] = useState(false)
  const [i, setI] = useState(0)
  const list = steps(isTeam, firstName)

  useEffect(() => {
    if (!store.get(TOUR_KEY)) setOpen(true)
    const onOpen = () => {
      setI(0)
      setOpen(true)
    }
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_EVENT, onOpen)
  }, [])

  const close = useCallback(() => {
    store.set(TOUR_KEY, '1')
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') setI((v) => Math.min(v + 1, list.length - 1))
      if (e.key === 'ArrowLeft') setI((v) => Math.max(v - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, list.length])

  if (!open) return null
  const step = list[i]
  const last = i === list.length - 1

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <button className="absolute inset-0 bg-[#000615]/55 backdrop-blur-[3px]" onClick={close} aria-label="Close tour" />
      <div
        className="relative w-full max-w-[480px] rounded-t-[28px] border border-navy/10 bg-surface p-6 shadow-large sm:rounded-[28px] sm:p-7"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
      >
        <button onClick={close} className="absolute right-4 top-4 rounded-full p-1.5 text-navy/45 hover:bg-navy/5 hover:text-navy" aria-label="Skip tour">
          <X className="h-5 w-5" />
        </button>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white shadow-navy">
          <step.icon className="h-5 w-5" />
        </span>
        <div className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-navy/45">Step {i + 1} of {list.length}</div>
        <h2 id="tour-title" className="mt-1.5 pr-6 font-display text-[1.35rem] font-semibold leading-tight text-navy">{step.title}</h2>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-navy/70">{step.body}</p>
        {step.extra && <div className="mt-5">{step.extra}</div>}

        <div className="mt-7 flex items-center justify-between gap-3">
          <div className="flex gap-1.5" aria-hidden>
            {list.map((_, j) => (
              <span key={j} className={cn('h-1.5 rounded-full transition-all', j === i ? 'w-6 bg-gold-400' : 'w-1.5 bg-navy/15')} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {i > 0 && (
              <button onClick={() => setI(i - 1)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy/70 hover:border-navy/30" aria-label="Back">
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => (last ? close() : setI(i + 1))}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#3b76f0] to-[#1d4ed8] px-5 py-2.5 text-sm font-semibold text-white shadow-gold"
            >
              {last ? 'Start using the portal' : i === 0 ? 'Show me around' : 'Next'} {!last && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TakeTourButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openTour} className={cn('inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-gold-600 hover:underline', className)}>
      <Sparkles className="h-4 w-4" /> Take the tour again
    </button>
  )
}

type Item = { key: string; label: string; hint: string; done: boolean; href?: string; onClick?: () => void }

/** "Get set up" card on Home. Disappears when everything is done or when dismissed on this device. */
export function GettingStarted({
  isTeam, hasPhoto, briefHref, availabilitySet, signatureSet,
}: {
  isTeam: boolean
  hasPhoto: boolean
  /** client: link to the first project still waiting for a brief (null when none) */
  briefHref: string | null
  availabilitySet: boolean
  signatureSet: boolean
}) {
  const installed = useInstalled()
  const pushOn = usePushOn()
  const [hidden, setHidden] = useState(true)
  useEffect(() => setHidden(store.get(CHECKLIST_KEY) === '1'), [])

  const items: Item[] = [
    { key: 'install', label: 'Install the app', hint: 'One tap from your home screen', done: installed, onClick: openTour },
    { key: 'push', label: 'Turn on notifications', hint: 'Never miss an update or reply', done: pushOn, href: '/portal/settings' },
    { key: 'photo', label: 'Add your photo', hint: isTeam ? 'Clients see who they are talking to' : 'So the team can put a face to the name', done: hasPhoto, href: '/portal/settings' },
    ...(isTeam
      ? [
          { key: 'signature', label: 'Add your message signature', hint: 'Shown under every message you send', done: signatureSet, href: '/portal/settings' },
          { key: 'availability', label: 'Set your meeting hours', hint: 'So clients can book calls with you', done: availabilitySet, href: '/portal/settings#availability' },
        ]
      : briefHref
        ? [{ key: 'brief', label: 'Complete your project brief', hint: 'Tell us what you need so we can start', done: false, href: briefHref }]
        : []),
  ]
  const doneCount = items.filter((x) => x.done).length
  if (hidden || doneCount === items.length) return null

  return (
    <section className="rounded-[24px] border border-gold-400/25 bg-surface p-5 shadow-soft sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-[18px] font-semibold text-navy">Get set up</h2>
          <p className="mt-0.5 text-[13.5px] text-navy/55">{doneCount} of {items.length} done · takes about two minutes</p>
        </div>
        <button
          onClick={() => {
            store.set(CHECKLIST_KEY, '1')
            setHidden(true)
          }}
          className="rounded-full p-1.5 text-navy/40 hover:bg-navy/5 hover:text-navy"
          aria-label="Hide checklist"
          title="Hide"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-navy/[0.07]">
        <div className="h-full rounded-full bg-gold-400 transition-all" style={{ width: `${(doneCount / items.length) * 100}%` }} />
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((it) => {
          const inner = (
            <>
              {it.done ? <CheckCircle2 className="h-5 w-5 flex-none text-success" /> : <Circle className="h-5 w-5 flex-none text-navy/25" />}
              <span className="min-w-0 flex-1">
                <span className={cn('block text-[14px] font-semibold', it.done ? 'text-navy/45 line-through' : 'text-navy')}>{it.label}</span>
                <span className="block truncate text-[12px] text-navy/50">{it.hint}</span>
              </span>
              {!it.done && <ArrowRight className="h-4 w-4 flex-none text-navy/30" />}
            </>
          )
          const cls = cn('flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-colors', it.done ? 'border-transparent bg-subtle' : 'border-navy/10 hover:border-gold-400/50')
          return (
            <li key={it.key}>
              {it.done || (!it.href && !it.onClick) ? (
                <div className={cls}>{inner}</div>
              ) : it.href ? (
                <Link href={it.href} className={cls}>{inner}</Link>
              ) : (
                <button type="button" onClick={it.onClick} className={cls}>{inner}</button>
              )}
            </li>
          )
        })}
      </ul>
      <TakeTourButton className="mt-4" />
    </section>
  )
}
