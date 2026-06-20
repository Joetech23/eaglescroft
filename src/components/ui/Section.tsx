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
          <span aria-hidden className="text-gold-500">↗</span>
          {eyebrow}
        </span>
      )}
      <h2 className={cn('mt-4 text-3xl font-semibold leading-[1.1] md:text-5xl', light ? 'text-white' : 'text-navy')}>
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
