'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bot, Workflow, Gauge, Filter, Users, ArrowRight, Zap, Mail, MessageSquare,
  CheckCircle2, Phone, type LucideIcon,
} from 'lucide-react'

/* ---------------------------------- data --------------------------------- */

type Solution = {
  key: string
  icon: LucideIcon
  title: string
  desc: string
  tags: string[]
}

const solutions: Solution[] = [
  {
    key: 'chatbot',
    icon: Bot,
    title: 'AI Chatbot Solutions',
    desc: 'Chatbots that answer, qualify and book leads 24/7 — on your site, WhatsApp and socials.',
    tags: ['Lead qualification', 'WhatsApp', '24/7 support'],
  },
  {
    key: 'automation',
    icon: Workflow,
    title: 'Smart Automations',
    desc: 'Workflows that follow up, route and report automatically — no task falls through.',
    tags: ['Follow-ups', 'n8n / Zapier', 'Zero manual work'],
  },
  {
    key: 'ghl',
    icon: Gauge,
    title: 'GoHighLevel Systems',
    desc: 'Complete GHL setups — pipelines, calendars, campaigns and reporting in one command centre.',
    tags: ['Full setup', 'Campaigns', 'Reporting'],
  },
  {
    key: 'funnels',
    icon: Filter,
    title: 'High-Converting Funnels',
    desc: 'Landing pages and funnels engineered to turn clicks into booked calls and sales.',
    tags: ['Landing pages', 'A/B ready', 'Booked calls'],
  },
  {
    key: 'crm',
    icon: Users,
    title: 'CRM & Pipelines',
    desc: 'Every lead captured, tracked and nurtured — your whole sales process in one view.',
    tags: ['Pipelines', 'Nurture', 'One dashboard'],
  },
]

/* ------------------------------ mock panels ------------------------------ */

const spring = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }

function ChatbotMock() {
  const msgs = [
    { from: 'bot', text: 'Hi 👋 Welcome to Star Homes. Looking to buy or rent?' },
    { from: 'user', text: 'Buying — 3 bedroom in Abuja.' },
    { from: 'bot', text: 'Great choice! Budget range?' },
    { from: 'user', text: '₦80m – ₦120m' },
    { from: 'bot', text: '✅ 6 matches found. I can book you a viewing — tomorrow 2pm work?' },
  ]
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-400/20 text-gold-300"><Bot className="h-4 w-4" /></span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">AI assistant · live on client site</span>
      </div>
      {msgs.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...spring, delay: 0.25 + i * 0.45 }}
          className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-[12.5px] leading-relaxed ${
            m.from === 'user' ? 'self-end rounded-br-md bg-gold-400 font-medium text-white' : 'self-start rounded-bl-md bg-white/10 text-white/90'
          }`}
        >
          {m.text}
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 + msgs.length * 0.45 }}
        className="mt-1 flex items-center gap-2 self-start rounded-full border border-[#28c840]/40 bg-[#28c840]/10 px-3 py-1.5 font-mono text-[10.5px] text-[#5ee08a]"
      >
        <CheckCircle2 className="h-3.5 w-3.5" /> Lead qualified & viewing booked — while you slept
      </motion.div>
    </div>
  )
}

function AutomationMock() {
  const steps = [
    { icon: Zap, label: 'New enquiry received', sub: 'Website form · 02:14 AM' },
    { icon: MessageSquare, label: 'Instant WhatsApp reply sent', sub: 'Personalised in 3 seconds' },
    { icon: Mail, label: 'Nurture email sequence started', sub: 'Day 1 of 7' },
    { icon: Phone, label: 'Call booked into your calendar', sub: 'No human touched a thing' },
  ]
  return (
    <div className="flex h-full flex-col justify-center gap-0 p-7">
      {steps.map((s, i) => (
        <div key={s.label} className="relative flex gap-4">
          {i < steps.length - 1 && (
            <motion.span
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.55 + i * 0.55, duration: 0.4 }}
              className="absolute left-[19px] top-10 h-[calc(100%-28px)] w-px origin-top bg-gradient-to-b from-gold-400/70 to-gold-400/20"
            />
          )}
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...spring, delay: 0.3 + i * 0.55 }}
            className="z-10 flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-gold-400/30 bg-gold-400/15 text-gold-300"
          >
            <s.icon className="h-[18px] w-[18px]" />
          </motion.span>
          <motion.div
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.4 + i * 0.55 }}
            className="pb-7"
          >
            <div className="text-[13.5px] font-semibold text-white">{s.label}</div>
            <div className="font-mono text-[10.5px] text-white/45">{s.sub}</div>
          </motion.div>
        </div>
      ))}
    </div>
  )
}

function GhlMock() {
  const stats = [
    { label: 'Leads this week', value: '128', delta: '+32%' },
    { label: 'Booked calls', value: '41', delta: '+18%' },
    { label: 'Pipeline value', value: '₦9.4m', delta: '+27%' },
  ]
  const bars = [42, 65, 50, 78, 62, 90, 74]
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-6">
      <div className="font-mono text-[10px] uppercase tracking-wider text-white/50">GoHighLevel · client command centre</div>
      <div className="grid grid-cols-3 gap-2.5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.25 + i * 0.15 }}
            className="rounded-xl border border-white/10 bg-white/[0.05] p-3"
          >
            <div className="font-display text-lg font-semibold text-white">{s.value}</div>
            <div className="text-[10px] text-white/45">{s.label}</div>
            <div className="mt-1 font-mono text-[10px] text-[#5ee08a]">{s.delta}</div>
          </motion.div>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-3 text-[11px] font-medium text-white/60">Conversions — last 7 days</div>
        <div className="flex h-[92px] items-end gap-2">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.6 + i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 rounded-t-md"
              style={{ background: i === 5 ? 'linear-gradient(180deg,#93c5fd,#2563EB)' : 'rgba(37,99,235,0.45)' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FunnelMock() {
  const stages = [
    { label: 'Visitors', value: '2,400', w: '100%' },
    { label: 'Leads captured', value: '640', w: '76%' },
    { label: 'Calls booked', value: '180', w: '52%' },
    { label: 'Clients closed', value: '46', w: '30%' },
  ]
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2.5 p-7">
      <div className="mb-2 self-start font-mono text-[10px] uppercase tracking-wider text-white/50">Funnel · click → client</div>
      {stages.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ ...spring, delay: 0.3 + i * 0.28 }}
          style={{ width: s.w, background: `linear-gradient(180deg, rgba(37,99,235,${0.85 - i * 0.16}), rgba(29,78,216,${0.85 - i * 0.16}))` }}
          className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3.5"
        >
          <span className="text-[12.5px] font-semibold text-white">{s.label}</span>
          <span className="font-display text-[15px] font-semibold text-white">{s.value}</span>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mt-1 flex items-center gap-2 rounded-full border border-[#28c840]/40 bg-[#28c840]/10 px-3 py-1.5 font-mono text-[10.5px] text-[#5ee08a]"
      >
        <CheckCircle2 className="h-3.5 w-3.5" /> 1.9% → 7.2% conversion after rebuild
      </motion.div>
    </div>
  )
}

function CrmMock() {
  const cols = [
    { title: 'New leads', cards: ['Chinedu · Real estate', 'Sarah · E-commerce'] },
    { title: 'In talks', cards: ['Oval Sports · Retainer', 'Clinic · Website'] },
    { title: 'Won 🎉', cards: ['Star Homes · Platform'] },
  ]
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-6">
      <div className="font-mono text-[10px] uppercase tracking-wider text-white/50">CRM · every lead tracked</div>
      <div className="grid grid-cols-3 gap-2.5">
        {cols.map((c, ci) => (
          <div key={c.title} className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
            <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-white/55">{c.title}</div>
            <div className="flex flex-col gap-2">
              {c.cards.map((card, i) => (
                <motion.div
                  key={card}
                  initial={{ opacity: 0, y: 14, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ ...spring, delay: 0.3 + ci * 0.3 + i * 0.18 }}
                  className={`rounded-lg border p-2.5 text-[11px] leading-snug ${
                    ci === 2 ? 'border-[#28c840]/40 bg-[#28c840]/10 text-[#bff2cf]' : 'border-white/10 bg-white/[0.06] text-white/80'
                  }`}
                >
                  {card}
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${35 + ci * 30}%` }}
                      transition={{ delay: 0.7 + ci * 0.3 + i * 0.18, duration: 0.6 }}
                      className="h-full rounded-full bg-gold-400"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        className="font-mono text-[10.5px] text-white/40">
        Auto-nurture runs on every column — nothing leaks.
      </motion.div>
    </div>
  )
}

const panels: Record<string, () => JSX.Element> = {
  chatbot: ChatbotMock,
  automation: AutomationMock,
  ghl: GhlMock,
  funnels: FunnelMock,
  crm: CrmMock,
}

/* -------------------------------- section -------------------------------- */

const ROTATE_MS = 6500

export default function SolutionsShowcase() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (paused) return
    timer.current = setInterval(() => setActive((a) => (a + 1) % solutions.length), ROTATE_MS)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [paused])

  const current = solutions[active]
  const Panel = panels[current.key]

  return (
    <section id="solutions" className="relative overflow-hidden bg-white px-6 py-[110px] sm:px-7">
      <div className="pointer-events-none absolute -right-32 top-24 h-[420px] w-[420px] rounded-full" style={{ background: 'radial-gradient(circle,rgba(37,99,235,0.10),transparent 70%)' }} />

      <div className="relative mx-auto max-w-[1280px]">
        <div className="mb-12 max-w-[760px]">
          <span className="chip">Growth systems</span>
          <h2 className="mt-5 font-display font-semibold leading-[1.05] tracking-tight text-navy" style={{ fontSize: 'clamp(2rem,4.6vw,3.4rem)' }}>
            We don&rsquo;t just build websites.{' '}
            <span className="text-transparent" style={{ background: 'linear-gradient(100deg,#1d4ed8,#3b82f6)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
              We partner on growth.
            </span>
          </h2>
          <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-[#48526e]">
            AI chatbots, automations, GoHighLevel funnels and CRM systems — one connected engine
            that captures, nurtures and converts customers for you, around the clock.
          </p>
        </div>

        <div
          className="grid items-stretch gap-8 lg:grid-cols-[0.92fr_1.08fr]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* tabs */}
          <div className="flex flex-col gap-2.5">
            {solutions.map((s, i) => {
              const Icon = s.icon
              const isActive = i === active
              return (
                <button
                  key={s.key}
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                    isActive ? 'border-gold-400/50 bg-white shadow-medium' : 'border-navy/10 bg-white shadow-soft hover:border-navy/25'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="solution-glow"
                      className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-gradient-to-b from-gold-300 to-gold-500"
                    />
                  )}
                  <div className="flex items-start gap-4">
                    <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl transition-colors duration-300 ${
                      isActive ? 'bg-gold-400 text-white shadow-gold' : 'bg-navy-50 text-navy'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-display text-[16.5px] font-semibold text-navy">{s.title}</div>
                      <p className={`mt-1 text-[13.5px] leading-relaxed text-[#5a6685] transition-all duration-300 ${isActive ? '' : 'line-clamp-1'}`}>
                        {s.desc}
                      </p>
                      {isActive && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-2.5 flex flex-wrap gap-1.5">
                          {s.tags.map((t) => (
                            <span key={t} className="rounded-full bg-gold-400/10 px-2.5 py-1 font-mono text-[10px] font-medium text-gold-600">{t}</span>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                  {/* auto-rotate progress */}
                  {isActive && !paused && (
                    <motion.span
                      key={`progress-${active}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: ROTATE_MS / 1000, ease: 'linear' }}
                      className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gold-400/40"
                    />
                  )}
                </button>
              )
            })}

            <a href="/contact" className="group mt-2 inline-flex items-center gap-2 self-start rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
              style={{ background: 'linear-gradient(180deg,#3b76f0,#1d4ed8)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 10px 24px -6px rgba(37,99,235,0.5)' }}>
              Build my growth system <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* animated panel */}
          <div className="section-dark relative min-h-[440px] overflow-hidden rounded-[26px] border border-white/10 shadow-dark-card">
            <div className="bg-dots-dark pointer-events-none absolute inset-0 opacity-50" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-[240px] w-[480px] -translate-x-1/2" style={{ background: 'radial-gradient(55% 70% at 50% 0%,rgba(37,99,235,.30),transparent 70%)' }} />
            {/* faux window chrome */}
            <div className="relative flex items-center gap-2 border-b border-white/[0.08] px-5 py-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-[10.5px] uppercase tracking-wider text-white/45">{current.title}</span>
            </div>
            <div className="relative h-[calc(100%-45px)] min-h-[395px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Panel />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
