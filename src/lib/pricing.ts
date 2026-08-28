import { Monitor, Database, Workflow, Clapperboard, type LucideIcon } from 'lucide-react'

export type PricingTier = {
  name: string
  level: 'basic' | 'business' | 'premium'
  price: string
  billing: string
  tagline: string
  features: string[]
  popular?: boolean
}

export type Retainer = {
  label: string
  price: string
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
        price: '₦120,000 – ₦250,000',
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
        price: '₦300,000 – ₦800,000',
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
        price: '₦900,000 – ₦3,000,000+',
        billing: 'one-time',
        tagline: 'A full web platform, built your way.',
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
      price: '₦20,000 – ₦100,000',
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
        price: '₦150,000 – ₦400,000',
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
        price: '₦500,000 – ₦1,500,000',
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
        price: '₦2,000,000 – ₦8,000,000+',
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
      price: '₦50,000 – ₦300,000',
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
        price: '₦100,000 – ₦300,000',
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
        price: '₦400,000 – ₦1,200,000',
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
        price: '₦1,500,000 – ₦5,000,000+',
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
      price: '₦50,000 – ₦250,000',
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
        price: '₦10,000 – ₦30,000',
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
        price: '₦40,000 – ₦120,000',
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
        price: '₦150,000 – ₦500,000+',
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
      price: '₦100,000 – ₦600,000',
      note: 'per month · 4–20 videos depending on plan',
    },
  },
]

export function getPricingCategory(slug: string) {
  return pricingCategories.find((c) => c.slug === slug)
}
