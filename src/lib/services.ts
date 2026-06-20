import {
  Code2, PenTool, Sparkles, Clapperboard, Share2, TrendingUp, ServerCog,
  type LucideIcon,
} from 'lucide-react'

export type Service = {
  slug: string
  title: string
  short: string
  description: string
  icon: LucideIcon
  /** icon-tile colors (prototype palette) */
  color: string
  tint: string
  tags: string[]
  deliverables: string[]
  process: string[]
}

export const services: Service[] = [
  {
    slug: 'web-development',
    title: 'Web Development',
    short: 'Scalable, high-performance web applications.',
    description:
      'Full-stack apps in Next.js, React & Node — engineered for speed, scale and conversion.',
    icon: Code2,
    color: 'oklch(0.62 0.16 75)',
    tint: 'oklch(0.95 0.05 85)',
    tags: ['Next.js', 'React', 'Node', 'E-commerce'],
    deliverables: ['Next.js & React builds', 'Server-side rendering', 'Headless & custom CMS', 'E-commerce platforms', 'API & backend systems'],
    process: ['Discovery & architecture', 'Design system & build', 'Testing & optimisation', 'Launch & support'],
  },
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    short: 'Interfaces that feel effortless.',
    description:
      'Research-driven product design in Figma — interfaces that feel effortless and convert.',
    icon: PenTool,
    color: 'oklch(0.58 0.18 300)',
    tint: 'oklch(0.95 0.04 300)',
    tags: ['Figma', 'Prototyping', 'Design systems'],
    deliverables: ['User research', 'Wireframing & prototyping', 'Design systems', 'Conversion optimisation', 'Usability testing'],
    process: ['Research & audit', 'Wireframe & prototype', 'High-fidelity design', 'Handoff & iteration'],
  },
  {
    slug: 'branding-identity',
    title: 'Branding & Identity',
    short: 'Brands built to be remembered.',
    description:
      'Positioning, visual systems and messaging that make businesses unforgettable.',
    icon: Sparkles,
    color: 'oklch(0.6 0.18 25)',
    tint: 'oklch(0.95 0.04 25)',
    tags: ['Strategy', 'Logo', 'Guidelines'],
    deliverables: ['Brand strategy', 'Logo & visual identity', 'Messaging frameworks', 'Brand guidelines', 'Social media kits'],
    process: ['Brand discovery', 'Strategy & positioning', 'Visual identity', 'Guidelines & rollout'],
  },
  {
    slug: 'video-motion',
    title: 'Video & Motion',
    short: 'Motion that moves audiences.',
    description:
      'Cinematic edits, reels and motion graphics crafted to capture attention.',
    icon: Clapperboard,
    color: 'oklch(0.6 0.13 195)',
    tint: 'oklch(0.95 0.04 195)',
    tags: ['Premiere', 'After Effects', 'Motion'],
    deliverables: ['Promo & ad edits', 'Social reels', 'Motion graphics', 'Explainer videos', 'Brand films'],
    process: ['Brief & storyboard', 'Edit & motion', 'Sound & grade', 'Delivery & formats'],
  },
  {
    slug: 'social-media',
    title: 'Social Media',
    short: 'Presence that compounds.',
    description:
      'Content strategy, creative and community growth that turns followers into customers.',
    icon: Share2,
    color: 'oklch(0.55 0.17 265)',
    tint: 'oklch(0.95 0.04 265)',
    tags: ['Strategy', 'Reels', 'Community'],
    deliverables: ['Content strategy', 'Creative & copy', 'Scheduling & publishing', 'Community management', 'Performance reporting'],
    process: ['Audit & strategy', 'Content calendar', 'Create & publish', 'Analyse & scale'],
  },
  {
    slug: 'digital-marketing-seo',
    title: 'Marketing & SEO',
    short: 'Growth you can measure.',
    description:
      'Technical SEO, Core Web Vitals and data-driven campaigns that grow ROI.',
    icon: TrendingUp,
    color: 'oklch(0.58 0.15 150)',
    tint: 'oklch(0.95 0.04 150)',
    tags: ['SEO', 'Analytics', 'CWV'],
    deliverables: ['Technical SEO audits', 'On-page & off-page SEO', 'Core Web Vitals', 'Analytics & Search Console', 'Content strategy'],
    process: ['Audit & research', 'Strategy & roadmap', 'Implementation', 'Measure & optimise'],
  },
  {
    slug: 'it-management',
    title: 'IT & Automation',
    short: 'Infrastructure you can rely on.',
    description:
      'Reliable hosting, security hardening and AI automation that cut manual overhead.',
    icon: ServerCog,
    color: 'oklch(0.55 0.1 230)',
    tint: 'oklch(0.95 0.03 230)',
    tags: ['Hosting', 'Security', 'AI'],
    deliverables: ['Hosting & domain management', 'Security hardening', 'AI automation workflows', 'Performance optimisation', 'Ongoing maintenance'],
    process: ['Assessment', 'Architecture & setup', 'Automation', 'Monitoring & support'],
  },
]
