export const siteConfig = {
  name: 'Eaglescroft',
  legalName: 'Eaglescroft Limited',
  tagline: 'We Help Businesses Fly Online',
  description:
    'Eaglescroft creates complete digital solutions for businesses — websites, branding, AI chatbots, automations, funnels, CRM systems, video and SEO — partnering with companies across Nigeria, the UK, USA, and Australia.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://eaglescroft.com.ng',
  email: 'hello@eaglescroft.com.ng',
  phones: ['+234 814 484 8470', '+234 807 348 8126'],
  phoneRaw: '+2348144848470',
  phoneDisplay: '+234 814 484 8470',
  whatsapp: '2348144848470',
  location: 'Asokoro, FCT — Abuja, Nigeria',
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL || '',
}

export const whatsappLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
  "Hi Eaglescroft 👋 I'd like to talk about a project.",
)}`

export const countries = ['Nigeria', 'United Kingdom', 'United States', 'Australia'] as const

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/portfolio' },
  { label: 'Insights', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'X', href: 'https://x.com/' },
  { label: 'Instagram', href: 'https://instagram.com/' },
  { label: 'GitHub', href: 'https://github.com/' },
]
