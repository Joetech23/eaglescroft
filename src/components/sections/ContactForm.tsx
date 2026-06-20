'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { siteConfig } from '@/lib/site'
import { services } from '@/lib/services'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email'),
  company: z.string().optional(),
  service: z.string().min(1, 'Select a service'),
  budget: z.string().optional(),
  message: z.string().min(10, 'Tell us a little more (10+ characters)'),
})

type FormValues = z.infer<typeof schema>

const budgets = ['< $1k', '$1k – $5k', '$5k – $15k', '$15k+']

export default function ContactForm() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormValues) => {
    // No backend yet — open the user's mail client with a prefilled message.
    const subject = encodeURIComponent(`New project enquiry — ${data.service}`)
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || '—'}\n` +
      `Service: ${data.service}\nBudget: ${data.budget || '—'}\n\n${data.message}`,
    )
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const field = 'w-full rounded-2xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/35 outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-navy/10'
  const label = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-navy/55'
  const err = 'mt-1 text-xs text-red-500'

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-3xl border border-navy/10 bg-white p-12 text-center shadow-soft"
      >
        <CheckCircle2 className="h-14 w-14 text-gold-500" />
        <h3 className="mt-5 text-2xl font-semibold text-navy">Thank you!</h3>
        <p className="mt-2 max-w-sm text-sm text-navy/60">
          Your email client should have opened with your message ready to send. We’ll get back to you within 24 hours.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-navy/10 bg-white p-7 shadow-soft md:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Name *</label>
          <input className={field} placeholder="Jane Doe" {...register('name')} />
          {errors.name && <p className={err}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={label}>Email *</label>
          <input className={field} placeholder="jane@company.com" {...register('email')} />
          {errors.email && <p className={err}>{errors.email.message}</p>}
        </div>
        <div>
          <label className={label}>Company</label>
          <input className={field} placeholder="Company name" {...register('company')} />
        </div>
        <div>
          <label className={label}>Service *</label>
          <select className={field} defaultValue="" {...register('service')}>
            <option value="" disabled>Select a service</option>
            {services.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
            <option value="Not sure yet">Not sure yet</option>
          </select>
          {errors.service && <p className={err}>{errors.service.message}</p>}
        </div>
      </div>

      <div className="mt-5">
        <label className={label}>Estimated Budget</label>
        <div className="flex flex-wrap gap-2">
          {budgets.map((b) => (
            <label key={b} className="cursor-pointer">
              <input type="radio" value={b} className="peer sr-only" {...register('budget')} />
              <span className="block rounded-full border border-navy/15 px-4 py-2 text-sm text-navy/70 transition-all peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white">
                {b}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <label className={label}>Project Details *</label>
        <textarea rows={5} className={field} placeholder="Tell us about your goals, timeline, and what you’d like to build…" {...register('message')} />
        {errors.message && <p className={err}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-4 text-sm font-semibold text-navy shadow-gold transition-all hover:-translate-y-0.5 hover:bg-gold-300 disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Enquiry'}
      </button>
    </form>
  )
}
