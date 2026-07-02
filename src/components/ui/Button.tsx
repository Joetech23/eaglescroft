'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'gold' | 'ghost' | 'outline'

type Props = {
  href?: string
  children: React.ReactNode
  variant?: Variant
  className?: string
  withArrow?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
}

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 will-change-transform'

const variants: Record<Variant, string> = {
  primary:
    'bg-navy text-white shadow-navy hover:-translate-y-0.5 hover:shadow-large',
  gold:
    'bg-gold-400 text-navy shadow-gold hover:-translate-y-0.5 hover:bg-gold-300 hover:shadow-[0_12px_40px_rgba(37,99,235,0.5)]',
  ghost:
    'text-navy hover:bg-navy/5',
  outline:
    'border border-white/30 text-white backdrop-blur hover:bg-white/10 hover:-translate-y-0.5',
}

export default function Button({
  href, children, variant = 'primary', className, withArrow, onClick, type = 'button',
}: Props) {
  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {withArrow && (
        <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  )
  const classes = cn(base, variants[variant], className)

  if (href) {
    const external = href.startsWith('http')
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {content}
        </a>
      )
    }
    return <Link href={href} className={classes}>{content}</Link>
  }
  return <button type={type} onClick={onClick} className={classes}>{content}</button>
}
