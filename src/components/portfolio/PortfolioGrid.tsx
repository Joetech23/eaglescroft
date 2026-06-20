'use client'

import { useState } from 'react'
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion'
import ProjectCard from './ProjectCard'
import { projects, categoryLabels, type ProjectCategory } from '@/lib/projects'
import { cn } from '@/lib/utils'

type Filter = ProjectCategory | 'all'
const filters: Filter[] = ['all', 'website', 'video', 'social']

export default function PortfolioGrid() {
  const [active, setActive] = useState<Filter>('all')
  const visible = active === 'all' ? projects : projects.filter((p) => p.category === active)

  return (
    <div className="container-x">
      {/* Filter bar */}
      <LayoutGroup>
        <div className="mx-auto mb-12 flex w-fit flex-wrap justify-center gap-2 rounded-full border border-navy/10 bg-white p-1.5 shadow-soft">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={cn(
                'relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors',
                active === f ? 'text-white' : 'text-navy/60 hover:text-navy',
              )}
            >
              {active === f && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-navy"
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                />
              )}
              <span className="relative z-10">{categoryLabels[f]}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      {/* Grid */}
      <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={p} priority={i < 3} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
