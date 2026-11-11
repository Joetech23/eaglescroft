import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from './supabase'
import type { Profile } from './types'

/** The signed-in user + profile for this request (cached). Redirects to login when signed out. */
export const getViewer = cache(async () => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/portal/login?error=profile')

  return { supabase, user, profile: profile as Profile }
})

export async function requireAdmin() {
  const viewer = await getViewer()
  if (viewer.profile.role !== 'admin') redirect('/portal')
  return viewer
}
