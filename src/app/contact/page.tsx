import type { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock, CalendarCheck } from 'lucide-react'
import PageHeader from '@/components/sections/PageHeader'
import Section from '@/components/ui/Section'
import ContactForm from '@/components/sections/ContactForm'
import { siteConfig, countries } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a project with Eaglescroft. Tell us your goals and we’ll engineer the digital experience that gets you there.',
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in Touch"
        title={<>Let’s build something <span className="text-gold-400">exceptional.</span></>}
        intro="Tell us about your project. We respond within 24 hours and love an ambitious brief."
      />

      <Section>
        <div className="container-x grid gap-10 lg:grid-cols-5">
          {/* Info column */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-navy">Talk to us directly</h2>
            <p className="mt-3 text-sm leading-relaxed text-navy/60">
              Prefer email or a call? Reach out any time — we work across {countries.length} countries and flexible time zones.
            </p>

            <div className="mt-8 space-y-4">
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-4 rounded-2xl border border-navy/10 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-medium">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white"><Mail className="h-5 w-5" /></span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-navy/45">Email</span>
                  <span className="block text-sm font-medium text-navy">{siteConfig.email}</span>
                </span>
              </a>
              {siteConfig.phones.map((p) => (
                <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="flex items-center gap-4 rounded-2xl border border-navy/10 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-medium">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white"><Phone className="h-5 w-5" /></span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-navy/45">Phone</span>
                    <span className="block text-sm font-medium text-navy">{p}</span>
                  </span>
                </a>
              ))}
              <div className="flex items-center gap-4 rounded-2xl border border-navy/10 bg-white p-5 shadow-soft">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white"><MapPin className="h-5 w-5" /></span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-navy/45">Location</span>
                  <span className="block text-sm font-medium text-navy">{siteConfig.location}</span>
                </span>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-navy/10 bg-white p-5 shadow-soft">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white"><Clock className="h-5 w-5" /></span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-navy/45">Response time</span>
                  <span className="block text-sm font-medium text-navy">Within 24 hours</span>
                </span>
              </div>
            </div>

            {siteConfig.calendly && (
              <a href={siteConfig.calendly} target="_blank" rel="noopener noreferrer"
                className="mt-4 flex items-center gap-4 rounded-2xl border border-gold-400 bg-gold-50 p-5 transition-all hover:-translate-y-0.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-400 text-navy"><CalendarCheck className="h-5 w-5" /></span>
                <span className="text-sm font-semibold text-navy">Book a discovery call →</span>
              </a>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  )
}
