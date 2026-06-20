import Section, { SectionHeading } from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import ProjectCard from '@/components/portfolio/ProjectCard'
import { featuredProjects } from '@/lib/projects'

export default function FeaturedProjects() {
  return (
    <Section className="bg-navy-50/40">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Selected Work"
            title={<>Real projects.<br /><span className="text-gradient">Real results.</span></>}
          />
          <Button href="/portfolio" variant="ghost" withArrow className="shrink-0">View all work</Button>
        </div>

        <Stagger className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.slice(0, 6).map((p, i) => (
            <StaggerItem key={p.slug} className="h-full">
              <ProjectCard project={p} priority={i < 3} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}
