/**
 * CYBERSTYLE Client Portal - Truthfulness, Roles, & State Constants
 * Single source of truth for portal copy, labels, states, and demo mode.
 */

export const PORTAL_DEMO_BANNER_TEXT =
  'Demo workspace — sample data only. No real client information, invoices, payment records, files, source repositories, or production systems are shown.';

export const PORTAL_LABELS = {
  WORKSPACE_TITLE: 'Client Workspace',
  DASHBOARD: 'Dashboard',
  PROJECTS: 'Projects',
  INVOICES: 'Invoices and Payments',
  FILES: 'Files and Deliverables',
  MESSAGES: 'Project Messages',
  FEEDBACK: 'Feedback',
  SECURITY: 'Account Security',
  SETTINGS: 'Organization Settings',
} as const;

export type ProjectStage =
  | 'Project planning'
  | 'Design direction'
  | 'Build in progress'
  | 'Preview and feedback'
  | 'Testing and launch preparation'
  | 'Launch and handover'
  | 'Ongoing support';

export const PROJECT_STAGES: readonly ProjectStage[] = [
  'Project planning',
  'Design direction',
  'Build in progress',
  'Preview and feedback',
  'Testing and launch preparation',
  'Launch and handover',
  'Ongoing support',
] as const;

export type ProjectStatus =
  | 'Needs your feedback'
  | 'We are working'
  | 'Waiting for information'
  | 'Scheduled'
  | 'Paused'
  | 'Complete';

export const PROJECT_STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string; bg: string; border: string; description: string }
> = {
  'Needs your feedback': {
    label: 'Needs your feedback',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    description: 'Action is needed from your team to keep the project moving forward.',
  },
  'We are working': {
    label: 'We are working',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    description: 'Our team is actively executing the current milestone deliverables.',
  },
  'Waiting for information': {
    label: 'Waiting for information',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    description: 'Pending external assets, credentials, or domain access from your team.',
  },
  'Scheduled': {
    label: 'Scheduled',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    description: 'Milestone is queued and will begin once preceding items are verified.',
  },
  'Paused': {
    label: 'Paused',
    color: 'text-zinc-400',
    bg: 'bg-zinc-500/10',
    border: 'border-zinc-500/30',
    description: 'Work is currently on hold per agreed scope or request.',
  },
  'Complete': {
    label: 'Complete',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    description: 'All milestones and agreed deliverables have been completed and handed over.',
  },
};

export type InvoiceState =
  | 'Draft'
  | 'Sent'
  | 'Due'
  | 'Overdue'
  | 'Paid'
  | 'Partially paid'
  | 'Void'
  | 'Refunded / Credited'
  | 'Disputed';

export const INVOICE_STATE_CONFIG: Record<
  InvoiceState,
  { label: string; color: string; bg: string; border: string }
> = {
  'Draft': { label: 'Draft', color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500/30' },
  'Sent': { label: 'Sent', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  'Due': { label: 'Due', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  'Overdue': { label: 'Overdue', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  'Paid': { label: 'Paid', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  'Partially paid': { label: 'Partially paid', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  'Void': { label: 'Void', color: 'text-zinc-500', bg: 'bg-zinc-800/30', border: 'border-zinc-700/50' },
  'Refunded / Credited': { label: 'Refunded / Credited', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  'Disputed': { label: 'Disputed', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
};

export const FILE_FOLDERS = [
  'Project plan',
  'Design review',
  'Content and brand',
  'Website or system previews',
  'Invoices and agreements',
  'Launch and handover',
  'Archive',
] as const;

export type FileFolder = (typeof FILE_FOLDERS)[number];

export const MESSAGE_CATEGORIES = [
  'Project question',
  'Feedback',
  'Files/content',
  'Access issue',
  'Billing question',
  'Support request',
  'Other',
] as const;

export type MessageCategory = (typeof MESSAGE_CATEGORIES)[number];

export type ClientRole =
  | 'Client Owner'
  | 'Client Billing Contact'
  | 'Client Project Contact'
  | 'Client Member'
  | 'CYBERSTYLE Admin'
  | 'CYBERSTYLE Project Manager'
  | 'CYBERSTYLE Finance'
  | 'CYBERSTYLE Developer';

/**
 * Obviously fictional demo data conforming to truthfulness rules
 */
export const DEMO_WORKSPACE_DATA = {
  isDemo: true,
  organization: {
    name: 'Demo Workspace',
    businessName: 'Sample Business Ltd.',
    domain: 'samplebusiness.example',
    billingEmail: 'billing@samplebusiness.example',
    supportArrangement: 'Sample support arrangement — terms outlined in project agreement',
    timezone: 'UTC',
  },
  user: {
    name: 'Demo Client',
    email: 'demo@cyberstyle.example',
    role: 'Client Owner' as ClientRole,
  },
  activeProject: {
    id: 'demo-proj-01',
    name: 'Sample Website Project',
    type: 'Website Design & Development',
    stage: 'Preview and feedback' as ProjectStage,
    status: 'Needs your feedback' as ProjectStatus,
    currentOwner: 'Client',
    nextAction: 'Review the homepage design preview and provide feedback by 18 September.',
    nextActionDueDate: '18 September 2026',
    actionLink: '/portal/projects/demo-proj-01',
    actionButtonText: 'Review design',
    nextUpdateDate: 'Scheduled for 16 September 2026',
    projectManager: 'Alex Rivers (CYBERSTYLE PM)',
    milestonesTotal: 5,
    milestonesCompleted: 3,
    milestones: [
      {
        id: 'm1',
        title: 'Project planning',
        description: 'Scope alignment, sitemap architecture, and content requirements.',
        status: 'Approved',
        deliverables: ['Sample project brief', 'Information architecture map'],
      },
      {
        id: 'm2',
        title: 'Design direction',
        description: 'Brand direction, typography, design tokens, and desktop wireframes.',
        status: 'Approved',
        deliverables: ['Sample design preview (v1.2)'],
      },
      {
        id: 'm3',
        title: 'Build in progress',
        description: 'Frontend component development, responsive layouts, and CMS setup.',
        status: 'Approved',
        deliverables: ['Interactive preview environment link'],
      },
      {
        id: 'm4',
        title: 'Preview and feedback',
        description: 'Client review of complete interactive pages and content accuracy.',
        status: 'Awaiting feedback',
        deliverables: ['Sample staging preview (v1.0)'],
      },
      {
        id: 'm5',
        title: 'Testing and launch preparation',
        description: 'Accessibility verification, Core Web Vitals checks, and DNS setup.',
        status: 'Scheduled',
        deliverables: ['Handover checklist and launch guide'],
      },
    ],
  },
  recentActivity: [
    {
      id: 'act-1',
      description: 'Homepage design preview v1.2 uploaded for review',
      actor: 'CYBERSTYLE Design Lead',
      timestamp: '2 hours ago',
      link: '/portal/files',
    },
    {
      id: 'act-2',
      description: 'Project planning milestone approved',
      actor: 'Demo Client',
      timestamp: 'Yesterday',
      link: '/portal/projects',
    },
    {
      id: 'act-3',
      description: 'Sample invoice #INV-SAMPLE-001 issued',
      actor: 'CYBERSTYLE Finance',
      timestamp: '3 days ago',
      link: '/portal/invoices',
    },
  ],
  sampleInvoices: [
    {
      id: 'inv-sample-1',
      number: 'INV-SAMPLE-001',
      description: 'Sample invoice — Deposit for Sample Website Project',
      amount: 4500,
      currency: 'USD',
      issueDate: '01 Sep 2026',
      dueDate: '15 Sep 2026',
      status: 'Due' as InvoiceState,
      pdfUrl: '#',
    },
    {
      id: 'inv-sample-2',
      number: 'INV-SAMPLE-000',
      description: 'Sample invoice — Project discovery session',
      amount: 1500,
      currency: 'USD',
      issueDate: '15 Aug 2026',
      dueDate: '25 Aug 2026',
      status: 'Paid' as InvoiceState,
      paidDate: '20 Aug 2026',
      pdfUrl: '#',
    },
  ],
  sampleFiles: [
    {
      id: 'file-1',
      name: 'Sample project plan.pdf',
      description: 'Project scope, agreed milestones, and delivery timeline.',
      folder: 'Project plan' as FileFolder,
      version: 'v1.1',
      size: '2.4 MB',
      updatedAt: '02 Sep 2026',
      uploadedBy: 'CYBERSTYLE PM',
      status: 'Approved',
    },
    {
      id: 'file-2',
      name: 'Sample design preview.png',
      description: 'High-fidelity desktop and mobile layouts for client review.',
      folder: 'Design review' as FileFolder,
      version: 'v1.2',
      size: '8.1 MB',
      updatedAt: '10 Sep 2026',
      uploadedBy: 'CYBERSTYLE Design',
      status: 'Ready for review',
    },
    {
      id: 'file-3',
      name: 'Sample handover guide.pdf',
      description: 'Draft website documentation and content editing steps.',
      folder: 'Launch and handover' as FileFolder,
      version: 'v0.9',
      size: '1.2 MB',
      updatedAt: '12 Sep 2026',
      uploadedBy: 'CYBERSTYLE Engineering',
      status: 'Draft',
    },
  ],
};
