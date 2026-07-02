'use client'

import { motion } from 'framer-motion'

export default function PageHeader({
  eyebrow, title, intro,
}: {
  eyebrow: string
  title: React.ReactNode
  intro?: string
}) {
  return (
    <section className="section-dark relative overflow-hidden pb-20 pt-36 text-center md:pb-24 md:pt-44">
      <div className="bg-dots-dark pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[860px] max-w-full -translate-x-1/2"
        style={{ background: 'radial-gradient(55% 60% at 50% 0%,rgba(37,99,235,.28),transparent 70%)' }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/eagle-white.png" alt="" aria-hidden className="pointer-events-none absolute right-[-60px] top-1/2 h-[300px] -translate-y-1/2 opacity-[0.05]" />

      <div className="container-x relative">
        <motion.span
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="chip-dark"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }}
          className="mx-auto mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
          {title}
        </motion.h1>
        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">
            {intro}
          </motion.p>
        )}
      </div>
      {/* fade into light content */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(37,99,235,0.5),transparent)' }} />
    </section>
  )
}
