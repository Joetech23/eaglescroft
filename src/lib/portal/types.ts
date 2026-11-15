export type Role = 'admin' | 'staff' | 'client'
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
  title: string | null
  signature: string | null
  avatar_url: string | null
  timezone: string
  last_seen_at: string | null
  notify_email: boolean
  created_at: string
}

/** The public face of a person in chat, tasks and meetings. */
export type Person = Pick<Profile, 'id' | 'full_name' | 'email' | 'role' | 'title' | 'signature' | 'avatar_url' | 'company'>

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

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = {
  id: string
  project_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  assignee_id: string | null
  due_date: string | null
  created_by: string | null
  client_visible: boolean
  sort: number
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type Attachment = { path: string; name: string; size: number; type: string }

export type Message = {
  id: string
  project_id: string
  author_id: string | null
  body: string
  attachments: Attachment[]
  reply_to: string | null
  created_at: string
  edited_at: string | null
  deleted_at: string | null
}

export type Notification = {
  id: string
  user_id: string
  kind: string
  title: string
  body: string | null
  link: string | null
  read_at: string | null
  created_at: string
}

export type MeetingStatus = 'scheduled' | 'cancelled' | 'completed'

export type Meeting = {
  id: string
  project_id: string | null
  host_id: string
  client_id: string | null
  title: string
  agenda: string | null
  starts_at: string
  ends_at: string
  status: MeetingStatus
  meeting_url: string | null
  created_at: string
}

export type AvailabilityBlock = {
  id: string
  user_id: string
  weekday: number
  start_minute: number
  end_minute: number
}
