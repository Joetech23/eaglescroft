'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'

const points = [
  'A senior team across engineering, design and growth — no juniors learning on your budget',
  'Every build tuned for speed, SEO and conversion from day one',
  'AI automation baked in, so your business works while you sleep',
  'One accountable partner from strategy to launch and beyond',
]

export default function WhoWeAre() {
  return (
    <section id="who-we-are" className="bg-white px-7 py-[110px]">
      <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-2">
        {/* copy */}
        <div>
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold-600">
            <span className="h-px w-[22px] bg-gold-400/60" /> Who we are
          </div>
          <h2 className="mt-[18px] font-display font-semibold leading-[1.05] tracking-tight text-navy" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)' }}>
            More than an agency — a serious growth partner.
          </h2>
          <p className="mt-5 max-w-[520px] text-[16px] leading-relaxed text-[#48526e]">
            Eaglescroft is a founder-led team partnering with companies across Nigeria, the UK, USA and
            Australia — websites, brands, AI chatbots, automations and CRM systems that work as one
            engine. We don&rsquo;t hand over a project and disappear; we stay invested in your growth.
          </p>

          <ul className="mt-8 space-y-3.5">
            {points.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="flex items-start gap-3 text-[15px] leading-relaxed text-navy/80"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-gold-500" />
                {p}
              </motion.li>
            ))}
          </ul>

          <a href="/about" className="group mt-9 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3.5 text-sm font-semibold text-white shadow-navy transition-all duration-300 hover:-translate-y-0.5 hover:shadow-large">
            More about us <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* visual */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative aspect-[4/4.4] overflow-hidden rounded-[28px] shadow-[0_30px_70px_rgba(0,30,96,0.18)] sm:aspect-[4/3.6]">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
              alt="The Eaglescroft team in a strategy session"
              fill unoptimized sizes="(max-width:1024px) 100vw, 50vw" className="object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(200deg,rgba(37,99,235,0.10),rgba(0,30,96,0.05) 50%,transparent)' }} />
          </div>
          {/* floating cards */}
          <motion.div
            animate={{ y: [0, -10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-6 -left-4 rounded-2xl border border-navy/10 bg-white px-5 py-4 shadow-[0_18px_44px_rgba(0,30,96,0.14)]"
          >
            <div className="font-display text-[28px] font-semibold leading-none text-navy">6+</div>
            <div className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-navy/50">Countries served</div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-3 top-8 flex items-center gap-2.5 rounded-2xl bg-gold-400 px-4 py-3 shadow-gold"
          >
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="font-display text-sm font-semibold text-white">Est. 2021 · Still climbing</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
