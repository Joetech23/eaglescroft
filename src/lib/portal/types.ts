export type Role = 'admin' | 'client'
export type ProjectStatus = 'onboarding' | 'in_progress' | 'in_review' | 'completed' | 'on_hold'
export type MilestoneStatus = 'upcoming' | 'in_progress' | 'done'
export type TicketStatus = 'open' | 'in_progress' | 'resolved'
export type InvoiceKind = 'deposit' | 'milestone' | 'balance' | 'retainer' | 'upsell'
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'void'
export type DocumentKind = 'deliverable' | 'handover' | 'contract' | 'other'
export type Currency = 'USD' | 'NGN'

export type Profile = {
  id: string
  email: string
  full_name: string | null
  company: string | null
  phone: string | null
  role: Role
  created_at: string
}

export type Project = {
  id: string
  client_id: string
  title: string
  service: string
  status: ProjectStatus
  progress: number
  summary: string | null
  goals: { title: string; target?: string }[]
  features: string[]
  brief: Record<string, string>
  brief_submitted_at: string | null
  start_date: string | null
  due_date: string | null
  currency: Currency
  budget_minor: number
  deposit_percent: number
  revision_quota: number
  retainer_minor: number | null
  created_at: string
  updated_at: string
}

export type Milestone = {
  id: string
  project_id: string
  title: string
  description: string | null
  due_date: string | null
  status: MilestoneStatus
  sort: number
}

export type ProjectUpdate = {
  id: string
  project_id: string
  author_id: string | null
  body: string
  created_at: string
}

export type Ticket = {
  id: string
  project_id: string
  author_id: string | null
  title: string
  body: string
  is_revision: boolean
  status: TicketStatus
  created_at: string
  updated_at: string
}

export type TicketMessage = {
  id: string
  ticket_id: string
  author_id: string | null
  body: string
  created_at: string
}

export type InvoiceItem = {
  id: string
  invoice_id: string
  description: string
  quantity: number
  unit_minor: number
  sort: number
}

export type Invoice = {
  id: string
  project_id: string
  number: string
  kind: InvoiceKind
  status: InvoiceStatus
  currency: Currency
  due_date: string | null
  issued_at: string | null
  paid_at: string | null
  notes: string | null
  created_at: string
  invoice_items?: InvoiceItem[]
  payments?: Payment[]
}

export type Payment = {
  id: string
  invoice_id: string
  amount_minor: number
  currency: Currency
  provider: 'paystack' | 'stripe' | 'manual'
  reference: string
  status: 'pending' | 'success' | 'failed'
  paid_at: string | null
  created_at: string
}

export type ProjectDocument = {
  id: string
  project_id: string
  title: string
  kind: DocumentKind
  storage_path: string
  size_bytes: number | null
  created_at: string
}

export type Review = {
  id: string
  project_id: string
  rating: number
  comment: string | null
  created_at: string
}
