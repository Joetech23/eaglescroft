import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { posts, getPost, formatDate } from '@/lib/posts'
import FinalCTA from '@/components/sections/FinalCTA'

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug)
  if (!post) return { title: 'Insight' }
  return { title: post.title, description: post.excerpt }
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()

  return (
    <>
      <article className="relative">
        <header className="relative overflow-hidden bg-brand-deep pb-16 pt-36 text-white md:pt-44">
          <div className="pointer-events-none absolute inset-0 bg-brand-glow" />
          <div className="container-x relative max-w-3xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-gold-400">
              <ArrowLeft className="h-4 w-4" /> All insights
            </Link>
            <div className="mt-7 flex items-center gap-3 text-xs text-white/60">
              <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-gold-400">{post.category}</span>
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
            <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tightest md:text-5xl">{post.title}</h1>
          </div>
        </header>

        <div className="container-x max-w-3xl py-16">
          <div className="space-y-6">
            <p className="text-lg font-medium leading-relaxed text-navy/80">{post.excerpt}</p>
            {post.body.map((para, i) => (
              <p key={i} className="leading-relaxed text-navy/70">{para}</p>
            ))}
          </div>
        </div>
      </article>

      <FinalCTA />
    </>
  )
}
