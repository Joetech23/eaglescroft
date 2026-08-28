// Lightweight rule-based assistant — no backend required.
// Matches the user's message against intents and returns a reply + quick replies.

export type Reply = { text: string; quick?: string[] }

const services = [
  'Web Development', 'UI/UX Design', 'Branding & Identity', 'Video & Motion',
  'Social Media', 'Marketing & SEO', 'IT & Automation',
]

export const greeting: Reply = {
  text: "Hi 👋 I'm Aero, Eaglescroft's assistant. I can tell you about our services, pricing, timelines, or get you booked in. What are you working on?",
  quick: ['Start a project', 'Your services', 'Pricing & timelines', 'Talk to a human'],
}

export function getReply(raw: string): Reply {
  const m = raw.toLowerCase()

  const has = (...words: string[]) => words.some((w) => m.includes(w))

  if (has('hi', 'hello', 'hey', 'good morning', 'good afternoon'))
    return greeting

  if (has('start', 'project', 'build', 'hire', 'quote', 'get started', 'begin'))
    return {
      text: "Love it. The fastest way to start is a quick brief — tell us your goal and timeline and we reply within 24 hours. Want to send it now?",
      quick: ['Open contact form', 'Chat on WhatsApp', 'Pricing & timelines'],
    }

  if (has('service', 'what do you do', 'offer', 'capab'))
    return {
      text: `We're a full-stack agency. Our core services:\n• ${services.join('\n• ')}\n\nWhich one fits your need?`,
      quick: ['Web Development', 'Branding & Identity', 'Marketing & SEO', 'Start a project'],
    }

  if (has('web', 'website', 'next', 'react', 'app', 'develop'))
    return {
      text: "We build high-performance sites & apps in Next.js, React and Node — from marketing sites to multi-vendor e-commerce. Fast, SEO-ready, built to scale. Want a quote?",
      quick: ['Start a project', 'See our work', 'Pricing & timelines'],
    }

  if (has('brand', 'logo', 'identity', 'design', 'ui', 'ux'))
    return {
      text: "From brand strategy and identity to pixel-perfect UI/UX in Figma — we make businesses unforgettable and easy to use. Shall we talk specifics?",
      quick: ['Start a project', 'Talk to a human', 'See our work'],
    }

  if (has('seo', 'marketing', 'rank', 'traffic', 'growth', 'ads'))
    return {
      text: "Technical SEO, Core Web Vitals and data-driven campaigns that compound your ROI. We can audit your current site for free — interested?",
      quick: ['Request an audit', 'Start a project', 'Chat on WhatsApp'],
    }

  if (has('price', 'cost', 'budget', 'how much', 'pricing', 'rate', 'timeline', 'how long', 'when'))
    return {
      text: "We publish clear pricing for every service — websites from ₦180k, CRM systems from ₦299k, automation from ₦299k and video from ₦35k per clip. Most projects launch in 2–6 weeks. Want the full breakdown?",
      quick: ['See pricing', 'Open contact form', 'Chat on WhatsApp'],
    }

  if (has('human', 'person', 'call', 'phone', 'talk', 'speak', 'agent'))
    return {
      text: "Of course — Joshua and the team are one tap away. Pick whatever's easiest:",
      quick: ['Chat on WhatsApp', 'Call us', 'Email us'],
    }

  if (has('whatsapp', 'wa'))
    return { text: "Tap below and we'll continue on WhatsApp 👇", quick: ['Chat on WhatsApp'] }

  if (has('email', 'mail'))
    return { text: "You can reach us by email any time 👇", quick: ['Email us'] }

  if (has('thank', 'thanks', 'cheers', 'great', 'awesome', 'cool'))
    return { text: "Anytime! 🦅 Anything else I can help with?", quick: ['Start a project', 'Your services', 'Talk to a human'] }

  return {
    text: "Good question! I can help with services, pricing, timelines, or connecting you with the team. What would be most useful?",
    quick: ['Start a project', 'Your services', 'Pricing & timelines', 'Talk to a human'],
  }
}
