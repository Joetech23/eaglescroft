'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Signature element: an ascending flight-path trajectory.
 * Embodies the Eaglescroft thesis — helping businesses gain altitude.
 * Used as a section divider and ambient hero motif.
 */
export default function FlightPath({
  className,
  light = false,
}: {
  className?: string
  light?: boolean
}) {
  const stroke = light ? 'rgba(255,201,64,0.7)' : 'rgba(0,30,96,0.35)'
  const dot = light ? '#FFC940' : '#001e60'

  return (
    <div className={cn('pointer-events-none w-full', className)} aria-hidden="true">
      <svg viewBox="0 0 1200 80" fill="none" className="h-auto w-full" preserveAspectRatio="none">
        {/* baseline horizon */}
        <line x1="0" y1="64" x2="1200" y2="64" stroke={stroke} strokeWidth="1" strokeDasharray="2 8" opacity="0.5" />
        {/* ascending trajectory */}
        <motion.path
          d="M0 64 C 320 60, 520 40, 760 22 S 1080 4, 1200 6"
          stroke={dot}
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* climbing markers */}
        {[
          { x: 0, y: 64 },
          { x: 520, y: 40 },
          { x: 760, y: 22 },
          { x: 1200, y: 6 },
        ].map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x} cy={p.y} r="3"
            fill={dot}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.25, duration: 0.4 }}
          />
        ))}
      </svg>
    </div>
  )
}
