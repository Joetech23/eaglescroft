import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/lib/site'

const cols = [
  {
    title: 'Services',
    items: [
      { label: 'Web Development', href: '/services#web-development' },
      { label: 'UI/UX Design', href: '/services#ui-ux-design' },
      { label: 'Branding', href: '/services#branding-identity' },
      { label: 'Video & Motion', href: '/services#video-motion' },
      { label: 'SEO & Marketing', href: '/services#digital-marketing-seo' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'Work', href: '/portfolio' },
      { label: 'Why Eaglescroft', href: '/about' },
      { label: 'Insights', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Connect',
    items: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
      { label: 'Instagram', href: 'https://instagram.com/' },
      { label: 'X / Twitter', href: 'https://x.com/' },
      { label: 'Email Us', href: `mailto:${siteConfig.email}` },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#020a24] px-7 pb-10 pt-[60px]">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-10 pb-[46px]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}>
          <div className="max-w-[300px] [grid-column:1/-1] md:[grid-column:auto]">
            <div className="mb-4 flex items-center gap-2.5">
              <Image src="/brand/eagle-white.png" alt="" width={30} height={30} className="h-7 w-auto object-contain" />
              <span className="font-display text-[20px] font-semibold text-white">Eaglescroft</span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-white/50">
              We help businesses fly online. A global digital agency building websites, brands and AI-powered systems.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">{col.title}</div>
              <div className="flex flex-col gap-[11px]">
                {col.items.map((it) => {
                  const ext = it.href.startsWith('http') || it.href.startsWith('mailto')
                  return ext ? (
                    <a key={it.label} href={it.href} className="text-sm text-white/65 transition-colors hover:text-gold-300">{it.label}</a>
                  ) : (
                    <Link key={it.label} href={it.href} className="text-sm text-white/65 transition-colors hover:text-gold-300">{it.label}</Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-[26px]">
          <div className="font-mono text-xs text-white/40">© {new Date().getFullYear()} Eaglescroft Limited — Asokoro, Abuja, Nigeria</div>
          <div className="flex gap-[18px] font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
            <span>Nigeria</span><span>·</span><span>UK</span><span>·</span><span>USA</span><span>·</span><span>Australia</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
