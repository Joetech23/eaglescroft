'use client'

import { motion } from 'framer-motion'
import { Bot, CheckCircle2, Search, Heart, Play, MessageCircle, TrendingUp } from 'lucide-react'

/*
 * Code-animated product mocks for the home reel. Every element animates *to* a
 * visible state on mount — nothing waits on an observer, so a frozen background
 * tab simply shows the panel once it is focused again.
 */

const spring = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }

/* ------------------------- motion graphics for SaaS ------------------------ */

export function MotionMock() {
  const words = ['Ship', 'faster', 'with', 'Flowdesk.']
  const tracks = [
    { label: 'Text', color: 'rgba(147,197,253,0.6)', clips: [[4, 26], [36, 24], [70, 22]] },
    { label: 'UI', color: 'rgba(37,99,235,0.8)', clips: [[0, 44], [48, 46]] },
    { label: 'FX', color: 'rgba(167,139,250,0.65)', clips: [[16, 12], [58, 16], [86, 10]] },
    { label: 'Audio', color: 'rgba(94,224,138,0.45)', clips: [[0, 100]] },
  ]
  return (
    <div className="flex h-full flex-col gap-3 p-4 sm:p-5">
      {/* preview frame */}
      <div
        className="relative flex-1 overflow-hidden rounded-xl border border-white/10"
        style={{ background: 'radial-gradient(80% 90% at 70% 20%, rgba(37,99,235,0.45), transparent 60%), linear-gradient(160deg,#0a1a4a,#040b26)' }}
      >
        <div className="absolute left-3 top-3 font-mono text-[9.5px] uppercase tracking-wider text-white/45">Launch film · 16:9 · 60fps</div>
        <div className="absolute right-3 top-3 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9.5px] text-white/60">00:00:07:12</div>

        {/* kinetic headline */}
        <div className="absolute left-4 top-1/2 flex -translate-y-1/2 flex-wrap gap-x-2 sm:left-6">
          {words.map((w, i) => (
            <span key={w} className="overflow-hidden">
              <motion.span
                className={`inline-block font-display text-[22px] font-semibold leading-tight sm:text-[28px] ${i === words.length - 1 ? 'text-gold-300' : 'text-white'}`}
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ ...spring, delay: 0.2 + i * 0.16 }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </div>

        {/* floating product UI card */}
        <motion.div
          className="absolute bottom-4 right-4 w-[44%] max-w-[190px] rounded-lg border border-white/15 bg-white/[0.08] p-2.5 backdrop-blur"
          initial={{ opacity: 0, x: 30, rotate: 4 }}
          animate={{ opacity: 1, x: 0, rotate: -2 }}
          transition={{ ...spring, delay: 0.9 }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-semibold text-white/80">Weekly active</span>
            <span className="font-mono text-[9px] text-[#5ee08a]">+38%</span>
          </div>
          <div className="flex h-10 items-end gap-1">
            {[40, 55, 48, 70, 62, 88].map((h, i) => (
              <motion.span
                key={i}
                className="flex-1 rounded-sm"
                style={{ background: i === 5 ? '#93c5fd' : 'rgba(147,197,253,0.4)' }}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 1.2 + i * 0.08, duration: 0.45 }}
              />
            ))}
          </div>
        </motion.div>

        {/* cursor gliding to a CTA */}
        <motion.div
          className="absolute bottom-6 left-6 rounded-full bg-gold-400 px-3 py-1.5 text-[10px] font-semibold text-white shadow-gold"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: [0.8, 1, 0.94, 1] }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          Start free trial
        </motion.div>
      </div>

      {/* editor timeline */}
      <div className="relative rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
        <div className="flex flex-col gap-1.5">
          {tracks.map((t, ti) => (
            <div key={t.label} className="flex items-center gap-2">
              <span className="w-10 flex-none font-mono text-[9px] uppercase text-white/40">{t.label}</span>
              <div className="relative h-3.5 flex-1">
                {t.clips.map(([left, width], ci) => (
                  <motion.span
                    key={ci}
                    className="absolute inset-y-0 origin-left rounded"
                    style={{ left: `${left}%`, width: `${width}%`, background: t.color }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3 + ti * 0.12 + ci * 0.1, duration: 0.45 }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* playhead */}
        <div className="pointer-events-none absolute inset-y-1.5 left-[3.75rem] right-3">
          <motion.span
            className="absolute inset-y-0 w-px bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            initial={{ left: '0%' }}
            animate={{ left: '100%' }}
            transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  )
}

/* ---------------------------- visibility / SEO ---------------------------- */

export function SeoMock() {
  const results = [
    { domain: 'eaglescroft.com.ng', title: 'Web Design Agency in Abuja — Fast, SEO-Ready Sites', ours: true },
    { domain: 'directory.example', title: 'Web Design Companies in Abuja — Listings' },
    { domain: 'blog.example', title: 'How to Choose a Web Designer in Nigeria' },
  ]
  const chart = 'M0,70 L30,66 L60,68 L90,58 L120,52 L150,44 L180,34 L210,26 L240,14 L270,8'
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5 sm:p-6">
      <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2">
        <Search className="h-3.5 w-3.5 text-white/50" />
        <span className="truncate text-[12px] text-white/80">web design agency abuja</span>
      </div>

      <div className="flex flex-col gap-2">
        {results.map((r, i) => (
          <motion.div
            key={r.domain}
            initial={{ opacity: 0, y: r.ours ? 40 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: r.ours ? 0.9 : 0.25 + i * 0.12 }}
            className={`rounded-lg border px-3 py-2 ${r.ours ? 'border-gold-400/50 bg-gold-400/15' : 'border-white/10 bg-white/[0.04]'}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-mono text-[10px] text-white/50">{r.domain}</span>
              {r.ours && (
                <span className="flex flex-none items-center gap-1 rounded-full bg-[#28c840]/15 px-2 py-0.5 font-mono text-[9.5px] text-[#5ee08a]">
                  <TrendingUp className="h-3 w-3" /> #14 → #1
                </span>
              )}
            </div>
            <div className={`truncate text-[12px] font-medium ${r.ours ? 'text-white' : 'text-white/60'}`}>{r.title}</div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11px] font-medium text-white/60">Organic clicks — 6 months</span>
          <span className="font-mono text-[10.5px] text-[#5ee08a]">+214%</span>
        </div>
        <svg viewBox="0 0 270 76" className="h-[64px] w-full" preserveAspectRatio="none" aria-hidden>
          <motion.path
            d={chart}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 1.4, ease: 'easeOut' }}
          />
        </svg>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          {[
            ['37', 'Top-3 keywords'],
            ['1.8s', 'Mobile LCP'],
            ['98', 'SEO score'],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="font-display text-[15px] font-semibold text-white">{v}</div>
              <div className="text-[9.5px] text-white/45">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* -------------------------- social media marketing ------------------------- */

export function SmmMock() {
  const tiles = [
    { bg: 'linear-gradient(135deg,#2563EB,#1e3a8a)', reel: true, likes: '2.4k' },
    { bg: 'linear-gradient(135deg,#93c5fd,#3b82f6)', likes: '864' },
    { bg: 'linear-gradient(135deg,#a78bfa,#4c1d95)', reel: true, likes: '5.1k' },
    { bg: 'linear-gradient(135deg,#0f172a,#1d4ed8)', likes: '1.2k' },
    { bg: 'linear-gradient(135deg,#38bdf8,#1e40af)', reel: true, likes: '3.7k' },
    { bg: 'linear-gradient(135deg,#1e40af,#60a5fa)', likes: '990' },
  ]
  return (
    <div className="relative flex h-full flex-col justify-center gap-3 p-5 sm:p-6">
      <div className="grid grid-cols-3 gap-2">
        {[
          ['48.2k', 'Reach', '+62%'],
          ['6.8%', 'Engagement', '+2.1pt'],
          ['+1,240', 'Followers', '30 days'],
        ].map(([v, l, d], i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 + i * 0.12 }}
            className="rounded-lg border border-white/10 bg-white/[0.05] p-2.5"
          >
            <div className="font-display text-[15px] font-semibold text-white">{v}</div>
            <div className="text-[9.5px] text-white/45">{l}</div>
            <div className="font-mono text-[9.5px] text-[#5ee08a]">{d}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {tiles.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring, delay: 0.45 + i * 0.1 }}
            className="relative aspect-[4/3] overflow-hidden rounded-md"
            style={{ background: t.bg }}
          >
            {t.reel && <Play className="absolute right-1.5 top-1.5 h-3 w-3 fill-white text-white" />}
            <span className="absolute bottom-1 left-1.5 flex items-center gap-1 text-[9px] font-semibold text-white">
              <Heart className="h-2.5 w-2.5 fill-white" /> {t.likes}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 1.4 }}
        className="flex items-center gap-2 self-start rounded-xl border border-white/15 bg-[#0b1840]/90 px-3 py-2 shadow-dark-card"
      >
        <MessageCircle className="h-3.5 w-3.5 flex-none text-gold-300" />
        <span className="text-[11px] text-white/85">New DM: &ldquo;How much for a website?&rdquo;</span>
        <span className="flex-none whitespace-nowrap rounded-full bg-[#28c840]/15 px-2 py-0.5 font-mono text-[9px] text-[#5ee08a]">→ CRM</span>
      </motion.div>
    </div>
  )
}

/* ------------------------------ CRM pipeline ------------------------------ */

export function CrmMock() {
  const cols = [
    { title: 'New leads', cards: ['Chinedu · Real estate', 'Sarah · E-commerce'] },
    { title: 'In talks', cards: ['Oval Sports · Retainer', 'Clinic · Website'] },
    { title: 'Won 🎉', cards: ['Star Homes · Platform'] },
  ]
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5 sm:p-6">
      <div className="font-mono text-[10px] uppercase tracking-wider text-white/50">CRM · GoHighLevel pipeline</div>
      <div className="grid grid-cols-3 gap-2">
        {cols.map((c, ci) => (
          <div key={c.title} className="rounded-xl border border-white/10 bg-white/[0.04] p-2">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-white/55">{c.title}</div>
            <div className="flex flex-col gap-2">
              {c.cards.map((card, i) => (
                <motion.div
                  key={card}
                  initial={{ opacity: 0, y: 14, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ ...spring, delay: 0.3 + ci * 0.3 + i * 0.18 }}
                  className={`rounded-lg border p-2 text-[10.5px] leading-snug ${
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
      <div className="grid grid-cols-3 gap-2">
        {[
          ['128', 'Leads this week'],
          ['41', 'Booked calls'],
          ['7.2%', 'Funnel conversion'],
        ].map(([v, l], i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 + i * 0.12 }}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2"
          >
            <div className="font-display text-[15px] font-semibold text-white">{v}</div>
            <div className="text-[9.5px] text-white/45">{l}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------ AI automation ----------------------------- */

export function ChatbotMock() {
  const msgs = [
    { from: 'bot', text: 'Hi 👋 Welcome to Star Homes. Looking to buy or rent?' },
    { from: 'user', text: 'Buying — 3 bedroom in Abuja.' },
    { from: 'bot', text: 'Great choice! Budget range?' },
    { from: 'user', text: '$50k – $80k' },
    { from: 'bot', text: '✅ 6 matches found. I can book you a viewing — tomorrow 2pm work?' },
  ]
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 p-5 sm:p-6">
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
          className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-[12px] leading-relaxed ${
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
        className="mt-1 flex items-center gap-2 self-start rounded-full border border-[#28c840]/40 bg-[#28c840]/10 px-3 py-1.5 font-mono text-[10px] text-[#5ee08a]"
      >
        <CheckCircle2 className="h-3.5 w-3.5 flex-none" /> Qualified, booked & synced to CRM — while you slept
      </motion.div>
    </div>
  )
}
