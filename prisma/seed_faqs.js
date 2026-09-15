const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialFaqs = [
  // General & Pricing (Faq page, Home, Pricing)
  {
    category: 'Build Fees & Scope',
    question: 'How are CYBERSTYLE project fees structured?',
    answer: 'Our projects are priced as fixed one-time build fees based on documented scope: Business Website Launch starts from $750, Website + Smart Enquiry System starts from $1,200, and Custom Web Applications start from $2,500. Every proposal details deliverables in writing before work begins.',
    displayPages: ['faq', 'home', 'pricing'],
    orderIndex: 1,
    isPublished: true,
  },
  {
    category: 'Build Fees & Scope',
    question: 'How do milestone payments work?',
    answer: 'Standard projects typically follow a 50% initial milestone payment to initiate design and architecture, with the remaining 50% due upon review, staging acceptance, and final deployment approval. Payments are processed securely via Stripe or bank transfer.',
    displayPages: ['faq', 'home', 'pricing'],
    orderIndex: 2,
    isPublished: true,
  },
  {
    category: 'Performance & Engineering',
    question: 'How do you ensure websites perform well on mobile phones?',
    answer: 'We engineer using Next.js and TypeScript, serving pre-rendered HTML and automatically optimizing modern image formats (WebP/AVIF). We avoid bloated third-party plugin suites to guarantee sub-second page loads (99+ Core Web Vitals) and smooth navigation on all cellular connections.',
    displayPages: ['faq', 'home', 'premium-web'],
    orderIndex: 3,
    isPublished: true,
  },
  {
    category: 'Automation & AI',
    question: 'What does an AI enquiry workflow do, and what are its limits?',
    answer: 'An automated enquiry assistant can greet visitors, answer routine questions about your services based on approved documentation, and provide links to book consultation calls. It operates under strict guardrails and escalates directly to human staff when complex or out-of-scope inquiries occur.',
    displayPages: ['faq', 'home', 'ai-automation'],
    orderIndex: 4,
    isPublished: true,
  },
  {
    category: 'Ownership & Infrastructure',
    question: 'Do I own the code and design files once the project is finished?',
    answer: 'Yes. Upon completion and final settlement, you receive 100% full ownership of custom code repositories, media assets, deployment configurations, and documentation. No proprietary lock-in or recurring builder licensing fees.',
    displayPages: ['faq', 'home', 'pricing', 'premium-web', 'custom-saas'],
    orderIndex: 5,
    isPublished: true,
  },
  {
    category: 'Timelines & Delivery',
    question: 'What are typical project timelines from kickoff to launch?',
    answer: 'Standard business websites typically take 2 to 4 weeks, depending on page volume and feedback turnaround. Custom web applications and multi-step automation pipelines typically require 3 to 6 weeks. Target milestone dates are committed in writing.',
    displayPages: ['faq', 'home', 'premium-web', 'custom-saas'],
    orderIndex: 6,
    isPublished: true,
  },
  {
    category: 'Ongoing Maintenance',
    question: 'What ongoing support or maintenance is needed after launch?',
    answer: 'We provide 30 days of post-launch warranty and hypercare included with every project. Ongoing managed hosting, proactive security updates, and retainer support are optional and can also be handed over completely to internal teams.',
    displayPages: ['faq', 'home', 'pricing'],
    orderIndex: 7,
    isPublished: true,
  },
  {
    category: 'Getting Started',
    question: 'What information should we prepare before our first call?',
    answer: 'It is helpful to have an idea of your primary business goals, your existing website URL (if applicable), key features you require, and a rough target timeline. We will guide you through the technical scoping questions during our call.',
    displayPages: ['faq', 'home'],
    orderIndex: 8,
    isPublished: true,
  },

  // Premium Web Service FAQs
  {
    category: 'Web Architecture',
    question: 'What technologies do you use to build websites?',
    answer: 'We build with Next.js (App Router), React 19, TypeScript, and modern Tailwind CSS. For databases and backend systems, we utilize Node.js, PostgreSQL, Prisma ORM, and Redis.',
    displayPages: ['premium-web', 'faq'],
    orderIndex: 9,
    isPublished: true,
  },
  {
    category: 'Design & Revisions',
    question: 'How many design revisions are included?',
    answer: 'Every project includes iterative design stages: wireframes, high-fidelity interactive staging mockups, and two full rounds of consolidated revisions prior to production build sign-off.',
    displayPages: ['premium-web', 'faq'],
    orderIndex: 10,
    isPublished: true,
  },
  {
    category: 'SEO & Search Rankings',
    question: 'Is SEO optimization included with the website build?',
    answer: 'Yes. We implement technical on-page SEO: semantic HTML5 hierarchies, OpenGraph meta tags, XML sitemaps, robots.txt, canonical URLs, and schema.org JSON-LD structured data for Google rich snippets.',
    displayPages: ['premium-web', 'home', 'faq'],
    orderIndex: 11,
    isPublished: true,
  },

  // AI & Automation FAQs
  {
    category: 'AI Integrations',
    question: 'How does the AI assistant learn about my business?',
    answer: 'We vectorize and embed your verified company documentation, service pricing, brochures, and FAQs into a private knowledge base. The AI references only your verified data, preventing hallucinations.',
    displayPages: ['ai-automation', 'home', 'faq'],
    orderIndex: 12,
    isPublished: true,
  },
  {
    category: 'Integrations & CRM',
    question: 'Can the automation connect to our CRM or calendar?',
    answer: 'Yes. We natively integrate with Google Calendar, Calendly, HubSpot, Slack, WhatsApp Business, Gmail, and custom Webhooks so inquiries flow instantly into your existing tools.',
    displayPages: ['ai-automation', 'pricing', 'faq'],
    orderIndex: 13,
    isPublished: true,
  },

  // Custom SaaS FAQs
  {
    category: 'Custom Applications',
    question: 'Can you build custom client portals with user logins and payments?',
    answer: 'Yes. We architect full-stack custom platforms with role-based access control (RBAC), multi-factor authentication (2FA), Stripe billing & invoicing, file vaults, and real-time client dashboards.',
    displayPages: ['custom-saas', 'home', 'faq'],
    orderIndex: 14,
    isPublished: true,
  },
  {
    category: 'Hosting & Infrastructure',
    question: 'Where is the application hosted?',
    answer: 'We deploy to high-availability cloud infrastructure such as Vercel, AWS, or digital self-hosted VPS (Docker + Nginx + PostgreSQL) depending on your data sovereignty and compliance requirements.',
    displayPages: ['custom-saas', 'faq'],
    orderIndex: 15,
    isPublished: true,
  },
];

async function main() {
  console.log('Seeding FAQs into PostgreSQL...');
  let count = 0;
  for (const item of initialFaqs) {
    const existing = await prisma.fAQ.findFirst({
      where: { question: item.question }
    });
    if (!existing) {
      await prisma.fAQ.create({ data: item });
      count++;
    } else {
      // Update displayPages and orderIndex to ensure latest config
      await prisma.fAQ.update({
        where: { id: existing.id },
        data: {
          displayPages: item.displayPages,
          category: item.category,
          orderIndex: item.orderIndex,
          isPublished: true,
        }
      });
    }
  }
  console.log(`✅ Successfully seeded/synced ${initialFaqs.length} FAQs in PostgreSQL (${count} new created).`);
}

main()
  .catch((err) => {
    console.error('Error seeding FAQs:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
