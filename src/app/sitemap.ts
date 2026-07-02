import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site'
import { projects } from '@/lib/projects'
import { posts } from '@/lib/posts'
import { portfolioCategories } from '@/lib/categories'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url

  const staticRoutes = ['', '/about', '/services', '/portfolio', '/blog', '/contact'].map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: r === '' ? 1 : 0.8,
  }))

  const categoryRoutes = portfolioCategories.map((c) => ({
    url: `${base}/portfolio/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const projectRoutes = projects.map((p) => ({
    url: `${base}/portfolio/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const postRoutes = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...categoryRoutes, ...projectRoutes, ...postRoutes]
}
