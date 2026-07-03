import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Raleway, Poppins } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SmoothScroll from '@/components/layout/SmoothScroll'
import ContactDock from '@/components/layout/ContactDock'
import JsonLd from '@/components/seo/JsonLd'
import { siteConfig, countries } from '@/lib/site'
import { services } from '@/lib/services'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
})

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Digital Solutions for Business Growth`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'digital agency Nigeria', 'web design Nigeria', 'web design Abuja', 'website development company',
    'Next.js development agency', 'UI/UX design', 'branding agency', 'technical SEO agency',
    'AI chatbot solutions', 'AI chatbot for business', 'business automation agency',
    'GoHighLevel expert', 'GoHighLevel setup', 'sales funnels', 'funnel builder',
    'CRM setup', 'CRM automation', 'marketing automation', 'lead generation systems',
    'digital marketing Nigeria', 'web agency UK', 'web agency USA', 'web agency Australia',
    'Eaglescroft', 'Eaglescroft Limited',
  ],
  authors: [{ name: siteConfig.legalName, url: siteConfig.url }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  applicationName: siteConfig.name,
  category: 'technology',
  // Resolves per-route against metadataBase — canonical URL on every page.
  alternates: { canonical: './' },
  icons: { icon: '/brand/favicon.png', apple: '/brand/favicon.png' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Digital Solutions for Business Growth`,
    description: siteConfig.description,
    images: [{ url: '/brand/logo-a.png', width: 1200, height: 630, alt: `${siteConfig.legalName} — ${siteConfig.tagline}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — Digital Solutions for Business Growth`,
    description: siteConfig.description,
    images: ['/brand/logo-a.png'],
  },
}

/** Sitewide structured data: who we are + site search entity. */
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${siteConfig.url}/#organization`,
  name: siteConfig.legalName,
  alternateName: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/brand/logo-a.png`,
  image: `${siteConfig.url}/brand/logo-a.png`,
  slogan: siteConfig.tagline,
  description: siteConfig.description,
  email: siteConfig.email,
  telephone: siteConfig.phoneRaw,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Asokoro',
    addressLocality: 'Abuja',
    addressRegion: 'FCT',
    addressCountry: 'NG',
  },
  areaServed: countries.map((c) => ({ '@type': 'Country', name: c })),
  foundingDate: '2021',
  founder: [
    { '@type': 'Person', name: 'Joshua Obaje Enemaku', jobTitle: 'Founder & CTO' },
    { '@type': 'Person', name: 'Benjamin Adama', jobTitle: 'Co-founder' },
  ],
  sameAs: ['https://www.linkedin.com/', 'https://instagram.com/', 'https://x.com/'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Digital Services',
    itemListElement: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, description: s.description, url: `${siteConfig.url}/services#${s.slug}` },
    })),
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  publisher: { '@id': `${siteConfig.url}/#organization` },
  inLanguage: 'en',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} ${raleway.variable} ${poppins.variable}`}>
      <body>
        <JsonLd data={[orgJsonLd, websiteJsonLd]} />
        <SmoothScroll />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ContactDock />
      </body>
    </html>
  )
}
