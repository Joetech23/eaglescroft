'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, MessageCircle, ArrowRight } from 'lucide-react'
import { whatsappLink } from '@/lib/site'
import { faqs } from '@/lib/faqs'

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${open ? 'border-gold-400/50 bg-white shadow-soft' : 'border-navy/10 bg-white hover:border-navy/25'}`}>
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={open}>
        <span className="font-display text-[16.5px] font-semibold text-navy">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className={`flex h-8 w-8 flex-none items-center justify-center rounded-full transition-colors ${open ? 'bg-gold-400 text-white' : 'bg-navy-50 text-navy'}`}
        >
          <Plus className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="px-6 pb-6 text-[14.5px] leading-relaxed text-[#5a6685]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section id="faqs" className="bg-[#f6f7fb] px-7 py-[110px]">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        {/* heading + CTA card */}
        <div>
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold-600">
            <span className="h-px w-[22px] bg-gold-400/60" /> FAQs
          </div>
          <h2 className="mt-[18px] font-display font-semibold leading-[1.05] tracking-tight text-navy" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)' }}>
            Answers before<br />you even ask.
          </h2>
          <p className="mt-4 max-w-[400px] text-[15.5px] leading-relaxed text-[#5a6685]">
            Everything clients usually want to know before takeoff. Still curious? We reply within 24 hours.
          </p>

          <div className="mt-9 rounded-[24px] border border-navy/10 bg-white p-7 shadow-soft">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-400/10 text-gold-500">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-navy">Have a different question?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#5a6685]">Chat with us directly — a real answer, fast.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-white shadow-gold transition-all hover:-translate-y-0.5 hover:bg-gold-500">
                WhatsApp us
              </a>
              <a href="/contact" className="group inline-flex items-center gap-2 rounded-full border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:border-gold-400/60">
                Contact form <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* accordion */}
        <div className="flex flex-col gap-3.5">
          {faqs.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  )
}
