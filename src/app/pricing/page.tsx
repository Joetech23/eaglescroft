import type { Metadata } from 'next'
import PageHeader from '@/components/sections/PageHeader'
import Section from '@/components/ui/Section'
import PricingTabs from '@/components/pricing/PricingTabs'
import PricingAssurance from '@/components/pricing/PricingAssurance'
import FinalCTA from '@/components/sections/FinalCTA'
import JsonLd from '@/components/seo/JsonLd'
import { pricingCategories } from '@/lib/pricing'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pricing — Websites, CRM, Automation & Video',
  description:
    'Transparent Eaglescroft pricing for website design, CRM development, business automation and video production. Clear packages in Naira, with a free consultation before every quote.',
  alternates: { canonical: '/pricing' },
}

const pricingJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'Eaglescroft Service Pricing',
  url: `${siteConfig.url}/pricing`,
  provider: { '@id': `${siteConfig.url}/#organization` },
  itemListElement: pricingCategories.map((c) => ({
    '@type': 'OfferCatalog',
    name: c.title,
    url: `${siteConfig.url}/pricing/${c.slug}`,
    itemListElement: c.tiers.map((t) => ({
      '@type': 'Offer',
      name: t.name,
      description: t.features.join('; '),
      priceCurrency: 'NGN',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'NGN',
        description: `${t.price} (${t.billing})`,
      },
      itemOffered: { '@type': 'Service', name: `${c.label} — ${t.name}`, provider: { '@id': `${siteConfig.url}/#organization` } },
    })),
  })),
}

export default function PricingPage() {
  return (
    <>
      <JsonLd data={pricingJsonLd} />
      <PageHeader
        eyebrow="Pricing"
        title={<>Digital solutions, <span className="text-gold-300">priced with clarity.</span></>}
        intro="From websites and CRM platforms to automation, content and digital experiences — explore our solutions and pricing."
      />
      <Section className="pb-8">
        <PricingTabs initial="websites" />
      </Section>
      <PricingAssurance />
      <FinalCTA />
    </>
  )
}
