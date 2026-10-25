import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
  id?: string
  dark?: boolean
}

export default function Section({ children, className, id, dark }: Props) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-20 md:py-28',
        dark && 'bg-brand-deep text-white',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function SectionHeading({
  eyebrow, title, intro, light, center, className,
}: {
  eyebrow?: string
  title: React.ReactNode
  intro?: string
  light?: boolean
  center?: boolean
  className?: string
}) {
  return (
    <div className={cn(center && 'mx-auto text-center', 'max-w-3xl', className)}>
      {eyebrow && (
        <span className={cn('eyebrow', light && 'text-gold-400/90', center && 'justify-center')}>
          <span aria-hidden className="flight-marker" />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn('mt-4 font-display font-semibold leading-[1.08] tracking-tight', light ? 'text-white' : 'text-navy')}
        style={{ fontSize: 'clamp(2rem,4.5vw,3.1rem)' }}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn('mt-5 text-base leading-relaxed md:text-lg', light ? 'text-white/70' : 'text-navy/60')}>
          {intro}
        </p>
      )}
    </div>
  )
}
