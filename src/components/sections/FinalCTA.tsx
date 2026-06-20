import { ArrowRight, Phone } from 'lucide-react'
import { siteConfig } from '@/lib/site'

export default function FinalCTA() {
  return (
    <section id="contact" className="bg-[#000615] px-7 pb-[100px] pt-[90px]">
      <div
        className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[36px]"
        style={{ background: 'radial-gradient(110% 130% at 18% 10%,#2a3f8f 0%,#001e60 45%,#000a22 100%)', padding: 'clamp(40px,6vw,80px)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/eagle-gold.png" alt="" aria-hidden className="pointer-events-none absolute bottom-[-40px] right-[-40px] h-[320px] opacity-[0.12]" />
        <div className="relative max-w-[640px]">
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold-400">
            <span className="h-px w-[22px] bg-gold-400/50" /> Ready for takeoff
          </div>
          <h2 className="mt-5 font-display font-semibold leading-[1.02] tracking-tightest text-white" style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)' }}>
            Let&rsquo;s build something<br />that takes flight.
          </h2>
          <p className="mt-[22px] max-w-[480px] text-[17px] leading-relaxed text-white/72">
            Tell us where you want to go. We&rsquo;ll map the route, build the system, and get you climbing — fast.
          </p>
          <div className="mt-[38px] flex flex-wrap gap-3.5">
            <a href="/contact" className="inline-flex items-center gap-2.5 rounded-2xl bg-gold-400 px-7 py-4 text-[15px] font-semibold text-navy shadow-[0_14px_40px_rgba(255,201,64,0.36)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_52px_rgba(255,201,64,0.5)]">
              Start a Project <ArrowRight className="h-[18px] w-[18px]" />
            </a>
            <a href={`tel:${siteConfig.phoneRaw}`} className="inline-flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/[0.08] px-7 py-4 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.15]">
              <Phone className="h-[17px] w-[17px]" /> {siteConfig.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
