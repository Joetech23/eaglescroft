'use client'

import { motion } from 'framer-motion'

const industries = [
  'E-Commerce', 'Healthcare', 'Education', 'Luxury Transport', 'Media & News',
  'Architecture', 'Real Estate', 'Sports', 'Technology', 'Personal Brands',
  'Hospitality', 'AI & Automation', 'Branding', 'Motion Design',
]

export default function TrustLayer() {
  const loop = [...industries, ...industries]
  return (
    <div className="overflow-hidden border-t border-white/[0.06] bg-[#000615] py-[22px]">
      <motion.div
        className="flex w-max items-center"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      >
        {loop.map((m, i) => (
          <span key={i} className="flex items-center gap-6 whitespace-nowrap px-6 font-display text-lg font-medium text-white/40">
            {m}
            <span className="h-[5px] w-[5px] rounded-full bg-gold-400 opacity-70" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}
