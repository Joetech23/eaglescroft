import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Check } from 'lucide-react'
import { projects, getProject, shot } from '@/lib/projects'
import Section from '@/components/ui/Section'
import FinalCTA from '@/components/sections/FinalCTA'
import Button from '@/components/ui/Button'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProject(params.slug)
  if (!p) return { title: 'Case Study' }
  return { title: `${p.title} — Case Study`, description: p.description }
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug)
  if (!project) notFound()

  const cs = project.caseStudy
  const hasShot = project.category === 'website' && project.url

  return (
    <>
      <section className="relative overflow-hidden bg-brand-deep pb-16 pt-36 text-white md:pt-44">
        <div className="pointer-events-none absolute inset-0 bg-brand-glow" />
        <div className="container-x relative">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-gold-400">
            <ArrowLeft className="h-4 w-4" /> Back to work
          </Link>
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gold-400">{project.industry}</span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tightest md:text-6xl">{project.title}</h1>
              <p className="mt-4 max-w-2xl text-base text-white/70 md:text-lg">{project.description}</p>
            </div>
            {project.url && (
              <Button href={`https://${project.url}`} variant="gold" className="shrink-0">
                Visit Site <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Hero preview */}
      <div className="container-x -mt-8 md:-mt-12">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-navy-50 shadow-large">
          {hasShot ? (
            <Image
              src={shot(project.url)}
              alt={project.title}
              width={1600}
              height={1000}
              unoptimized
              className="w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center bg-brand-deep">
              <span className="text-2xl font-semibold text-white/30">{project.title} — preview coming soon</span>
            </div>
          )}
        </div>
      </div>

      <Section>
        <div className="container-x grid gap-12 lg:grid-cols-3">
          {/* Sidebar */}
          <aside className="space-y-6 lg:col-span-1">
            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-soft">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-navy/50">Tech Stack</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span key={s} className="rounded-full border border-navy/10 bg-navy-50 px-3 py-1 text-xs font-medium text-navy/70">{s}</span>
                ))}
              </div>
              <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-navy/50">Industry</h3>
              <p className="mt-2 text-sm font-medium text-navy">{project.industry}</p>
            </div>
          </aside>

          {/* Body */}
          <div className="space-y-10 lg:col-span-2">
            {cs ? (
              <>
                <div>
                  <h2 className="text-2xl font-semibold text-navy">The Problem</h2>
                  <p className="mt-3 leading-relaxed text-navy/70">{cs.problem}</p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-navy">The Solution</h2>
                  <p className="mt-3 leading-relaxed text-navy/70">{cs.solution}</p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-navy">Our Process</h2>
                  <ol className="mt-4 space-y-3">
                    {cs.process.map((p, i) => (
                      <li key={p} className="flex items-start gap-3 text-navy/75">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">{i + 1}</span>
                        {p}
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-navy">The Results</h2>
                  <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {cs.results.map((r) => (
                      <div key={r.label} className="rounded-2xl border border-navy/10 bg-navy-50/50 p-5 text-center">
                        <div className="text-2xl font-semibold text-gold-500">{r.value}</div>
                        <p className="mt-1 text-xs text-navy/60">{r.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-navy/10 bg-navy-50/40 p-8">
                <h2 className="text-2xl font-semibold text-navy">Project Highlights</h2>
                <ul className="mt-5 space-y-3">
                  {project.stack.map((s) => (
                    <li key={s} className="flex items-center gap-3 text-navy/75">
                      <Check className="h-5 w-5 text-gold-500" /> Built with {s}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-navy/60">
                  A detailed case study for this project is on the way. {project.url && 'In the meantime, explore the live site above.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>

      <FinalCTA />
    </>
  )
}
