'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight, Play } from 'lucide-react'
import { shot, type Project } from '@/lib/projects'
import { cn } from '@/lib/utils'

export default function ProjectCard({ project, priority }: { project: Project; priority?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const isVideo = project.category === 'video'
  const hasShot = project.category === 'website' && project.url

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setTilt({ rx: -py * 6, ry: px * 8 })
  }

  return (
    <motion.div layout className="h-full" style={{ perspective: 1000 }}>
      <Link
        ref={ref}
        href={`/portfolio/${project.slug}`}
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
        className="group block h-full"
      >
        <motion.div
          animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="flex h-full flex-col overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-soft transition-shadow duration-300 group-hover:shadow-large"
        >
          {/* Preview */}
          <div className="relative aspect-[16/11] overflow-hidden bg-navy-50">
            {hasShot ? (
              <Image
                src={shot(project.url)}
                alt={project.title}
                fill
                unoptimized
                priority={priority}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-brand-deep">
                {isVideo ? (
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-400 text-navy shadow-gold transition-transform group-hover:scale-110">
                    <Play className="h-6 w-6 translate-x-0.5 fill-navy" />
                  </span>
                ) : (
                  <span className="text-4xl font-semibold text-white/20">{project.title}</span>
                )}
              </div>
            )}
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy backdrop-blur">
              {project.industry}
            </span>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-semibold text-navy">{project.title}</h3>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-navy/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-500" />
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy/60">{project.description}</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              {project.stack.slice(0, 3).map((s) => (
                <span key={s} className={cn('rounded-full border border-navy/10 bg-navy-50 px-3 py-1 text-xs font-medium text-navy/70')}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
