import { formatPrice, type Price } from './pricing'

/*
 * Eaglescroft's OWN products (client builds live in projects.ts / portfolio).
 * Keep this honest: update `progress` together with `progressUpdatedAt`, and only
 * list a partner once they've approved being named publicly.
 */

export type ProductStatus = 'concept' | 'building' | 'beta' | 'live'
export type FeatureStatus = 'shipped' | 'building' | 'planned'

export type Product = {
  slug: string
  name: string
  tagline: string
  category: string
  /** schema.org SoftwareApplication category */
  appCategory: string
  summary: string
  audience: string
  status: ProductStatus
  /** 0–100, roadmap to v1.0 */
  progress: number
  progressUpdatedAt: string
  accent: string
  stack: string[]
  features: { title: string; status: FeatureStatus }[]
  pricing: { price: Price; billing: string; note?: string } | 'free' | 'coming-soon'
  releases: { version: string; date: string; notes: string[] }[]
  /** quick-start documentation shown on the product page */
  docs: { title: string; body: string }[]
  partners: { name: string; role: string; url?: string }[]
  links: { live?: string }
}

export const statusLabel: Record<ProductStatus, string> = {
  concept: 'Concept',
  building: 'In development',
  beta: 'Beta',
  live: 'Live',
}

export const featureStatusLabel: Record<FeatureStatus, string> = {
  shipped: 'Shipped',
  building: 'Building',
  planned: 'Planned',
}

export const products: Product[] = [
  {
    slug: 'callcapture-ai',
    name: 'CallCapture AI',
    tagline: 'The 24/7 AI receptionist for home-service businesses.',
    category: 'AI · Voice receptionist',
    appCategory: 'BusinessApplication',
    summary:
      'CallCapture AI answers every call your team can’t — qualifying the job, booking it into your calendar and sending reminders — so plumbers, electricians and HVAC teams stop losing work to whoever picks up first.',
    audience: 'Plumbers, electricians, HVAC and other home-service teams',
    status: 'beta',
    progress: 70,
    progressUpdatedAt: '2026-10-23',
    accent: '#2477f2',
    stack: ['Next.js', 'Voice AI', 'Calendar APIs', 'CRM integrations'],
    features: [
      { title: '24/7 AI call answering', status: 'shipped' },
      { title: 'Calendar booking & reminders', status: 'shipped' },
      { title: 'Customisable call templates', status: 'shipped' },
      { title: 'Automated workflow setup', status: 'shipped' },
      { title: 'CRM & calendar integrations', status: 'building' },
      { title: 'Advanced analytics & reporting', status: 'building' },
    ],
    pricing: {
      price: { currency: 'USD', min: 297 },
      billing: 'one-time · from',
      note: '30-day money-back guarantee — no results, pay nothing.',
    },
    releases: [
      {
        version: 'v0.9 beta',
        date: '2026-06-25',
        notes: ['Public landing site and checkout', 'Onboarding for first home-service businesses', 'Booking + reminder workflows'],
      },
    ],
    docs: [
      { title: 'How it works', body: 'Forward your business line (or missed calls) to your CallCapture number. The AI answers in your business name, captures the caller’s job details and books them into your calendar.' },
      { title: 'Onboarding', body: 'We configure your services, service area, hours and booking rules with you on a dedicated onboarding call — most teams are live within days.' },
      { title: 'Integrations', body: 'Bookings sync to your calendar and confirmations go out automatically. CRM integrations are rolling out during the beta.' },
    ],
    partners: [],
    links: {},
  },
  {
    slug: 'gradeit',
    name: 'GradeIt',
    tagline: 'Secure computer-based testing for schools and exam bodies.',
    category: 'EdTech · CBT platform',
    appCategory: 'EducationalApplication',
    summary:
      'GradeIt runs computer-based exams end to end — question banks, timed sittings, live monitoring and instant results. Its exam engine already powers real post-UTME screening at a Nigerian college, and we’re now turning it into a hosted, multi-school platform.',
    audience: 'Schools, colleges and exam bodies across Africa',
    status: 'building',
    progress: 55,
    progressUpdatedAt: '2026-10-23',
    accent: '#2563EB',
    stack: ['Next.js', 'PostgreSQL', 'Prisma', 'Docker'],
    features: [
      { title: 'Question banks with bulk import', status: 'shipped' },
      { title: 'Timed exams with windows & attempt limits', status: 'shipped' },
      { title: 'Live monitor — pause, resume, extend, terminate', status: 'shipped' },
      { title: 'Full-screen exam runner with question dock', status: 'shipped' },
      { title: 'Instant marking & result exports', status: 'shipped' },
      { title: 'Runs offline on a school LAN', status: 'shipped' },
      { title: 'Multi-school hosting (multi-tenancy)', status: 'building' },
      { title: 'AI proctoring — lockdown + in-browser webcam checks', status: 'planned' },
    ],
    pricing: 'coming-soon',
    releases: [
      { version: 'v0.6', date: '2026-09-22', notes: ['GradeIt split out as a standalone product', 'New white + blue product UI and landing page'] },
      { version: 'v0.5', date: '2026-08-27', notes: ['First live high-stakes sitting — 100-question screening exam', 'Re-grade tooling and auditable results'] },
      { version: 'v0.3', date: '2026-07-26', notes: ['Live monitor with pause / terminate / time extension', 'In-exam calculator, dark mode and candidate profiles'] },
    ],
    docs: [
      { title: 'Set up an exam', body: 'Create a subject bank, import questions (one correct option each), then schedule an exam with its window, duration, attempt limit and target class.' },
      { title: 'Candidate access', body: 'Bulk-load candidates from your applicant list; each gets a login ID and password. Accounts can be paused without losing their results.' },
      { title: 'On exam day', body: 'Candidates sit in a locked, full-screen runner. Admins watch progress live and can pause, extend or end any attempt.' },
      { title: 'Results', body: 'Marking is instant. Export ranked results for screening, and re-grade defective items with a full audit trail.' },
    ],
    partners: [],
    links: {},
  },
  {
    slug: 'hidden-in-my-heart',
    name: 'Hidden in My Heart',
    tagline: 'Memorise scripture, one card at a time.',
    category: 'Faith · Mobile app (PWA)',
    appCategory: 'LifestyleApplication',
    summary:
      'A swipeable Bible memory-verse app with 122 KJV verses across 16 themes — each with highlighted key phrases and a short preacher’s note on the verse’s basis. Installs to your home screen and works fully offline.',
    audience: 'Believers, Bible-study groups and churches',
    status: 'beta',
    progress: 85,
    progressUpdatedAt: '2026-10-23',
    accent: '#2b2d5b',
    stack: ['Next.js', 'PWA', 'Offline-first'],
    features: [
      { title: 'Swipeable verse cards', status: 'shipped' },
      { title: '122 KJV verses in 16 themes', status: 'shipped' },
      { title: 'Highlighted key phrases + preacher’s notes', status: 'shipped' },
      { title: 'Install to home screen, works offline', status: 'shipped' },
      { title: 'Progress tracking & review reminders', status: 'planned' },
    ],
    pricing: 'free',
    releases: [
      { version: 'v0.9', date: '2026-08-03', notes: ['Expanded to 122 verses and 16 themes', 'Preacher’s notes on every verse'] },
      { version: 'v0.5', date: '2026-07-26', notes: ['First build — swipe deck, categories, offline PWA'] },
    ],
    docs: [
      { title: 'Install', body: 'Open the app in your phone’s browser and choose “Add to Home Screen”. It then works offline like a native app.' },
      { title: 'Practise', body: 'Pick a theme, swipe through the cards and read the highlighted phrases aloud until the verse sticks.' },
    ],
    partners: [],
    links: {},
  },
]

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

/** "Free" · "Pricing soon" · "$297 one-time · from" */
export function productPriceLabel(p: Product) {
  if (p.pricing === 'free') return 'Free'
  if (p.pricing === 'coming-soon') return 'Pricing soon'
  return formatPrice(p.pricing.price)
}

/** "23 Oct 2026" */
export function formatProductDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}
