'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Portal light / dark / system theme. The choice is kept per device (localStorage) and applied as
 * <html data-portal-theme="dark">; globals.css swaps the colour tokens inside .portal-theme only.
 */
export type ThemePref = 'light' | 'dark' | 'system'
const KEY = 'es-theme'
const EVENT = 'es-theme-change'
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Runs inline before first paint (no flash of the wrong theme on a full page load). */
export const themeScript = `(function(){try{var p=localStorage.getItem('${KEY}')||'system';var d=p==='dark'||(p==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-portal-theme',d?'dark':'light');}catch(e){}})();`

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

function resolve(pref: ThemePref) {
  return pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
}

function apply(pref: ThemePref) {
  const mode = resolve(pref)
  document.documentElement.setAttribute('data-portal-theme', mode)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'dark' ? '#090e20' : '#001e60')
}

export function setThemePref(pref: ThemePref) {
  try {
    if (pref === 'system') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, pref)
  } catch {}
  apply(pref)
  window.dispatchEvent(new Event(EVENT))
}

function useThemePref() {
  const [pref, setPref] = useState<ThemePref>('system')
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  useEffect(() => {
    const sync = () => {
      const p = readPref()
      setPref(p)
      setMode(resolve(p))
    }
    sync()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    mq.addEventListener('change', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
      mq.removeEventListener('change', sync)
    }
  }, [])
  return { pref, mode }
}

/** Keeps <html> in sync: on mount (client-side navigation into the portal), OS theme changes and other tabs. */
export function ThemeSync() {
  useIsoLayoutEffect(() => {
    const run = () => apply(readPref())
    run()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', run)
    window.addEventListener('storage', run)
    return () => {
      mq.removeEventListener('change', run)
      window.removeEventListener('storage', run)
    }
  }, [])
  return null
}

/** Round header button: flips between light and dark. */
export function ThemeToggle() {
  const { mode } = useThemePref()
  const next = mode === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      onClick={() => setThemePref(next)}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-navy/10 bg-surface text-navy shadow-soft transition-colors hover:border-navy/25"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      {mode === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  )
}

const options: { value: ThemePref; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'Match device', icon: Monitor },
]

/** Three-way picker for Settings and the welcome tour. */
export function ThemePicker() {
  const { pref } = useThemePref()
  return (
    <div role="radiogroup" aria-label="Appearance" className="grid grid-cols-3 gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={pref === o.value}
          onClick={() => setThemePref(o.value)}
          className={cn(
            'flex flex-col items-center gap-2 rounded-2xl border px-3 py-3.5 text-[13px] font-semibold transition-colors',
            pref === o.value ? 'border-gold-400 bg-gold-400/10 text-navy ring-2 ring-gold-400/20' : 'border-navy/12 text-navy/65 hover:border-navy/25',
          )}
        >
          <o.icon className="h-5 w-5" />
          {o.label}
        </button>
      ))}
    </div>
  )
}
