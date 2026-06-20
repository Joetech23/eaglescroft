'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Marquee } from '@/components/ui/3d-testimonials'
import { testimonials, type Testimonial } from '@/lib/testimonials'

function TestimonialCard({ img, name, role, quote, initials, country }: Testimonial) {
  return (
    <Card className="w-64 border-navy/10 bg-white shadow-soft">
      <CardContent className="p-5">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            {img && <AvatarImage src={img} alt={name} />}
            <AvatarFallback className="bg-navy text-xs font-semibold text-white">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="flex items-center gap-1 text-sm font-semibold text-navy">
              {name} {country && <span className="text-xs">{country}</span>}
            </figcaption>
            <p className="text-xs font-medium text-navy/45">{role}</p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm leading-relaxed text-[#2a3550]">{quote}</blockquote>
      </CardContent>
    </Card>
  )
}

export default function TestimonialsMarquee() {
  const fade = 'from-[#000a22]'
  return (
    <section
      id="voices"
      className="relative overflow-hidden px-7 py-[120px]"
      style={{ background: 'linear-gradient(160deg,#000615 0%,#00102f 55%,#000a22 100%)' }}
    >
      <div className="mx-auto mb-12 max-w-[1280px] text-center">
        <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold-400">
          <span className="h-px w-[22px] bg-gold-400/50" /> Client voices
        </div>
        <h2 className="mt-4 font-display font-semibold leading-[1.04] tracking-tightest text-white" style={{ fontSize: 'clamp(2rem,4.5vw,3.3rem)' }}>
          Trusted across four continents.
        </h2>
      </div>

      <div className="relative mx-auto flex h-[460px] w-full max-w-[1100px] flex-row items-center justify-center gap-1.5 overflow-hidden [perspective:320px]">
        <div
          className="flex flex-row items-center gap-3"
          style={{ transform: 'translateX(0px) translateY(0px) translateZ(-120px) rotateX(18deg) rotateY(-8deg) rotateZ(18deg)' }}
        >
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:46s]">
            {testimonials.map((t) => <TestimonialCard key={t.name + '1'} {...t} />)}
          </Marquee>
          <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:46s]">
            {testimonials.map((t) => <TestimonialCard key={t.name + '2'} {...t} />)}
          </Marquee>
          <Marquee vertical pauseOnHover repeat={3} className="hidden [--duration:52s] md:flex">
            {testimonials.map((t) => <TestimonialCard key={t.name + '3'} {...t} />)}
          </Marquee>
          <Marquee vertical pauseOnHover reverse repeat={3} className="hidden [--duration:52s] lg:flex">
            {testimonials.map((t) => <TestimonialCard key={t.name + '4'} {...t} />)}
          </Marquee>
        </div>
        {/* edge fades to section bg */}
        <div className={`pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b ${fade}`} />
        <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t ${fade}`} />
        <div className={`pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r ${fade}`} />
        <div className={`pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l ${fade}`} />
      </div>
    </section>
  )
}
