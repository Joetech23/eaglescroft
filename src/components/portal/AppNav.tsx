'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, MessagesSquare, ListChecks, CalendarDays, CalendarClock, Receipt, Settings, LayoutDashboard, Users,
  UserCog, PlusCircle, MoreHorizontal, LogOut, X, type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/app/portal/actions'
import { InstallButton } from './Pwa'

const icons = {
  Home, MessagesSquare, ListChecks, CalendarDays, CalendarClock, Receipt, Settings, LayoutDashboard, Users, UserCog, PlusCircle,
} satisfies Record<string, LucideIcon>

export type AppLink = {
  href: string
  label: string
  icon: keyof typeof icons
  badge?: number
  exact?: boolean
  group: 'main' | 'account' | 'team'
  /** shown in the phone tab bar */
  primary?: boolean
}

function isActive(path: string, l: AppLink) {
  return l.exact ? path === l.href : path === l.href || path.startsWith(`${l.href}/`)
}

function Badge({ n }: { n?: number }) {
  if (!n) return null
  return (
    <span className="ml-auto inline-flex min-w-[20px] items-center justify-center rounded-full bg-gold-400 px-1.5 py-0.5 text-[10.5px] font-bold leading-none text-white">
      {n > 99 ? '99+' : n}
    </span>
  )
}

const groupLabel = { main: 'Workspace', account: 'Account', team: 'Team' }

export function DesktopSidebar({ links, name, roleLine }: { links: AppLink[]; name: string; roleLine: string }) {
  const path = usePathname()
  return (
    <aside className="sticky top-5 hidden h-[calc(100dvh-40px)] w-[256px] flex-none flex-col rounded-[28px] border border-navy/[0.07] bg-white/90 p-4 shadow-soft backdrop-blur lg:flex print:hidden">
      <Link href="/portal" className="flex items-center gap-2.5 px-2 pb-5 pt-2">
        <Image src="/brand/eagle-gold.png" alt="" width={30} height={30} className="h-7 w-auto object-contain" />
        <span className="font-display text-[15px] font-semibold tracking-[0.14em] text-navy">EAGLESCROFT</span>
      </Link>
      <nav className="flex-1 space-y-5 overflow-y-auto">
        {(['main', 'account', 'team'] as const).map((g) => {
          const items = links.filter((l) => l.group === g)
          if (!items.length) return null
          return (
            <div key={g}>
              <div className="px-3 pb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-navy/40">{groupLabel[g]}</div>
              <div className="space-y-0.5">
                {items.map((l) => {
                  const Icon = icons[l.icon]
                  const active = isActive(path, l)
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={cn(
                        'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[14px] font-medium transition-colors',
                        active ? 'bg-navy text-white shadow-navy' : 'text-navy/70 hover:bg-navy/[0.05] hover:text-navy',
                      )}
                    >
                      <Icon className={cn('h-[18px] w-[18px] flex-none', active ? 'text-gold-300' : 'text-navy/50')} />
                      {l.label}
                      <Badge n={l.badge} />
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>
      <div className="mt-4 rounded-2xl bg-[#f4f6fb] p-3">
        <div className="truncate text-[13.5px] font-semibold text-navy">{name}</div>
        <div className="truncate text-[12px] text-navy/50">{roleLine}</div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <InstallButton compact />
          <form action={signOut}>
            <button className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-navy/55 hover:text-navy">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}

/** App-style bottom tab bar for phones (and the installed PWA). */
export function MobileTabBar({ links }: { links: AppLink[] }) {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [path])
  const primary = links.filter((l) => l.primary).slice(0, 4)
  const rest = links.filter((l) => !primary.includes(l))
  const restActive = rest.some((l) => isActive(path, l))
  const restBadge = rest.reduce((s, l) => s + (l.badge ?? 0), 0)

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/[0.08] bg-white/95 backdrop-blur lg:hidden print:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto grid max-w-md grid-cols-5">
          {primary.map((l) => {
            const Icon = icons[l.icon]
            const active = isActive(path, l)
            return (
              <Link key={l.href} href={l.href} className="relative flex flex-col items-center gap-1 py-2.5">
                <span className={cn('relative flex h-8 w-12 items-center justify-center rounded-full transition-colors', active && 'bg-navy')}>
                  <Icon className={cn('h-5 w-5', active ? 'text-white' : 'text-navy/50')} />
                  {l.badge ? <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-gold-400" /> : null}
                </span>
                <span className={cn('text-[10.5px] font-semibold', active ? 'text-navy' : 'text-navy/50')}>{l.label}</span>
              </Link>
            )
          })}
          <button onClick={() => setOpen(true)} className="relative flex flex-col items-center gap-1 py-2.5" aria-label="More">
            <span className={cn('relative flex h-8 w-12 items-center justify-center rounded-full', restActive && 'bg-navy')}>
              <MoreHorizontal className={cn('h-5 w-5', restActive ? 'text-white' : 'text-navy/50')} />
              {restBadge ? <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-gold-400" /> : null}
            </span>
            <span className={cn('text-[10.5px] font-semibold', restActive ? 'text-navy' : 'text-navy/50')}>More</span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="More">
          <button className="absolute inset-0 bg-navy/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} aria-label="Close" />
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white p-5 shadow-large"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)' }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-[16px] font-semibold text-navy">More</span>
              <button onClick={() => setOpen(false)} className="rounded-full p-1.5 text-navy/50 hover:bg-navy/5" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {rest.map((l) => {
                const Icon = icons[l.icon]
                return (
                  <Link key={l.href} href={l.href} className={cn('relative flex flex-col items-center gap-2 rounded-2xl border p-3.5 text-center', isActive(path, l) ? 'border-navy bg-navy text-white' : 'border-navy/10 text-navy')}>
                    <Icon className="h-5 w-5" />
                    <span className="text-[12px] font-semibold leading-tight">{l.label}</span>
                    {l.badge ? <span className="absolute right-2 top-2 rounded-full bg-gold-400 px-1.5 text-[10px] font-bold text-white">{l.badge}</span> : null}
                  </Link>
                )
              })}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-navy/[0.07] pt-4">
              <InstallButton />
              <form action={signOut}>
                <button className="inline-flex items-center gap-2 rounded-full border border-navy/15 px-4 py-2 text-[13px] font-semibold text-navy/70"><LogOut className="h-4 w-4" /> Sign out</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

