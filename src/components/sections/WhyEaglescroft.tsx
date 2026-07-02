'use client'

import { motion } from 'framer-motion'
import { Code2, PenTool, Cpu, Globe, LineChart, Workflow, type LucideIcon } from 'lucide-react'

const reasons: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Code2, title: 'Engineering Depth', body: 'Full-stack mastery across Next.js, React, Node and WordPress — systems that scale, not just sites that look good.' },
  { icon: PenTool, title: 'Design Sensibility', body: 'Pixel-perfect, conversion-focused interfaces where aesthetics meet measurable performance.' },
  { icon: Cpu, title: 'AI & Automation', body: 'Chatbots, AI agent pipelines and automation workflows that cut overhead and unlock growth.' },
  { icon: Globe, title: 'Global Reach', body: 'Trusted across Nigeria, the UK, USA and Australia — global standard, on local time.' },
  { icon: LineChart, title: 'SEO & ROI Focus', body: 'Technical SEO and Core Web Vitals baked into every build, so your investment compounds.' },
  { icon: Workflow, title: 'End-to-End', body: 'From discovery to deployment and support — one accountable partner across the whole journey.' },
]

export default function WhyEaglescroft() {
  return (
    <section id="why" className="bg-[#f4f6fb] px-7 py-[120px]">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-[54px] max-w-[620px]">
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-navy/55">
            <span className="h-px w-[22px] bg-navy/40" /> Why Eaglescroft
          </div>
          <h2 className="mt-[18px] font-display font-semibold leading-[1.02] tracking-tightest text-navy" style={{ fontSize: 'clamp(2rem,4.5vw,3.3rem)' }}>
            A partner, not a vendor.
          </h2>
        </div>
        <div className="grid gap-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
          {reasons.map((r) => {
            const Icon = r.icon
            return (
              <motion.div
                key={r.title}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-navy/[0.07] bg-white p-7 shadow-soft transition-all duration-300 hover:border-gold-400/40 hover:shadow-medium"
              >
                <div className="mb-[18px] flex h-[46px] w-[46px] items-center justify-center rounded-[13px] bg-navy text-gold-400">
                  <Icon className="h-[21px] w-[21px]" />
                </div>
                <h3 className="mb-2 font-display text-[18px] font-semibold text-navy">{r.title}</h3>
                <p className="text-sm leading-relaxed text-[#5a6685]">{r.body}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
