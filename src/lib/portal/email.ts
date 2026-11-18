/**
 * Transactional email through Resend (from your verified domain). Silently skipped when
 * RESEND_API_KEY isn't set, so local dev and early launch work without it.
 */
const FROM = process.env.EMAIL_FROM || 'Eaglescroft <notifications@eaglescroft.com.ng>'

export const emailEnabled = () => Boolean(process.env.RESEND_API_KEY)

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

export function brandedEmail({ title, body, cta }: { title: string; body: string; cta?: { label: string; url: string } }) {
  return `<!doctype html><html><body style="margin:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;color:#0b1530">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:28px 14px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:20px;border:1px solid #e7eaf3">
<tr><td style="background:#001e60;border-radius:20px 20px 0 0;padding:20px 26px;color:#fff;font-weight:bold;letter-spacing:3px;font-size:13px">EAGLESCROFT</td></tr>
<tr><td style="padding:26px">
<h1 style="margin:0 0 12px;font-size:20px;color:#001e60">${escapeHtml(title)}</h1>
<p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#48526e;white-space:pre-line">${escapeHtml(body)}</p>
${cta ? `<a href="${cta.url}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 22px;border-radius:999px">${escapeHtml(cta.label)}</a>` : ''}
</td></tr></table>
<p style="margin:14px 0 0;font-size:12px;color:#7a86a3">Eaglescroft Limited · You can turn off email alerts in your portal settings.</p>
</td></tr></table></body></html>`
}

export async function sendEmail({ to, subject, html }: { to: string | string[]; subject: string; html: string }) {
  if (!emailEnabled()) return { skipped: true }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to, subject, html }),
    cache: 'no-store',
  })
  if (!res.ok) console.error('Resend error', res.status, await res.text().catch(() => ''))
  return { skipped: false, ok: res.ok }
}
