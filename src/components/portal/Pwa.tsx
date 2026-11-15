'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, Download, Share } from 'lucide-react'
import { savePushSubscription, removePushSubscription } from '@/app/portal/collab'
import { cn } from '@/lib/utils'

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }
let deferred: InstallEvent | null = null

/** Registers the service worker and captures the browser's install prompt for the Install button. */
export function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {})
    const onPrompt = (e: Event) => {
      e.preventDefault()
      deferred = e as InstallEvent
      window.dispatchEvent(new Event('es-install-ready'))
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])
  return null
}

function useStandalone() {
  const [standalone, setStandalone] = useState(true)
  useEffect(() => {
    setStandalone(window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true)
  }, [])
  return standalone
}

export function InstallButton({ compact }: { compact?: boolean }) {
  const standalone = useStandalone()
  const [ready, setReady] = useState(false)
  const [iosHelp, setIosHelp] = useState(false)
  const [isIos, setIsIos] = useState(false)
  useEffect(() => {
    setReady(Boolean(deferred))
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent))
    const on = () => setReady(true)
    window.addEventListener('es-install-ready', on)
    return () => window.removeEventListener('es-install-ready', on)
  }, [])
  if (standalone || (!ready && !isIos)) return null

  async function install() {
    if (deferred) {
      await deferred.prompt()
      deferred = null
      setReady(false)
    } else setIosHelp((v) => !v)
  }
  return (
    <div className="relative">
      <button
        onClick={install}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-semibold text-gold-600 hover:text-gold-500',
          compact ? 'text-[12.5px]' : 'border border-gold-400/30 bg-gold-400/[0.07] px-4 py-2 text-[13px]',
        )}
      >
        <Download className="h-3.5 w-3.5" /> Install app
      </button>
      {iosHelp && (
        <div className="absolute bottom-full left-0 z-10 mb-2 w-64 rounded-2xl border border-navy/10 bg-white p-3 text-[12.5px] text-navy/70 shadow-large">
          Tap <Share className="inline h-3.5 w-3.5" /> <strong>Share</strong> in Safari, then <strong>Add to Home Screen</strong>. Notifications work once it&rsquo;s installed.
        </div>
      )}
    </div>
  )
}

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(raw, (c) => c.charCodeAt(0))
}

/** Turn device push notifications on/off for this browser or installed app. */
export function PushToggle() {
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const [state, setState] = useState<'unsupported' | 'off' | 'on' | 'blocked' | 'busy'>('busy')

  useEffect(() => {
    if (!key || !('serviceWorker' in navigator) || !('PushManager' in window)) return setState('unsupported')
    if (Notification.permission === 'denied') return setState('blocked')
    navigator.serviceWorker.ready.then((reg) => reg.pushManager.getSubscription()).then((s) => setState(s ? 'on' : 'off'))
  }, [key])

  async function enable() {
    setState('busy')
    try {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') return setState(perm === 'denied' ? 'blocked' : 'off')
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key!) })
      const json = sub.toJSON()
      await savePushSubscription({ endpoint: json.endpoint!, p256dh: json.keys!.p256dh, auth: json.keys!.auth, userAgent: navigator.userAgent })
      setState('on')
    } catch {
      setState('off')
    }
  }
  async function disable() {
    setState('busy')
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (sub) {
      await removePushSubscription(sub.endpoint)
      await sub.unsubscribe()
    }
    setState('off')
  }

  if (state === 'unsupported')
    return <p className="text-[13px] text-navy/55">This browser doesn&rsquo;t support push. On iPhone, install the app to your Home Screen first.</p>
  if (state === 'blocked')
    return <p className="text-[13px] text-navy/55">Notifications are blocked for this site. Allow them in your browser settings, then come back.</p>

  return state === 'on' ? (
    <button onClick={disable} className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-4 py-2.5 text-sm font-semibold text-navy">
      <BellOff className="h-4 w-4" /> Turn off on this device
    </button>
  ) : (
    <button
      onClick={enable}
      disabled={state === 'busy'}
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#3b76f0] to-[#1d4ed8] px-5 py-2.5 text-sm font-semibold text-white shadow-gold disabled:opacity-60"
    >
      <Bell className="h-4 w-4" /> {state === 'busy' ? 'Checking…' : 'Enable notifications on this device'}
    </button>
  )
}
