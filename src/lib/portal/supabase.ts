import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient as createPlainClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

/** The portal stays dark (a "setting up" screen) until Supabase is configured, so the marketing site never breaks. */
export const portalConfigured = Boolean(url && anonKey)

/** Per-request client acting as the signed-in user — every query goes through row-level security. */
export function createClient() {
  const cookieStore = cookies()
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(toSet) {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Called from a Server Component: the middleware refreshes the session instead.
        }
      },
    },
  })
}

/** Cookie-less anon client — used to email a login code on someone else's behalf (admin invites). */
export function createAnonClient() {
  return createPlainClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } })
}

/** Service-role client. Server-only: bypasses RLS, so use it solely for trusted work (admin user creation, payment webhooks). */
export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  return createPlainClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
}
