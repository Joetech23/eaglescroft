'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { services } from '@/lib/services'

export default function ServicesOverview() {
  return (
    <section id="services" className="relative bg-[#f6f7fb] px-7 py-[120px]">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-[54px] flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[620px]">
            <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-navy/55">
              <span className="h-px w-[22px] bg-navy/40" /> What we do
            </div>
            <h2 className="mt-[18px] font-display font-semibold leading-[1.02] tracking-tightest text-navy" style={{ fontSize: 'clamp(2rem,4.5vw,3.3rem)' }}>
              Full-stack capability,<br />end to end.
            </h2>
          </div>
          <p className="max-w-[380px] text-base leading-relaxed text-[#4a5578]">
            Strategy, design, engineering and growth under one accountable roof — so nothing falls through the cracks between teams.
          </p>
        </div>

        <div className="grid gap-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))' }}>
          {services.map((s) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.slug}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                <Link
                  href={`/services#${s.slug}`}
                  className="group relative block h-full overflow-hidden rounded-[26px] border border-[#e7eaf3] bg-white p-[30px] transition-shadow duration-300 hover:border-[#d4dbef] hover:shadow-[0_28px_60px_rgba(0,30,96,0.12)]"
                >
                  <div className="mb-[22px] flex h-[52px] w-[52px] items-center justify-center rounded-2xl" style={{ background: s.tint, color: s.color }}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2.5 font-display text-[21px] font-semibold tracking-tightest text-navy">{s.title}</h3>
                  <p className="mb-[18px] text-[14.5px] leading-relaxed text-[#5a6685]">{s.description}</p>
                  <div className="flex flex-wrap gap-[7px]">
                    {s.tags.map((t) => (
                      <span key={t} className="rounded-[9px] bg-[#f1f3fa] px-2.5 py-[5px] font-mono text-[11px] text-[#4a5578]">{t}</span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
