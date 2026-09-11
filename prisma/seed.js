const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'postgresql://postgres:123456789@localhost:5432/db_agency?schema=public',
});

// Helper password hasher for demo seed
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'cyberstyle_salt').digest('hex');
}

async function main() {
  console.log('🌱 Starting comprehensive CYBERSTYLE demo database seeding...');

  // 1. Super Admin Account (admin@cyberstyle.net / Admin123456!)
  const superAdminPasswordHash = hashPassword('Admin123456!');
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@cyberstyle.net' },
    update: { passwordHash: superAdminPasswordHash },
    create: {
      email: 'admin@cyberstyle.net',
      name: 'CYBERSTYLE Executive Admin',
      passwordHash: superAdminPasswordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
      adminProfile: {
        create: {
          department: 'Executive Leadership',
          permissions: ['*'],
        },
      },
    },
  });
  console.log(`✅ Super Admin created: ${superAdmin.email} (Password: Admin123456!)`);

  // 2. Demo Client Organization & User (client@apexcapital.com / Client123456!)
  let clientOrg = await prisma.clientOrganization.findFirst({
    where: { name: 'Apex Capital Advisory' },
  });
  if (!clientOrg) {
    clientOrg = await prisma.clientOrganization.create({
      data: {
        name: 'Apex Capital Advisory',
        website: 'https://apexcapital.com',
        country: 'USA',
      },
    });
  }

  const clientPasswordHash = hashPassword('Client123456!');
  const clientUser = await prisma.user.upsert({
    where: { email: 'client@apexcapital.com' },
    update: { passwordHash: clientPasswordHash },
    create: {
      email: 'client@apexcapital.com',
      name: 'Franklin Vance',
      passwordHash: clientPasswordHash,
      role: 'CLIENT',
      status: 'ACTIVE',
      isEmailVerified: true,
      clientProfile: {
        create: {
          organizationId: clientOrg.id,
          title: 'Managing Director',
        },
      },
    },
  });
  console.log(`✅ Demo Client created: ${clientUser.email} (Password: Client123456!)`);

  // 3. Demo Active Project & Milestones
  let project = await prisma.project.findFirst({
    where: { slug: 'apex-capital-web' },
  });
  if (!project) {
    project = await prisma.project.create({
      data: {
        title: 'Apex Capital Web Architecture & Three.js Shaders',
        slug: 'apex-capital-web',
        organizationId: clientOrg.id,
        status: 'DEVELOPMENT',
        stagingUrl: 'https://staging.cyberstyle.net/apex-preview',
        startDate: new Date('2026-08-01'),
        targetLaunchDate: new Date('2026-09-28'),
        milestones: {
          create: [
            {
              title: '01 Discovery & Technical Spec',
              description: 'Define information architecture, database schema, and conversion goals.',
              orderIndex: 0,
              status: 'COMPLETED',
              completedAt: new Date('2026-08-12'),
            },
            {
              title: '02 Design System & WebGL Prototyping',
              description: 'Custom Silk shader parameters, typography tokens, and responsive layout grids.',
              orderIndex: 1,
              status: 'COMPLETED',
              completedAt: new Date('2026-08-24'),
            },
            {
              title: '03 3D Web Build & CMS Integration',
              description: 'Next.js frontend build, Three.js shaders, and Payload CMS collections.',
              orderIndex: 2,
              status: 'IN_PROGRESS',
              dueDate: new Date('2026-09-15'),
            },
            {
              title: '04 Production VPS Deployment & Handover',
              description: 'Nginx TLS 1.3, Docker compose, backup automation, and full repository transfer.',
              orderIndex: 3,
              status: 'PENDING',
              dueDate: new Date('2026-09-28'),
            },
          ],
        },
        updates: {
          create: [
            {
              authorId: superAdmin.id,
              title: 'Silk Fluid Shader Optimization Complete',
              content: 'Clamped DPR to 1.5 and integrated reduced-motion CSS gradient fallbacks. Lighthouse performance verified at 98/100.',
              isClientVisible: true,
            },
          ],
        },
        deliverables: {
          create: [
            {
              title: 'Brand Identity & Design System Kit',
              fileKey: 'apex/design-system-v1.zip',
              fileSize: 14889728,
              mimeType: 'application/zip',
              isClientVisible: true,
            },
            {
              title: 'Technical Architecture & Sitemap Specification',
              fileKey: 'apex/architecture-spec.pdf',
              fileSize: 2516582,
              mimeType: 'application/pdf',
              isClientVisible: true,
            },
          ],
        },
      },
    });
    console.log(`✅ Demo Project created: ${project.title}`);
  }

  // 4. Invoices
  const inv1 = await prisma.invoice.findFirst({ where: { invoiceNumber: 'INV-2026-0041' } });
  if (!inv1) {
    await prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2026-0041',
        organizationId: clientOrg.id,
        projectId: project.id,
        subtotal: 1200.0,
        totalAmount: 1200.0,
        amountPaid: 1200.0,
        amountDue: 0.0,
        status: 'PAID',
        paidAt: new Date('2026-08-12'),
        dueDate: new Date('2026-08-12'),
        paymentTerms: 'Due on receipt',
        lineItems: {
          create: [
            {
              description: 'Milestone 1: Project Initiation, Strategy & Design System Deposit (50%)',
              quantity: 1,
              unitPrice: 1200.0,
              totalPrice: 1200.0,
            },
          ],
        },
      },
    });
  }

  const inv2 = await prisma.invoice.findFirst({ where: { invoiceNumber: 'INV-2026-0089' } });
  if (!inv2) {
    await prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2026-0089',
        organizationId: clientOrg.id,
        projectId: project.id,
        subtotal: 1200.0,
        totalAmount: 1200.0,
        amountPaid: 0.0,
        amountDue: 1200.0,
        status: 'SENT',
        dueDate: new Date('2026-09-28'),
        paymentTerms: 'Due upon completion',
        lineItems: {
          create: [
            {
              description: 'Milestone 2: Final 3D Web Build, Production VPS Deployment & Handover (50%)',
              quantity: 1,
              unitPrice: 1200.0,
              totalPrice: 1200.0,
            },
          ],
        },
      },
    });
  }
  console.log('✅ Demo Invoices seeded (INV-2026-0041 [PAID], INV-2026-0089 [DUE])');

  // 5. Core Site Settings
  const defaultSettings = [
    { key: 'site_name', value: 'CYBERSTYLE LLC', description: 'Brand Name', isPublic: true },
    { key: 'site_domain', value: 'https://cyberstyle.net', description: 'Canonical Domain', isPublic: true },
    { key: 'contact_email', value: 'hello@cyberstyle.net', description: 'Primary Inquiries Email', isPublic: true },
    { key: 'starting_price_web', value: '800', description: 'Starting price for Premium Web Development', isPublic: true },
    { key: 'starting_price_ai', value: '1200', description: 'Starting price for AI & Automation Integrations', isPublic: true },
    { key: 'starting_price_saas', value: '3000', description: 'Starting price for Custom SaaS Builds', isPublic: true },
    { key: 'availability_status', value: 'Available for Q3/Q4 select builds', description: 'Header status chip', isPublic: true },
  ];

  for (const s of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // 6. FAQs
  const faqCount = await prisma.fAQ.count();
  if (faqCount === 0) {
    const defaultFaqs = [
      {
        question: 'What is the starting investment for a CYBERSTYLE website?',
        answer: 'Our bespoke websites start from $800. Final investment is based on design depth, 3D/Silk interactive elements, CMS structure, API integrations, and conversion architecture.',
        category: 'Pricing & Scope',
        orderIndex: 0,
        isPublished: true,
      },
      {
        question: 'How do 3D and Silk backgrounds affect load speed and Core Web Vitals?',
        answer: 'We engineer our Three.js/Silk shaders with lazy initialization, strict DPR limits, frame throttling, and instant static CSS fallbacks for low-power or reduced-motion environments, achieving 90+ Lighthouse performance.',
        category: 'Performance & 3D',
        orderIndex: 1,
        isPublished: true,
      },
      {
        question: 'What does your AI & Business Automation service include?',
        answer: 'Starting from $1,200, we engineer custom lead capture pipelines, CRM workflows, automated customer routing, OpenAI/Gemini integrations, and operational dashboards tailored to your service business.',
        category: 'Services & Automation',
        orderIndex: 2,
        isPublished: true,
      },
    ];

    for (const faq of defaultFaqs) {
      await prisma.fAQ.create({ data: faq });
    }
  }

  // 7. Blog Author & Posts
  const author = await prisma.author.upsert({
    where: { slug: 'cyberstyle-editorial' },
    update: {},
    create: {
      name: 'CYBERSTYLE Engineering & Strategy',
      slug: 'cyberstyle-editorial',
      role: 'Core Strategy Team',
      bio: 'Technical essays on high-conversion architecture, 3D web systems, and AI operations.',
    },
  });

  const webCat = await prisma.category.upsert({
    where: { slug: 'web-architecture' },
    update: {},
    create: { name: 'Web Architecture', slug: 'web-architecture' },
  });

  const postCount = await prisma.blogPost.count();
  if (postCount === 0) {
    await prisma.blogPost.create({
      data: {
        title: 'Engineering Sub-Second 3D Web Experiences with Next.js and Three.js',
        slug: 'engineering-sub-second-3d-web-experiences',
        excerpt: 'How we achieve 90+ Lighthouse Core Web Vitals while running complex WebGL shader canvases on agency websites.',
        content: 'Building interactive 3D web experiences requires balancing visual richness with tight performance budgets...',
        status: 'PUBLISHED',
        publishedAt: new Date('2026-08-15'),
        readingTimeMinutes: 5,
        authorId: author.id,
        categoryId: webCat.id,
      },
    });
  }

  // 8. Reviews
  const reviewCount = await prisma.review.count();
  if (reviewCount === 0) {
    await prisma.review.create({
      data: {
        clientName: 'Franklin Vance',
        clientTitle: 'Managing Director',
        companyName: 'Apex Capital Advisory',
        rating: 5,
        quote: 'CYBERSTYLE transformed our visual presence completely. Our inbound high-ticket inquiries increased significantly in the first 30 days.',
        status: 'APPROVED',
        isFeatured: true,
        approvedAt: new Date(),
      },
    });
  }

  // 9. CRM Inbound Leads
  const leadCount = await prisma.lead.count();
  if (leadCount === 0) {
    await prisma.lead.create({
      data: {
        name: 'Marcus Vance',
        company: 'Vance Robotics Inc.',
        email: 'm.vance@vancerobotics.com',
        phone: '+1 (555) 234-5678',
        country: 'USA',
        serviceNeeded: 'AI & Business Automation ($1,200+)',
        approxBudget: '$3,000 - $6,000',
        desiredTimeline: '4-6 weeks',
        projectGoals: 'Automate inbound qualification and CRM lead distribution.',
        stage: 'NEW',
      },
    });
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
