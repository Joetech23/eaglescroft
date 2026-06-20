'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname()
  const matchActive = () =>
    items.find((i) => i.url !== '/' && pathname.startsWith(i.url))?.name ??
    items.find((i) => i.url === pathname)?.name ??
    items[0].name
  const [activeTab, setActiveTab] = useState(matchActive)

  useEffect(() => {
    setActiveTab(matchActive())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div className={cn('fixed bottom-0 left-1/2 z-50 mb-6 -translate-x-1/2 sm:top-0 sm:mb-0 sm:pt-5', className)}>
      <div className="flex items-center gap-2 rounded-full border border-navy/10 bg-white/75 px-1.5 py-1.5 shadow-[0_8px_30px_rgba(0,30,96,0.12)] backdrop-blur-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name
          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                'relative cursor-pointer rounded-full px-5 py-2 text-sm font-semibold text-navy/70 transition-colors hover:text-navy',
                isActive && 'bg-navy/5 text-navy',
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.4} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 -z-10 w-full rounded-full bg-gold-400/10"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <div className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-gold-400">
                    <div className="absolute -left-2 -top-2 h-6 w-12 rounded-full bg-gold-400/30 blur-md" />
                    <div className="absolute -top-1 h-6 w-8 rounded-full bg-gold-400/30 blur-md" />
                    <div className="absolute left-2 top-0 h-4 w-4 rounded-full bg-gold-400/30 blur-sm" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
