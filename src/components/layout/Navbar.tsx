'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { siteConfig } from '@/lib/site'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setProgress(max > 0 ? h.scrollTop / max : 0)
      setScrolled((window.scrollY || h.scrollTop) > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      {/* scroll progress */}
      <div className="fixed inset-x-0 top-0 z-[125] h-[3px]">
        <div className="h-full origin-left bg-gradient-to-r from-gold-400 to-gold-600" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* floating capsule header */}
      <header className="fixed inset-x-0 top-4 z-[110] px-4 sm:top-5">
        <nav
          className={cn(
            'mx-auto flex max-w-[1180px] items-center justify-between gap-4 rounded-full border py-2.5 pl-5 pr-2.5 transition-all duration-500',
            scrolled
              ? 'border-navy/10 bg-white/85 shadow-[0_2px_4px_rgba(9,30,66,0.05),0_16px_40px_-12px_rgba(9,30,66,0.18)] backdrop-blur-xl'
              : 'border-white/40 bg-white/60 shadow-[0_10px_30px_-12px_rgba(9,30,66,0.12)] backdrop-blur-lg',
          )}
        >
          {/* logo */}
          <Link href="/" className="flex items-center gap-2.5" aria-label={siteConfig.name}>
            <Image src="/brand/eagle-gold.png" alt="" width={30} height={30} priority className="h-[26px] w-auto object-contain" />
            <span className="font-display text-[19px] font-semibold tracking-tight text-navy">Eaglescroft</span>
          </Link>

          {/* links */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {links.map((l) => {
              const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                      active ? 'text-navy' : 'text-navy/60 hover:text-navy',
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-navy/[0.06]"
                        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 sm:inline-flex"
              style={{ background: 'linear-gradient(180deg,#3b76f0,#1d4ed8)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 4px rgba(37,99,235,0.25), 0 10px 24px -6px rgba(37,99,235,0.5)' }}
            >
              Book a Free Call <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button className="rounded-full p-2 text-navy lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-2 max-w-[1180px] overflow-hidden rounded-3xl border border-navy/10 bg-white/95 shadow-medium backdrop-blur-xl lg:hidden"
            >
              <ul className="flex flex-col gap-1 p-4">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="block rounded-2xl px-4 py-3 text-base font-medium text-navy/80 transition-colors hover:bg-navy/5">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-2">
                  <Link
                    href="/contact"
                    className="flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(180deg,#3b76f0,#1d4ed8)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 10px 24px -6px rgba(37,99,235,0.5)' }}
                  >
                    Book a Free Call <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
