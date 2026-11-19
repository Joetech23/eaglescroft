'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Upload } from 'lucide-react'
import { addDocument } from '@/app/admin/actions'
import { inputClass } from './ui'
import type { DocumentKind } from '@/lib/portal/types'

/**
 * Uploads go straight from the browser to Supabase Storage (as the signed-in admin, so storage RLS
 * applies) — server actions/Vercel functions cap request bodies at a few MB, which large deliverables exceed.
 */
export default function DocumentUploader({ projectId }: { projectId: string }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState<DocumentKind>('deliverable')
  const [state, setState] = useState<'idle' | 'uploading' | 'error'>('idle')

  async function upload(e: React.FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setState('uploading')
    try {
      const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(-80)
      const path = `${projectId}/${crypto.randomUUID()}-${safe}`
      const { error } = await supabase.storage.from('project-files').upload(path, file, { contentType: file.type || undefined })
      if (error) throw error
      await addDocument(projectId, { title: title.trim() || file.name, kind, storagePath: path, size: file.size })
      setTitle('')
      if (fileRef.current) fileRef.current.value = ''
      setState('idle')
      router.refresh()
    } catch {
      setState('error')
    }
  }

  return (
    <form onSubmit={upload} className="space-y-3 rounded-2xl bg-subtle p-4">
      <input ref={fileRef} type="file" required aria-label="File" className="block w-full text-[13px] text-navy/70 file:mr-3 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-[13px] file:font-semibold file:text-white" />
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (defaults to file name)" aria-label="Title" className={inputClass} />
        <select value={kind} onChange={(e) => setKind(e.target.value as DocumentKind)} aria-label="Kind" className={inputClass}>
          <option value="deliverable">Deliverable</option>
          <option value="handover">Handover</option>
          <option value="contract">Contract</option>
          <option value="other">Other</option>
        </select>
      </div>
      <button
        disabled={state === 'uploading'}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#3b76f0] to-[#1d4ed8] px-5 py-2.5 text-sm font-semibold text-white shadow-gold disabled:opacity-60"
      >
        <Upload className="h-4 w-4" /> {state === 'uploading' ? 'Uploading…' : 'Upload file'}
      </button>
      {state === 'error' && <p className="text-[13px] text-danger">Upload failed. Check the file and try again.</p>}
    </form>
  )
}
