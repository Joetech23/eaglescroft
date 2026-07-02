import Hero from '@/components/sections/Hero'
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

export default function HomePage() {
  return (
    <>
      {/* 1. Hook */}
      <Hero />
      <TrustLayer />
      {/* 2. Trust: who we are + what we do */}
      <WhoWeAre />
      <ServicesHover />
      {/* 3. Show, don't tell */}
      <ScrollShowcase />
      <LivePortfolio />
      <Metrics />
      {/* 4. How + why us */}
      <ProcessSection />
      <WhyEaglescroft />
      <StudioShowcase />
      <TeamSection />
      {/* 5. Social proof + objections + close */}
      <TestimonialsCircular />
      <FAQSection />
      <FinalCTA />
    </>
  )
}
