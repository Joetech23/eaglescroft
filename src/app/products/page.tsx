import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Handshake } from 'lucide-react'
import PageHeader from '@/components/sections/PageHeader'
import Section from '@/components/ui/Section'
import FinalCTA from '@/components/sections/FinalCTA'
import JsonLd from '@/components/seo/JsonLd'
import { StatusPill, ProgressMeter } from '@/components/products/ProductBits'
import { products, productPriceLabel, formatProductDate } from '@/lib/products'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Products — Software We Build & Ship',
  description:
    'The products Eaglescroft builds in-house — CallCapture AI, GradeIt and Hidden in My Heart. Live progress, features, documentation, pricing and release notes for each.',
  alternates: { canonical: '/products' },
}

const listJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Eaglescroft products',
  url: `${siteConfig.url}/products`,
  itemListElement: products.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `${siteConfig.url}/products/${p.slug}`,
    name: p.name,
  })),
}

export default function ProductsPage() {
  return (
    <>
      <JsonLd data={listJsonLd} />
      <PageHeader
        eyebrow="Products"
        title={<>Products we build, <span className="text-gold-300">and ship.</span></>}
        intro="Alongside client work, we build our own software. Here is everything in our studio — with honest progress, what's shipped, what's next and how to get early access."
      />

      <Section className="pb-10">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group flex flex-col rounded-[24px] border border-navy/10 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-medium"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl font-display text-lg font-semibold text-white"
                    style={{ background: p.accent }}
                    aria-hidden
                  >
                    {p.name[0]}
                  </span>
                  <StatusPill status={p.status} />
                </div>
                <div className="mt-5 font-mono text-[10.5px] uppercase tracking-wider text-navy/45">{p.category}</div>
                <h2 className="mt-1.5 font-display text-[22px] font-semibold text-navy">{p.name}</h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[#48526e]">{p.tagline}</p>

                <ul className="mt-5 space-y-2">
                  {p.features.filter((f) => f.status === 'shipped').slice(0, 3).map((f) => (
                    <li key={f.title} className="flex items-start gap-2 text-[13.5px] text-navy/75">
                      <Check className="mt-0.5 h-4 w-4 flex-none text-gold-500" /> {f.title}
                    </li>
                  ))}
                </ul>

                <ProgressMeter value={p.progress} updated={formatProductDate(p.progressUpdatedAt)} className="mt-6" />

                <div className="mt-6 flex items-center justify-between border-t border-navy/[0.08] pt-5">
                  <div>
                    <div className="font-display text-[17px] font-semibold text-navy">{productPriceLabel(p)}</div>
                    <div className="font-mono text-[10.5px] uppercase tracking-wide text-navy/45">
                      {typeof p.pricing === 'object' ? p.pricing.billing : p.releases[0] ? `Latest: ${p.releases[0].version}` : null}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-500">
                    Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* partnerships */}
      <Section className="pt-6">
        <div className="container-x">
          <div className="section-dark relative overflow-hidden rounded-[28px] px-7 py-12 sm:px-12">
            <div className="bg-dots-dark pointer-events-none absolute inset-0 opacity-50" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <span className="chip-dark"><Handshake className="h-3.5 w-3.5" /> Partnerships</span>
                <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-white md:text-4xl">
                  Build, pilot or distribute with us.
                </h2>
                <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-white/65">
                  We partner with schools, exam bodies, service businesses and technology companies — as pilot
                  customers, resellers or integration partners. If one of our products fits your market, let&rsquo;s talk.
                </p>
              </div>
              <ul className="space-y-3">
                {['Pilot partners get early access & founder support', 'Reseller and white-label arrangements', 'API and integration partnerships'].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[14.5px] text-white/80">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-gold-300" /> {t}
                  </li>
                ))}
                <li className="pt-3">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
                    style={{ background: 'linear-gradient(180deg,#3b76f0,#1d4ed8)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 10px 24px -6px rgba(37,99,235,0.5)' }}
                  >
                    Become a partner <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
      <FinalCTA />
    </>
  )
}
