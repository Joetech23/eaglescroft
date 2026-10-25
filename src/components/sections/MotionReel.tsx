'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import Link from 'next/link'
import { motion, MotionConfig, useReducedMotion } from 'framer-motion'
import { Clapperboard, Search, Megaphone, Users, Bot, ArrowRight, Play, type LucideIcon } from 'lucide-react'
import { MotionMock, SeoMock, SmmMock, CrmMock, ChatbotMock } from '@/components/reel/mocks'

/* ---------------------------------- data --------------------------------- */

type Slide = {
  key: string
  icon: LucideIcon
  tab: string
  title: string
  desc: string
  tags: string[]
  window: string
  href: string
  cta: string
  panel: () => JSX.Element
  /** Real footage beats a mock for motion work — when set, it replaces `panel`. */
  video?: { src: string; poster: string; length: string }
  /** how long the slide stays up (defaults to ROTATE_MS) */
  ms?: number
}

const slides: Slide[] = [
  {
    key: 'motion',
    icon: Clapperboard,
    tab: 'Motion graphics',
    title: 'Motion graphics for SaaS',
    desc: 'Launch films, feature explainers and product demos — we animate your UI into stories that make people sign up. This is our own brand film.',
    tags: ['Launch films', 'Product demos', 'UI animation'],
    window: 'Eaglescroft · “Take Flight” brand film',
    href: '/portfolio/eaglescroft-take-flight',
    cta: 'Watch the full film',
    panel: MotionMock,
    video: { src: '/reel/eaglescroft-advert.mp4', poster: '/reel/eaglescroft-advert-poster.jpg', length: '0:47' },
    ms: 12000,
  },
  {
    key: 'seo',
    icon: Search,
    tab: 'Visibility (SEO)',
    title: 'Visibility that compounds',
    desc: 'Technical SEO, content and local search that put you on page one — exactly where your buyers are already looking.',
    tags: ['Technical SEO', 'Local search', 'Core Web Vitals'],
    window: 'Search Console · organic growth',
    href: '/services#digital-marketing-seo',
    cta: 'See SEO & marketing',
    panel: SeoMock,
  },
  {
    key: 'smm',
    icon: Megaphone,
    tab: 'Social media',
    title: 'Social media that sells',
    desc: 'Content systems, reels and paid boosts that grow reach — and route every interested DM straight into your pipeline.',
    tags: ['Content calendar', 'Reels', 'Paid social'],
    window: 'Social dashboard · last 30 days',
    href: '/services#social-media',
    cta: 'See social media',
    panel: SmmMock,
  },
  {
    key: 'crm',
    icon: Users,
    tab: 'CRM & GoHighLevel',
    title: 'CRM, funnels & GoHighLevel',
    desc: 'Pipelines, funnels and full GoHighLevel setups — every lead captured, tracked, nurtured and closed in one view.',
    tags: ['Pipelines', 'Funnels', 'GoHighLevel'],
    window: 'CRM · sales pipeline',
    href: '/pricing/crm',
    cta: 'See CRM pricing',
    panel: CrmMock,
  },
  {
    key: 'ai',
    icon: Bot,
    tab: 'AI automation',
    title: 'AI automation, around the clock',
    desc: 'AI chatbots and workflows that reply, qualify and book on your site, WhatsApp and socials — 24/7, no task falls through.',
    tags: ['AI chatbots', 'WhatsApp', 'Workflows'],
    window: 'AI assistant · live conversation',
    href: '/pricing/automation',
    cta: 'See automation pricing',
    panel: ChatbotMock,
  },
]

/** Time each slide stays up. The tab's progress bar *is* the timer. */
const ROTATE_MS = 7000

/* -------------------------------- section -------------------------------- */

export default function MotionReel() {
  const [active, setActive] = useState(0)
  const [held, setHeld] = useState(false) // hover or keyboard focus
  const [hidden, setHidden] = useState(false)
  const [watching, setWatching] = useState(false) // brand film playing with sound
  const reduced = useReducedMotion()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const rail = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sync = () => setHidden(document.hidden)
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  // Keep the active tab visible on the mobile scroll-rail (scrolls the rail only, never the page).
  useEffect(() => {
    const r = rail.current
    const t = tabs.current[active]
    if (!r || !t || r.scrollWidth <= r.clientWidth) return
    const left = r.scrollLeft + t.getBoundingClientRect().left - r.getBoundingClientRect().left - 24
    r.scrollTo({ left, behavior: 'smooth' })
  }, [active])

  const paused = held || hidden || watching
  const slide = slides[active]
  const Panel = slide.panel

  const go = (i: number, focus = false) => {
    const next = (i + slides.length) % slides.length
    setActive(next)
    if (focus) tabs.current[next]?.focus()
  }

  // Advances only when the progress bar finishes — so pausing the bar pauses the reel.
  const onProgressEnd = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    go(active + 1)
  }

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go(active + 1, true) }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(active - 1, true) }
    else if (e.key === 'Home') { e.preventDefault(); go(0, true) }
    else if (e.key === 'End') { e.preventDefault(); go(slides.length - 1, true) }
  }

  return (
    <section
      id="solutions"
      aria-labelledby="reel-heading"
      className="section-dark relative overflow-hidden px-6 py-[100px] sm:px-7 sm:py-[110px]"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false) }}
    >
      <div className="bg-dots-dark pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[460px] w-[460px] rounded-full" style={{ background: 'radial-gradient(circle,rgba(37,99,235,0.18),transparent 70%)' }} />

      <MotionConfig reducedMotion="user">
        <div className="relative mx-auto max-w-[1280px]">
          {/* header */}
          <div className="mb-12 max-w-[780px]">
            <span className="chip-dark">What we&rsquo;re shipping</span>
            <h2 id="reel-heading" className="mt-5 font-display font-semibold leading-[1.05] tracking-tight text-white" style={{ fontSize: 'clamp(2rem,4.5vw,3.1rem)' }}>
              From motion graphics{' '}
              <span className="text-transparent" style={{ background: 'linear-gradient(100deg,#93c5fd,#3b82f6)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                to AI automation.
              </span>
            </h2>
            <p className="mt-4 max-w-[600px] text-[16px] leading-relaxed text-white/60">
              We animate SaaS products, put brands on page one, grow their socials — then wire up the
              CRM and AI that turn all that attention into customers.
            </p>
          </div>

          {/* stage */}
          <div className="grid items-center gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12">
            <motion.div
              key={`copy-${slide.key}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 lg:order-1"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
                {String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-400 text-white shadow-gold">
                  <slide.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-[26px] font-semibold leading-tight text-white sm:text-[30px]">{slide.title}</h3>
              </div>
              <p className="mt-4 text-[15.5px] leading-relaxed text-white/65">{slide.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {slide.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10.5px] text-gold-300">{t}</span>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href={slide.href}
                  className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
                  style={{ background: 'linear-gradient(180deg,#3b76f0,#1d4ed8)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 10px 24px -6px rgba(37,99,235,0.5)' }}
                >
                  {slide.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/contact" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/85 transition-colors hover:border-white/40 hover:text-white">
                  Start a project
                </Link>
              </div>
            </motion.div>

            {/* window */}
            <div
              id="reel-panel"
              role="tabpanel"
              aria-labelledby={`reel-tab-${slide.key}`}
              className="order-1 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] shadow-dark-card lg:order-2"
            >
              <div className="flex items-center gap-2 border-b border-white/[0.08] px-5 py-3.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 truncate font-mono text-[10.5px] uppercase tracking-wider text-white/45">{slide.window}</span>
                <span className="ml-auto flex flex-none items-center gap-1.5 font-mono text-[10px] text-[#5ee08a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" /> LIVE
                </span>
              </div>
              <div className="relative h-[400px] sm:h-[420px]">
                <motion.div
                  key={slide.key}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  {slide.video ? (
                    <ReelVideo {...slide.video} title={slide.title} onWatchChange={setWatching} />
                  ) : (
                    <Panel />
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* tabs */}
          <div
            ref={rail}
            role="tablist"
            aria-label="What we ship"
            onKeyDown={onTabKey}
            className="-mx-6 mt-10 flex snap-x gap-2.5 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0"
          >
            {slides.map((s, i) => {
              const isActive = i === active
              return (
                <button
                  key={s.key}
                  ref={(el) => { tabs.current[i] = el }}
                  id={`reel-tab-${s.key}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="reel-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => go(i)}
                  className={`relative flex min-w-[168px] flex-none snap-start items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-colors duration-300 sm:min-w-0 ${
                    isActive ? 'border-gold-400/60 bg-white/[0.09]' : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                  }`}
                >
                  <s.icon className={`h-[18px] w-[18px] flex-none ${isActive ? 'text-gold-300' : 'text-white/45'}`} />
                  <span className={`text-[13px] font-semibold ${isActive ? 'text-white' : 'text-white/60'}`}>{s.tab}</span>
                  {isActive && !reduced && (
                    <span
                      key={`bar-${active}`}
                      aria-hidden
                      onAnimationEnd={onProgressEnd}
                      className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gold-400"
                      style={{ animation: `reel-progress ${s.ms ?? ROTATE_MS}ms linear forwards`, animationPlayState: paused ? 'paused' : 'running' }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </MotionConfig>
    </section>
  )
}

/* ------------------------------- brand film ------------------------------- */

function ReelVideo({
  src, poster, length, title, onWatchChange,
}: {
  src: string
  poster: string
  length: string
  title: string
  onWatchChange: (watching: boolean) => void
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [withSound, setWithSound] = useState(false)

  // Muted preview only starts near the viewport; until then (or if the observer never fires) the poster shows.
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else if (v.muted) v.pause()
      },
      { rootMargin: '200px' },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  // Leaving the slide always releases the reel.
  useEffect(() => () => onWatchChange(false), [onWatchChange])

  const watch = () => {
    const v = ref.current
    if (!v) return
    v.currentTime = 0
    v.muted = false
    v.loop = false
    v.controls = true
    v.play().catch(() => {})
    setWithSound(true)
    onWatchChange(true)
  }

  const done = () => {
    const v = ref.current
    if (!v) return
    v.muted = true
    v.loop = true
    v.controls = false
    v.play().catch(() => {})
    setWithSound(false)
    onWatchChange(false)
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#020a24]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl" />
      <video
        ref={ref}
        className="relative h-full w-full object-contain"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        onEnded={done}
        aria-label={title}
      />
      {!withSound && (
        <button
          type="button"
          onClick={watch}
          className="group absolute bottom-4 left-4 inline-flex items-center gap-2.5 rounded-full bg-white/95 py-2 pl-2 pr-4 text-[13px] font-semibold text-navy shadow-large backdrop-blur transition-transform hover:-translate-y-0.5"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-400 text-white shadow-gold transition-transform group-hover:scale-110">
            <Play className="h-3.5 w-3.5 translate-x-px fill-white" />
          </span>
          Watch with sound
          <span className="font-mono text-[11px] text-navy/45">{length}</span>
        </button>
      )}
    </div>
  )
}
