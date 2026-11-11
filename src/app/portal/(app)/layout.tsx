import type { Metadata } from 'next'
import Shell from '@/components/portal/Shell'
import PortalSoon from '@/components/portal/PortalSoon'
import type { NavItem } from '@/components/portal/NavLinks'
import { portalConfigured } from '@/lib/portal/supabase'
import { getViewer } from '@/lib/portal/session'

export const metadata: Metadata = {
  title: { default: 'Client portal', template: '%s — Client portal' },
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  if (!portalConfigured) return <PortalSoon />
  const { profile } = await getViewer()

  const nav: NavItem[] = [
    { href: '/portal', label: 'Dashboard', icon: 'LayoutDashboard', exact: true },
    { href: '/portal/billing', label: 'Billing', icon: 'Receipt' },
    ...(profile.role === 'admin' ? [{ href: '/admin', label: 'Admin', icon: 'ArrowLeftRight' } as NavItem] : []),
  ]

  return (
    <Shell profile={profile} nav={nav} area="Client portal">
      {children}
    </Shell>
  )
}
