import { Star } from 'lucide-react'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import { testimonials } from '@/lib/testimonials'

export default function Testimonials() {
  return (
    <section id="voices" className="bg-[#f6f7fb] px-7 py-[120px]">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-12 max-w-[620px]">
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-navy/55">
            <span className="h-px w-[22px] bg-navy/40" /> Client voices
          </div>
          <h2 className="mt-[18px] font-display font-semibold leading-[1.02] tracking-tightest text-navy" style={{ fontSize: 'clamp(2rem,4.5vw,3.3rem)' }}>
            Trusted across four continents.
          </h2>
        </div>
        <Stagger className="grid gap-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))' }}>
          {testimonials.map((t) => (
            <StaggerItem key={t.name} className="h-full">
              <figure className="flex h-full flex-col gap-5 rounded-3xl border border-[#eceff7] bg-white p-[30px]">
                <div className="flex gap-[3px] text-gold-400">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-gold-400" />)}
                </div>
                <blockquote className="text-base font-medium leading-relaxed text-[#2a3550]">{t.quote}</blockquote>
                <figcaption className="mt-auto flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy font-display text-[15px] font-semibold text-white">{t.initials}</div>
                  <div>
                    <div className="text-[14.5px] font-semibold text-navy">{t.name}</div>
                    <div className="text-[12.5px] text-[#7a86a3]">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
