'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Magnetic from '@/components/ui/Magnetic'

const heroStats = [
  { k: 'ALT', v: '12+', l: 'Sites shipped' },
  { k: 'LAT', v: '4', l: 'Continents' },
  { k: 'SAT', v: '99%', l: 'Satisfaction' },
]

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      style={{ background: 'radial-gradient(120% 90% at 80% 0%,#ffffff 0%,#f3f5fb 45%,#eaeef8 100%)' }}
    >
      {/* soft brand glows */}
      <div className="pointer-events-none absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full" style={{ background: 'radial-gradient(circle,rgba(42,63,143,0.12),transparent 70%)' }} />
      <div className="pointer-events-none absolute -right-20 top-10 h-[360px] w-[360px] rounded-full" style={{ background: 'radial-gradient(circle,rgba(255,201,64,0.18),transparent 70%)' }} />
      {/* faint eagle watermark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/eagle-gold.png" alt="" aria-hidden className="pointer-events-none absolute right-[-40px] top-1/2 hidden h-[460px] -translate-y-1/2 opacity-[0.07] lg:block" />

      <div className="container-x relative z-[3] grid w-full items-center gap-12 py-28 pt-40 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div custom={0} variants={rise} initial="hidden" animate="show"
            className="inline-flex items-center gap-3 rounded-full border border-navy/10 bg-white/70 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-navy/70 backdrop-blur">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-500" />
            </span>
            Global Digital Agency · 4 Regions
          </motion.div>

          <motion.h1 custom={1} variants={rise} initial="hidden" animate="show"
            className="mt-6 font-display font-semibold text-navy"
            style={{ fontSize: 'clamp(2.6rem,6vw,4.8rem)', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
            Helping ambitious businesses{' '}
            <span className="relative inline-block text-transparent" style={{ background: 'linear-gradient(100deg,#f5b800,#FFC940)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
              take flight
              <svg viewBox="0 0 320 22" preserveAspectRatio="none" className="absolute -bottom-1.5 left-0 h-3.5 w-full overflow-visible">
                <motion.path d="M3 17 C 90 9, 210 4, 317 4" fill="none" stroke="#FFC940" strokeWidth="3" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9, duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
              </svg>
            </span>{' '}
            online.
          </motion.h1>

          <motion.p custom={2} variants={rise} initial="hidden" animate="show"
            className="mt-7 max-w-[520px] leading-relaxed text-[#48526e]" style={{ fontSize: 'clamp(1rem,1.6vw,1.15rem)' }}>
            We engineer high-performance websites, magnetic brands, and AI-powered systems —
            the lift your business needs to climb above the competition.
          </motion.p>

          <motion.div custom={3} variants={rise} initial="hidden" animate="show" className="mt-9 flex flex-wrap gap-3.5">
            <Magnetic>
              <a href="/contact" className="inline-flex items-center gap-2.5 rounded-2xl bg-navy px-7 py-4 text-[15px] font-semibold text-white shadow-navy transition-all duration-300 hover:-translate-y-0.5 hover:shadow-large">
                Start a Project <ArrowRight className="h-[18px] w-[18px]" />
              </a>
            </Magnetic>
            <a href="#work" className="inline-flex items-center gap-2.5 rounded-2xl border border-navy/15 bg-white px-7 py-4 text-[15px] font-semibold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-soft">
              View Our Work
            </a>
          </motion.div>

          <motion.dl custom={4} variants={rise} initial="hidden" animate="show"
            className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-navy/10 pt-7">
            {heroStats.map((s) => (
              <div key={s.k} className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] tracking-[0.15em] text-gold-500">{s.k}</span>
                <dd className="font-display text-[26px] font-semibold text-navy">{s.v}</dd>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-navy/45">{s.l}</dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* visual: floating brand card stack */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:block"
        >
          <div className="relative aspect-[4/3.4] overflow-hidden rounded-[28px] border border-navy/10 shadow-[0_40px_90px_rgba(0,30,96,0.22)]">
            <Image
              src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80"
              alt="Eaglescroft digital work"
              fill unoptimized sizes="40vw" className="object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,rgba(0,30,96,0.15),rgba(0,30,96,0) 45%)' }} />
          </div>
          <motion.div
            animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-6 bottom-8 flex items-center gap-3 rounded-2xl border border-navy/10 bg-white/90 px-5 py-4 shadow-[0_18px_44px_rgba(0,30,96,0.16)] backdrop-blur"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400 font-display text-lg font-bold text-navy">★</span>
            <div>
              <div className="font-display text-base font-semibold text-navy">99% satisfaction</div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-navy/45">across 9+ industries</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
