'use client'

/* eslint-disable @next/next/no-img-element */
import { motion } from 'framer-motion'
import { ArrowRight, Star, Lock, TrendingUp, Zap } from 'lucide-react'
import Magnetic from '@/components/ui/Magnetic'
import { shot } from '@/lib/projects'

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const avatars = [
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/51.jpg',
  'https://randomuser.me/api/portraits/men/85.jpg',
  'https://randomuser.me/api/portraits/women/32.jpg',
]

function BrowserCard({ url, className, delay = 0 }: { url: string; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-large">
        <div className="flex items-center gap-2.5 border-b border-navy/[0.06] bg-[#f2f4fa] px-3.5 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex flex-1 items-center gap-1.5 overflow-hidden rounded-md bg-white px-2.5 py-1 font-mono text-[10px] text-navy/55">
            <Lock className="h-[9px] w-[9px] flex-none text-[#28c840]" />
            <span className="truncate">{url}</span>
          </div>
        </div>
        <div className="relative aspect-[16/10.5] overflow-hidden bg-navy-50">
          <img src={shot(url)} alt={`Live preview of ${url}`} loading="eager" className="absolute inset-0 h-full w-full object-cover object-top" />
        </div>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      style={{ background: 'radial-gradient(120% 90% at 80% 0%,#ffffff 0%,#eef2fb 42%,#dfe7f7 100%)' }}
    >
      <div className="bg-dots pointer-events-none absolute inset-x-0 top-0 h-[70%]" style={{ maskImage: 'linear-gradient(180deg,black 20%,transparent)', WebkitMaskImage: 'linear-gradient(180deg,black 20%,transparent)' }} />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-[460px] w-[460px] rounded-full" style={{ background: 'radial-gradient(circle,rgba(0,30,96,0.14),transparent 70%)' }} />
      <div className="pointer-events-none absolute -right-24 top-6 h-[420px] w-[420px] rounded-full" style={{ background: 'radial-gradient(circle,rgba(37,99,235,0.22),transparent 70%)' }} />

      <div className="container-x relative z-[3] grid w-full items-center gap-14 py-28 pt-36 lg:grid-cols-[1.02fr_0.98fr] lg:pt-32">
        {/* copy */}
        <div>
          <motion.div custom={0} variants={rise} initial="hidden" animate="show" className="chip bg-white/80 shadow-soft backdrop-blur">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-500" />
            </span>
            Global Digital Agency · 4 Regions
          </motion.div>

          <motion.h1 custom={1} variants={rise} initial="hidden" animate="show"
            className="mt-6 font-display font-semibold text-navy"
            style={{ fontSize: 'clamp(2.5rem,5.6vw,4.5rem)', lineHeight: 1.02, letterSpacing: '-0.03em' }}>
            Digital solutions that{' '}
            <span className="relative inline-block text-transparent" style={{ background: 'linear-gradient(100deg,#1d4ed8,#2563EB 60%,#3b82f6)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
              grow your business
              <svg viewBox="0 0 320 22" preserveAspectRatio="none" className="absolute -bottom-1.5 left-0 h-3.5 w-full overflow-visible">
                <motion.path d="M3 17 C 90 9, 210 4, 317 4" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9, duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
              </svg>
            </span>
            .
          </motion.h1>

          <motion.p custom={2} variants={rise} initial="hidden" animate="show"
            className="mt-7 max-w-[540px] leading-relaxed text-[#48526e]" style={{ fontSize: 'clamp(1rem,1.6vw,1.15rem)' }}>
            From websites and branding to AI chatbots, automations, funnels and CRM systems — one
            senior team partnering with businesses across Nigeria, the UK, USA and Australia.
          </motion.p>

          <motion.div custom={3} variants={rise} initial="hidden" animate="show" className="mt-9 flex flex-wrap gap-3.5">
            <Magnetic>
              <a
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
                style={{ background: 'linear-gradient(180deg,#0a2f86 0%,#001e60 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), 0 2px 4px rgba(0,30,96,0.2), 0 14px 30px -8px rgba(0,30,96,0.5)' }}
              >
                Start a Project <ArrowRight className="h-[18px] w-[18px]" />
              </a>
            </Magnetic>
            <a href="#work" className="inline-flex items-center gap-2.5 rounded-full border border-navy/15 bg-white/80 px-8 py-4 text-[15px] font-semibold text-navy shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/50 hover:shadow-medium">
              View Our Work
            </a>
          </motion.div>

          {/* trust row */}
          <motion.div custom={4} variants={rise} initial="hidden" animate="show"
            className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-navy/10 pt-7">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {avatars.map((a) => (
                  <img key={a} src={a} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-soft" />
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 text-gold-500">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />)}
                </div>
                <div className="mt-0.5 text-[12.5px] font-medium text-navy/60">Trusted by clients in 6+ countries</div>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold text-navy">99%</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-navy/45">satisfaction</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold text-navy">12+</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-navy/45">projects delivered</span>
            </div>
          </motion.div>
        </div>

        {/* live-site card stack */}
        <div className="relative hidden min-h-[520px] lg:block">
          <BrowserCard url="enyobuilt.com.ng" delay={0.35} className="absolute left-0 top-4 w-[78%] rotate-[-3deg]" />
          <BrowserCard url="starhomes.com.ng" delay={0.55} className="absolute bottom-2 right-0 w-[78%] rotate-[2.5deg]" />

          {/* floating chips */}
          <motion.div
            animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-4 bottom-16 z-10 flex items-center gap-2.5 rounded-2xl border border-navy/10 bg-white/95 px-4 py-3 shadow-medium backdrop-blur"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-500"><TrendingUp className="h-[18px] w-[18px]" /></span>
            <div>
              <div className="font-display text-sm font-semibold text-navy">Built to convert</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-navy/45">SEO + speed first</div>
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-2 top-0 z-10 flex items-center gap-2 rounded-full px-4 py-2.5 text-white shadow-gold"
            style={{ background: 'linear-gradient(180deg,#3b76f0,#1d4ed8)' }}
          >
            <Zap className="h-4 w-4" />
            <span className="font-display text-[13px] font-semibold">Live in weeks, not months</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
