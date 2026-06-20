'use client'

import { useEffect, useRef, useState } from 'react'

const clamp = (v: number) => Math.max(0, Math.min(1, v))
const map = (x: number, a: number, b: number) => clamp((x - a) / (b - a))

/**
 * Scroll-driven cinematic intro (ported from the design prototype):
 * "Welcome to the world of" → Eaglescroft → Ready? → 3·2·1 → flash → reveal.
 * A 2D starfield warp accelerates as you approach the end.
 */
export default function CinematicIntro() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pRef = useRef(0)

  // refs to animated text nodes (updated imperatively for perf)
  const welcome = useRef<HTMLDivElement>(null)
  const word = useRef<HTMLDivElement>(null)
  const ready = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLDivElement>(null)
  const countNum = useRef<HTMLSpanElement>(null)
  const flash = useRef<HTMLDivElement>(null)
  const hint = useRef<HTMLDivElement>(null)

  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // scroll → progress
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const p = clamp(-rect.top / total)
      pRef.current = p
      updateText(p)
    }
    const updateText = (p: number) => {
      if (welcome.current) welcome.current.style.opacity = `${map(p, 0.05, 0.14) * (1 - map(p, 0.45, 0.52))}`
      if (word.current) {
        word.current.style.opacity = `${map(p, 0.12, 0.22) * (1 - map(p, 0.45, 0.52))}`
        const r = map(p, 0.12, 0.24)
        word.current.style.transform = `translateY(${(1 - r) * 24}px) scale(${0.92 + 0.08 * r})`
      }
      if (ready.current) ready.current.style.opacity = `${map(p, 0.46, 0.54) * (1 - map(p, 0.56, 0.62))}`
      if (count.current) count.current.style.opacity = `${map(p, 0.58, 0.62) * (1 - map(p, 0.9, 0.94))}`
      if (countNum.current) {
        let label = '3', tt = 0
        if (p < 0.68) { label = '3'; tt = map(p, 0.58, 0.68) }
        else if (p < 0.78) { label = '2'; tt = map(p, 0.68, 0.78) }
        else { label = '1'; tt = map(p, 0.78, 0.88) }
        if (countNum.current.textContent !== label) countNum.current.textContent = label
        countNum.current.style.opacity = `${Math.sin(clamp(tt) * Math.PI)}`
        countNum.current.style.transform = `scale(${0.6 + tt * 0.9})`
      }
      if (flash.current) flash.current.style.opacity = `${Math.sin(map(p, 0.88, 0.985) * Math.PI) * 0.95}`
      if (hint.current) hint.current.style.opacity = `${1 - map(p, 0.02, 0.1)}`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // starfield warp
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0, raf = 0
    const STARS = 420
    const stars = Array.from({ length: STARS }, () => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: Math.random(),
    }))
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      W = canvas.clientWidth; H = canvas.clientHeight
      canvas.width = W * dpr; canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const p = pRef.current
      const warp = map(p, 0.55, 1)
      const speed = 0.002 + warp * 0.05
      ctx.fillStyle = '#000615'
      ctx.fillRect(0, 0, W, H)
      const cx = W / 2, cy = H / 2
      const focal = Math.min(W, H) * 0.9
      for (const s of stars) {
        const pz = s.z
        s.z -= reduced ? 0.001 : speed
        if (s.z <= 0.02) { s.z = 1; s.x = (Math.random() - 0.5) * 2; s.y = (Math.random() - 0.5) * 2 }
        const sx = cx + (s.x / s.z) * focal
        const sy = cy + (s.y / s.z) * focal
        const psx = cx + (s.x / pz) * focal
        const psy = cy + (s.y / pz) * focal
        const r = (1 - s.z) * 2.2
        const alpha = (1 - s.z) * (0.5 + warp * 0.5)
        // gold near center fading to white outward
        const gold = s.z > 0.6
        ctx.strokeStyle = gold ? `rgba(255,201,64,${alpha})` : `rgba(220,230,255,${alpha})`
        ctx.lineWidth = Math.max(0.4, r)
        ctx.beginPath()
        ctx.moveTo(psx, psy)
        ctx.lineTo(sx, sy)
        ctx.stroke()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [reduced])

  const skip = () => {
    const el = sectionRef.current
    if (!el) return
    window.scrollTo({ top: el.offsetTop + el.offsetHeight - window.innerHeight + 4, behavior: 'smooth' })
  }

  return (
    <div ref={sectionRef} className="relative z-[40] bg-[#000615]" style={{ height: '520vh' }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
        style={{ background: 'radial-gradient(120% 120% at 50% 50%,#06112e 0%,#000615 70%)' }}>
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 60% at 50% 50%,transparent 35%,rgba(0,6,21,.85) 88%)' }} />

        <div className="pointer-events-none relative z-[3] px-6 text-center">
          <div ref={welcome} className="font-mono uppercase text-gold-400" style={{ fontSize: 'clamp(12px,1.6vw,15px)', letterSpacing: '0.42em', opacity: 0 }}>
            Welcome to the world of
          </div>
          <div ref={word} className="mt-[18px] font-display font-semibold text-white" style={{ fontSize: 'clamp(2.8rem,9vw,7rem)', lineHeight: 0.95, letterSpacing: '-0.03em', opacity: 0 }}>
            Eaglescroft
          </div>
          <div ref={ready} className="mt-6 font-display font-medium text-white/80" style={{ fontSize: 'clamp(1.4rem,3.6vw,2.4rem)', opacity: 0 }}>
            Ready?
          </div>
        </div>

        <div ref={count} className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center" style={{ opacity: 0 }}>
          <span ref={countNum} className="font-display font-bold text-gold-400" style={{ fontSize: 'clamp(8rem,28vw,24rem)', lineHeight: 1, textShadow: '0 0 90px rgba(255,201,64,.55)' }}>3</span>
        </div>

        <div ref={flash} className="pointer-events-none absolute inset-0 z-[5]" style={{ background: 'radial-gradient(circle at 50% 50%,#fff 0%,#FFE9AE 60%,#FFC940 100%)', opacity: 0 }} />

        <div ref={hint} className="pointer-events-none absolute bottom-8 left-1/2 z-[6] flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">Scroll to enter</span>
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/30 py-1.5">
            <span className="h-[7px] w-1 rounded-full bg-gold-400" style={{ animation: 'float 1.8s ease-in-out infinite' }} />
          </div>
        </div>

        <button onClick={skip} className="absolute right-6 top-6 z-[7] rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-white/70 backdrop-blur transition-colors hover:bg-white/[0.14] hover:text-white">
          Skip ↓
        </button>
      </div>
    </div>
  )
}
