import type { Metadata, Viewport } from 'next'
import Shell from '@/components/portal/Shell'
import PortalSoon from '@/components/portal/PortalSoon'
import { portalConfigured } from '@/lib/portal/supabase'
import { requireTeam } from '@/lib/portal/session'
import { buildNav } from '@/lib/portal/nav'

export const metadata: Metadata = {
  title: { default: 'Team', template: '%s | Eaglescroft team' },
  robots: { index: false, follow: false },
  manifest: '/portal.webmanifest',
  appleWebApp: { capable: true, title: 'Eaglescroft', statusBarStyle: 'default' },
  icons: { apple: '/pwa/apple-touch-icon.png' },
}

export const viewport: Viewport = { themeColor: '#001e60', viewportFit: 'cover' }

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!portalConfigured) return <PortalSoon />
  const { supabase, profile, isTeam } = await requireTeam()
  const { links, unreadNotifications } = await buildNav(supabase, profile, isTeam)
  return (
    <Shell profile={profile} links={links} unreadNotifications={unreadNotifications}>
      {children}
    </Shell>
  )
}
