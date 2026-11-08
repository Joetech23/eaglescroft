export type ProjectCategory = 'website' | 'video' | 'social'

export type Project = {
  slug: string
  title: string
  category: ProjectCategory
  url?: string
  industry: string
  description: string
  stack: string[]
  featured?: boolean
  /** our own screenshot (in /public) — used instead of the live capture when a site can't be captured */
  image?: string
  /** extra screenshots shown on the project page */
  gallery?: string[]
  /** self-hosted film for video projects (in /public) */
  video?: { src: string; poster: string }
  // Case study (optional — populated for flagship projects)
  caseStudy?: {
    problem: string
    solution: string
    process: string[]
    results: { label: string; value: string }[]
  }
}

/**
 * Live screenshot helper — renders a real, up-to-date screenshot of a site.
 * Falls back gracefully if the local capture in /portfolio is missing.
 */
export function shot(url?: string) {
  if (!url) return ''
  const clean = url.replace(/^https?:\/\//, '')
  return `https://image.thum.io/get/width/1200/crop/800/noanimate/https://${clean}`
}

/** full-length capture used for the hover-scroll browser-preview cards */
export function shotTall(url?: string) {
  if (!url) return ''
  const clean = url.replace(/^https?:\/\//, '')
  return `https://image.thum.io/get/width/1200/noanimate/https://${clean}`
}

export const catColor: Record<ProjectCategory, string> = {
  website: 'oklch(0.72 0.13 230)',
  video: 'oklch(0.72 0.15 300)',
  social: 'oklch(0.74 0.14 150)',
}

export const projects: Project[] = [
  // ── Latest work ──
  {
    slug: 'angelus-capital-partners',
    title: 'Angelus Capital Partners',
    category: 'website',
    url: 'angeluscapitalpartners.com',
    industry: 'Finance · Investment Advisory',
    description:
      'A corporate site for a financial advisory, capital solutions and investment management firm — three integrated platforms, sector transactions, leadership and insights, built to earn institutional trust.',
    stack: ['WordPress', 'Custom Design', 'SEO'],
    featured: true,
    image: '/portfolio/angelus-home.webp',
    gallery: ['/portfolio/angelus-ticker.webp', '/portfolio/angelus-glance.webp'],
  },
  {
    slug: 'fasttrack-removals',
    title: 'FastTrack Team Logistics',
    category: 'website',
    url: 'fstremoval.co.uk',
    industry: 'Removals & Logistics (UK)',
    description:
      'A removals, storage and pallet-delivery site for London and the South East — a two-minute postcode quote flow, WhatsApp photo quotes and live move tracking.',
    stack: ['Custom Build', 'Quote Flow', 'Local SEO'],
    featured: true,
    image: '/portfolio/fasttrack-home.webp',
    gallery: ['/portfolio/fasttrack-areas.webp'],
  },
  // ── Top sites (featured, in display order) ──
  {
    slug: 'aehobbs',
    title: 'A E Hobbs Pharmacy',
    category: 'website',
    url: 'aehobbsltd.com',
    industry: 'Healthcare · Pharmacy (UK)',
    description:
      'Royal Tunbridge Wells’ independent pharmacy, trusted since 1895 — rebuilt as a modern platform for NHS prescriptions, Pharmacy First, the travel clinic and vaccinations, all one tap away.',
    stack: ['Next.js', 'TailwindCSS', 'Technical SEO'],
    featured: true,
  },
  {
    slug: 'spirit-of-excellence-tuition',
    title: 'Spirit of Excellence Tuition',
    category: 'website',
    url: 'soetuition.com',
    industry: 'Education (UK)',
    description:
      'A UK primary tutoring platform for Reception to Year 6 and 11+ preparation, with an integrated digital resource shop, parent portal and secure checkout.',
    stack: ['Next.js', 'Supabase', 'Stripe'],
    featured: true,
  },
  {
    slug: 'careaccess',
    title: 'CareAccess Nigeria',
    category: 'website',
    url: 'careaccess.ng',
    industry: 'Healthcare',
    description:
      'A healthcare access platform connecting patients to medical services across Nigeria, with a scalable Node.js API and Next.js frontend.',
    stack: ['Next.js', 'Node.js', 'Express.js', 'MongoDB'],
    featured: true,
  },
  {
    slug: 'lrvlc',
    title: 'LRVLC',
    category: 'website',
    url: 'lrvlc.com',
    industry: 'Recruitment & Care (UK)',
    description:
      'A UK site for Lineup Recruitment and Vine Lodge Care — healthcare staffing and personalised home care under one brand, with division pages, live proof points and call-first enquiry.',
    stack: ['Next.js', 'React', 'TailwindCSS'],
    featured: true,
    image: '/portfolio/lrvlc-home.webp',
    gallery: ['/portfolio/lrvlc-stats.webp'],
  },
  {
    slug: 'techbridge-digital',
    title: 'TechBridge Digital',
    category: 'website',
    url: 'techbridgedigital.co.uk',
    industry: 'IT Consultancy (UK)',
    description:
      'A London IT consultancy site for AWS cloud architecture, cyber security, penetration testing, data & AI and managed IT — positioned to win public-sector and finance clients.',
    stack: ['Next.js', 'TailwindCSS', 'Technical SEO'],
    featured: true,
  },
  {
    slug: 'learn-tech-hub',
    title: 'Learn Tech Hub',
    category: 'website',
    url: 'lth.dgclgroup.com',
    industry: 'EdTech · Cloud Training (UK)',
    description:
      'A learning platform for DGCL Digital Cloud Academy — four tech courses, 140 narrated AWS lessons with a free start, and a learner dashboard with progress, points and weekly goals.',
    stack: ['Next.js', 'Supabase', 'LMS'],
    featured: true,
    image: '/portfolio/lth-home.webp',
    gallery: ['/portfolio/lth-courses.webp', '/portfolio/lth-dashboard.webp'],
  },
  {
    slug: 'mrhabs-mc',
    title: 'Mr. Habs MC',
    category: 'website',
    url: 'mrhabsmc.com',
    industry: 'Personal Brand',
    description:
      'A personal brand website for a professional entertainer with event booking, media galleries, and conversion-optimised CTAs.',
    stack: ['WordPress', 'Custom Theme', 'SEO'],
    featured: true,
  },
  {
    slug: 'care-best-initiative',
    title: 'Care Best Initiative',
    category: 'website',
    url: 'cbi.ngo',
    industry: 'NGO · Humanitarian',
    description:
      'A national NGO platform presenting healthcare, clean water, education, nutrition and protection programmes reaching 1.5M+ lives across 10 Nigerian states.',
    stack: ['Next.js', 'TailwindCSS', 'Donor-ready content'],
    featured: true,
  },
  {
    slug: 'p4-studio',
    title: 'P4 Studio Limited',
    category: 'website',
    url: 'p4studioltd.com',
    industry: 'Architecture',
    description:
      'A corporate architectural firm website with project portfolio gallery, brand identity, content strategy, and social media kit.',
    stack: ['WordPress', 'Elementor', 'Brand Identity'],
    featured: true,
  },
  {
    slug: 'arcmarshal',
    title: 'Arcmarshal Dzine Koncept',
    category: 'website',
    url: 'arcmarshaldzine.com',
    industry: 'Design & Construction',
    description:
      'A design and construction company site for Abuja — residential, commercial and industrial projects, renovations and interior finishing, built to turn bold ideas into enquiries.',
    stack: ['Next.js', 'TailwindCSS', 'SEO'],
    featured: true,
  },
  // ── Nigeria (.com.ng) ──
  {
    slug: 'starhomes',
    title: 'Star Homes',
    category: 'website',
    url: 'starhomes.com.ng',
    industry: 'Real Estate',
    description:
      'A modern Nigerian real-estate platform with rich property listings, smart search and a conversion-focused enquiry flow — built for speed and trust.',
    stack: ['Next.js', 'React', 'TailwindCSS'],
    featured: true,
    caseStudy: {
      problem:
        'Star Homes needed a fast, trustworthy platform where buyers could browse properties easily and enquire without friction — and rank against established real-estate portals.',
      solution:
        'We built a high-performance Next.js platform with rich listings, smart filtering and a streamlined enquiry flow, tuned for Core Web Vitals and technical SEO from day one.',
      process: [
        'Discovery & property-buyer journey mapping',
        'Listing + search UX design',
        'Next.js build with SEO-first architecture',
        'Performance tuning & Core Web Vitals',
        'Launch & growth support',
      ],
      results: [
        { label: 'Page speed', value: 'Fast' },
        { label: 'Enquiry friction', value: '↓ Reduced' },
        { label: 'Search visibility', value: '↑ Improved' },
        { label: 'Client satisfaction', value: '100%' },
      ],
    },
  },
  {
    slug: 'skyflix-media',
    title: 'Skyflix Media',
    category: 'website',
    url: 'skyflixmedia.com.ng',
    industry: 'Media & Production',
    description:
      'A production house site for photography, videography, livestreaming and broadcast work — with an Academy enrolment flow for aspiring creators.',
    stack: ['Next.js', 'Resend', 'Google Sheets'],
    featured: true,
  },
  // ── More websites ──
  {
    slug: 'enyobuilt',
    title: 'Enyobuilt',
    category: 'website',
    url: 'enyobuilt.com.ng',
    industry: 'Construction & Real Estate',
    description:
      'A construction and real estate corporate website with project gallery, service listings, and a client inquiry system.',
    stack: ['WordPress', 'Custom Design', 'SEO'],
  },
  {
    slug: 'oval-sports',
    title: 'Oval Sports Australia',
    category: 'website',
    url: 'ovalsports.com.au',
    industry: 'E-Commerce / Sports',
    description:
      'A sports equipment e-commerce store for the Australian market with full WooCommerce setup, international shipping, and currency localisation.',
    stack: ['WordPress', 'WooCommerce', 'PHP'],
  },
  {
    slug: 'heritage-hospitals',
    title: 'Heritage Hospitals',
    category: 'website',
    url: 'heritagehospitals.com',
    industry: 'Healthcare',
    description:
      'A healthcare website with appointment booking, detailed service pages, and a patient resource hub — designed to build trust and streamline care.',
    stack: ['WordPress', 'PHP', 'Custom Plugins', 'Booking System'],
  },
  {
    slug: 'dash-limo',
    title: 'Dash Limo Service',
    category: 'website',
    url: 'dashlimoservices.com',
    industry: 'Luxury Transport',
    description:
      'A luxury transportation booking site with premium UI/UX, fleet showcase, and a mobile-first online reservation system.',
    stack: ['WordPress', 'Elementor', 'Custom Booking'],
  },
  {
    slug: 'primus-learning',
    title: 'Primus Learning',
    category: 'website',
    url: 'primuslearning.io',
    industry: 'Education',
    description:
      'An interactive e-learning platform with course management, student dashboards, and fully responsive design.',
    stack: ['React.js', 'JavaScript', 'CSS3', 'REST API'],
  },
  {
    slug: 'distinct-news',
    title: 'Distinct News',
    category: 'website',
    url: 'distinctnews.com.ng',
    industry: 'Media & News',
    description:
      'A high-volume Nigerian news platform with SEO-rich architecture, category organisation, and a monetisation-ready ad system.',
    stack: ['WordPress', 'PHP', 'Technical SEO'],
  },
  {
    slug: 'datavox-media',
    title: 'Datavox Media',
    category: 'website',
    url: 'datavoxmedia.com.ng',
    industry: 'Media Agency',
    description:
      'A media and communications agency website showcasing services and brand stories with authority-signalling design.',
    stack: ['WordPress', 'Agency Design', 'SEO'],
  },
  // ── Video editing (placeholders to replace with real reels) ──
  {
    slug: 'eaglescroft-take-flight',
    title: 'Eaglescroft — “Take Flight”',
    category: 'video',
    industry: 'Motion Graphics · Brand Film',
    description:
      'Our own 47-second brand film: kinetic type, animated product UI, CRM and AI systems in motion and a closing logo reveal — the SaaS-style motion work we make for clients.',
    stack: ['Motion Graphics', 'Kinetic Typography', 'Voiceover & Sound'],
    video: { src: '/reel/eaglescroft-advert.mp4', poster: '/reel/eaglescroft-advert-poster.jpg' },
  },
  {
    slug: 'product-explainer',
    title: 'Product Explainer',
    category: 'video',
    industry: 'Explainer',
    description: 'An animated explainer breaking down a product in under 60 seconds. Sample reel — replace with your real video.',
    stack: ['After Effects', 'Illustration', 'Voiceover'],
  },
  {
    slug: 'social-ad-cut',
    title: 'Social Ad Cut',
    category: 'video',
    industry: 'Advertising',
    description: 'A punchy vertical ad edit optimised for social feeds and retention. Sample reel — replace with your real video.',
    stack: ['CapCut', 'Premiere Pro', 'Sound Design'],
  },
  // ── Social media (placeholders) ──
  {
    slug: 'social-campaign-lifestyle',
    title: 'Lifestyle Brand Campaign',
    category: 'social',
    industry: 'Social Media',
    description: 'A 30-day content system that grew engagement and built community. Sample case — replace with real assets.',
    stack: ['Content Strategy', 'Creative', 'Community'],
  },
  {
    slug: 'social-launch-grid',
    title: 'Product Launch Grid',
    category: 'social',
    industry: 'Social Media',
    description: 'A cohesive launch grid and reel series engineered for reach and conversion. Sample case — replace with real assets.',
    stack: ['Creative Direction', 'Reels', 'Paid Boost'],
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}

export const categoryLabels: Record<ProjectCategory | 'all', string> = {
  all: 'All Work',
  website: 'Websites',
  video: 'Video Editing',
  social: 'Social Media',
}
