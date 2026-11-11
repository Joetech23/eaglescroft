import Image from 'next/image'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import NavLinks, { type NavItem } from './NavLinks'
import { signOut } from '@/app/portal/actions'
import type { Profile } from '@/lib/portal/types'

/** App chrome for the client portal and admin: navy sidebar on desktop, compact top bar on mobile. */
export default function Shell({
  profile, nav, area, children,
}: {
  profile: Profile
  nav: NavItem[]
  area: 'Client portal' | 'Admin'
  children: React.ReactNode
}) {
  const name = profile.full_name || profile.email
  return (
    <div className="min-h-screen bg-[#f4f6fb] lg:flex">
      <aside className="section-dark relative flex flex-col print:hidden text-white lg:sticky lg:top-0 lg:h-screen lg:w-[260px] lg:flex-none">
        <div className="flex items-center justify-between gap-3 px-5 py-4 lg:block lg:px-6 lg:pt-7">
          <Link href={profile.role === 'admin' && area === 'Admin' ? '/admin' : '/portal'} className="flex items-center gap-2.5">
            <Image src="/brand/eagle-white.png" alt="" width={30} height={30} className="h-7 w-auto object-contain" />
            <span className="font-display text-[16px] font-semibold tracking-[0.14em]">EAGLESCROFT</span>
          </Link>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-300 lg:mt-3">{area}</div>
        </div>

        <NavLinks items={nav} />

        <div className="mt-auto hidden border-t border-white/10 px-6 py-5 lg:block">
          <div className="truncate text-[14px] font-semibold">{name}</div>
          <div className="truncate text-[12px] text-white/50">{profile.company || profile.email}</div>
          <form action={signOut} className="mt-3">
            <button className="inline-flex items-center gap-2 text-[13px] text-white/60 transition-colors hover:text-white">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3 border-b border-navy/[0.07] bg-white px-5 py-3 lg:hidden print:hidden">
          <span className="truncate text-[13px] font-semibold text-navy">{name}</span>
          <form action={signOut}>
            <button className="inline-flex items-center gap-1.5 text-[13px] text-navy/60"><LogOut className="h-4 w-4" /> Sign out</button>
          </form>
        </div>
        <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8 lg:py-10 print:p-0">{children}</main>
      </div>
    </div>
  )
}
