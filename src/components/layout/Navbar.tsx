'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Layers, Briefcase, Users, Mail } from 'lucide-react'
import { NavBar } from '@/components/ui/tubelight-navbar'
import { cn } from '@/lib/utils'

const items = [
  { name: 'Home', url: '/', icon: Home },
  { name: 'Services', url: '/services', icon: Layers },
  { name: 'Work', url: '/portfolio', icon: Briefcase },
  { name: 'About', url: '/about', icon: Users },
  { name: 'Contact', url: '/contact', icon: Mail },
]

export default function Navbar() {
  const [progress, setProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  // Inner pages open on a dark PageHeader; the home hero is light.
  const darkTop = pathname !== '/'

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setProgress(max > 0 ? h.scrollTop / max : 0)
      setScrolled((window.scrollY || h.scrollTop) > 40)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onDark = darkTop && !scrolled
  const mark = onDark ? '/brand/eagle-white.png' : '/brand/eagle-gold.png'

  return (
    <>
      {/* scroll progress */}
      <div className="fixed inset-x-0 top-0 z-[120] h-[3px] bg-transparent">
        <div className="h-full origin-left bg-gradient-to-r from-gold-400 to-gold-500" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* logo */}
      <Link
        href="/"
        aria-label="Eaglescroft"
        className={cn(
          'fixed left-6 top-5 z-[110] flex items-center gap-2.5 transition-all duration-300',
          scrolled && 'rounded-full border border-navy/10 bg-white/75 px-3 py-1.5 shadow-soft backdrop-blur-lg',
        )}
      >
        <Image src={mark} alt="" width={30} height={30} priority className="h-7 w-auto object-contain" />
        <span className={cn('font-display text-xl tracking-tight transition-colors', onDark ? 'text-white' : 'text-navy')}>
          Eaglescroft
        </span>
      </Link>

      <NavBar items={items} />
    </>
  )
}
