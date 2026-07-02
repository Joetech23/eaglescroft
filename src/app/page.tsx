import type { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import SolutionsShowcase from '@/components/sections/SolutionsShowcase'
import TrustLayer from '@/components/sections/TrustLayer'
import WhoWeAre from '@/components/sections/WhoWeAre'
import ServicesHover from '@/components/sections/ServicesHover'
import ScrollShowcase from '@/components/sections/ScrollShowcase'
import ProcessSection from '@/components/sections/ProcessSection'
import LivePortfolio from '@/components/sections/LivePortfolio'
import Metrics from '@/components/sections/Metrics'
import WhyEaglescroft from '@/components/sections/WhyEaglescroft'
import StudioShowcase from '@/components/sections/StudioShowcase'
import TeamSection from '@/components/sections/TeamSection'
import TestimonialsCircular from '@/components/sections/TestimonialsCircular'
import FAQSection from '@/components/sections/FAQSection'
import FinalCTA from '@/components/sections/FinalCTA'
import JsonLd from '@/components/seo/JsonLd'
import { faqs } from '@/lib/faqs'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: { absolute: 'Eaglescroft — Web Design, AI Chatbots, Automation & CRM Agency in Nigeria' },
  description:
    'Eaglescroft is a growth partner, not just a web agency. We build high-performance websites, AI chatbots, automations, GoHighLevel funnels and CRM systems for businesses in Nigeria, the UK, USA and Australia.',
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteConfig.url}/#webpage`,
  url: siteConfig.url,
  name: 'Eaglescroft — Web Design, AI Chatbots, Automation & CRM Agency',
  isPartOf: { '@id': `${siteConfig.url}/#website` },
  about: { '@id': `${siteConfig.url}/#organization` },
  inLanguage: 'en',
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={[homeJsonLd, faqJsonLd]} />
      {/* 1. Hook */}
      <Hero />
      <TrustLayer />
      {/* 2. Growth systems — we partner, not just build */}
      <SolutionsShowcase />
      {/* 3. Trust: who we are + what we do */}
      <WhoWeAre />
      <ServicesHover />
      {/* 4. Show, don't tell */}
      <ScrollShowcase />
      <LivePortfolio />
      <Metrics />
      {/* 5. How + why us */}
      <ProcessSection />
      <WhyEaglescroft />
      <StudioShowcase />
      <TeamSection />
      {/* 6. Social proof + objections + close */}
      <TestimonialsCircular />
      <FAQSection />
      <FinalCTA />
    </>
  )
}
