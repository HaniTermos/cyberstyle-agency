/**
 * CYBERSTYLE Brand & Positioning Constants
 * Single source of truth for public messaging, disclosures, and service definitions.
 */

export const BRAND_NAME = 'CYBERSTYLE';
export const LEGAL_ENTITY_NAME = 'CYBERSTYLE LLC';
export const PRIMARY_DOMAIN = 'https://cyberstyle.net';
export const CONTACT_EMAIL = 'info@cyberstyle.net';
export const PRIVACY_EMAIL = 'privacy@cyberstyle.net';

// Core Positioning
export const BRAND_STATEMENT =
  'CYBERSTYLE designs high-quality websites, AI-assisted enquiry workflows, e-commerce systems, and custom business tools around real business needs.';

export const PRIMARY_MESSAGE =
  'Help visitors understand your offer, respond to enquiries more consistently, and reduce repetitive work with practical digital systems.';

export const AVAILABILITY_NOTICE =
  'Taking on a limited number of new website and automation projects.';

// Standard Disclaimers & Disclosures
export const INCLUDED_SCOPE_DISCLOSURE =
  'Your quote covers the agreed strategy, design, development, testing, and launch of your project.';

export const ONGOING_COSTS_DISCLOSURE =
  'Some services are paid directly to external providers, such as your domain name, web hosting, email platform, online payments, booking software, or AI usage. We explain these costs clearly before anything is activated—there are no surprise subscriptions.';

export const OWNERSHIP_DISCLOSURE =
  'After final payment, you receive ownership of the custom work created for your project, as specified in your agreement. External tools remain subject to their own provider terms.';

export const AI_LIMITATIONS_DISCLOSURE =
  'AI can make mistakes. We use approved information, guardrails, testing, and human handoff rules to reduce risk. Your team remains responsible for high-impact decisions and final approvals.';

export const SUPPORT_DISCLOSURE =
  'We stay available after launch for 30 days of post-launch support to resolve issues related to the agreed project and help your team settle into the new system.';

// High-Perception Value Extras Included with Every Engagement
export const VALUE_EXTRAS = [
  {
    title: 'Business-first planning session',
    description: 'Before design starts, we map your service, ideal customers, common questions, and the action you want visitors to take.',
  },
  {
    title: 'A website designed to guide decisions',
    description: 'We organise your content so visitors quickly understand your offer, see why they should trust you, and know exactly what to do next.',
  },
  {
    title: 'Ready-to-launch checklist',
    description: 'We help you prepare the essentials—contact details, enquiry notifications, legal links, analytics, and launch checks—before your site goes live.',
  },
  {
    title: 'Personal handover walkthrough',
    description: 'Receive a short recorded walkthrough showing how to update key content, manage enquiries, and use the tools included in your project.',
  },
  {
    title: '30 days of post-launch support',
    description: 'We stay available after launch to resolve issues related to the agreed project and help your team settle into the new system.',
  },
  {
    title: 'Mobile, speed, and enquiry-flow review',
    description: 'Before launch, we test the most important customer journey: arriving on your site, understanding your offer, and contacting you successfully.',
  },
];

// Simple 4-Step Engagement Process
export const PROJECT_PROCESS_STEPS = [
  {
    step: '01',
    title: 'Tell us what you need',
    desc: 'Share your business, goals, and current challenges.',
  },
  {
    step: '02',
    title: 'Receive a clear plan',
    desc: 'We send recommended scope, timeline, deliverables, and price.',
  },
  {
    step: '03',
    title: 'Review before we build',
    desc: 'You approve the direction before development begins.',
  },
  {
    step: '04',
    title: 'Launch with confidence',
    desc: 'We test, launch, hand over, and support the agreed work.',
  },
];

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  name: string;
  startingPrice: string;
  pricePrefix: string;
  shortDesc: string;
  description: string;
  problemSolved: string;
  bestFor?: string;
  ctaText?: string;
  highLevelInclusions: string[];
  inclusions: string[];
}

const rawServices: ServiceItem[] = [
  {
    id: 'premium-web',
    slug: 'premium-web',
    title: 'Business Website Launch',
    name: 'Business Website Launch',
    startingPrice: '$800',
    pricePrefix: 'Starting from',
    shortDesc:
      'For businesses that need a credible online presence that turns visitors into enquiries.',
    description:
      'For businesses that need a credible online presence that turns visitors into enquiries.',
    problemSolved:
      'Websites that are confusing, outdated, or hard to use on phones lose customer confidence before they ever reach out.',
    bestFor:
      'New businesses, local services, consultants, restaurants, clinics, agencies, contractors, and businesses replacing an outdated site.',
    ctaText: 'Build My Business Website',
    highLevelInclusions: [
      'A custom website that reflects your business and builds trust',
      'Clear pages that explain what you offer and why customers should choose you',
      'A smooth experience on mobile, tablet, and desktop',
      'Contact and enquiry forms sent directly to you',
      'Basic search visibility setup so customers can find you more easily',
      'Launch support and guidance for managing your website',
    ],
    inclusions: [
      'A custom website that reflects your business and builds trust',
      'Clear pages that explain what you offer and why customers should choose you',
      'A smooth experience on mobile, tablet, and desktop',
      'Contact and enquiry forms sent directly to you',
      'Basic search visibility setup so customers can find you more easily',
      'Launch support and guidance for managing your website',
    ],
  },
  {
    id: 'ai-automation',
    slug: 'ai-automation',
    title: 'Website + Smart Enquiry System',
    name: 'Website + Smart Enquiry System',
    startingPrice: '$1,200',
    pricePrefix: 'Starting from',
    shortDesc:
      'For businesses that want to respond faster, qualify leads, and spend less time repeating the same answers.',
    description:
      'For businesses that want to respond faster, qualify leads, and spend less time repeating the same answers.',
    problemSolved:
      'Manual email delays and missed messages cause qualified prospects to look to competitors instead.',
    bestFor:
      'Companies receiving frequent enquiries, appointment-based businesses, real estate, logistics, agencies, education providers, and service businesses.',
    ctaText: 'Improve My Enquiry Process',
    highLevelInclusions: [
      'Everything in the Business Website Launch package',
      'Autonomous 24/7 AI Enquiry Assistant trained on your business knowledge',
      'Automated Lead Qualification & Triage (scores prospects before notifying your team)',
      'Calendar Scheduling Automation (Google Calendar / Calendly auto-booking)',
      'Instant Multi-Channel Alerts (Email, Slack, WhatsApp, or CRM Webhooks)',
      'Smart Form Intake with structured field validation & follow-up pipelines',
      'Seamless Human Handover protocols with strict safety guardrails',
      'End-to-end integration with your sales CRM or email workflow',
    ],
    inclusions: [
      'Everything in the Business Website Launch package',
      'Autonomous 24/7 AI Enquiry Assistant trained on your business knowledge',
      'Automated Lead Qualification & Triage (scores prospects before notifying your team)',
      'Calendar Scheduling Automation (Google Calendar / Calendly auto-booking)',
      'Instant Multi-Channel Alerts (Email, Slack, WhatsApp, or CRM Webhooks)',
      'Smart Form Intake with structured field validation & follow-up pipelines',
      'Seamless Human Handover protocols with strict safety guardrails',
      'End-to-end integration with your sales CRM or email workflow',
    ],
  },
  {
    id: 'custom-saas',
    slug: 'custom-saas',
    title: 'Custom Business Growth System',
    name: 'Custom Business Growth System',
    startingPrice: '$3,000',
    pricePrefix: 'Starting from',
    shortDesc:
      'For teams that have outgrown spreadsheets, scattered messages, and manual follow-up.',
    description:
      'For teams that have outgrown spreadsheets, scattered messages, and manual follow-up.',
    problemSolved:
      'Disconnected spreadsheets and scattered messages create administrative drag, manual errors, and lost client time.',
    bestFor:
      'Businesses needing a client portal, booking system, order workflow, internal operations tool, membership platform, or first version of a digital product.',
    ctaText: 'Discuss My Custom System',
    highLevelInclusions: [
      'A tailored system built around one important business process',
      'One organised place for clients, requests, bookings, orders, or project updates',
      'Secure staff access based on each person’s role',
      'A simple view of the information that matters to your business',
      'Customer payments, notifications, or third-party tools connected where needed',
      'A private test version before launch, so you can review everything safely',
      'Training, handover, and documentation for your team',
    ],
    inclusions: [
      'A tailored system built around one important business process',
      'One organised place for clients, requests, bookings, orders, or project updates',
      'Secure staff access based on each person’s role',
      'A simple view of the information that matters to your business',
      'Customer payments, notifications, or third-party tools connected where needed',
      'A private test version before launch, so you can review everything safely',
      'Training, handover, and documentation for your team',
    ],
  },
  {
    id: 'ecommerce',
    slug: 'ecommerce',
    title: 'E-commerce Systems & Store Experiences',
    name: 'E-commerce Systems & Store Experiences',
    startingPrice: 'Custom Scoped',
    pricePrefix: '',
    shortDesc:
      'Tailored storefront experiences and product catalogue systems configured around your inventory, checkout, and fulfillment needs.',
    description:
      'Tailored storefront experiences and product catalogue systems configured around your inventory, checkout, and fulfillment needs.',
    problemSolved:
      'Generic store templates with poor mobile checkouts and rigid layouts limit conversion and customer trust.',
    bestFor:
      'Retail brands, boutique studios, direct-to-consumer businesses, and digital product merchants.',
    ctaText: 'Discuss Store Scopes',
    highLevelInclusions: [
      'Custom product catalogue and collection layouts',
      'Secure cart and checkout configuration',
      'Inventory and order management workflow integration',
      'Mobile-first responsive purchasing flows',
      'Search and filter foundations for easy product discovery',
      'Scoped individually based on SKU count and operational complexity',
    ],
    inclusions: [
      'Custom product catalogue and collection layouts',
      'Secure cart and checkout configuration',
      'Inventory and order management workflow integration',
      'Mobile-first responsive purchasing flows',
      'Search and filter foundations for easy product discovery',
      'Scoped individually based on SKU count and operational complexity',
    ],
  },
];

export type ServicesType = ServiceItem[] & {
  web: ServiceItem;
  ai: ServiceItem;
  saas: ServiceItem;
  ecommerce: ServiceItem;
};

const webItem = rawServices[0] as ServiceItem;
const aiItem = rawServices[1] as ServiceItem;
const saasItem = rawServices[2] as ServiceItem;
const ecommerceItem = rawServices[3] as ServiceItem;

export const SERVICES: ServicesType = Object.assign([...rawServices], {
  web: webItem,
  ai: aiItem,
  saas: saasItem,
  ecommerce: ecommerceItem,
});

export const SERVICES_MAP = {
  web: webItem,
  ai: aiItem,
  saas: saasItem,
  ecommerce: ecommerceItem,
};

// Standard Approved CTAs
export const CTA_LABELS = {
  primary: 'Request a Project Call',
  secondary: 'Explore Services',
  REQUEST_CALL: 'Request a Project Call',
  START_ENQUIRY: 'Start a Project Enquiry',
  DISCUSS_VERSION: 'Discuss a Version for Your Business',
  VIEW_OPTIONS: 'View Practical Options',
  EXPLORE_SERVICES: 'Explore Services',
};
