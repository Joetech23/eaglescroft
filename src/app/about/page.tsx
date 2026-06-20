import type { Metadata } from 'next'
import { Globe, Target, Rocket, Layers } from 'lucide-react'
import PageHeader from '@/components/sections/PageHeader'
import Section, { SectionHeading } from '@/components/ui/Section'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import FinalCTA from '@/components/sections/FinalCTA'
import Metrics from '@/components/sections/Metrics'
import { countries } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Eaglescroft is a global digital agency founded by Joshua Obaje Enemaku, uniting full-stack engineering, design, and strategy across Nigeria, the UK, USA, and Australia.',
}

const values = [
  { icon: Target, title: 'Results First', body: 'Every pixel and line of code serves a measurable business outcome.' },
  { icon: Layers, title: 'Craft & Depth', body: 'Engineering rigour meets genuine design taste — no shortcuts.' },
  { icon: Rocket, title: 'Built to Scale', body: 'Architecture that grows with you, from startup to enterprise.' },
  { icon: Globe, title: 'Global Standard', body: 'We deliver world-class work from Abuja to the rest of the world.' },
]

const skills = [
  'Next.js & React', 'Node.js & Express', 'WordPress & WooCommerce', 'TailwindCSS',
  'AI Agents & Automation', 'Technical SEO', 'UI/UX & Figma', 'Brand Strategy',
  'Python & Django', 'MongoDB & MySQL', 'Shopify & Webflow', 'Performance Optimisation',
]

const timeline = [
  { year: '2021', title: 'Eaglescroft Founded', body: 'Launched as a results-driven digital consulting agency.' },
  { year: '2023', title: 'Going Global', body: 'Expanded delivery across Nigeria, the UK, USA, and Australia.' },
  { year: '2025', title: 'AI & Scale', body: 'Engineering AI automation pipelines and serving clients in 6+ countries.' },
  { year: 'Today', title: '12+ Sites, 9+ Industries', body: 'Delivering high-performance products with 99% client satisfaction.' },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Eaglescroft"
        title={<>We help businesses <span className="text-gold-400">fly online.</span></>}
        intro="A global digital agency uniting engineering depth, design sensibility, and commercial strategy to build products that deliver lasting impact."
      />

      <Section>
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our Story" title="Founder-led. Engineering-driven." />
            <div className="mt-6 space-y-5 text-base leading-relaxed text-navy/70">
              <p>
                Eaglescroft was founded by <strong className="text-navy">Joshua Obaje Enemaku</strong>, a
                multi-disciplinary technologist and entrepreneur, on a simple belief: businesses deserve
                digital products that are as strategic as they are beautiful.
              </p>
              <p>
                With 4+ years delivering high-performance solutions for clients across four continents,
                we fuse full-stack development, AI automation, and design to transform complex business
                challenges into scalable, user-centric products.
              </p>
              <p>
                From multi-vendor marketplaces to healthcare platforms and luxury brands, we’ve shipped
                12+ websites across 9+ industries — always on time, always built to perform.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-3xl border border-navy/10 bg-white p-6 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-navy">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy/60">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Metrics />

      {/* Timeline */}
      <Section className="bg-navy-50/40">
        <div className="container-x">
          <SectionHeading eyebrow="The Journey" title="From Abuja to the world" center />
          <Stagger className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-4">
            {timeline.map((t) => (
              <StaggerItem key={t.year}>
                <div className="h-full rounded-3xl border border-navy/10 bg-white p-6 shadow-soft">
                  <span className="text-2xl font-semibold text-gold-500">{t.year}</span>
                  <h3 className="mt-3 font-semibold text-navy">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy/60">{t.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Capabilities + presence */}
      <Section>
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Capabilities" title="A deep, modern toolkit" />
            <div className="mt-8 flex flex-wrap gap-3">
              {skills.map((s) => (
                <span key={s} className="rounded-full border border-navy/10 bg-navy-50 px-4 py-2 text-sm font-medium text-navy/75">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Global Presence" title="Operating across 4 countries" />
            <div className="mt-8 grid grid-cols-2 gap-4">
              {countries.map((c) => (
                <div key={c} className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-white p-5 shadow-soft">
                  <Globe className="h-5 w-5 text-gold-500" />
                  <span className="font-medium text-navy">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <FinalCTA />
    </>
  )
}
