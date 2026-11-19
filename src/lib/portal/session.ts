import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from './supabase'
import type { Profile } from './types'

export const isTeamRole = (role: Profile['role']) => role === 'admin' || role === 'staff'

/** The signed-in user + profile for this request (cached). Redirects to login when signed out. */
export const getViewer = cache(async () => {
  const supabase = createClient()
  // getClaims verifies the access token's signature locally against the project's public
  // signing key (ES256, cached), so there is no Auth-server round trip per page. Tokens signed
  // with the legacy HS256 secret (e.g. the local dev stack) fall back to a getUser() call.
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (!claims?.sub) redirect('/portal/login')
  const user = { id: claims.sub, email: claims.email as string | undefined }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/portal/login?error=profile')

  // Presence for "only email people who aren't around" — throttled to one write every 5 minutes.
  const seen = profile.last_seen_at ? new Date(profile.last_seen_at).getTime() : 0
  if (Date.now() - seen > 5 * 60_000) {
    await supabase.from('profiles').update({ last_seen_at: new Date().toISOString() }).eq('id', user.id)
  }

  const p = profile as Profile
  return { supabase, user, profile: p, isTeam: isTeamRole(p.role) }
})

/** Any Eaglescroft team member (admin or staff). */
export async function requireTeam() {
  const viewer = await getViewer()
  if (!viewer.isTeam) redirect('/portal')
  return viewer
}

/** Admin-only: billing and team management. */
export async function requireAdmin() {
  const viewer = await getViewer()
  if (viewer.profile.role !== 'admin') redirect(viewer.isTeam ? '/admin' : '/portal')
  return viewer
}
