'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Loader2 } from 'lucide-react'
import { browserSupabase } from '@/lib/portal/browser'
import { setAvatar } from '@/app/portal/collab'
import Avatar from './Avatar'
import type { Person } from '@/lib/portal/types'

export default function AvatarUploader({ person }: { person: Person }) {
  const router = useRouter()
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function onFile(file: File) {
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return setError('Choose an image under 5 MB.')
    setBusy(true)
    setError('')
    const sb = browserSupabase()
    const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    const path = `${person.id}/avatar-${Date.now()}.${ext}`
    const { error: upErr } = await sb.storage.from('avatars').upload(path, file, { contentType: file.type, upsert: true })
    if (upErr) {
      setBusy(false)
      return setError('Upload failed. Please try again.')
    }
    const { data } = sb.storage.from('avatars').getPublicUrl(path)
    await setAvatar(data.publicUrl)
    setBusy(false)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar person={person} size="xl" />
        <button type="button" onClick={() => input.current?.click()} className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-gold-400 text-white shadow-gold" aria-label="Change photo">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        </button>
      </div>
      <div>
        <button type="button" onClick={() => input.current?.click()} className="text-[14px] font-semibold text-gold-600 hover:underline">Upload a photo</button>
        <p className="text-[12.5px] text-navy/50">Square images look best. Max 5 MB.</p>
        {error && <p className="text-[12.5px] text-danger">{error}</p>}
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
    </div>
  )
}
