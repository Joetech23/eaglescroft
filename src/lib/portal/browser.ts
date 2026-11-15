'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/** One shared browser client (auth from cookies) — used for realtime and direct-to-storage uploads. */
export function browserSupabase() {
  if (!client) {
    client = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    // Keep the realtime socket on the user's current token so RLS-filtered change feeds keep flowing.
    client.auth.onAuthStateChange((_event, session) => {
      if (session) client!.realtime.setAuth(session.access_token)
    })
  }
  return client
}

/**
 * Realtime only delivers rows that pass RLS for the *authenticated* user, so the socket must carry the
 * user's JWT before any channel subscribes — otherwise it joins as anon and silently receives nothing.
 */
export async function realtimeClient() {
  const sb = browserSupabase()
  const {
    data: { session },
  } = await sb.auth.getSession()
  if (session) await sb.realtime.setAuth(session.access_token)
  return sb
}
