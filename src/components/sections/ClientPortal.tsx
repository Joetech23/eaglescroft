import Link from 'next/link'
import {
  CalendarDays, Receipt, MessageSquareText, FileCheck2, Sparkles, Target, ArrowRight, Lock, CheckCircle2, Circle,
} from 'lucide-react'

const features = [
  { icon: CalendarDays, title: 'Day-by-day timeline', desc: 'See exactly what’s happening on your project, every single day.' },
  { icon: Target, title: 'Goals & targets', desc: 'Your brief, features and success targets — set up for your service.' },
  { icon: MessageSquareText, title: 'Reviews & revisions', desc: 'Raise a ticket on any review round and track every revision.' },
  { icon: Receipt, title: 'Invoices & payments', desc: 'Deposits, balances, retainers and your full transaction history.' },
  { icon: FileCheck2, title: 'Handover documents', desc: 'Logins, guides and assets delivered in one secure place.' },
  { icon: Sparkles, title: 'AI project assistant', desc: 'Helps write your brief and keeps every request tracked.' },
]

const timeline = [
  { day: 'Day 1', label: 'Brief approved', done: true },
  { day: 'Day 4', label: 'Design review', done: true },
  { day: 'Day 9', label: 'Build — revision 1', done: false, active: true },
  { day: 'Day 14', label: 'Launch & handover', done: false },
]

/** Home teaser for the upcoming client portal (portal.eaglescroft.com.ng). Static — always renders. */
export default function ClientPortal() {
  return (
    <section id="client-portal" aria-labelledby="portal-heading" className="section-dark relative overflow-hidden px-6 py-[110px] sm:px-7">
      <div className="bg-dots-dark pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -right-40 top-10 h-[480px] w-[480px] rounded-full" style={{ background: 'radial-gradient(circle,rgba(37,99,235,0.20),transparent 70%)' }} />

      <div className="relative mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
        {/* copy */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="chip-dark">Client Portal</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-300/40 bg-gold-300/10 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-gold-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-300 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-300" />
              </span>
              Coming soon
            </span>
          </div>
          <h2 id="portal-heading" className="mt-6 font-display font-semibold leading-[1.05] tracking-tight text-white" style={{ fontSize: 'clamp(2rem,4.5vw,3.1rem)' }}>
            Your whole project,{' '}
            <span className="text-transparent" style={{ background: 'linear-gradient(100deg,#93c5fd,#3b82f6)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
              in one place.
            </span>
          </h2>
          <p className="mt-4 max-w-[540px] text-[16px] leading-relaxed text-white/60">
            We&rsquo;re building a private portal for every Eaglescroft client — so you can follow progress, review work,
            pay invoices and collect your handover without chasing a single email.
          </p>

          <ul className="mt-9 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f.title} className="flex gap-3.5">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-gold-300">
                  <f.icon className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <div className="text-[14.5px] font-semibold text-white">{f.title}</div>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-white/50">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
              style={{ background: 'linear-gradient(180deg,#3b76f0,#1d4ed8)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 10px 24px -6px rgba(37,99,235,0.5)' }}
            >
              Start a project <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <span
              aria-disabled="true"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/15 px-5 py-3.5 text-sm font-semibold text-white/45"
            >
              <Lock className="h-4 w-4" /> Client login — coming soon
            </span>
          </div>
        </div>

        {/* dashboard preview */}
        <div className="relative min-w-0">
          <div className="pointer-events-none absolute -inset-6 rounded-[36px] bg-gold-400/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white shadow-dark-card" aria-hidden>
            {/* chrome */}
            <div className="flex items-center gap-2 border-b border-navy/[0.07] bg-[#f2f4fa] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 flex-1 truncate rounded-md bg-white px-2.5 py-1 font-mono text-[10px] text-navy/50">
                portal.eaglescroft.com.ng/projects/website
              </span>
            </div>

            <div className="select-none p-5 blur-[0.3px] sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-navy/45">Your project</div>
                  <div className="mt-1 font-display text-[18px] font-semibold text-navy">Business Website</div>
                </div>
                <span className="rounded-full bg-gold-400/10 px-2.5 py-1 font-mono text-[10px] font-medium text-gold-600">In build</span>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-[11.5px]">
                  <span className="font-medium text-navy/70">Overall progress</span>
                  <span className="font-semibold text-navy">64%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-navy/[0.07]">
                  <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-gold-500 to-gold-300" />
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-[1.15fr_1fr]">
                <div className="min-w-0 rounded-xl border border-navy/[0.08] p-3.5">
                  <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-navy/50">Timeline</div>
                  <ol className="space-y-2.5">
                    {timeline.map((t) => (
                      <li key={t.day} className="flex items-center gap-2.5 text-[12px]">
                        {t.done ? (
                          <CheckCircle2 className="h-4 w-4 flex-none text-[#28c840]" />
                        ) : (
                          <Circle className={`h-4 w-4 flex-none ${t.active ? 'fill-gold-400/20 text-gold-400' : 'text-navy/20'}`} />
                        )}
                        <span className="w-11 flex-none font-mono text-[10px] text-navy/40">{t.day}</span>
                        <span className={t.active ? 'font-semibold text-navy' : t.done ? 'text-navy/70' : 'text-navy/45'}>{t.label}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-navy/[0.08] p-3.5">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-navy/50">Payments</div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-[12px] text-navy/60">Deposit</span>
                      <span className="rounded-full bg-[#28c840]/10 px-2 py-0.5 font-mono text-[9.5px] text-[#178a3c]">PAID</span>
                    </div>
                    <div className="mt-1.5 flex items-baseline justify-between">
                      <span className="text-[12px] text-navy/60">Balance</span>
                      <span className="font-mono text-[9.5px] text-navy/45">DUE AT LAUNCH</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-navy/[0.08] p-3.5">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-navy/50">Revisions</div>
                    <div className="mt-2 flex items-center gap-1.5">
                      {[1, 2, 3].map((n) => (
                        <span key={n} className={`h-2 flex-1 rounded-full ${n === 1 ? 'bg-gold-400' : 'bg-navy/10'}`} />
                      ))}
                    </div>
                    <div className="mt-1.5 text-[11px] text-navy/55">1 of 3 used</div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-gold-400/25 bg-gold-400/[0.06] px-3.5 py-2.5">
                <MessageSquareText className="h-4 w-4 flex-none text-gold-500" />
                <span className="truncate text-[12px] text-navy/75">Ticket #12 · “Make the hero headline bigger” — <span className="font-semibold text-gold-600">in progress</span></span>
              </div>
            </div>

            {/* coming-soon veil */}
            <div className="absolute inset-x-0 bottom-0 flex h-24 items-end justify-center bg-gradient-to-t from-white via-white/85 to-transparent pb-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white shadow-navy">
                <Lock className="h-3.5 w-3.5 text-gold-300" /> Launching soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
