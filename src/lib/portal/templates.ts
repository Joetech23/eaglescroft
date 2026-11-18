/**
 * Service templates — "project setup depends on the service". Creating a project from a template
 * seeds its milestones (as day offsets from the start date), revision allowance and the intake
 * questions the client answers in their brief.
 */

export type IntakeQuestion = {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select'
  options?: string[]
  placeholder?: string
}

export type ServiceTemplate = {
  key: string
  label: string
  revisionQuota: number
  milestones: { title: string; dayOffset: number; description?: string }[]
  intake: IntakeQuestion[]
  deliverables: string[]
}

const common: IntakeQuestion[] = [
  { id: 'business', label: 'Tell us about your business in a few lines', type: 'textarea', placeholder: 'What you do, who you serve, what makes you different.' },
  { id: 'audience', label: 'Who is your ideal customer?', type: 'textarea' },
  { id: 'goal', label: 'What is the main result you want from this project?', type: 'textarea', placeholder: 'e.g. more enquiries, online sales, fewer missed leads' },
  { id: 'competitors', label: 'Competitors or brands you admire (links welcome)', type: 'textarea' },
]

export const serviceTemplates: ServiceTemplate[] = [
  {
    key: 'website',
    label: 'Website',
    revisionQuota: 2,
    milestones: [
      { title: 'Kick-off & brief approved', dayOffset: 0 },
      { title: 'Sitemap & content plan', dayOffset: 3 },
      { title: 'Homepage design review', dayOffset: 7 },
      { title: 'Full build on staging', dayOffset: 14 },
      { title: 'Revisions & QA', dayOffset: 18 },
      { title: 'Launch & handover', dayOffset: 21 },
    ],
    intake: [
      ...common,
      { id: 'pages', label: 'Which pages do you need?', type: 'textarea', placeholder: 'Home, About, Services, Contact…' },
      { id: 'domain', label: 'Do you already own a domain and hosting?', type: 'select', options: ['Yes — both', 'Domain only', 'Neither yet'] },
      { id: 'content', label: 'Do you have your logo, copy and photos ready?', type: 'select', options: ['Yes, all ready', 'Some of it', 'No — we need help'] },
    ],
    deliverables: ['Live website', 'Admin / CMS logins', 'Analytics & Search Console set-up', 'Handover guide'],
  },
  {
    key: 'crm',
    label: 'CRM system',
    revisionQuota: 2,
    milestones: [
      { title: 'Process mapping workshop', dayOffset: 0 },
      { title: 'Pipeline & data model sign-off', dayOffset: 5 },
      { title: 'CRM build', dayOffset: 14 },
      { title: 'Integrations & automations', dayOffset: 21 },
      { title: 'Team training & handover', dayOffset: 28 },
    ],
    intake: [
      ...common,
      { id: 'team', label: 'How many people will use the CRM, and in which roles?', type: 'textarea' },
      { id: 'stages', label: 'Describe your sales stages today', type: 'textarea', placeholder: 'Lead → Contacted → Proposal → Won/Lost' },
      { id: 'tools', label: 'Tools it must connect to', type: 'textarea', placeholder: 'Website forms, WhatsApp, email, Paystack…' },
    ],
    deliverables: ['Configured CRM', 'Pipelines & automations', 'User accounts', 'Training recording', 'Handover guide'],
  },
  {
    key: 'automation',
    label: 'Automation / AI',
    revisionQuota: 2,
    milestones: [
      { title: 'Workflow discovery', dayOffset: 0 },
      { title: 'Automation blueprint sign-off', dayOffset: 4 },
      { title: 'Build & connect tools', dayOffset: 12 },
      { title: 'Testing with live data', dayOffset: 16 },
      { title: 'Go-live & monitoring', dayOffset: 20 },
    ],
    intake: [
      ...common,
      { id: 'tasks', label: 'Which repetitive tasks should run on autopilot?', type: 'textarea' },
      { id: 'channels', label: 'Where do your leads and customers reach you?', type: 'textarea', placeholder: 'WhatsApp, Instagram, website, phone…' },
      { id: 'ai', label: 'Do you want an AI chatbot / assistant?', type: 'select', options: ['Yes', 'Maybe — advise us', 'No'] },
    ],
    deliverables: ['Live workflows', 'Automation map', 'Credentials & access list', 'Handover guide'],
  },
  {
    key: 'video',
    label: 'Video & motion graphics',
    revisionQuota: 2,
    milestones: [
      { title: 'Creative brief & references', dayOffset: 0 },
      { title: 'Script & storyboard', dayOffset: 3 },
      { title: 'First cut', dayOffset: 8 },
      { title: 'Revisions', dayOffset: 11 },
      { title: 'Final masters delivered', dayOffset: 14 },
    ],
    intake: [
      ...common,
      { id: 'format', label: 'Where will the video run?', type: 'textarea', placeholder: 'Website hero, Instagram reels, YouTube ads…' },
      { id: 'length', label: 'Ideal length', type: 'select', options: ['15–30 seconds', '30–60 seconds', '1–3 minutes', 'Not sure'] },
      { id: 'assets', label: 'Footage, product UI or brand assets you can share', type: 'textarea' },
    ],
    deliverables: ['Final video masters (16:9 / 9:16)', 'Captioned versions', 'Project files on request'],
  },
  {
    key: 'branding',
    label: 'Branding & identity',
    revisionQuota: 3,
    milestones: [
      { title: 'Brand discovery', dayOffset: 0 },
      { title: 'Logo concepts', dayOffset: 6 },
      { title: 'Refinement', dayOffset: 10 },
      { title: 'Brand guidelines', dayOffset: 15 },
      { title: 'Asset handover', dayOffset: 18 },
    ],
    intake: [
      ...common,
      { id: 'personality', label: 'Three words your brand should feel like', type: 'text' },
      { id: 'existing', label: 'Is this a new brand or a refresh?', type: 'select', options: ['Brand new', 'Refresh of an existing brand'] },
    ],
    deliverables: ['Logo suite', 'Colour & type system', 'Brand guidelines PDF', 'Social templates'],
  },
  {
    key: 'seo',
    label: 'SEO & visibility',
    revisionQuota: 1,
    milestones: [
      { title: 'Technical & content audit', dayOffset: 0 },
      { title: 'Keyword & content plan', dayOffset: 7 },
      { title: 'On-page fixes live', dayOffset: 21 },
      { title: 'First monthly report', dayOffset: 30 },
    ],
    intake: [
      ...common,
      { id: 'site', label: 'Website address', type: 'text', placeholder: 'https://' },
      { id: 'keywords', label: 'Searches you want to show up for', type: 'textarea' },
      { id: 'areas', label: 'Locations you serve', type: 'text' },
    ],
    deliverables: ['Audit report', 'Keyword plan', 'Monthly ranking reports'],
  },
  {
    key: 'social',
    label: 'Social media',
    revisionQuota: 2,
    milestones: [
      { title: 'Strategy & content pillars', dayOffset: 0 },
      { title: 'First content batch for approval', dayOffset: 7 },
      { title: 'Publishing starts', dayOffset: 10 },
      { title: 'Monthly performance report', dayOffset: 30 },
    ],
    intake: [
      ...common,
      { id: 'platforms', label: 'Which platforms?', type: 'textarea', placeholder: 'Instagram, LinkedIn, TikTok, X…' },
      { id: 'handles', label: 'Your current handles', type: 'textarea' },
      { id: 'cadence', label: 'Posting frequency you want', type: 'select', options: ['3 per week', '5 per week', 'Daily', 'Advise us'] },
    ],
    deliverables: ['Content calendar', 'Monthly content batches', 'Monthly analytics report'],
  },
]

export function getTemplate(key: string) {
  return serviceTemplates.find((t) => t.key === key)
}

export function serviceLabel(key: string) {
  return getTemplate(key)?.label ?? key
}
