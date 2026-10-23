import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ExternalLink, BookOpen, Rocket, Handshake } from 'lucide-react'
import PageHeader from '@/components/sections/PageHeader'
import Section from '@/components/ui/Section'
import FinalCTA from '@/components/sections/FinalCTA'
import JsonLd from '@/components/seo/JsonLd'
import { StatusPill, FeatureBadge, ProgressMeter } from '@/components/products/ProductBits'
import { products, getProduct, productPriceLabel, formatProductDate } from '@/lib/products'
import { siteConfig } from '@/lib/site'

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProduct(params.slug)
  if (!p) return { title: 'Products' }
  return {
    title: `${p.name} — ${p.tagline.replace(/\.$/, '')}`,
    description: p.summary,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: `${p.name} — ${siteConfig.name}`, description: p.summary },
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug)
  if (!p) notFound()

  const offers =
    p.pricing === 'free'
      ? { '@type': 'Offer', price: 0, priceCurrency: 'USD' }
      : p.pricing === 'coming-soon'
        ? undefined
        : { '@type': 'Offer', price: p.pricing.price.min, priceCurrency: p.pricing.price.currency }

  const appJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: p.name,
    description: p.summary,
    url: `${siteConfig.url}/products/${p.slug}`,
    applicationCategory: p.appCategory,
    operatingSystem: 'Web',
    ...(p.releases[0] ? { softwareVersion: p.releases[0].version } : {}),
    publisher: { '@id': `${siteConfig.url}/#organization` },
    featureList: p.features.filter((f) => f.status === 'shipped').map((f) => f.title).join(', '),
    ...(offers ? { offers } : {}),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${siteConfig.url}/products` },
      { '@type': 'ListItem', position: 3, name: p.name, item: `${siteConfig.url}/products/${p.slug}` },
    ],
  }

  const pricing = typeof p.pricing === 'object' ? p.pricing : null
  const ctaHref = p.links.live ?? '/contact'
  const ctaLabel = p.links.live ? `Open ${p.name}` : p.status === 'building' ? 'Join the early-access list' : 'Request access'

  return (
    <>
      <JsonLd data={[appJsonLd, breadcrumbJsonLd]} />
      <PageHeader eyebrow={p.category} title={p.name} intro={p.tagline} />

      <Section className="pb-10">
        <div className="container-x">
          <Link href="/products" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-navy/60 transition-colors hover:text-navy">
            <ArrowLeft className="h-4 w-4" /> All products
          </Link>

          <div className="grid items-start gap-10 lg:grid-cols-[1.45fr_1fr]">
            {/* main column */}
            <div className="space-y-12">
              <div>
                <h2 className="font-display text-2xl font-semibold text-navy">Overview</h2>
                <p className="mt-4 text-[16px] leading-relaxed text-[#48526e]">{p.summary}</p>
                <p className="mt-3 text-[14px] text-navy/55"><span className="font-semibold text-navy/75">Built for:</span> {p.audience}</p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold text-navy">Features</h2>
                <ul className="mt-5 divide-y divide-navy/[0.07] rounded-[20px] border border-navy/10 bg-white shadow-soft">
                  {p.features.map((f) => (
                    <li key={f.title} className="flex items-center justify-between gap-4 px-5 py-3.5 text-[14.5px] text-navy/80">
                      {f.title}
                      <FeatureBadge status={f.status} />
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="flex items-center gap-2.5 font-display text-2xl font-semibold text-navy">
                  <BookOpen className="h-5 w-5 text-gold-500" /> Documentation
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {p.docs.map((d, i) => (
                    <div key={d.title} className="rounded-[18px] border border-navy/10 bg-[#f6f8fc] p-5">
                      <div className="font-mono text-[10.5px] text-navy/40">{String(i + 1).padStart(2, '0')}</div>
                      <h3 className="mt-1 font-display text-[16px] font-semibold text-navy">{d.title}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-[#48526e]">{d.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="flex items-center gap-2.5 font-display text-2xl font-semibold text-navy">
                  <Rocket className="h-5 w-5 text-gold-500" /> Releases
                </h2>
                <ol className="mt-6 space-y-6 border-l border-navy/10 pl-6">
                  {p.releases.map((r) => (
                    <li key={r.version} className="relative">
                      <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-gold-400 shadow-gold" />
                      <div className="flex flex-wrap items-baseline gap-3">
                        <span className="font-display text-[17px] font-semibold text-navy">{r.version}</span>
                        <span className="font-mono text-[11px] text-navy/45">{formatProductDate(r.date)}</span>
                      </div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-[#48526e]">
                        {r.notes.map((n) => <li key={n}>{n}</li>)}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-28">
              <div className="rounded-[22px] border border-navy/10 bg-white p-6 shadow-medium">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10.5px] uppercase tracking-wider text-navy/45">Status</span>
                  <StatusPill status={p.status} />
                </div>
                <ProgressMeter value={p.progress} updated={formatProductDate(p.progressUpdatedAt)} className="mt-5" />

                <div className="mt-6 border-t border-navy/[0.08] pt-5">
                  <div className="font-mono text-[10.5px] uppercase tracking-wider text-navy/45">Pricing</div>
                  <div className="mt-1.5 font-display text-[26px] font-semibold leading-none text-navy">{productPriceLabel(p)}</div>
                  {pricing && <div className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-navy/45">{pricing.billing}</div>}
                  {pricing?.note && <p className="mt-2 text-[13px] text-navy/60">{pricing.note}</p>}
                  {p.pricing === 'coming-soon' && <p className="mt-2 text-[13px] text-navy/60">Early partners get launch pricing locked in.</p>}
                </div>

                <a
                  href={ctaHref}
                  {...(p.links.live ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
                  style={{ background: 'linear-gradient(180deg,#3b76f0,#1d4ed8)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 10px 24px -6px rgba(37,99,235,0.5)' }}
                >
                  {ctaLabel}
                  {p.links.live ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </a>
              </div>

              <div className="rounded-[22px] border border-navy/10 bg-white p-6 shadow-soft">
                <div className="font-mono text-[10.5px] uppercase tracking-wider text-navy/45">Built with</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span key={s} className="rounded-full border border-navy/10 bg-navy/[0.03] px-3 py-1 text-[12.5px] text-navy/70">{s}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-navy/10 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-wider text-navy/45">
                  <Handshake className="h-3.5 w-3.5" /> Partners
                </div>
                {p.partners.length ? (
                  <ul className="mt-3 space-y-2">
                    {p.partners.map((pt) => (
                      <li key={pt.name} className="text-[14px] text-navy/80">
                        <span className="font-semibold">{pt.name}</span> — {pt.role}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-[13.5px] leading-relaxed text-navy/60">
                    We&rsquo;re onboarding pilot and distribution partners for {p.name}.{' '}
                    <Link href="/contact" className="font-semibold text-gold-500 hover:underline">Partner with us →</Link>
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </Section>
      <FinalCTA />
    </>
  )
}
