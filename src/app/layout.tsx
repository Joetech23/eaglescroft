import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Raleway, Poppins } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SmoothScroll from '@/components/layout/SmoothScroll'
import ContactDock from '@/components/layout/ContactDock'
import { siteConfig } from '@/lib/site'

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
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'digital agency', 'web development', 'Next.js', 'UI/UX design', 'branding',
    'SEO', 'digital marketing', 'Nigeria', 'UK', 'USA', 'Australia', 'Eaglescroft',
  ],
  authors: [{ name: siteConfig.name }],
  icons: { icon: '/brand/favicon.png', apple: '/brand/favicon.png' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: '/brand/logo-navy.png', width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} ${raleway.variable} ${poppins.variable}`}>
      <body>
        <SmoothScroll />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ContactDock />
      </body>
    </html>
  )
}
