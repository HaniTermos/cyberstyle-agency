/**
 * CYBERSTYLE Brand & Positioning Constants
 * Single source of truth for public messaging, disclosures, and service definitions.
 */

export const BRAND_NAME = 'CYBERSTYLE';
export const LEGAL_ENTITY_NAME = 'CYBERSTYLE LLC';
export const PRIMARY_DOMAIN = 'https://cyberstyle.net';
export const CONTACT_EMAIL = 'contact@cyberstyle.net';
export const PRIVACY_EMAIL = 'privacy@cyberstyle.net';

// Core Positioning
export const BRAND_STATEMENT =
  'CYBERSTYLE designs high-quality websites, AI-assisted enquiry workflows, e-commerce systems, and custom business tools around real business needs.';

export const PRIMARY_MESSAGE =
  'Help visitors understand your offer, respond to enquiries more consistently, and reduce repetitive work with practical digital systems.';

export const AVAILABILITY_NOTICE =
  'Taking on a limited number of new website and automation projects.';

// Standard Disclaimers & Disclosures
export const OWNERSHIP_DISCLOSURE =
  'After final payment, you own the custom deliverables specified in your agreement, subject to third-party licenses and provider terms.';

export const ONGOING_COSTS_DISCLOSURE =
  'Project pricing covers custom build services. Ongoing operating costs such as hosting, domain registration/renewal, email, SMS, calendar tools, AI API usage, payment processing, cloud storage, monitoring, maintenance, and third-party software are separate and disclosed upfront before activation.';

export const AI_LIMITATIONS_DISCLOSURE =
  'AI can make mistakes. We use approved information, guardrails, testing, and human handoff rules to reduce risk. Your team remains responsible for high-impact decisions and final approvals.';

export const SUPPORT_DISCLOSURE =
  'Support plans are tailored to hosting, monitoring, backups, update needs, response expectations, and monthly change allowances. Exact inclusions and fees are detailed in your proposal.';

export const CONCEPT_DEMO_DISCLAIMER =
  'This is a concept demonstration created by CYBERSTYLE to showcase design and architectural capabilities. It is not an actual client result or commercial endorsement.';

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
  highLevelInclusions: string[];
  inclusions: string[];
}

const rawServices: ServiceItem[] = [
  {
    id: 'premium-web',
    slug: 'premium-web',
    title: 'High-Performing Websites',
    name: 'High-Performing Websites',
    startingPrice: '$800',
    pricePrefix: 'From',
    shortDesc:
      'Clear, responsive business websites designed to help visitors understand your offer, build trust, and take the next step.',
    description:
      'Clear, responsive business websites designed to help visitors understand your offer, build trust, and take the next step.',
    problemSolved:
      'Websites that are confusing, outdated, or slow on mobile fail to convey credibility and lose prospective enquiries.',
    highLevelInclusions: [
      'Responsive, mobile-friendly design and layout',
      'Clear information hierarchy and service content structure',
      'Search-friendly foundation and technical SEO setup',
      'Optional interactive visual layers where appropriate',
      'Contact workflows with spam protection and notifications',
      'Custom deliverables defined in writing before kickoff',
    ],
    inclusions: [
      'Responsive, mobile-friendly design and layout',
      'Clear information hierarchy and service content structure',
      'Search-friendly foundation and technical SEO setup',
      'Optional interactive visual layers where appropriate',
      'Contact workflows with spam protection and notifications',
      'Custom deliverables defined in writing before kickoff',
    ],
  },
  {
    id: 'ai-automation',
    slug: 'ai-automation',
    title: 'AI & Enquiry Automation Workflows',
    name: 'AI & Enquiry Automation Workflows',
    startingPrice: '$1,200',
    pricePrefix: 'From',
    shortDesc:
      'Practical workflows that answer approved questions, capture enquiry details, and help your team respond and follow up consistently.',
    description:
      'Practical workflows that answer approved questions, capture enquiry details, and help your team respond and follow up consistently.',
    problemSolved:
      'Manual email back-and-forth leads to delayed replies, inconsistent communication, and missed follow-ups.',
    highLevelInclusions: [
      'Approved FAQ knowledgebase and structured response rules',
      'Enquiry detail capture, routing, and team alerts',
      'Optional calendar integration and appointment scheduling',
      'Human handoff and escalation rules for complex enquiries',
      'Safety guardrails, testing, and team walkthrough',
      'Transparent operating cost overview before activation',
    ],
    inclusions: [
      'Approved FAQ knowledgebase and structured response rules',
      'Enquiry detail capture, routing, and team alerts',
      'Optional calendar integration and appointment scheduling',
      'Human handoff and escalation rules for complex enquiries',
      'Safety guardrails, testing, and team walkthrough',
      'Transparent operating cost overview before activation',
    ],
  },
  {
    id: 'custom-saas',
    slug: 'custom-saas',
    title: 'Custom Digital Systems & MVPs',
    name: 'Custom Digital Systems & MVPs',
    startingPrice: '$3,000',
    pricePrefix: 'From',
    shortDesc:
      'Focused internal tools, client portals, approval workflows, and MVP systems built around the way your business actually operates.',
    description:
      'Focused internal tools, client portals, approval workflows, and MVP systems built around the way your business actually operates.',
    problemSolved:
      'Disconnected spreadsheets and rigid off-the-shelf software create duplicated data entry and unnecessary per-user licence fees.',
    highLevelInclusions: [
      'Focused client or internal dashboard tailored to one core workflow',
      'Role-based access controls and secure authentication setup',
      'Document exchange, milestone tracking, or intake workflows',
      'Optional Stripe payment processing integration',
      'Custom code deliverable transferred after final payment',
      'Hosting, data migration, and third-party services scoped separately',
    ],
    inclusions: [
      'Focused client or internal dashboard tailored to one core workflow',
      'Role-based access controls and secure authentication setup',
      'Document exchange, milestone tracking, or intake workflows',
      'Optional Stripe payment processing integration',
      'Custom code deliverable transferred after final payment',
      'Hosting, data migration, and third-party services scoped separately',
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
