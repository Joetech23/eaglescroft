import type { Person, Profile } from './types'

export const personSelect = 'id, full_name, email, role, title, signature, avatar_url, company'

export function displayName(p: Pick<Profile, 'full_name' | 'email'> | null | undefined) {
  return p?.full_name || p?.email?.split('@')[0] || 'Someone'
}

export function initials(p: Pick<Profile, 'full_name' | 'email'> | null | undefined) {
  const name = displayName(p)
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

/** "CTO · Eaglescroft" for team, company name for clients. */
export function roleLine(p: Pick<Person, 'role' | 'title' | 'company'> | null | undefined) {
  if (!p) return ''
  if (p.role === 'client') return p.company || 'Client'
  return `${p.title || (p.role === 'admin' ? 'Admin' : 'Team')} · Eaglescroft`
}

export const teamTitles = [
  'CEO',
  'CTO',
  'Project Manager',
  'Virtual Assistant',
  'Customer Representative',
  'Designer',
  'Developer',
  'Video Editor',
  'Marketing Lead',
  'Accounts',
]
