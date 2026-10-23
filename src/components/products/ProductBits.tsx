import { cn } from '@/lib/utils'
import { statusLabel, featureStatusLabel, type ProductStatus, type FeatureStatus } from '@/lib/products'

const statusStyle: Record<ProductStatus, string> = {
  live: 'border-[#28c840]/40 bg-[#28c840]/10 text-[#178a3c]',
  beta: 'border-gold-400/40 bg-gold-400/10 text-gold-600',
  building: 'border-amber-500/40 bg-amber-500/10 text-amber-700',
  concept: 'border-navy/15 bg-navy/[0.04] text-navy/60',
}

export function StatusPill({ status, className }: { status: ProductStatus; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-wider', statusStyle[status], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabel[status]}
    </span>
  )
}

const featureStyle: Record<FeatureStatus, string> = {
  shipped: 'bg-[#28c840]/10 text-[#178a3c]',
  building: 'bg-amber-500/10 text-amber-700',
  planned: 'bg-navy/[0.05] text-navy/50',
}

export function FeatureBadge({ status }: { status: FeatureStatus }) {
  return (
    <span className={cn('flex-none rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide', featureStyle[status])}>
      {featureStatusLabel[status]}
    </span>
  )
}

/** Progress to v1.0 — always shown with its "updated" date so it never reads as stale. */
export function ProgressMeter({ value, updated, className }: { value: number; updated: string; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[12.5px] font-semibold text-navy">Progress to v1.0</span>
        <span className="font-display text-[15px] font-semibold text-navy">{value}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress to version 1.0"
        className="h-2 overflow-hidden rounded-full bg-navy/[0.07]"
      >
        <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300" style={{ width: `${value}%` }} />
      </div>
      <div className="mt-1.5 font-mono text-[10.5px] text-navy/45">Updated {updated}</div>
    </div>
  )
}
