'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Compass, PenTool, Rocket, LifeBuoy, type LucideIcon } from 'lucide-react'

const steps: { icon: LucideIcon; k: string; title: string; body: string }[] = [
  { icon: Compass, k: '01', title: 'Discover', body: 'We dig into your goals, audience and market — then map the route to measurable results.' },
  { icon: PenTool, k: '02', title: 'Design', body: 'Strategy becomes interface: wireframes, brand systems and prototypes built to convert.' },
  { icon: Rocket, k: '03', title: 'Build & Launch', body: 'Engineered in Next.js & modern stacks, tuned for Core Web Vitals, shipped on time.' },
  { icon: LifeBuoy, k: '04', title: 'Grow & Support', body: 'SEO, automation and ongoing care keep you climbing long after launch day.' },
]

export default function ProcessSection() {
  return (
    <section id="process" className="overflow-hidden bg-white px-7 py-[120px]">
      <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-2">
        {/* image stack */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_30px_70px_rgba(0,30,96,0.2)]">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1100&q=80"
              alt="The Eaglescroft team collaborating"
              fill
              unoptimized
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,6,21,0) 50%,rgba(0,6,21,0.55) 100%)' }} />
          </div>
          {/* floating accent card */}
          <div className="absolute -bottom-6 -right-3 hidden rounded-[20px] border border-[#e7eaf3] bg-white p-5 shadow-[0_20px_50px_rgba(0,30,96,0.15)] sm:block">
            <div className="font-display text-[34px] font-semibold leading-none text-navy">99%</div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[#7a86a3]">Client satisfaction</div>
          </div>
          <div className="absolute -left-3 top-8 hidden rounded-[16px] bg-gold-400 px-4 py-3 shadow-gold md:block">
            <div className="font-display text-[15px] font-semibold text-navy">On time. Every time.</div>
          </div>
        </motion.div>

        {/* steps */}
        <div>
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-navy/55">
            <span className="h-px w-[22px] bg-navy/40" /> How we work
          </div>
          <h2 className="mt-[18px] font-display font-semibold leading-[1.02] tracking-tightest text-navy" style={{ fontSize: 'clamp(2rem,4.5vw,3.1rem)' }}>
            From idea to lift-off.
          </h2>
          <p className="mt-4 max-w-[460px] text-[15.5px] leading-relaxed text-[#5a6685]">
            A clear, proven flight plan — so you always know where the project is and where it&rsquo;s headed.
          </p>

          <div className="mt-9 flex flex-col gap-2">
            {steps.map((s) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.k}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5 }}
                  className="group flex items-start gap-4 rounded-2xl p-4 transition-colors hover:bg-[#f6f7fb]"
                >
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-navy text-gold-400 transition-colors group-hover:bg-gold-400 group-hover:text-navy">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] text-gold-500">{s.k}</span>
                      <h3 className="font-display text-[18px] font-semibold text-navy">{s.title}</h3>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-[#5a6685]">{s.body}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
