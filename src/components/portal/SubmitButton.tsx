'use client'

import { useFormStatus } from 'react-dom'
import { cn } from '@/lib/utils'

export default function SubmitButton({
  children, pendingText = 'Saving…', variant = 'primary', className,
}: {
  children: React.ReactNode
  pendingText?: string
  variant?: 'primary' | 'ghost' | 'danger'
  className?: string
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-wait disabled:opacity-60',
        variant === 'primary' && 'bg-gradient-to-b from-[#3b76f0] to-[#1d4ed8] text-white shadow-gold hover:-translate-y-0.5 hover:brightness-110',
        variant === 'ghost' && 'border border-navy/15 bg-surface text-navy hover:border-navy/30',
        variant === 'danger' && 'border border-[#e5484d]/30 bg-surface text-danger hover:bg-[#e5484d]/[0.06]',
        className,
      )}
    >
      {pending ? pendingText : children}
    </button>
  )
}
