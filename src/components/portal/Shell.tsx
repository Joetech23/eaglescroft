import Image from 'next/image'
import Link from 'next/link'
import { DesktopSidebar, MobileTabBar, type AppLink } from './AppNav'
import NotificationBell from './NotificationBell'
import Avatar from './Avatar'
import { PwaRegister } from './Pwa'
import { ThemeSync, ThemeToggle, themeScript } from './Theme'
import { WelcomeTour } from './Onboarding'
import { isTeamRole } from '@/lib/portal/session'
import { displayName, roleLine } from '@/lib/portal/people'
import type { Profile } from '@/lib/portal/types'

/**
 * App chrome shared by clients and the team: floating sidebar on desktop, top bar + bottom tab bar on
 * phones (installable as a PWA), live notification bell everywhere.
 */
export default function Shell({
  profile, links, unreadNotifications, children,
}: {
  profile: Profile
  links: AppLink[]
  unreadNotifications: number
  children: React.ReactNode
}) {
  const name = displayName(profile)
  return (
    <div className="portal-theme relative min-h-[100dvh] bg-canvas text-navy">
      {/* Applies the saved light/dark choice before first paint. */}
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <ThemeSync />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] print:hidden"
        style={{ background: 'var(--portal-glow)', maskImage: 'linear-gradient(180deg,black 55%,transparent)', WebkitMaskImage: 'linear-gradient(180deg,black 55%,transparent)' }}
      />
      <div className="relative mx-auto flex max-w-[1480px] gap-6 lg:p-5">
        <DesktopSidebar links={links} name={name} roleLine={roleLine(profile)} />

        <div className="min-w-0 flex-1">
          <header
            className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-canvas/80 px-4 py-3 backdrop-blur sm:px-6 lg:static lg:bg-transparent lg:px-2 lg:pb-0 lg:pt-1 lg:backdrop-blur-0 print:hidden"
            style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}
          >
            <Link href="/portal" className="flex items-center gap-2 lg:hidden">
              <Image src="/brand/eagle-gold.png" alt="" width={28} height={28} className="h-6 w-auto object-contain" />
              <span className="font-display text-[14px] font-semibold tracking-[0.14em] text-navy">EAGLESCROFT</span>
            </Link>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-2.5">
              <ThemeToggle />
              <NotificationBell userId={profile.id} initialUnread={unreadNotifications} />
              <Link href="/portal/settings" className="flex items-center gap-2.5 rounded-full border border-navy/10 bg-surface py-1 pl-1 pr-1 shadow-soft transition-colors hover:border-navy/25 sm:pr-4">
                <Avatar person={profile} size="sm" />
                <span className="hidden min-w-0 sm:block">
                  <span className="block max-w-[160px] truncate text-[13px] font-semibold leading-tight text-navy">{name}</span>
                  <span className="block max-w-[160px] truncate text-[11px] leading-tight text-navy/50">{roleLine(profile)}</span>
                </span>
              </Link>
            </div>
          </header>
          <main className="px-4 pb-32 pt-4 sm:px-6 lg:px-2 lg:pb-10 lg:pt-6 print:p-0">{children}</main>
        </div>
      </div>
      <MobileTabBar links={links} />
      <PwaRegister />
      <WelcomeTour isTeam={isTeamRole(profile.role)} firstName={name.split(' ')[0]} />
    </div>
  )
}
