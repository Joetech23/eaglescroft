export type Post = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  body: string[]
}

export const posts: Post[] = [
  {
    slug: 'why-next-js-for-business-websites',
    title: 'Why We Build Business Websites on Next.js',
    excerpt:
      'Speed, SEO, and scalability aren’t buzzwords — they’re revenue. Here’s why Next.js is our default for high-performance sites.',
    category: 'Engineering',
    date: '2026-05-20',
    readTime: '5 min read',
    body: [
      'When a business asks us to build their website, the goal is never “a website.” The goal is growth — more qualified leads, more conversions, more revenue. The technology we choose is in direct service of that outcome, and for the vast majority of projects, that technology is Next.js.',
      'First, performance. Next.js gives us server-side rendering and static generation out of the box, which means pages load fast and rank well. Core Web Vitals are a Google ranking factor, and a one-second improvement in load time can lift conversions measurably.',
      'Second, SEO. Because content is rendered on the server, search engines see a complete page immediately — no waiting for JavaScript to hydrate. Combined with clean metadata, structured sitemaps, and image optimisation, this gives our clients a structural advantage in search.',
      'Third, scalability. The same framework that powers a five-page marketing site can power a complex, data-driven application. That means a business never has to rebuild from scratch as it grows — the architecture grows with it.',
      'At Eaglescroft, every build starts with the business outcome and works backwards to the technology. Next.js earns its place as our default because, time and again, it delivers measurable results.',
    ],
  },
  {
    slug: 'design-that-converts',
    title: 'Design That Converts: Beyond Looking Good',
    excerpt:
      'Beautiful design is table stakes. Conversion-focused design is what separates a portfolio piece from a profit centre.',
    category: 'Design',
    date: '2026-04-12',
    readTime: '4 min read',
    body: [
      'A website can win design awards and still fail the business that paid for it. The difference between design that looks good and design that performs comes down to one question: does it move the user toward a decision?',
      'Conversion-focused design starts with hierarchy. The most important action on any page — book a call, start a project, buy now — should be the most visually prominent. Everything else supports that single decision.',
      'It continues with trust. Social proof, clear pricing, real results, and friction-free forms all reduce the anxiety that stops people from acting. We design these in deliberately, not as an afterthought.',
      'And it ends with measurement. We instrument every build so we can see where users drop off and iterate. Great design is never finished — it’s continuously improved against real data.',
    ],
  },
  {
    slug: 'ai-automation-for-lean-teams',
    title: 'AI Automation for Lean Teams',
    excerpt:
      'You don’t need a big team to operate like one. Here’s how AI workflows quietly remove hours of manual work every week.',
    category: 'AI & Automation',
    date: '2026-03-03',
    readTime: '6 min read',
    body: [
      'The biggest unlock for small and mid-sized businesses isn’t a bigger team — it’s automation that behaves like one. With tools like n8n, Pabbly Connect, and the OpenAI API, we build workflows that handle the repetitive work humans shouldn’t.',
      'Think lead routing, customer onboarding emails, content repurposing, support triage, and reporting. Each of these can be wired into an intelligent pipeline that runs 24/7 without supervision.',
      'The result is leverage. Founders get their time back, customers get faster responses, and the business operates with the consistency of a much larger organisation — at a fraction of the cost.',
      'Automation isn’t about replacing people. It’s about freeing them to do the work that actually requires human judgement.',
    ],
  },
]

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug)
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
