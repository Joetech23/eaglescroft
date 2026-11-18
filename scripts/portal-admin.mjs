// Create (or promote) an Eaglescroft portal admin.
//   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/portal-admin.mjs you@eaglescroft.com.ng "Your Name"
// Portal accounts are invite-only, so the first admin has to be created this way.
import { createClient } from '@supabase/supabase-js'

const [email, fullName = ''] = process.argv.slice(2)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!email || !url || !key) {
  console.error('Usage: NEXT_PUBLIC_SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… node scripts/portal-admin.mjs <email> ["Full Name"]')
  process.exit(1)
}

const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

const { data: existing } = await db.from('profiles').select('id').eq('email', email.toLowerCase()).maybeSingle()
let id = existing?.id
if (!id) {
  const { data, error } = await db.auth.admin.createUser({
    email: email.toLowerCase(),
    email_confirm: true,
    user_metadata: { full_name: fullName, company: 'Eaglescroft' },
  })
  if (error) throw error
  id = data.user.id
}

const { error } = await db.from('profiles').update({ role: 'admin', ...(fullName ? { full_name: fullName } : {}) }).eq('id', id)
if (error) throw error
console.log(`✔ ${email} is a portal admin. Sign in at /portal/login with a one-time code.`)
