'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Send, X } from 'lucide-react'
import { siteConfig, whatsappLink } from '@/lib/site'
import { getReply, greeting } from '@/lib/chatbot'

type Msg = { from: 'bot' | 'user'; text: string; quick?: string[] }

export default function ChatBot({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', ...greeting }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  const act = (label: string) => {
    // handoff quick-replies
    if (label === 'Chat on WhatsApp') { window.open(whatsappLink, '_blank'); return true }
    if (label === 'Call us') { window.location.href = `tel:${siteConfig.phoneRaw}`; return true }
    if (label === 'Email us') { window.location.href = `mailto:${siteConfig.email}`; return true }
    if (label === 'Open contact form' || label === 'Request an audit') { window.location.href = '/contact'; return true }
    if (label === 'See our work') { window.location.href = '/portfolio'; return true }
    return false
  }

  const send = (text: string) => {
    const value = text.trim()
    if (!value) return
    setMsgs((m) => [...m, { from: 'user', text: value }])
    setInput('')
    if (act(value)) return
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'bot', ...getReply(value) }])
    }, 650)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-[540px] max-h-[78vh] w-[360px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#000a22] shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
      role="dialog"
      aria-label="Chat with Eaglescroft"
    >
      {/* header */}
      <div className="flex items-center gap-3 px-5 py-4" style={{ background: 'linear-gradient(120deg,#001e60,#2a3f8f)' }}>
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <Image src="/brand/eagle-gold.png" alt="" width={24} height={24} className="h-6 w-auto object-contain" />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#001e60] bg-[#28c840]" />
        </div>
        <div className="flex-1">
          <div className="font-display text-[15px] font-semibold text-white">Aero · Eaglescroft</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-gold-400">Online · replies instantly</div>
        </div>
        <button onClick={onClose} aria-label="Close chat" className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
        {msgs.map((m, i) => (
          <div key={i}>
            <div className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[82%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                  m.from === 'user'
                    ? 'rounded-br-md bg-gold-400 font-medium text-navy'
                    : 'rounded-bl-md bg-white/[0.07] text-white/90'
                }`}
              >
                {m.text}
              </div>
            </div>
            {m.quick && m.from === 'bot' && (
              <div className="mt-2 flex flex-wrap gap-2">
                {m.quick.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1.5 text-[12px] font-medium text-gold-400 transition-colors hover:bg-gold-400/20"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white/[0.07] px-4 py-3">
              {[0, 1, 2].map((d) => (
                <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-white/60"
                  animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input) }}
        className="flex items-center gap-2 border-t border-white/10 bg-[#000615] p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-gold-400/50"
        />
        <button type="submit" aria-label="Send" className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gold-400 text-navy transition-transform hover:scale-105">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </motion.div>
  )
}
