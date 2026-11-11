import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/portal/supabase'

/** Magic-link fallback: the emailed link lands here with a PKCE code (same browser) or a token hash. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const next = params.get('next') ?? '/portal'
  const safeNext = next.startsWith('/portal') || next.startsWith('/admin') ? next : '/portal'
  const supabase = createClient()

  const code = params.get('code')
  const tokenHash = params.get('token_hash')
  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'email' })
      : { error: new Error('missing code') }

  return NextResponse.redirect(new URL(error ? '/portal/login?error=link' : safeNext, request.url))
}
