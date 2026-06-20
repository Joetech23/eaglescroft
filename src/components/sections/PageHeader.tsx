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
    <section className="relative overflow-hidden bg-brand-deep pb-20 pt-36 text-white md:pb-28 md:pt-44">
      <div className="pointer-events-none absolute inset-0 bg-brand-glow" />
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="container-x relative text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="eyebrow justify-center text-gold-400/90">
          <span className="h-px w-6 bg-current opacity-50" /> {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }}
          className="mx-auto mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tightest md:text-6xl">
          {title}
        </motion.h1>
        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            {intro}
          </motion.p>
        )}
      </div>
    </section>
  )
}
