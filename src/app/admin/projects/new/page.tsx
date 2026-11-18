import type { Metadata } from 'next'
import { requireTeam } from '@/lib/portal/session'
import { serviceTemplates } from '@/lib/portal/templates'
import { createProject } from '../../actions'
import SubmitButton from '@/components/portal/SubmitButton'
import { ButtonLink, Card, Empty, Field, Notice, PageHeader, inputClass } from '@/components/portal/ui'
import type { Profile } from '@/lib/portal/types'

export const metadata: Metadata = { title: 'New project' }

export default async function NewProjectPage({ searchParams }: { searchParams: { error?: string } }) {
  const { supabase } = await requireTeam()
  const { data } = await supabase.from('profiles').select('*').eq('role', 'client').order('full_name')
  const clients = (data ?? []) as Profile[]

  return (
    <>
      <PageHeader
        eyebrow="New project"
        title="Set up a project."
        intro="Pick the service and we’ll seed the timeline, revision allowance and the client’s brief questions from its template."
      />
      {searchParams.error && <div className="mb-6"><Notice tone="red">Choose a client, a service and a title, then try again.</Notice></div>}

      {clients.length === 0 ? (
        <Card><Empty>Create a client account first.</Empty><div className="mt-4"><ButtonLink href="/admin/clients">Add a client</ButtonLink></div></Card>
      ) : (
        <form action={createProject} className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <Card title="Project">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Client">
                <select name="client_id" required className={inputClass}>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.company ? `${c.company} — ${c.full_name ?? c.email}` : c.full_name ?? c.email}</option>)}
                </select>
              </Field>
              <Field label="Service template">
                <select name="service" required className={inputClass}>
                  {serviceTemplates.map((t) => <option key={t.key} value={t.key}>{t.label} · {t.milestones.length} milestones</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2"><Field label="Project title"><input name="title" required placeholder="e.g. Business website rebuild" className={inputClass} /></Field></div>
              <div className="sm:col-span-2"><Field label="Summary (client-facing)"><textarea name="summary" rows={2} className={inputClass} /></Field></div>
              <div className="sm:col-span-2">
                <Field label="Goals & targets" hint="One per line. Use “Goal | target”, e.g. “More enquiries | 40 leads a month”.">
                  <textarea name="goals" rows={3} className={inputClass} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Features in scope" hint="One per line.">
                  <textarea name="features" rows={4} className={inputClass} />
                </Field>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card title="Dates">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Start date"><input type="date" name="start_date" className={inputClass} /></Field>
                <Field label="Target launch" hint="Blank = from template"><input type="date" name="due_date" className={inputClass} /></Field>
              </div>
            </Card>
            <Card title="Commercials">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Currency">
                  <select name="currency" className={inputClass}><option>USD</option><option>NGN</option></select>
                </Field>
                <Field label="Project fee"><input name="budget" inputMode="decimal" placeholder="0.00" className={inputClass} /></Field>
                <Field label="Deposit %"><input name="deposit_percent" type="number" min={0} max={100} defaultValue={50} className={inputClass} /></Field>
                <Field label="Revision rounds" hint="Blank = template default"><input name="revision_quota" type="number" min={0} className={inputClass} /></Field>
                <div className="sm:col-span-2"><Field label="Monthly retainer (optional)"><input name="retainer" inputMode="decimal" placeholder="0.00" className={inputClass} /></Field></div>
              </div>
              <label className="mt-4 flex items-center gap-2.5 text-[14px] text-navy/80">
                <input type="checkbox" name="deposit_invoice" defaultChecked className="h-4 w-4 accent-[#2563EB]" />
                Create a draft deposit invoice
              </label>
            </Card>
            <SubmitButton pendingText="Creating project…" className="w-full py-3">Create project</SubmitButton>
          </div>
        </form>
      )}
    </>
  )
}
