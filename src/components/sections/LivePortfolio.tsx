'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowRight, Lock, Play, Megaphone } from 'lucide-react'
import { featuredProjects, projects, shotTall, catColor } from '@/lib/projects'

export default function LivePortfolio() {
  // Home: show a curated few (featured first), then link to the full archive.
  const shown = [...featuredProjects, ...projects.filter((p) => !p.featured)].slice(0, 6)

  return (
    <section id="work" className="relative overflow-hidden bg-[#000615] px-6 py-[100px] sm:px-7 sm:py-[120px]">
      <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[500px] w-[900px] max-w-full -translate-x-1/2"
        style={{ background: 'radial-gradient(60% 60% at 50% 0%,rgba(66,87,176,.4),transparent 70%)' }} />

      <div className="relative mx-auto max-w-[1280px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold-400">
              <span className="h-px w-[22px] bg-gold-400/50" /> Selected work
            </div>
            <h2 className="mt-[18px] font-display font-semibold leading-[1.02] tracking-tight text-white" style={{ fontSize: 'clamp(2rem,4.5vw,3.3rem)' }}>
              Live previews, real results.
            </h2>
          </div>
          <p className="max-w-[360px] text-[15px] leading-relaxed text-white/60">
            Every site below is rendered live from its production URL. Hover to explore — click to visit.
          </p>
        </div>

        <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => {
              const hasPreview = p.category === 'website' && !!p.url
              const color = catColor[p.category]
              return (
                <motion.a
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  href={p.url ? `https://${p.url}` : '/contact'}
                  target={p.url ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0a1336] no-underline transition-all duration-300 hover:-translate-y-2 hover:border-gold-400/40 hover:shadow-[0_36px_80px_rgba(0,0,0,0.5)]"
                >
                  {/* browser chrome */}
                  <div className="flex items-center gap-3 border-b border-white/[0.07] bg-[#0c1640] px-4 py-3">
                    <div className="flex gap-[7px]">
                      <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
                      <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
                      <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex flex-1 items-center gap-2 overflow-hidden rounded-[9px] bg-black/30 px-3 py-1.5 font-mono text-[11.5px] text-white/65">
                      <Lock className="h-[11px] w-[11px] flex-none text-[#28c840]" />
                      <span className="truncate">{p.url || 'eaglescroft.com'}</span>
                    </div>
                  </div>

                  {/* preview viewport */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: '16/10.6', background: 'linear-gradient(135deg,#0a1336,#11205c)' }}>
                    {hasPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={shotTall(p.url)}
                        alt={p.title}
                        loading="lazy"
                        className="absolute inset-0 h-auto w-full object-cover object-top transition-transform duration-[3000ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-[calc(100%-238px)]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5"
                        style={{ background: `radial-gradient(80% 80% at 50% 40%,${p.category === 'video' ? 'oklch(0.42 0.16 300 / 0.5)' : 'oklch(0.42 0.14 150 / 0.5)'},#0a1336)` }}>
                        <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white/10 text-white backdrop-blur">
                          {p.category === 'video' ? <Play className="h-[26px] w-[26px]" /> : <Megaphone className="h-[26px] w-[26px]" />}
                        </div>
                        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/70">
                          {p.category === 'video' ? 'Video Reel' : 'Social Campaign'}
                        </span>
                      </div>
                    )}
                    <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#000615]/70 px-2.5 py-[5px] font-mono text-[10px] uppercase tracking-[0.1em] text-white backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#28c840] shadow-[0_0_8px_#28c840]" />
                      {hasPreview ? 'Live' : 'Sample'}
                    </div>
                  </div>

                  {/* meta */}
                  <div className="px-5 pb-[22px] pt-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-[19px] font-semibold text-white">{p.title}</h3>
                      <ArrowUpRight className="h-[18px] w-[18px] flex-none text-gold-400" />
                    </div>
                    <div className="my-[5px] mb-[13px] font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color }}>{p.industry}</div>
                    <p className="mb-[15px] text-[13.5px] leading-snug text-white/60">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.stack.slice(0, 3).map((s) => (
                        <span key={s} className="rounded-lg bg-white/[0.06] px-[9px] py-1 font-mono text-[10.5px] text-white/55">{s}</span>
                      ))}
                    </div>
                  </div>
                </motion.a>
              )
            })}
        </motion.div>

        <div className="mt-12 flex justify-center">
          <a
            href="/portfolio"
            className="group inline-flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.05] px-7 py-4 text-[15px] font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/50 hover:bg-white/[0.1]"
          >
            View all work
            <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}
