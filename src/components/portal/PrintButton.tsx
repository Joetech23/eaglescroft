'use client'

import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-surface px-4 py-2 text-sm font-semibold text-navy hover:border-navy/30"
    >
      <Printer className="h-4 w-4" /> Print / save PDF
    </button>
  )
}
