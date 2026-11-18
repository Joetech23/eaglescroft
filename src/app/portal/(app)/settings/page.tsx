import type { Metadata } from 'next'
import { getViewer } from '@/lib/portal/session'
import { displayName, roleLine } from '@/lib/portal/people'
import { minutesToLabel, weekdayNames } from '@/lib/portal/slots'
import { saveAvailability, updateProfile } from '@/app/portal/collab'
import AvatarUploader from '@/components/portal/AvatarUploader'
import { InstallButton, PushToggle } from '@/components/portal/Pwa'
import SubmitButton from '@/components/portal/SubmitButton'
import { Card, Field, Notice, PageHeader, inputClass } from '@/components/portal/ui'
import type { AvailabilityBlock } from '@/lib/portal/types'

export const metadata: Metadata = { title: 'Settings' }

const notices: Record<string, { tone: 'green' | 'red'; text: string }> = {
  'saved=profile': { tone: 'green', text: 'Profile saved.' },
  'saved=availability': { tone: 'green', text: 'Availability saved. Clients can now book these times.' },
  'error=profile': { tone: 'red', text: 'Couldn’t save your profile. Please try again.' },
}

export default async function SettingsPage({ searchParams }: { searchParams: Record<string, string> }) {
  const { supabase, profile, isTeam } = await getViewer()
  const { data: blocks } = isTeam ? await supabase.from('availability').select('*').eq('user_id', profile.id) : { data: [] }
  const byDay = new Map(((blocks ?? []) as AvailabilityBlock[]).map((b) => [b.weekday, b]))
  const notice = Object.entries(searchParams).map(([k, v]) => notices[`${k}=${v}`]).find(Boolean)
  const days = [1, 2, 3, 4, 5, 6, 0]

  return (
    <>
      <PageHeader eyebrow="Settings" title="Your account." intro={`${displayName(profile)} · ${roleLine(profile)}`} />
      {notice && <div className="mb-6"><Notice tone={notice.tone}>{notice.text}</Notice></div>}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <Card title="Profile">
            <AvatarUploader person={profile} />
            <form action={updateProfile} className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full name"><input name="full_name" defaultValue={profile.full_name ?? ''} className={inputClass} /></Field>
              <Field label="Phone"><input name="phone" defaultValue={profile.phone ?? ''} className={inputClass} /></Field>
              <Field label="Email" hint="Contact us to change your sign-in email."><input value={profile.email} disabled className={`${inputClass} bg-[#f6f8fc] text-navy/50`} /></Field>
              {isTeam ? (
                <Field label="Job title" hint="Set by an admin."><input value={profile.title ?? ''} disabled className={`${inputClass} bg-[#f6f8fc] text-navy/50`} /></Field>
              ) : (
                <Field label="Company"><input name="company" defaultValue={profile.company ?? ''} className={inputClass} /></Field>
              )}
              {isTeam && (
                <div className="sm:col-span-2">
                  <Field label="Message signature" hint="Shown under your messages so clients know exactly who they’re talking to.">
                    <input name="signature" maxLength={280} defaultValue={profile.signature ?? ''} placeholder={`${displayName(profile)}, ${profile.title ?? 'Team'} · Eaglescroft`} className={inputClass} />
                  </Field>
                </div>
              )}
              <label className="flex items-center gap-2.5 text-[14px] text-navy/80 sm:col-span-2">
                <input type="checkbox" name="notify_email" defaultChecked={profile.notify_email} className="h-4 w-4 accent-[#2563EB]" />
                Email me when something needs my attention (messages only when I’m away)
              </label>
              <div className="sm:col-span-2"><SubmitButton>Save profile</SubmitButton></div>
            </form>
          </Card>

          {isTeam && (
            <div id="availability" className="scroll-mt-6">
              <Card title="Meeting availability" action={<span className="text-[12px] text-navy/50">Lagos time (WAT)</span>}>
                <p className="mb-4 text-[13.5px] text-navy/60">Clients can book calls with you inside these hours. Existing meetings are blocked out automatically.</p>
                <form action={saveAvailability} className="space-y-2.5">
                  {days.map((d) => {
                    const b = byDay.get(d)
                    const weekday = d >= 1 && d <= 5
                    return (
                      <div key={d} className="grid grid-cols-[110px_1fr_1fr] items-center gap-2 sm:grid-cols-[140px_1fr_1fr]">
                        <label className="flex items-center gap-2 text-[14px] font-semibold text-navy">
                          <input type="checkbox" name={`day_${d}`} defaultChecked={b ? true : blocks?.length ? false : weekday} className="h-4 w-4 accent-[#2563EB]" />
                          {weekdayNames[d].slice(0, 3)}
                        </label>
                        <input type="time" name={`start_${d}`} defaultValue={b ? minutesToLabel(b.start_minute) : '09:00'} aria-label={`${weekdayNames[d]} start`} className={inputClass} />
                        <input type="time" name={`end_${d}`} defaultValue={b ? minutesToLabel(b.end_minute) : '17:00'} aria-label={`${weekdayNames[d]} end`} className={inputClass} />
                      </div>
                    )
                  })}
                  <div className="pt-2"><SubmitButton>Save availability</SubmitButton></div>
                </form>
              </Card>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card title="Notifications">
            <p className="mb-4 text-[13.5px] text-navy/60">Get instant alerts for new messages, tasks, meetings and invoices, even when the portal is closed.</p>
            <PushToggle />
          </Card>
          <Card title="Install the app">
            <p className="mb-4 text-[13.5px] text-navy/60">Add the Eaglescroft portal to your home screen or desktop for one-tap access and reliable notifications.</p>
            <InstallButton />
            <p className="mt-3 text-[12.5px] text-navy/45">On iPhone: open in Safari → Share → Add to Home Screen.</p>
          </Card>
        </div>
      </div>
    </>
  )
}
