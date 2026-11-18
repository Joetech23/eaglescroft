import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/portal/session'
import { displayName, teamTitles } from '@/lib/portal/people'
import { createTeamMember, updateTeamMember } from '../actions'
import Avatar from '@/components/portal/Avatar'
import SubmitButton from '@/components/portal/SubmitButton'
import { Card, Field, Notice, PageHeader, inputClass } from '@/components/portal/ui'
import type { Profile } from '@/lib/portal/types'

export const metadata: Metadata = { title: 'Team' }

const notices: Record<string, { tone: 'green' | 'red'; text: string }> = {
  'saved=created': { tone: 'green', text: 'Team member added. They can sign in at /portal/login.' },
  'saved=updated': { tone: 'green', text: 'Team member updated.' },
  'error=email': { tone: 'red', text: 'Enter a valid email address.' },
  'error=exists': { tone: 'red', text: 'Someone with that email already has an account. Change their role below instead.' },
  'error=create': { tone: 'red', text: 'Couldn’t create the account.' },
}

export default async function TeamPage({ searchParams }: { searchParams: Record<string, string> }) {
  const { supabase, user } = await requireAdmin()
  const { data } = await supabase.from('profiles').select('*').in('role', ['admin', 'staff']).order('full_name')
  const team = (data ?? []) as Profile[]
  const notice = Object.entries(searchParams).map(([k, v]) => notices[`${k}=${v}`]).find(Boolean)

  return (
    <>
      <PageHeader eyebrow="Team" title="Your Eaglescroft team." intro="Everyone here can work on client projects. Titles and signatures appear on every message so clients always know who they’re speaking to." />
      {notice && <div className="mb-6"><Notice tone={notice.tone}>{notice.text}</Notice></div>}
      <datalist id="titles">{teamTitles.map((t) => <option key={t} value={t} />)}</datalist>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr]">
        <Card title="Add a team member">
          <form action={createTeamMember} className="space-y-4">
            <Field label="Email"><input name="email" type="email" required className={inputClass} /></Field>
            <Field label="Full name"><input name="full_name" required className={inputClass} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Job title"><input name="title" list="titles" placeholder="e.g. Customer Representative" className={inputClass} /></Field>
              <Field label="Access">
                <select name="role" className={inputClass}><option value="staff">Staff: projects, chat, tasks</option><option value="admin">Admin: everything incl. billing & team</option></select>
              </Field>
            </div>
            <Field label="Signature (optional)"><input name="signature" maxLength={280} placeholder="Ada, Customer Success · Eaglescroft" className={inputClass} /></Field>
            <label className="flex items-center gap-2.5 text-[14px] text-navy/80"><input type="checkbox" name="send_code" defaultChecked className="h-4 w-4 accent-[#2563EB]" /> Email them a sign-in code now</label>
            <SubmitButton pendingText="Adding…">Add team member</SubmitButton>
          </form>
        </Card>

        <div className="space-y-3">
          {team.map((m) => (
            <details key={m.id} className="group rounded-[22px] border border-navy/[0.07] bg-white shadow-soft">
              <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
                <Avatar person={m} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-semibold text-navy">{displayName(m)}{m.id === user.id && <span className="ml-1.5 text-[12px] font-normal text-navy/45">(you)</span>}</div>
                  <div className="truncate text-[12.5px] text-navy/50">{m.title || 'No title yet'} · {m.email}</div>
                </div>
                <span className={`rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider ${m.role === 'admin' ? 'bg-navy text-white' : 'bg-gold-400/10 text-gold-600'}`}>{m.role}</span>
              </summary>
              <form action={updateTeamMember.bind(null, m.id)} className="grid gap-3 border-t border-navy/[0.07] p-4 sm:grid-cols-2">
                <Field label="Job title"><input name="title" list="titles" defaultValue={m.title ?? ''} className={inputClass} /></Field>
                <Field label="Access">
                  <select name="role" defaultValue={m.role} disabled={m.id === user.id} className={inputClass}>
                    <option value="staff">Staff</option><option value="admin">Admin</option><option value="client">Remove from team (client access only)</option>
                  </select>
                </Field>
                <div className="sm:col-span-2"><Field label="Signature"><input name="signature" maxLength={280} defaultValue={m.signature ?? ''} className={inputClass} /></Field></div>
                <div className="sm:col-span-2"><SubmitButton variant="ghost">Save changes</SubmitButton></div>
              </form>
            </details>
          ))}
        </div>
      </div>
    </>
  )
}
