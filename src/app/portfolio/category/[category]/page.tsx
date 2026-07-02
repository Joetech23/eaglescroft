import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageHeader from '@/components/sections/PageHeader'
import Section from '@/components/ui/Section'
import PortfolioGrid from '@/components/portfolio/PortfolioGrid'
import FinalCTA from '@/components/sections/FinalCTA'
import JsonLd from '@/components/seo/JsonLd'
import { portfolioCategories, getCategory } from '@/lib/categories'
import { projects } from '@/lib/projects'
import { siteConfig } from '@/lib/site'

export function generateStaticParams() {
  return portfolioCategories.map((c) => ({ category: c.slug }))
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const cat = getCategory(params.category)
  if (!cat) return { title: 'Work' }
  return {
    title: cat.title,
    description: cat.description,
    alternates: { canonical: `/portfolio/category/${cat.slug}` },
    openGraph: { title: `${cat.title} — ${siteConfig.name}`, description: cat.description },
  }
}

export default function PortfolioCategoryPage({ params }: { params: { category: string } }) {
  const cat = getCategory(params.category)
  if (!cat) notFound()

  const items = projects.filter((p) => p.category === cat.category)

  const listJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cat.title,
    description: cat.description,
    url: `${siteConfig.url}/portfolio/category/${cat.slug}`,
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        url: `${siteConfig.url}/portfolio/${p.slug}`,
      })),
    },
  }

  return (
    <>
      <JsonLd data={listJsonLd} />
      <PageHeader
        eyebrow={cat.label}
        title={<>{cat.label} that <span className="text-gold-300">deliver results.</span></>}
        intro={cat.description}
      />
      <Section>
        <PortfolioGrid active={cat.category} />
      </Section>
      <FinalCTA />
    </>
  )
}
