'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Link2, CheckCheck, Sparkles } from 'lucide-react'
import { pricingCategories, type PricingTier } from '@/lib/pricing'
import { whatsappLink } from '@/lib/site'
import { cn } from '@/lib/utils'

const ease = [0.22, 1, 0.36, 1] as const

function TierCard({ tier, index }: { tier: PricingTier; index: number }) {
  const isPremium = tier.level === 'premium'
  const isPopular = !!tier.popular

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.09, ease }}
      className={cn(
        'relative flex flex-col rounded-[26px] border p-7 transition-all duration-300',
        isPopular && 'border-gold-400/50 bg-white shadow-large lg:-translate-y-3 lg:scale-[1.02]',
        isPremium && 'section-dark border-white/10 text-white shadow-dark-card',
        !isPopular && !isPremium && 'border-navy/10 bg-white shadow-soft hover:-translate-y-1 hover:shadow-medium',
      )}
    >
      {isPremium && <div className="bg-dots-dark pointer-events-none absolute inset-0 rounded-[26px] opacity-40" />}

      {isPopular && (
        <span
          className="absolute -top-3.5 left-7 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white"
          style={{ background: 'linear-gradient(180deg,#3b76f0,#1d4ed8)', boxShadow: '0 8px 20px -6px rgba(37,99,235,0.6)' }}
        >
          <Sparkles className="h-3 w-3" /> Most popular
        </span>
      )}

      <div className="relative">
        <h3 className={cn('font-display text-[19px] font-semibold', isPremium ? 'text-white' : 'text-navy')}>
          {tier.name}
        </h3>
        <p className={cn('mt-1 text-[13.5px]', isPremium ? 'text-white/55' : 'text-navy/50')}>{tier.tagline}</p>

        <div className="mt-6">
          <div
            className={cn('font-display font-semibold leading-none', isPremium ? 'text-transparent' : 'text-navy')}
            style={{
              fontSize: 'clamp(1.5rem,2.4vw,1.85rem)',
              ...(isPremium
                ? { background: 'linear-gradient(180deg,#ffffff 30%,#93c5fd)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }
                : {}),
            }}
          >
            {tier.price}
          </div>
          <div className={cn('mt-2 font-mono text-[11px] uppercase tracking-wider', isPremium ? 'text-white/45' : 'text-navy/45')}>
            {tier.billing}
          </div>
        </div>

        <div className={cn('my-6 h-px w-full', isPremium ? 'bg-white/10' : 'bg-navy/[0.08]')} />

        <ul className="flex flex-col gap-3">
          {tier.features.map((f) => (
            <li key={f} className={cn('flex items-start gap-2.5 text-[13.5px] leading-relaxed', isPremium ? 'text-white/75' : 'text-navy/70')}>
              <Check className={cn('mt-0.5 h-4 w-4 flex-none', isPremium ? 'text-gold-300' : 'text-gold-500')} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <a
        href="/contact"
        className={cn(
          'relative mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5',
          isPremium && 'bg-white text-navy shadow-[0_10px_28px_-8px_rgba(0,0,0,0.6)]',
          isPopular && 'text-white hover:brightness-110',
          !isPopular && !isPremium && 'border border-navy/15 bg-white text-navy hover:border-gold-400/60 hover:shadow-soft',
        )}
        style={
          isPopular
            ? {
                background: 'linear-gradient(180deg,#3b76f0,#1d4ed8)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 10px 24px -6px rgba(37,99,235,0.5)',
              }
            : undefined
        }
      >
        Get started <ArrowRight className="h-4 w-4" />
      </a>
    </motion.div>
  )
}

export default function PricingTabs({ initial = 'websites' }: { initial?: string }) {
  const startIdx = Math.max(0, pricingCategories.findIndex((c) => c.slug === initial))
  const [active, setActive] = useState(startIdx)
  const [copied, setCopied] = useState(false)

  const current = pricingCategories[active]

  // Keep the address bar in sync so any tab can be copied & shared directly.
  useEffect(() => {
    const path = `/pricing/${current.slug}`
    if (window.location.pathname !== path) {
      window.history.replaceState(null, '', path)
    }
  }, [current.slug])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/pricing/${current.slug}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked — the address bar already holds the shareable URL */
    }
  }

  return (
    <div className="container-x">
      {/* tabs */}
      <div className="mx-auto flex w-fit max-w-full flex-wrap justify-center gap-1.5 rounded-full border border-navy/10 bg-white p-1.5 shadow-soft">
        {pricingCategories.map((c, i) => {
          const Icon = c.icon
          const isActive = i === active
          return (
            <button
              key={c.slug}
              onClick={() => setActive(i)}
              aria-pressed={isActive}
              className={cn(
                'relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'text-white' : 'text-navy/60 hover:text-navy',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="pricing-tab-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'linear-gradient(180deg,#0a2f86,#001e60)' }}
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{c.label}</span>
            </button>
          )
        })}
      </div>

      {/* headline + share — keyed so it remounts and replays on tab change */}
      <div className="mx-auto mt-12 max-w-3xl text-center">
        <motion.div
          key={`head-${current.slug}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
        >
          <h2 className="font-display font-semibold leading-[1.08] tracking-tight text-navy" style={{ fontSize: 'clamp(1.7rem,3.4vw,2.5rem)' }}>
            {current.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15.5px] leading-relaxed text-[#5a6685]">{current.description}</p>

          <button
            onClick={copyLink}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-navy/60 transition-all hover:-translate-y-0.5 hover:border-gold-400/60 hover:text-navy"
          >
            {copied ? <CheckCheck className="h-3.5 w-3.5 text-gold-500" /> : <Link2 className="h-3.5 w-3.5" />}
            {copied ? 'Link copied' : `Share ${current.label.toLowerCase()} pricing`}
          </button>
        </motion.div>
      </div>

      {/* cards — keyed grid remounts so each tier animates in on swap */}
      <div key={current.slug} className="mt-12 grid items-start gap-6 lg:grid-cols-3">
        {current.tiers.map((t, i) => (
          <TierCard key={`${current.slug}-${t.name}`} tier={t} index={i} />
        ))}
      </div>

      {/* retainer + note */}
      {current.retainer && (
        <motion.div
          key={`ret-${current.slug}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25, ease }}
          className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-[22px] border border-navy/10 bg-[#f4f6fb] p-6 sm:p-7"
        >
            <div>
              <div className="font-display text-[17px] font-semibold text-navy">{current.retainer.label}</div>
              <div className="mt-1 text-[13.5px] text-navy/55">{current.retainer.note}</div>
            </div>
            <div className="flex items-center gap-5">
              <div className="font-display text-xl font-semibold text-navy">{current.retainer.price}</div>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
                style={{ background: 'linear-gradient(180deg,#3b76f0,#1d4ed8)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 10px 24px -6px rgba(37,99,235,0.5)' }}
              >
                Ask about it
              </a>
            </div>
        </motion.div>
      )}

      <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-navy/40">
        All prices in Naira · Final quote confirmed after a free consultation · International clients billed in USD/GBP equivalent
      </p>
    </div>
  )
}
