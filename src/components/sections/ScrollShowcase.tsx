'use client'

/* eslint-disable @next/next/no-img-element */
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { shot } from '@/lib/projects'

export default function ScrollShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#f6f7fb]">
      <div className="-mb-40 md:-mb-72">
        <ContainerScroll
          titleComponent={
            <div className="pb-2">
              <div className="mx-auto inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-navy/55">
                <span className="h-px w-[22px] bg-navy/40" /> Built to perform
              </div>
              <h2 className="mt-4 font-display font-semibold leading-[1.04] tracking-tightest text-navy" style={{ fontSize: 'clamp(2rem,5vw,3.6rem)' }}>
                Websites that look the part —<br />
                <span className="text-transparent" style={{ background: 'linear-gradient(100deg,#001e60,#2a3f8f)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                  and pull their weight.
                </span>
              </h2>
            </div>
          }
        >
          <img
            src={shot('afribabah.com')}
            alt="A live Eaglescroft project"
            className="mx-auto h-full w-full rounded-2xl object-cover object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </section>
  )
}
