'use client'

import { motion } from 'framer-motion'
import { MessagesSquare, ReceiptText, CalendarClock, LifeBuoy, type LucideIcon } from 'lucide-react'

const points: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: MessagesSquare,
    title: 'Free consultation first',
    body: 'We scope your goals before quoting, so the price you see matches the work you actually need.',
  },
  {
    icon: ReceiptText,
    title: 'No hidden fees',
    body: 'Everything is written into the proposal up front — deliverables, timeline and total cost.',
  },
  {
    icon: CalendarClock,
    title: 'Milestone payments',
    body: 'Pay in stages as work is delivered, not all at once. You always see progress before the next step.',
  },
  {
    icon: LifeBuoy,
    title: 'Support after launch',
    body: 'Every project includes a support window, with optional monthly care to keep you growing.',
  },
]

export default function PricingAssurance() {
  return (
    <section className="bg-[#f4f6fb] px-7 py-[100px]">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-12 max-w-[620px]">
          <span className="chip">How we quote</span>
          <h2 className="mt-5 font-display font-semibold leading-[1.05] tracking-tight text-navy" style={{ fontSize: 'clamp(1.9rem,4vw,2.9rem)' }}>
            Pricing you can plan around.
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-[#5a6685]">
            Ranges exist because every business is different. Here&rsquo;s exactly how we turn a range into your number.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[24px] border border-navy/[0.07] bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-medium"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-gold-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-[17px] font-semibold text-navy">{p.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#5a6685]">{p.body}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
