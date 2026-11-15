import { cn } from '@/lib/utils'
import { initials } from '@/lib/portal/people'
import type { Person } from '@/lib/portal/types'

const sizes = { xs: 'h-6 w-6 text-[10px]', sm: 'h-8 w-8 text-[11px]', md: 'h-10 w-10 text-[13px]', lg: 'h-14 w-14 text-[17px]', xl: 'h-20 w-20 text-[22px]' }

/** Photo or initials. Team members get a blue ring so clients can tell who's from Eaglescroft at a glance. */
export default function Avatar({
  person, size = 'md', className,
}: {
  person: Pick<Person, 'full_name' | 'email' | 'avatar_url' | 'role'> | null | undefined
  size?: keyof typeof sizes
  className?: string
}) {
  const team = person?.role === 'admin' || person?.role === 'staff'
  return (
    <span
      className={cn(
        'relative inline-flex flex-none items-center justify-center overflow-hidden rounded-full font-display font-semibold',
        team ? 'bg-navy text-white ring-2 ring-gold-400/70 ring-offset-2 ring-offset-white' : 'bg-gold-400/15 text-gold-600',
        sizes[size],
        className,
      )}
      aria-hidden
    >
      {person?.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={person.avatar_url} alt="" className="h-full w-full object-cover" />
      ) : (
        initials(person)
      )}
    </span>
  )
}
