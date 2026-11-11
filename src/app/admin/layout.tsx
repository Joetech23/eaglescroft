import type { Metadata } from 'next'
import Shell from '@/components/portal/Shell'
import PortalSoon from '@/components/portal/PortalSoon'
import type { NavItem } from '@/components/portal/NavLinks'
import { portalConfigured } from '@/lib/portal/supabase'
import { requireAdmin } from '@/lib/portal/session'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s — Admin' },
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const nav: NavItem[] = [
  { href: '/admin', label: 'Overview', icon: 'LayoutDashboard', exact: true },
  { href: '/admin/clients', label: 'Clients', icon: 'Users' },
  { href: '/admin/projects/new', label: 'New project', icon: 'PlusCircle' },
  { href: '/portal', label: 'Client view', icon: 'ArrowLeftRight', exact: true },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!portalConfigured) return <PortalSoon />
  const { profile } = await requireAdmin()
  return (
    <Shell profile={profile} nav={nav} area="Admin">
      {children}
    </Shell>
  )
}
