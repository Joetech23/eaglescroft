import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import PageHeader from '@/components/sections/PageHeader'
import Section from '@/components/ui/Section'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import FinalCTA from '@/components/sections/FinalCTA'
import { services } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Web development, UI/UX design, branding, video & motion, social media, digital marketing & SEO, and IT management — delivered by Eaglescroft.',
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Services"
        title={<>Everything you need to <span className="text-gold-300">win online.</span></>}
        intro="Seven disciplines, one accountable partner. We engineer, design, and grow — so your business performs at every touchpoint."
      />

      <Section>
        <div className="container-x space-y-6">
          {services.map((s, idx) => {
            const Icon = s.icon
            return (
              <StaggerItem key={s.slug}>
                <div id={s.slug} className="scroll-mt-28 grid items-start gap-8 rounded-[2rem] border border-navy/10 bg-white p-8 shadow-soft md:grid-cols-12 md:p-10">
                  <div className="md:col-span-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-semibold text-gold-500">0{idx + 1}</span>
                    </div>
                    <h2 className="mt-5 text-2xl font-semibold text-navy">{s.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-navy/60">{s.description}</p>
                  </div>

                  <div className="md:col-span-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-navy/50">What you get</h3>
                    <ul className="mt-4 space-y-2.5">
                      {s.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2.5 text-sm text-navy/75">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" /> {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-navy/50">Our process</h3>
                    <ol className="mt-4 space-y-3">
                      {s.process.map((p, i) => (
                        <li key={p} className="flex items-center gap-3 text-sm text-navy/75">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-navy">{i + 1}</span>
                          {p}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </div>
      </Section>

      <FinalCTA />
    </>
  )
}
