'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const shots = [
  { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80', alt: 'Engineering & development', label: 'Engineering', span: 'row-span-2' },
  { src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80', alt: 'Interface & product design', label: 'Design' },
  { src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80', alt: 'Strategy & growth sessions', label: 'Strategy' },
  { src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1100&q=80', alt: 'Branding & creative direction', label: 'Branding', span: 'col-span-2' },
]

export default function StudioShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#000615] px-7 py-[120px]">
      <div className="pointer-events-none absolute right-1/2 top-[-10%] h-[460px] w-[820px] translate-x-1/2"
        style={{ background: 'radial-gradient(55% 55% at 50% 0%,rgba(66,87,176,.35),transparent 70%)' }} />

      <div className="relative mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold-400">
            <span className="h-px w-[22px] bg-gold-400/50" /> Inside the studio
          </div>
          <h2 className="mt-[18px] font-display font-semibold leading-[1.04] tracking-tightest text-white" style={{ fontSize: 'clamp(2rem,4.5vw,3.1rem)' }}>
            One team. Every discipline.
          </h2>
          <p className="mt-5 max-w-[440px] text-[15.5px] leading-relaxed text-white/65">
            Engineers, designers and strategists working side by side — so your brand, product and growth all pull
            in the same direction, with no gaps between hand-offs.
          </p>
          <a href="/about" className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/50">
            Meet the studio <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid auto-rows-[150px] grid-cols-2 gap-3.5 sm:auto-rows-[180px]">
          {shots.map((s, i) => (
            <motion.div
              key={s.src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-[20px] border border-white/[0.08] ${s.span || ''}`}
            >
              <Image src={s.src} alt={s.alt} fill unoptimized sizes="(max-width:1024px) 50vw, 30vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,6,21,0) 45%,rgba(0,6,21,0.75) 100%)' }} />
              <span className="absolute bottom-3 left-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/85">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
