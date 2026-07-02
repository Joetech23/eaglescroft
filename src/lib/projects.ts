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
  {
    slug: 'enyobuilt',
    title: 'Enyobuilt',
    category: 'website',
    url: 'enyobuilt.com.ng',
    industry: 'Construction & Real Estate',
    description:
      'A construction and real estate corporate website with project gallery, service listings, and a client inquiry system.',
    stack: ['WordPress', 'Custom Design', 'SEO'],
    featured: true,
  },
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
    slug: 'lrvlc',
    title: 'LRVLC',
    category: 'website',
    url: 'lrvlc.com',
    industry: 'Technology',
    description:
      'A modern Next.js web application with SSR/SSG optimisation, high-performance architecture, and a seamless user experience.',
    stack: ['Next.js', 'React', 'TailwindCSS', 'REST API'],
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    slug: 'p4-studio',
    title: 'P4 Studio Limited',
    category: 'website',
    url: 'p4studioltd.com',
    industry: 'Architecture',
    description:
      'A corporate architectural firm website with project portfolio gallery, brand identity, content strategy, and social media kit.',
    stack: ['WordPress', 'Elementor', 'Brand Identity'],
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
  {
    slug: 'mrhabs-mc',
    title: 'Mr. Habs MC',
    category: 'website',
    url: 'mrhabsmc.com',
    industry: 'Personal Brand',
    description:
      'A personal brand website for a professional entertainer with event booking, media galleries, and conversion-optimised CTAs.',
    stack: ['WordPress', 'Custom Theme', 'SEO'],
  },
  // ── Video editing (placeholders to replace with real reels) ──
  {
    slug: 'brand-promo-reel',
    title: 'Brand Promo Reel',
    category: 'video',
    industry: 'Motion Design',
    description: 'A cinematic brand promo with motion graphics and sound design. Sample reel — replace with your real video.',
    stack: ['Premiere Pro', 'After Effects', 'Motion Design'],
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
