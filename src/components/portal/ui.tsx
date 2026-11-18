import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { InvoiceStatus, ProjectStatus, TicketStatus } from '@/lib/portal/types'

export function PageHeader({
  eyebrow, title, intro, actions,
}: {
  eyebrow?: string
  title: React.ReactNode
  intro?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold-600">
            <span aria-hidden className="flight-marker" /> {eyebrow}
          </div>
        )}
        <h1 className="mt-2 font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-navy md:text-[2.1rem]">{title}</h1>
        {intro && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#48526e]">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </div>
  )
}

export function Card({
  title, action, children, className, padded = true,
}: {
  title?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  padded?: boolean
}) {
  return (
    <section className={cn('min-w-0 rounded-[22px] border border-navy/10 bg-white shadow-soft', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-navy/[0.07] px-5 py-4 sm:px-6">
          {title && <h2 className="font-display text-[16px] font-semibold text-navy">{title}</h2>}
          {action}
        </div>
      )}
      <div className={cn(padded && 'p-5 sm:p-6')}>{children}</div>
    </section>
  )
}

const tones = {
  navy: 'bg-navy/[0.06] text-navy/70',
  blue: 'bg-gold-400/10 text-gold-600',
  green: 'bg-[#28c840]/10 text-[#178a3c]',
  indigo: 'bg-[#2A3F8F]/10 text-[#2A3F8F]',
  red: 'bg-[#e5484d]/10 text-[#c2262b]',
  muted: 'bg-navy/[0.04] text-navy/45',
} as const
export type Tone = keyof typeof tones

export const statusTone: Record<ProjectStatus, Tone> = {
  onboarding: 'indigo',
  in_progress: 'blue',
  in_review: 'blue',
  completed: 'green',
  on_hold: 'muted',
}
export const invoiceTone: Record<InvoiceStatus, Tone> = { draft: 'muted', sent: 'blue', paid: 'green', void: 'red' }
export const ticketTone: Record<TicketStatus, Tone> = { open: 'blue', in_progress: 'indigo', resolved: 'green' }

export function Badge({ tone = 'navy', children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={cn('inline-flex flex-none items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-wider', tones[tone])}>
      {children}
    </span>
  )
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-2 overflow-hidden rounded-full bg-navy/[0.07]', className)}
    >
      <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

export function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border border-navy/10 bg-white p-5 shadow-soft">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#7a86a3]">{label}</div>
      <div className="mt-2 font-display text-[1.6rem] font-semibold leading-none text-navy">{value}</div>
      {hint && <div className="mt-2 text-[12.5px] text-navy/55">{hint}</div>}
    </div>
  )
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl border border-dashed border-navy/15 bg-[#f6f8fc] px-5 py-6 text-center text-[14px] text-navy/55">{children}</p>
}

export function Notice({ tone = 'blue', children }: { tone?: 'blue' | 'green' | 'red'; children: React.ReactNode }) {
  const styles = {
    blue: 'border-gold-400/25 bg-gold-400/[0.06] text-navy/80',
    green: 'border-[#28c840]/30 bg-[#28c840]/[0.07] text-[#14532d]',
    red: 'border-[#e5484d]/30 bg-[#e5484d]/[0.06] text-[#7f1d1d]',
  }
  return <div className={cn('rounded-2xl border px-4 py-3 text-[14px]', styles[tone])}>{children}</div>
}

export const inputClass =
  'w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-[14.5px] text-navy placeholder:text-navy/35 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20'

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-navy/80">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-navy/50">{hint}</span>}
    </label>
  )
}

export function ButtonLink({
  href, children, variant = 'primary', className,
}: {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'ghost'
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5',
        variant === 'primary'
          ? 'bg-gradient-to-b from-[#3b76f0] to-[#1d4ed8] text-white shadow-gold hover:brightness-110'
          : 'border border-navy/15 bg-white text-navy hover:border-navy/30',
        className,
      )}
    >
      {children}
    </Link>
  )
}
