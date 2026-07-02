import { ArrowRight, Phone } from 'lucide-react'
import { siteConfig } from '@/lib/site'

export default function FinalCTA() {
  return (
    <section id="contact" className="section-dark relative overflow-hidden px-7 py-[110px]">
      <div className="bg-dots-dark pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] max-w-full -translate-x-1/2"
        style={{ background: 'radial-gradient(55% 60% at 50% 0%,rgba(37,99,235,.30),transparent 70%)' }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/eagle-white.png" alt="" aria-hidden className="pointer-events-none absolute bottom-[-60px] right-[-50px] h-[380px] opacity-[0.06]" />

      <div className="relative mx-auto max-w-[1280px] text-center">
        <span className="chip-dark">Ready for takeoff</span>
        <h2 className="mx-auto mt-6 max-w-3xl font-display font-semibold leading-[1.05] tracking-tight text-white" style={{ fontSize: 'clamp(2.2rem,5vw,3.9rem)' }}>
          Let&rsquo;s build something<br />
          <span className="text-transparent" style={{ background: 'linear-gradient(100deg,#93c5fd,#2563EB)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
            that takes flight.
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-[520px] text-[17px] leading-relaxed text-white/70">
          Tell us where you want to go. We&rsquo;ll map the route, build the system, and get you climbing — fast.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/contact"
            className="inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(180deg,#3b76f0,#1d4ed8)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 4px rgba(0,0,0,0.3), 0 14px 34px -8px rgba(37,99,235,0.6)' }}
          >
            Start a Project <ArrowRight className="h-[18px] w-[18px]" />
          </a>
          <a
            href={`tel:${siteConfig.phoneRaw}`}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.06] px-8 py-4 text-[15px] font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.12]"
          >
            <Phone className="h-[17px] w-[17px]" /> {siteConfig.phoneDisplay}
          </a>
        </div>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
          Free consultation · Reply within 24 hours · Nigeria · UK · USA · Australia
        </p>
      </div>
    </section>
  )
}
