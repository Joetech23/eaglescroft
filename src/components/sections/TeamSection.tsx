'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Linkedin, Twitter, Github } from 'lucide-react'

type Member = { name: string; role: string; img: string; tag: string; linkedin?: string }

// Photos coming soon — placeholders for now.
const team: Member[] = [
  { name: 'Benjamin Adama', role: 'Founder', tag: 'Strategy · Growth', img: '/brand/bejamin adama - founder.png', linkedin: 'https://www.linkedin.com/in/benjaminadama/' },
  { name: 'Joshua Obaje Enemaku', role: 'Co-Founder', tag: 'Full-stack · AI', img: '/brand/Joshua Obaje - cto.png', linkedin: 'https://www.linkedin.com/in/joshua-obaje/' },
]

export default function TeamSection() {
  return (
    <section id="team" className="bg-[#f6f7fb] px-7 py-[120px]">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-[54px] flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[620px]">
            <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-navy/55">
              <span className="h-px w-[22px] bg-navy/40" /> The crew
            </div>
            <h2 className="mt-[18px] font-display font-semibold leading-[1.02] tracking-tightest text-navy" style={{ fontSize: 'clamp(2rem,4.5vw,3.3rem)' }}>
              The people behind the lift.
            </h2>
          </div>
          <p className="max-w-[360px] text-base leading-relaxed text-[#4a5578]">
            A tight, senior team of engineers, designers and strategists — no juniors learning on your budget.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {team.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group overflow-hidden rounded-[26px] border border-[#e7eaf3] bg-white shadow-soft transition-shadow duration-300 hover:shadow-[0_28px_60px_rgba(0,30,96,0.14)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={m.img}
                  alt={m.name}
                  fill
                  unoptimized
                  sizes="(max-width:1024px) 50vw, 22vw"
                  className="object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,6,21,0) 55%,rgba(0,6,21,0.72) 100%)' }} />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-navy">{m.tag}</span>
                <div className="absolute bottom-3 left-3 right-3 flex translate-y-2 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {m.linkedin && (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${m.name} on LinkedIn`}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-navy transition-colors hover:bg-gold-400"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-[17px] font-semibold text-navy">{m.name}</h3>
                <p className="mt-0.5 text-sm text-navy/55">{m.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
