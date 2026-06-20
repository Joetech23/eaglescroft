'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X, Phone, Mail, Bot } from 'lucide-react'
import { siteConfig, whatsappLink } from '@/lib/site'
import ChatBot from './ChatBot'

// Inline WhatsApp glyph (lucide has no brand icon)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 001.599 5.317l-.999 3.648 3.9-.864zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

export default function ContactDock() {
  const [open, setOpen] = useState(false)
  const [chat, setChat] = useState(false)

  const actions = [
    { label: 'Chat on WhatsApp', icon: WhatsAppIcon, color: '#25D366', onClick: () => window.open(whatsappLink, '_blank') },
    { label: 'Call us', icon: Phone, color: '#2a3f8f', onClick: () => { window.location.href = `tel:${siteConfig.phoneRaw}` } },
    { label: 'Email us', icon: Mail, color: '#001e60', onClick: () => { window.location.href = `mailto:${siteConfig.email}` } },
    { label: 'AI Assistant', icon: Bot, color: '#FFC940', onClick: () => { setChat(true); setOpen(false) } },
  ]

  return (
    <div className="fixed bottom-5 right-5 z-[130] flex flex-col items-end gap-3 print:hidden">
      <AnimatePresence>
        {chat && <ChatBot onClose={() => setChat(false)} />}
      </AnimatePresence>

      {/* action stack */}
      <AnimatePresence>
        {open && !chat && (
          <motion.div
            initial="hidden" animate="show" exit="hidden"
            variants={{ show: { transition: { staggerChildren: 0.05 } }, hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } } }}
            className="flex flex-col items-end gap-2.5"
          >
            {actions.map((a) => {
              const Icon = a.icon
              return (
                <motion.button
                  key={a.label}
                  onClick={a.onClick}
                  variants={{ hidden: { opacity: 0, y: 12, scale: 0.8 }, show: { opacity: 1, y: 0, scale: 1 } }}
                  className="group flex items-center gap-3"
                >
                  <span className="rounded-lg bg-[#000a22] px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {a.label}
                  </span>
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-110"
                    style={{ background: a.color, color: a.color === '#FFC940' ? '#001e60' : '#fff' }}
                  >
                    <Icon className="h-[22px] w-[22px]" />
                  </span>
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* main FAB */}
      {!chat && (
        <motion.button
          onClick={() => setOpen((v) => !v)}
          whileTap={{ scale: 0.92 }}
          aria-label={open ? 'Close contact menu' : 'Open contact menu'}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gold-400 text-navy shadow-[0_12px_34px_rgba(255,201,64,0.5)]"
        >
          {!open && (
            <span className="absolute inset-0 animate-ping rounded-full bg-gold-400 opacity-30" />
          )}
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="h-7 w-7" />
              </motion.span>
            ) : (
              <motion.span key="c" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <MessageCircle className="h-7 w-7 fill-navy/10" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </div>
  )
}
