import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import PageHeader from '@/components/sections/PageHeader'
import Section from '@/components/ui/Section'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import FinalCTA from '@/components/sections/FinalCTA'
import { posts, formatDate } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Ideas on engineering, design, SEO, and AI automation from the Eaglescroft team.',
}

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title={<>Ideas that <span className="text-gold-300">drive results.</span></>}
        intro="Practical thinking on engineering, design, growth, and AI — from the team building it every day."
      />

      <Section>
        <Stagger className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StaggerItem key={post.slug} className="h-full">
              <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col rounded-3xl border border-navy/10 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-large">
                <div className="flex items-center gap-3 text-xs text-navy/45">
                  <span className="rounded-full bg-navy-50 px-3 py-1 font-semibold text-navy/70">{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="mt-5 text-xl font-semibold leading-snug text-navy">{post.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-navy/60">{post.excerpt}</p>
                <div className="mt-6 flex items-center justify-between border-t border-navy/10 pt-5">
                  <span className="text-xs text-navy/45">{formatDate(post.date)}</span>
                  <ArrowUpRight className="h-5 w-5 text-navy/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-500" />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <FinalCTA />
    </>
  )
}
