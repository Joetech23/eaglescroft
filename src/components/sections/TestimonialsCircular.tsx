'use client'

import { CircularTestimonials } from '@/components/ui/circular-testimonials'

const testimonials = [
  {
    quote:
      'Eaglescroft rebuilt our marketplace from the ground up. Vendor onboarding is effortless and the platform just doesn’t go down. They think like partners, not vendors.',
    name: 'Adaeze Okafor',
    designation: 'Founder, Afribabah',
    src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1200&auto=format&fit=crop',
  },
  {
    quote:
      'Sharp engineering with genuine design taste. Our site loads instantly and converts far better than the old one — the numbers speak for themselves.',
    name: 'James Whitfield',
    designation: 'Director, Oval Sports Australia',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
  },
  {
    quote:
      'They understood our healthcare trust signals immediately. The booking flow is seamless and patients actually use it. Exceptional delivery throughout.',
    name: 'Dr. Ibrahim Kalu',
    designation: 'Administrator, Heritage Hospitals',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    quote:
      'From brand identity to a fully booked fleet site — premium work, on time, no hand-holding. Eaglescroft raised our entire image.',
    name: 'Sophie Laurent',
    designation: 'CMO, Distinct News',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop',
  },
]

export default function TestimonialsCircular() {
  return (
    <section id="voices" className="bg-[#f6f7fb] px-7 py-[120px]">
      <div className="mx-auto mb-6 max-w-[1280px] text-center">
        <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-navy/55">
          <span className="h-px w-[22px] bg-navy/40" /> Client voices
        </div>
        <h2 className="mt-4 font-display font-semibold leading-[1.04] tracking-tight text-navy" style={{ fontSize: 'clamp(2rem,4.5vw,3.3rem)' }}>
          Trusted across four continents.
        </h2>
      </div>

      <div className="flex items-center justify-center">
        <CircularTestimonials
          testimonials={testimonials}
          autoplay
          colors={{
            name: '#001e60',
            designation: '#5a6685',
            testimony: '#2a3550',
            arrowBackground: '#001e60',
            arrowForeground: '#ffffff',
            arrowHoverBackground: '#FFC940',
          }}
          fontSizes={{ name: '26px', designation: '16px', quote: '19px' }}
        />
      </div>
    </section>
  )
}
