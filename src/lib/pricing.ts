import { Monitor, Database, Workflow, Clapperboard, type LucideIcon } from 'lucide-react'

export type Currency = 'USD' | 'NGN'

/** Structured price — every display string, chatbot line, FAQ and JSON-LD offer derives from this. */
export type Price = {
  currency: Currency
  min: number
  /** upper bound of a range ("$X – $Y") */
  max?: number
  /** open-ended ("$X+") — scoped to features */
  open?: boolean
}

export type PricingTier = {
  name: string
  level: 'basic' | 'business' | 'premium'
  price: Price
  billing: string
  tagline: string
  features: string[]
  popular?: boolean
}

export type Retainer = {
  label: string
  price: Price
  note: string
}

export type PricingCategory = {
  slug: string
  label: string
  icon: LucideIcon
  title: string
  headline: string
  description: string
  tiers: PricingTier[]
  retainer?: Retainer
}

/** Currency every published price is quoted in. */
export const CURRENCY = 'NGN' as Currency

export const pricingCategories: PricingCategory[] = [
  /* ------------------------------- WEBSITES ------------------------------- */
  {
    slug: 'websites',
    label: 'Websites',
    icon: Monitor,
    title: 'Website Design & Development Pricing',
    headline: 'Websites built to win customers.',
    description:
      'Transparent pricing for website design and development — from lean business sites to fully custom web platforms with dashboards, payments and API integrations.',
    tiers: [
      {
        name: 'Basic Website',
        level: 'basic',
        price: { currency: CURRENCY, min: 180_000 },
        billing: 'one-time',
        tagline: 'Get online properly, fast.',
        features: [
          '1–5 pages website',
          'Mobile responsive design',
          'Contact form + WhatsApp button',
          'Basic SEO setup',
          'Google Maps integration',
          'Simple UI (template-based or light custom)',
        ],
      },
      {
        name: 'Business Website',
        level: 'business',
        price: { currency: CURRENCY, min: 280_000 },
        billing: 'one-time',
        tagline: 'The serious growth website.',
        popular: true,
        features: [
          '5–12 pages',
          'Custom UI design',
          'Blog system (optional)',
          'Advanced SEO setup',
          'Speed optimization',
          'Lead capture forms',
          'WhatsApp + email integration',
          'Analytics setup (Google Analytics / Search Console)',
        ],
      },
      {
        name: 'Premium / Custom Website',
        level: 'premium',
        price: { currency: CURRENCY, min: 350_000, open: true },
        billing: 'one-time · scoped to features',
        tagline: 'Priced on your features and business customisation.',
        features: [
          'Fully custom design (UI/UX)',
          '10–30 pages or more',
          'Web app features (portal, dashboard)',
          'API integrations',
          'Payment integration (Paystack / Stripe)',
          'Advanced SEO + conversion system',
          'Admin dashboard (optional)',
        ],
      },
    ],
    retainer: {
      label: 'Website Maintenance',
      price: { currency: CURRENCY, min: 60_000, max: 100_000 },
      note: 'per month · hosting, security, updates & fixes',
    },
  },

  /* ---------------------------------- CRM --------------------------------- */
  {
    slug: 'crm',
    label: 'CRM Systems',
    icon: Database,
    title: 'CRM Development Pricing',
    headline: 'Every lead captured, tracked and closed.',
    description:
      'Pricing for Eaglescroft CRM systems — from simple pipelines to SaaS-level custom CRMs with role-based access, sales automation and deep API integrations.',
    tiers: [
      {
        name: 'Basic CRM Setup',
        level: 'basic',
        price: { currency: CURRENCY, min: 299_000 },
        billing: 'one-time',
        tagline: 'Stop losing leads in your inbox.',
        features: [
          'Contact management system',
          'Basic pipeline (Lead → Contacted → Won/Lost)',
          'Simple dashboard',
          'Manual tracking system',
          'Basic automation (email / WhatsApp alerts)',
        ],
      },
      {
        name: 'Business CRM System',
        level: 'business',
        price: { currency: CURRENCY, min: 599_000 },
        billing: 'one-time',
        tagline: 'Your whole sales process, in one place.',
        popular: true,
        features: [
          'Full CRM dashboard',
          'Lead pipeline automation',
          'Multi-user access (team system)',
          'Customer history tracking',
          'Email + WhatsApp integration',
          'Lead tagging & segmentation',
          'Reporting dashboard',
        ],
      },
      {
        name: 'Advanced / Custom CRM',
        level: 'premium',
        price: { currency: CURRENCY, min: 1_500_000, max: 2_500_000, open: true },
        billing: 'one-time',
        tagline: 'SaaS-level CRM, built around your business.',
        features: [
          'Fully custom CRM system (SaaS-level)',
          'Role-based access (admin, staff, manager)',
          'Sales automation workflows',
          'API integrations (Paystack, websites, apps)',
          'Advanced analytics & reporting',
          'Custom business logic per client',
        ],
      },
    ],
    retainer: {
      label: 'CRM Maintenance',
      price: { currency: CURRENCY, min: 100_000, max: 200_000 },
      note: 'per month · support, improvements & monitoring',
    },
  },

  /* ------------------------------ AUTOMATION ------------------------------ */
  {
    slug: 'automation',
    label: 'Automation',
    icon: Workflow,
    title: 'Business Automation Pricing',
    headline: 'Systems that work while you sleep.',
    description:
      'Pricing for automation services — email and WhatsApp sequences, sales funnels, appointment booking, AI chatbots and full multi-department workflow automation.',
    tiers: [
      {
        name: 'Basic Automation',
        level: 'basic',
        price: { currency: CURRENCY, min: 299_000 },
        billing: 'setup',
        tagline: 'Never miss a follow-up again.',
        features: [
          'Email automation sequences',
          'WhatsApp auto-replies',
          'Basic lead follow-up system',
          'Simple workflows (2–5 steps)',
        ],
      },
      {
        name: 'Business Automation System',
        level: 'business',
        price: { currency: CURRENCY, min: 450_000 },
        billing: 'setup',
        tagline: 'A full funnel that runs itself.',
        popular: true,
        features: [
          'Multi-step workflows (sales funnels)',
          'Lead nurturing automation',
          'Appointment booking automation',
          'CRM integration',
          'WhatsApp + email + SMS automation',
          'Customer follow-up system',
        ],
      },
      {
        name: 'Advanced Business Automation',
        level: 'premium',
        price: { currency: CURRENCY, min: 1_299_000, max: 3_000_000 },
        billing: 'setup',
        tagline: 'Automate the whole operation.',
        features: [
          'Full business workflow automation',
          'Multi-department automation (sales, ops, support)',
          'AI chatbot integration',
          'Smart triggers (behavior-based automation)',
          'Advanced CRM sync',
          'API integrations with business tools',
        ],
      },
    ],
    retainer: {
      label: 'Automation Support',
      price: { currency: CURRENCY, min: 250_000 },
      note: 'per month · monitoring, tuning & new workflows',
    },
  },

  /* --------------------------------- VIDEO -------------------------------- */
  {
    slug: 'video',
    label: 'Video Editing',
    icon: Clapperboard,
    title: 'Video Editing & Production Pricing',
    headline: 'Content that stops the scroll.',
    description:
      'Pricing for video editing and production — social reels, business promos and full brand commercials with motion graphics, scripting and ads-ready formats.',
    tiers: [
      {
        name: 'Social Media Videos',
        level: 'basic',
        price: { currency: CURRENCY, min: 35_000 },
        billing: 'per video',
        tagline: 'Short-form content that performs.',
        features: [
          'Short reels (15–60 sec)',
          'Cuts, transitions, captions',
          'Basic motion graphics',
          'TikTok / Instagram / YouTube Shorts format',
        ],
      },
      {
        name: 'Business Promo Videos',
        level: 'business',
        price: { currency: CURRENCY, min: 99_000 },
        billing: 'per video',
        tagline: 'Tell your brand story properly.',
        popular: true,
        features: [
          '1–3 minute promotional video',
          'Stock footage + motion graphics',
          'Brand messaging',
          'Script arrangement (light)',
          'Music + sound design',
        ],
      },
      {
        name: 'Premium Video Production',
        level: 'premium',
        price: { currency: CURRENCY, min: 250_000, max: 499_000 },
        billing: 'per video',
        tagline: 'A commercial worth running.',
        features: [
          'Full brand commercial',
          'Advanced motion graphics',
          'Storyboard + scripting',
          'High-end editing',
          'Ads-ready versions',
          'Multiple formats (social + TV + web)',
        ],
      },
    ],
    retainer: {
      label: 'Monthly Content Package',
      price: { currency: CURRENCY, min: 250_000, max: 600_000 },
      note: 'per month · 4–20 videos depending on plan',
    },
  },
]

export function getPricingCategory(slug: string) {
  return pricingCategories.find((c) => c.slug === slug)
}

const SYMBOL: Record<Currency, string> = { USD: '$', NGN: '₦' }

/** Plain-English name of the published currency, for copy and metadata. */
export const currencyName = CURRENCY === 'USD' ? 'US dollars' : 'Naira'

/** 180000 → "₦180,000"; compact → "₦180k" / "$1.5m". */
export function formatAmount(amount: number, currency: Currency = CURRENCY, compact = false) {
  const sym = SYMBOL[currency]
  if (!compact) return `${sym}${amount.toLocaleString('en-US')}`
  if (amount >= 1_000_000) return `${sym}${+(amount / 1_000_000).toFixed(1)}m`
  if (amount >= 1_000) return `${sym}${+(amount / 1_000).toFixed(1)}k`
  return `${sym}${amount}`
}

/** Display string for a tier or retainer: "$X", "$X+", "$X – $Y" or "$X – $Y+". */
export function formatPrice(price: Price) {
  const lo = formatAmount(price.min, price.currency)
  const range = price.max ? `${lo} – ${formatAmount(price.max, price.currency)}` : lo
  return price.open ? `${range}+` : range
}

/** Entry price of a category, e.g. startingPrice('websites') → "₦180,000". */
export function startingPrice(slug: string, compact = false) {
  const tier = getPricingCategory(slug)?.tiers[0]
  return tier ? formatAmount(tier.price.min, tier.price.currency, compact) : ''
}

/** Footer note under the pricing tables, worded for the published currency. */
export const currencyNote =
  CURRENCY === 'USD'
    ? 'All prices in US dollars · Final quote confirmed after a free consultation · Local-currency invoicing available on request'
    : 'All prices in Naira · Final quote confirmed after a free consultation · International clients billed in USD/GBP equivalent'

/** schema.org Offer fields — numeric price for fixed tiers, min/max for ranges. */
export function offerPriceJsonLd(price: Price, billing: string) {
  const fixed = !price.max && !price.open
  return {
    priceCurrency: price.currency,
    ...(fixed ? { price: price.min } : {}),
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: price.currency,
      ...(fixed ? { price: price.min } : { minPrice: price.min }),
      ...(price.max ? { maxPrice: price.max } : {}),
      description: `${formatPrice(price)} (${billing})`,
    },
  }
}
