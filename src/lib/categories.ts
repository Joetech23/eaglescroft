import type { ProjectCategory } from '@/lib/projects'

export type PortfolioCategory = {
  slug: string
  category: ProjectCategory
  label: string
  title: string
  description: string
}

/** Shareable, indexable portfolio categories → /portfolio/category/[slug] */
export const portfolioCategories: PortfolioCategory[] = [
  {
    slug: 'websites',
    category: 'website',
    label: 'Websites',
    title: 'Website Design & Development Projects',
    description:
      'High-performance websites and web platforms built by Eaglescroft — e-commerce, real estate, healthcare, education and more, engineered for speed, SEO and conversion.',
  },
  {
    slug: 'video-editing',
    category: 'video',
    label: 'Video Editing',
    title: 'Video Editing & Motion Design Projects',
    description:
      'Cinematic edits, promo reels and motion graphics by Eaglescroft — crafted to capture attention and drive engagement across every platform.',
  },
  {
    slug: 'social-media',
    category: 'social',
    label: 'Social Media',
    title: 'Social Media Management Campaigns',
    description:
      'Content systems, launch grids and social campaigns by Eaglescroft that grow engagement and turn followers into customers.',
  },
]

export function getCategory(slug: string) {
  return portfolioCategories.find((c) => c.slug === slug)
}
