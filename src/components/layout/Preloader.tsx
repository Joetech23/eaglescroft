'use client'

import { useEffect, useRef, useState } from 'react'

const clamp = (v: number) => Math.max(0, Math.min(1, v))
const map = (x: number, a: number, b: number) => clamp((x - a) / (b - a))

const DURATION = 2900 // ms of the staged sequence
const TAIL = 500 // flash + fade-out

/** ~3s cinematic preloader: Welcome → Eaglescroft → Ready? → 3·2·1 → flash → reveal. */
export default function Preloader() {
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pRef = useRef(0)
  const welcome = useRef<HTMLDivElement>(null)
  const word = useRef<HTMLDivElement>(null)
  const ready = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLDivElement>(null)
  const countNum = useRef<HTMLSpanElement>(null)
  const flash = useRef<HTMLDivElement>(null)

  const finish = () => {
    setDone(true)
    setTimeout(() => setGone(true), 650)
  }

  // timed sequence
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { finish(); return }
    document.body.style.overflow = 'hidden'
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = now - t0
      const p = clamp(t / DURATION)
      pRef.current = p
      if (welcome.current) welcome.current.style.opacity = `${map(p, 0.05, 0.16) * (1 - map(p, 0.4, 0.48))}`
      if (word.current) {
        word.current.style.opacity = `${map(p, 0.12, 0.24) * (1 - map(p, 0.4, 0.48))}`
        const r = map(p, 0.12, 0.26)
        word.current.style.transform = `translateY(${(1 - r) * 22}px) scale(${0.92 + 0.08 * r})`
      }
      if (ready.current) ready.current.style.opacity = `${map(p, 0.44, 0.52) * (1 - map(p, 0.56, 0.62))}`
      if (count.current) count.current.style.opacity = `${map(p, 0.58, 0.62) * (1 - map(p, 0.9, 0.95))}`
      if (countNum.current) {
        let label = '3', tt = 0
        if (p < 0.68) { label = '3'; tt = map(p, 0.58, 0.68) }
        else if (p < 0.78) { label = '2'; tt = map(p, 0.68, 0.78) }
        else { label = '1'; tt = map(p, 0.78, 0.88) }
        if (countNum.current.textContent !== label) countNum.current.textContent = label
        countNum.current.style.opacity = `${Math.sin(clamp(tt) * Math.PI)}`
        countNum.current.style.transform = `scale(${0.6 + tt * 0.9})`
      }
      if (flash.current) flash.current.style.opacity = `${Math.sin(map(p, 0.9, 1) * Math.PI) * 0.95}`
      if (t < DURATION + TAIL) raf = requestAnimationFrame(tick)
      else finish()
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); document.body.style.overflow = '' }
  }, [])

  useEffect(() => { if (gone) document.body.style.overflow = '' }, [gone])

  // starfield warp
  useEffect(() => {
    if (gone) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0, raf = 0
    const STARS = 360
    const stars = Array.from({ length: STARS }, () => ({ x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z: Math.random() }))
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
      const warp = map(p, 0.45, 1)
      const speed = 0.004 + warp * 0.06
      ctx.fillStyle = '#000615'; ctx.fillRect(0, 0, W, H)
      const cx = W / 2, cy = H / 2, focal = Math.min(W, H) * 0.9
      for (const s of stars) {
        const pz = s.z
        s.z -= speed
        if (s.z <= 0.02) { s.z = 1; s.x = (Math.random() - 0.5) * 2; s.y = (Math.random() - 0.5) * 2 }
        const sx = cx + (s.x / s.z) * focal, sy = cy + (s.y / s.z) * focal
        const psx = cx + (s.x / pz) * focal, psy = cy + (s.y / pz) * focal
        const alpha = (1 - s.z) * (0.5 + warp * 0.5)
        ctx.strokeStyle = s.z > 0.6 ? `rgba(255,201,64,${alpha})` : `rgba(220,230,255,${alpha})`
        ctx.lineWidth = Math.max(0.4, (1 - s.z) * 2.2)
        ctx.beginPath(); ctx.moveTo(psx, psy); ctx.lineTo(sx, sy); ctx.stroke()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [gone])

  if (gone) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden transition-opacity duration-[600ms]"
      style={{ background: 'radial-gradient(120% 120% at 50% 50%,#06112e 0%,#000615 70%)', opacity: done ? 0 : 1, pointerEvents: done ? 'none' : 'auto' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 60% at 50% 50%,transparent 35%,rgba(0,6,21,.85) 88%)' }} />

      <div className="pointer-events-none relative z-[3] px-6 text-center">
        <div ref={welcome} className="font-mono uppercase text-gold-400" style={{ fontSize: 'clamp(11px,1.5vw,14px)', letterSpacing: '0.42em', opacity: 0 }}>
          Welcome to the world of
        </div>
        <div ref={word} className="mt-4 font-display font-semibold text-white" style={{ fontSize: 'clamp(2.8rem,9vw,7rem)', lineHeight: 0.95, letterSpacing: '-0.01em', opacity: 0 }}>
          Eaglescroft
        </div>
        <div ref={ready} className="mt-5 font-display text-white/80" style={{ fontSize: 'clamp(1.4rem,3.6vw,2.4rem)', opacity: 0 }}>
          Ready?
        </div>
      </div>

      <div ref={count} className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center" style={{ opacity: 0 }}>
        <span ref={countNum} className="font-display font-bold text-gold-400" style={{ fontSize: 'clamp(8rem,28vw,22rem)', lineHeight: 1, textShadow: '0 0 90px rgba(255,201,64,.55)' }}>3</span>
      </div>

      <div ref={flash} className="pointer-events-none absolute inset-0 z-[5]" style={{ background: 'radial-gradient(circle at 50% 50%,#fff 0%,#FFE9AE 60%,#FFC940 100%)', opacity: 0 }} />

      <button onClick={finish} className="absolute right-6 top-6 z-[7] rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-white/70 backdrop-blur transition-colors hover:bg-white/[0.14] hover:text-white">
        Skip
      </button>
    </div>
  )
}
