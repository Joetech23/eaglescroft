'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'
import { projects, type ProjectCategory } from '@/lib/projects'
import { portfolioCategories } from '@/lib/categories'
import { cn } from '@/lib/utils'

/**
 * Category tabs are real links (/portfolio/category/[slug]) so every
 * category has a crawlable, shareable URL.
 */
export default function PortfolioGrid({ active = 'all' }: { active?: ProjectCategory | 'all' }) {
  const visible = active === 'all' ? projects : projects.filter((p) => p.category === active)

  const counts: Record<string, number> = { all: projects.length }
  projects.forEach((p) => (counts[p.category] = (counts[p.category] || 0) + 1))

  const tabs = [
    { href: '/portfolio', label: 'All Work', key: 'all' as const, count: counts.all },
    ...portfolioCategories.map((c) => ({
      href: `/portfolio/category/${c.slug}`,
      label: c.label,
      key: c.category,
      count: counts[c.category] || 0,
    })),
  ]

  return (
    <div className="container-x">
      {/* Category links */}
      <nav aria-label="Portfolio categories" className="mx-auto mb-12 flex w-fit flex-wrap justify-center gap-2 rounded-full border border-navy/10 bg-white p-1.5 shadow-soft">
        {tabs.map((t) => {
          const isActive = t.key === active
          return (
            <Link
              key={t.key}
              href={t.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'text-white' : 'text-navy/60 hover:text-navy',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="portfolio-cat-pill"
                  className="absolute inset-0 rounded-full bg-navy"
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {t.label} <span className="ml-1 font-mono text-[11px] opacity-60">{t.count}</span>
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProjectCard project={p} priority={i < 3} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
