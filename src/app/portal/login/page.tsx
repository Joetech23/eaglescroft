import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { Lock, Mail } from 'lucide-react'
import { sendLoginCode, verifyLoginCode } from '../actions'
import SubmitButton from '@/components/portal/SubmitButton'
import PortalSoon from '@/components/portal/PortalSoon'
import { inputClass, Notice } from '@/components/portal/ui'
import { portalConfigured } from '@/lib/portal/supabase'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = { title: 'Client portal sign in', robots: { index: false, follow: false } }

const errors: Record<string, string> = {
  email: 'Please enter a valid email address.',
  code: 'That code didn’t work. Check the latest email and try again. Codes expire after an hour.',
  expired: 'Your sign-in session timed out. Enter your email to get a new code.',
  profile: 'We couldn’t load your account. Please contact your project lead.',
  link: 'That sign-in link has expired. Request a new code below.',
}

export default function LoginPage({ searchParams }: { searchParams: { step?: string; error?: string; next?: string } }) {
  if (!portalConfigured) return <PortalSoon />
  const codeStep = searchParams.step === 'code' && Boolean(cookies().get('es_portal_login'))
  const error = searchParams.error ? errors[searchParams.error] : null
  const next = searchParams.next ?? ''

  return (
    <div className="grid min-h-screen bg-[#f4f6fb] lg:grid-cols-[1.05fr_1fr]">
      <div className="section-dark relative hidden overflow-hidden px-12 py-12 text-white lg:flex lg:flex-col">
        <div className="bg-dots-dark pointer-events-none absolute inset-0 opacity-50" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/eagle-white.png" alt="" aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-[460px] opacity-[0.05]" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <Image src="/brand/eagle-white.png" alt="" width={30} height={30} className="h-7 w-auto object-contain" />
          <span className="font-display text-[16px] font-semibold tracking-[0.14em]">EAGLESCROFT</span>
        </Link>
        <div className="relative mt-auto max-w-md">
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-gold-300">
            <span aria-hidden className="flight-marker" /> Client portal
          </div>
          <h1 className="mt-4 font-display text-[2.6rem] font-semibold leading-[1.05]">
            Your whole project, <span className="text-gold-300">in one place.</span>
          </h1>
          <p className="mt-4 text-white/60">Timeline, reviews, revisions, invoices and handover, all in one place, updated as we build.</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-[400px]">
          <Link href="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
            <Image src="/brand/eagle-gold.png" alt="" width={30} height={30} className="h-7 w-auto object-contain" />
            <span className="font-display text-[16px] font-semibold tracking-[0.14em] text-navy">EAGLESCROFT</span>
          </Link>

          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white shadow-navy">
            {codeStep ? <Mail className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </span>
          <h2 className="mt-5 font-display text-[1.7rem] font-semibold tracking-tight text-navy">
            {codeStep ? 'Check your email.' : 'Sign in to your portal.'}
          </h2>
          <p className="mt-2 text-[15px] text-[#48526e]">
            {codeStep
              ? 'If that email has a portal account, we’ve sent it a sign-in code. Enter it below.'
              : 'Enter the email your project lead set up for you. We’ll send a one-time code. No password needed.'}
          </p>

          {error && <div className="mt-5"><Notice tone="red">{error}</Notice></div>}

          {codeStep ? (
            <form key="code" action={verifyLoginCode} className="mt-7 space-y-4">
              <input type="hidden" name="next" value={next} />
              <input
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6,10}"
                maxLength={10}
                required
                autoFocus
                placeholder="Enter code"
                aria-label="Sign-in code"
                className={`${inputClass} text-center font-mono text-2xl tracking-[0.4em] placeholder:text-base placeholder:tracking-normal`}
              />
              <SubmitButton pendingText="Checking…" className="w-full py-3">Sign in</SubmitButton>
              <p className="text-center text-[13px] text-navy/55">
                No email? Check spam, or <Link href="/portal/login" className="font-semibold text-gold-600 hover:underline">use a different email</Link>.
              </p>
            </form>
          ) : (
            <form key="email" action={sendLoginCode} className="mt-7 space-y-4">
              <input type="hidden" name="next" value={next} />
              <input name="email" type="email" required autoComplete="email" autoFocus placeholder="you@company.com" aria-label="Email address" className={inputClass} />
              <SubmitButton pendingText="Sending code…" className="w-full py-3">Email me a code</SubmitButton>
            </form>
          )}

          <p className="mt-10 text-[13px] text-navy/50">
            Not a client yet? <Link href="/contact" className="font-semibold text-gold-600 hover:underline">Start a project</Link> · Need help? <a href={`mailto:${siteConfig.email}`} className="font-semibold text-gold-600 hover:underline">{siteConfig.email}</a>
          </p>
        </div>
      </div>
    </div>
  )
}
