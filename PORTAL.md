# Eaglescroft client portal

Lives inside this site: clients use **/portal**, the team uses **/admin**. Accounts are invite-only.

## What's in it

**Clients**
- Sign in with a one-time 6-digit email code (no passwords).
- See every project: progress, goals and targets, features in scope, a milestone timeline and daily updates.
- Fill in the project brief. The questions depend on the service (website, CRM, automation, video, branding, SEO or social).
- Raise tickets and revision requests. The included revision rounds are enforced.
- Open invoices and pay them through Paystack, or print or save them as PDF.
- See their full transaction history.
- Download deliverables and the handover pack.
- When the project is complete, leave a rating and get a link to review Eaglescroft on Google. Every client sees the Google link, whatever rating they give.

**Admin**
- Create client accounts, optionally emailing them a sign-in code straight away.
- Create a project from a service template. This seeds its milestones, the revision allowance and a draft deposit invoice.
- Update status and progress, post daily updates, and advance milestones.
- Answer and resolve tickets.
- Raise invoices (deposit, milestone, balance, retainer or extra work), send or void them, and record bank transfers.
- Upload files. They go straight to storage, so there's no size cap from the server.

## Going live (one-time)

1. **Create a Supabase project** at supabase.com, in the region closest to your clients.
2. **Apply the schema.** In the SQL editor, run `supabase/migrations/20261111000000_client_portal.sql`, or run `npx supabase db push`.
3. **Set up email.** This is under Auth → Email Templates → *Magic Link*. The body must include `{{ .Token }}` so clients receive the 6-digit code; copy `supabase/templates/magic_link.html`. For reliable delivery, set custom SMTP under Auth → SMTP, for example Resend with `eaglescroft.com.ng` verified.
4. **Set the URLs.** Under Auth → URL configuration, the Site URL is `https://eaglescroft.com.ng`. Add `https://eaglescroft.com.ng/auth/callback` to the redirect URLs.
5. **Add the Vercel environment variables:**
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
   - `PAYSTACK_SECRET_KEY`
   - `NEXT_PUBLIC_GOOGLE_REVIEW_URL`
6. **Create the first admin:**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… node scripts/portal-admin.mjs you@eaglescroft.com.ng "Your Name"
   ```
7. **Set up Paystack.** In Settings → API Keys & Webhooks, set the webhook URL to `https://eaglescroft.com.ng/api/paystack/webhook`. USD invoices need Paystack's USD (domiciliary) approval; NGN works immediately.

Until step 5 is done, `/portal` and `/admin` show a "launching soon" page.

## Local development

```bash
npx supabase start          # Docker Desktop must be running
npx supabase status         # copy API URL, anon key and service_role key into .env.local
node scripts/portal-admin.mjs you@example.com "You"
npm run dev                 # sign-in emails appear in Mailpit: http://127.0.0.1:54324
```
