import Counter from '@/components/ui/Counter'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import { stats } from '@/lib/stats'

export default function Metrics() {
  return (
    <section
      className="relative overflow-hidden px-7 py-20"
      style={{ background: 'linear-gradient(180deg,#020a24 0%,#03102f 60%,#041538 100%)' }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(37,99,235,0.5),transparent)' }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/eagle-white.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-[-60px] top-1/2 h-[340px] -translate-y-1/2 opacity-[0.05]"
      />
      <div className="relative mx-auto grid max-w-[1280px] gap-[30px]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}>
        <Stagger className="contents">
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <div className="border-l-2 border-gold-400 pl-5">
                <div
                  className="font-display font-semibold leading-none text-transparent"
                  style={{ fontSize: 'clamp(2.6rem,5vw,3.6rem)', background: 'linear-gradient(180deg,#ffffff 30%,#93c5fd)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
                >
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-sm font-medium text-white/60">{s.label}</div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
