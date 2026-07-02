import type { Metadata } from 'next'
import PageHeader from '@/components/sections/PageHeader'
import Section from '@/components/ui/Section'
import PortfolioGrid from '@/components/portfolio/PortfolioGrid'
import FinalCTA from '@/components/sections/FinalCTA'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected work by Eaglescroft — websites, video editing, and social media campaigns delivered for clients across 9+ industries and 4+ countries.',
}

export default function PortfolioPage() {
  return (
    <>
      <PageHeader
        eyebrow="Selected Work"
        title={<>Work that <span className="text-gold-300">speaks for itself.</span></>}
        intro="Real projects across websites, video, and social — engineered for performance and built to convert."
      />
      <Section>
        <PortfolioGrid />
      </Section>
      <FinalCTA />
    </>
  )
}
