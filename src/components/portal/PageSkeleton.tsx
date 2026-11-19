/**
 * Shown instantly on every portal/admin click while the server renders the next page,
 * so a tap always gets immediate feedback (the sidebar and header stay in place).
 */
const bar = 'animate-pulse rounded-xl bg-navy/[0.07]'

export default function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="mx-auto max-w-6xl">
      <div className={`${bar} h-3 w-24`} />
      <div className={`${bar} mt-3 h-8 w-72 max-w-full`} />
      <div className={`${bar} mt-3 h-4 w-96 max-w-full`} />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-navy/[0.06] bg-surface p-5">
            <div className={`${bar} h-3 w-20`} />
            <div className={`${bar} mt-3 h-7 w-16`} />
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-navy/[0.06] bg-surface p-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 border-b border-navy/[0.05] py-4 last:border-0">
            <div className={`${bar} h-10 w-10 shrink-0 rounded-full`} />
            <div className="flex-1">
              <div className={`${bar} h-4 w-1/2`} />
              <div className={`${bar} mt-2 h-3 w-1/3`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
