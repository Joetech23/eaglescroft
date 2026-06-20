import Hero from '@/components/sections/Hero'
import ScrollShowcase from '@/components/sections/ScrollShowcase'
import TrustLayer from '@/components/sections/TrustLayer'
import ServicesHover from '@/components/sections/ServicesHover'
import ProcessSection from '@/components/sections/ProcessSection'
import LivePortfolio from '@/components/sections/LivePortfolio'
import Metrics from '@/components/sections/Metrics'
import StudioShowcase from '@/components/sections/StudioShowcase'
import TeamSection from '@/components/sections/TeamSection'
import WhyEaglescroft from '@/components/sections/WhyEaglescroft'
import TestimonialsCircular from '@/components/sections/TestimonialsCircular'
import FinalCTA from '@/components/sections/FinalCTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollShowcase />
      <TrustLayer />
      <ServicesHover />
      <ProcessSection />
      <LivePortfolio />
      <Metrics />
      <StudioShowcase />
      <TeamSection />
      <WhyEaglescroft />
      <TestimonialsCircular />
      <FinalCTA />
    </>
  )
}
