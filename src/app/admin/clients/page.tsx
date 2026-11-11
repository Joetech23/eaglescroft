import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/portal/session'
import { formatDate } from '@/lib/portal/format'
import { createClientAccount } from '../actions'
import SubmitButton from '@/components/portal/SubmitButton'
import { Card, Empty, Field, Notice, PageHeader, inputClass } from '@/components/portal/ui'
import type { Profile } from '@/lib/portal/types'

export const metadata: Metadata = { title: 'Clients' }

const messages: Record<string, { tone: 'green' | 'red'; text: string }> = {
  'created=1': { tone: 'green', text: 'Client created. They can sign in at /portal/login with their email.' },
  'created=sent': { tone: 'green', text: 'Client created and a sign-in code has been emailed to them.' },
  'error=email': { tone: 'red', text: 'Enter a valid email address.' },
  'error=exists': { tone: 'red', text: 'An account with that email already exists.' },
  'error=create': { tone: 'red', text: 'Couldn’t create the account. Check the service key is configured.' },
}

export default async function ClientsPage({ searchParams }: { searchParams: Record<string, string> }) {
  const { supabase } = await requireAdmin()
  const [{ data: cs }, { data: ps }] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('projects').select('client_id, status'),
  ])
  const people = (cs ?? []) as Profile[]
  const projects = (ps ?? []) as { client_id: string; status: string }[]
  const msg = Object.entries(searchParams).map(([k, v]) => messages[`${k}=${v}`]).find(Boolean)

  return (
    <>
      <PageHeader eyebrow="Clients" title="Client accounts." intro="Portal access is invite-only. Create the account here, then set up their project." />
      {msg && <div className="mb-6"><Notice tone={msg.tone}>{msg.text}</Notice></div>}

      <div className="grid gap-6 xl:grid-cols-[1fr_1.5fr]">
        <Card title="Add a client">
          <form action={createClientAccount} className="space-y-4">
            <Field label="Email"><input name="email" type="email" required className={inputClass} /></Field>
            <Field label="Full name"><input name="full_name" required className={inputClass} /></Field>
            <Field label="Company"><input name="company" className={inputClass} /></Field>
            <Field label="Phone"><input name="phone" className={inputClass} /></Field>
            <label className="flex items-center gap-2.5 text-[14px] text-navy/80">
              <input type="checkbox" name="send_code" defaultChecked className="h-4 w-4 accent-[#2563EB]" />
              Email them a sign-in code now
            </label>
            <SubmitButton pendingText="Creating…">Create client</SubmitButton>
          </form>
        </Card>

        <Card title={`All accounts (${people.length})`} padded={false}>
          {people.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-[14px]">
                <thead className="font-mono text-[10.5px] uppercase tracking-wider text-navy/45">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-3 py-3 font-medium">Email</th>
                    <th className="px-3 py-3 font-medium">Projects</th>
                    <th className="px-6 py-3 font-medium">Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/[0.07]">
                  {people.map((c) => (
                    <tr key={c.id}>
                      <td className="px-6 py-3.5">
                        <div className="font-semibold text-navy">{c.full_name || '—'}{c.role === 'admin' && <span className="ml-2 font-mono text-[10px] uppercase text-gold-600">admin</span>}</div>
                        <div className="text-[12px] text-navy/50">{c.company}</div>
                      </td>
                      <td className="px-3 py-3.5 text-navy/65">{c.email}</td>
                      <td className="px-3 py-3.5 text-navy/65">{projects.filter((p) => p.client_id === c.id).length}</td>
                      <td className="px-6 py-3.5 text-navy/65">{formatDate(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div className="p-6"><Empty>No accounts yet.</Empty></div>}
        </Card>
      </div>
    </>
  )
}
