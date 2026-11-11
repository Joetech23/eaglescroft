import Image from 'next/image'
import Link from 'next/link'

/** Shown while the portal backend isn't configured (no Supabase env) — keeps /portal and /admin graceful. */
export default function PortalSoon() {
  return (
    <div className="section-dark flex min-h-screen items-center justify-center px-6 text-center text-white">
      <div className="max-w-md">
        <Image src="/brand/eagle-white.png" alt="" width={64} height={64} className="mx-auto h-14 w-auto object-contain" />
        <div className="mt-6 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-gold-300">
          <span aria-hidden className="flight-marker" /> Client portal
        </div>
        <h1 className="mt-3 font-display text-3xl font-semibold">Launching soon.</h1>
        <p className="mt-3 text-white/60">
          We&rsquo;re putting the finishing touches on your client portal. In the meantime, your project lead will keep you updated directly.
        </p>
        <Link href="/" className="mt-8 inline-flex rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/85 hover:border-white/40">
          Back to eaglescroft.com.ng
        </Link>
      </div>
    </div>
  )
}
