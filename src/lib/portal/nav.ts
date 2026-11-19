import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppLink } from '@/components/portal/AppNav'
import type { Profile } from './types'

/** Navigation + live badge counts for the signed-in person. */
export async function buildNav(supabase: SupabaseClient, profile: Profile, isTeam: boolean) {
  const nowIso = new Date().toISOString()
  const [{ data: unread }, { count: myTasks }, { count: upcoming }, { count: unreadNotes }] = await Promise.all([
    supabase.rpc('unread_message_counts'),
    supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('assignee_id', profile.id).neq('status', 'done'),
    supabase.from('meetings').select('id', { count: 'exact', head: true }).eq('status', 'scheduled').gte('starts_at', nowIso)
      .or(isTeam ? `host_id.eq.${profile.id}` : `client_id.eq.${profile.id}`),
    supabase.from('notifications').select('id', { count: 'exact', head: true }).is('read_at', null),
  ])
  const unreadMessages = ((unread ?? []) as { unread: number }[]).reduce((s, r) => s + Number(r.unread), 0)

  const links: AppLink[] = [
    { href: '/portal', label: 'Home', icon: 'Home', exact: true, group: 'main', primary: true },
    { href: '/portal/messages', label: 'Messages', icon: 'MessagesSquare', badge: unreadMessages, group: 'main', primary: true },
    { href: '/portal/tasks', label: 'Tasks', icon: 'ListChecks', badge: myTasks ?? 0, group: 'main', primary: true },
    // Phone bottom bar holds 4 items: clients get Meetings there, the team gets Projects instead.
    { href: '/portal/meetings', label: 'Meetings', icon: 'CalendarClock', badge: upcoming ?? 0, group: 'main', primary: !isTeam },
    { href: '/portal/calendar', label: 'Calendar', icon: 'CalendarDays', group: 'main' },
    { href: '/portal/billing', label: 'Billing', icon: 'Receipt', group: 'account' },
    { href: '/portal/settings', label: 'Settings', icon: 'Settings', group: 'account' },
  ]
  if (isTeam) {
    links.push(
      { href: '/admin/projects', label: 'Projects', icon: 'FolderKanban', group: 'team', primary: true },
      { href: '/admin', label: 'Overview', icon: 'LayoutDashboard', exact: true, group: 'team' },
      { href: '/admin/clients', label: 'Clients', icon: 'Users', group: 'team' },
      { href: '/admin/projects/new', label: 'New project', icon: 'PlusCircle', group: 'team' },
    )
    if (profile.role === 'admin') links.push({ href: '/admin/team', label: 'Team', icon: 'UserCog', group: 'team' })
  }
  return { links, unreadNotifications: unreadNotes ?? 0, unreadMessages }
}
