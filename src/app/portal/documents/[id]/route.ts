import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/portal/supabase'

/** Short-lived signed download link. Runs as the user, so storage RLS decides whether they may see the file. */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: doc } = await supabase.from('documents').select('storage_path, title').eq('id', params.id).maybeSingle()
  if (!doc) return NextResponse.redirect(new URL('/portal', request.url))

  const { data } = await supabase.storage.from('project-files').createSignedUrl(doc.storage_path, 60, { download: doc.title })
  if (!data?.signedUrl) return NextResponse.redirect(new URL('/portal', request.url))
  return NextResponse.redirect(data.signedUrl)
}
