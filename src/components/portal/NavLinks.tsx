'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, Receipt, Users, PlusCircle, ArrowLeftRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const icons = { LayoutDashboard, FolderKanban, Receipt, Users, PlusCircle, ArrowLeftRight } satisfies Record<string, LucideIcon>

export type NavItem = { href: string; label: string; icon: keyof typeof icons; exact?: boolean }

export default function NavLinks({ items }: { items: NavItem[] }) {
  const path = usePathname()
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 [scrollbar-width:none] lg:mt-6 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0 [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const Icon = icons[item.icon]
        const active = item.exact ? path === item.href : path === item.href || path.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-none items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[14px] font-medium transition-colors',
              active ? 'bg-white/[0.12] text-white' : 'text-white/60 hover:bg-white/[0.06] hover:text-white',
            )}
          >
            <Icon className={cn('h-[18px] w-[18px]', active ? 'text-gold-300' : '')} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
