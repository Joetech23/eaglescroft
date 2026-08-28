import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageHeader from '@/components/sections/PageHeader'
import Section from '@/components/ui/Section'
import PricingTabs from '@/components/pricing/PricingTabs'
import PricingAssurance from '@/components/pricing/PricingAssurance'
import FinalCTA from '@/components/sections/FinalCTA'
import JsonLd from '@/components/seo/JsonLd'
import { pricingCategories, getPricingCategory } from '@/lib/pricing'
import { siteConfig } from '@/lib/site'

export function generateStaticParams() {
  return pricingCategories.map((c) => ({ category: c.slug }))
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const cat = getPricingCategory(params.category)
  if (!cat) return { title: 'Pricing' }
  return {
    title: cat.title,
    description: cat.description,
    alternates: { canonical: `/pricing/${cat.slug}` },
    openGraph: { title: `${cat.title} — ${siteConfig.name}`, description: cat.description },
  }
}

export default function PricingCategoryPage({ params }: { params: { category: string } }) {
  const cat = getPricingCategory(params.category)
  if (!cat) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: cat.title,
    description: cat.description,
    url: `${siteConfig.url}/pricing/${cat.slug}`,
    provider: { '@id': `${siteConfig.url}/#organization` },
    areaServed: ['Nigeria', 'United Kingdom', 'United States', 'Australia'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${cat.label} packages`,
      itemListElement: cat.tiers.map((t) => ({
        '@type': 'Offer',
        name: t.name,
        description: t.features.join('; '),
        priceCurrency: 'NGN',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'NGN',
          description: `${t.price} (${t.billing})`,
        },
      })),
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Pricing', item: `${siteConfig.url}/pricing` },
      { '@type': 'ListItem', position: 3, name: cat.label, item: `${siteConfig.url}/pricing/${cat.slug}` },
    ],
  }

  return (
    <>
      <JsonLd data={[jsonLd, breadcrumbJsonLd]} />
      <PageHeader
        eyebrow={`${cat.label} Pricing`}
        title={<>{cat.headline.replace(/\.$/, '')}<span className="text-gold-300">.</span></>}
        intro={cat.description}
      />
      <Section className="pb-8">
        <PricingTabs initial={cat.slug} />
      </Section>
      <PricingAssurance />
      <FinalCTA />
    </>
  )
}
