const { Client } = require('C:/Users/Hani/OneDrive/Desktop/agency project/Server/node_modules/pg');
const crypto = require('crypto');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123456789@localhost:5432/db_agency?schema=public';

async function seed() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('🌱 Connected to PostgreSQL db_agency. Seeding demo data...');

  try {
    await client.query('BEGIN');

    // 1. Super Admin User
    const adminId = 'usr_admin_cyberstyle';
    const adminPasswordHash = crypto.createHash('sha256').update('Admin123456!cyberstyle_salt').digest('hex');

    await client.query(`
      INSERT INTO "User" (id, email, name, "passwordHash", role, status, "isEmailVerified", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, 'SUPER_ADMIN', 'ACTIVE', true, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE 
      SET "passwordHash" = $4, name = $3;
    `, [adminId, 'admin@cyberstyle.net', 'CYBERSTYLE Executive Admin', adminPasswordHash]);

    await client.query(`
      INSERT INTO "AdminProfile" (id, "userId", department, permissions, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT ("userId") DO NOTHING;
    `, ['adm_prof_1', adminId, 'Executive Leadership', ['*']]);

    console.log('✅ Super Admin seeded: admin@cyberstyle.net (Password: Admin123456!)');

    // 2. Client Organization & User
    const orgId = 'org_apex_capital';
    await client.query(`
      INSERT INTO "ClientOrganization" (id, name, domain, country, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `, [orgId, 'Apex Capital Advisory', 'https://apexcapital.com', 'USA']);

    const clientId = 'usr_client_apex';
    const clientPasswordHash = crypto.createHash('sha256').update('Client123456!cyberstyle_salt').digest('hex');

    await client.query(`
      INSERT INTO "User" (id, email, name, "passwordHash", role, status, "isEmailVerified", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, 'CLIENT', 'ACTIVE', true, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE 
      SET "passwordHash" = $4, name = $3;
    `, [clientId, 'client@apexcapital.com', 'Franklin Vance', clientPasswordHash]);

    await client.query(`
      INSERT INTO "ClientProfile" (id, "userId", "organizationId", "jobTitle", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT ("userId") DO NOTHING;
    `, ['clt_prof_1', clientId, orgId, 'Managing Director']);

    console.log('✅ Demo Client seeded: client@apexcapital.com (Password: Client123456!)');

    // 3. Demo Active Project & Milestones
    const projectId = 'prj_apex_web_3d';
    await client.query(`
      INSERT INTO "Project" (id, name, slug, "organizationId", status, "stagingUrl", "startDate", "targetLaunchDate", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, 'DEVELOPMENT', $5, NOW() - INTERVAL '30 days', NOW() + INTERVAL '26 days', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `, [projectId, 'Apex Capital Web Architecture & Three.js Shaders', 'apex-capital-web', orgId, 'https://staging.cyberstyle.net/apex-preview']);

    // Milestones
    const milestones = [
      { id: 'ms_1', title: '01 Discovery & Technical Spec', desc: 'Define information architecture and schema.', status: 'COMPLETED', order: 0 },
      { id: 'ms_2', title: '02 Design System & WebGL Prototyping', desc: 'Custom Silk shader parameters and layout tokens.', status: 'COMPLETED', order: 1 },
      { id: 'ms_3', title: '03 3D Web Build & CMS Integration', desc: 'Next.js frontend build and Three.js canvas.', status: 'IN_PROGRESS', order: 2 },
      { id: 'ms_4', title: '04 Production VPS Deployment & Handover', desc: 'Nginx TLS 1.3, backup cron, and code transfer.', status: 'NOT_STARTED', order: 3 },
    ];

    for (const m of milestones) {
      await client.query(`
        INSERT INTO "Milestone" (id, "projectId", title, description, status, "orderIndex", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;
      `, [m.id, projectId, m.title, m.desc, m.status, m.order]);
    }

    // Deliverables
    await client.query(`
      INSERT INTO "Deliverable" (id, "projectId", "uploaderId", title, "fileUrl", "fileKey", "fileSize", "mimeType", "isClientVisible", "createdAt", "updatedAt")
      VALUES 
        ('del_1', $1, $2, 'Brand Identity & Design System Kit', 'https://cyberstyle.net/files/design-system.zip', 'apex/design-system-v1.zip', 14889728, 'application/zip', true, NOW(), NOW()),
        ('del_2', $1, $2, 'Technical Architecture & Sitemap Specification', 'https://cyberstyle.net/files/architecture.pdf', 'apex/architecture-spec.pdf', 2516582, 'application/pdf', true, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `, [projectId, adminId]);

    console.log('✅ Demo Project, 4 Milestones, and Deliverables seeded.');

    // 4. Invoices
    const inv1Id = 'inv_2026_0041';
    await client.query(`
      INSERT INTO "Invoice" (id, "invoiceNumber", "organizationId", "projectId", subtotal, "totalAmount", "amountPaid", "amountDue", status, "paidAt", "dueDate", "paymentTerms", "createdAt", "updatedAt")
      VALUES ($1, 'INV-2026-0041', $2, $3, 1200.0, 1200.0, 1200.0, 0.0, 'PAID', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days', 'Due on receipt', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `, [inv1Id, orgId, projectId]);

    await client.query(`
      INSERT INTO "InvoiceLineItem" (id, "invoiceId", description, quantity, "unitPrice", "totalPrice", "createdAt", "updatedAt")
      VALUES ('item_1', $1, 'Milestone 1: Project Initiation & Design System Deposit (50%)', 1, 1200.0, 1200.0, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `, [inv1Id]);

    const inv2Id = 'inv_2026_0089';
    await client.query(`
      INSERT INTO "Invoice" (id, "invoiceNumber", "organizationId", "projectId", subtotal, "totalAmount", "amountPaid", "amountDue", status, "dueDate", "paymentTerms", "createdAt", "updatedAt")
      VALUES ($1, 'INV-2026-0089', $2, $3, 1200.0, 1200.0, 0.0, 1200.0, 'SENT', NOW() + INTERVAL '26 days', 'Due upon completion', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `, [inv2Id, orgId, projectId]);

    await client.query(`
      INSERT INTO "InvoiceLineItem" (id, "invoiceId", description, quantity, "unitPrice", "totalPrice", "createdAt", "updatedAt")
      VALUES ('item_2', $1, 'Milestone 2: Final 3D Web Build, VPS Deployment & Handover (50%)', 1, 1200.0, 1200.0, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `, [inv2Id]);

    console.log('✅ Demo Invoices seeded (INV-2026-0041 [PAID], INV-2026-0089 [DUE]).');

    // 5. Core Site Settings
    const settings = [
      ['site_name', 'CYBERSTYLE LLC', 'Brand Name'],
      ['site_domain', 'https://cyberstyle.net', 'Canonical Domain'],
      ['contact_email', 'hello@cyberstyle.net', 'Primary Inquiries Email'],
      ['starting_price_web', '800', 'Starting price for Premium Web Development'],
      ['starting_price_ai', '1200', 'Starting price for AI & Automation Integrations'],
      ['starting_price_saas', '3000', 'Starting price for Custom SaaS Builds'],
      ['availability_status', 'Available for Q3/Q4 select builds', 'Header status chip'],
    ];

    for (const [key, value, desc] of settings) {
      await client.query(`
        INSERT INTO "SiteSetting" (id, key, value, description, "isPublic", "updatedAt")
        VALUES ($1, $2, $3, $4, true, NOW())
        ON CONFLICT (key) DO UPDATE SET value = $3;
      `, [`set_${key}`, key, value, desc]);
    }
    console.log('✅ Core Site Settings seeded.');

    // 6. FAQs
    const faqs = [
      ['What is the starting investment for a CYBERSTYLE website?', 'Our bespoke websites start from $800. Final investment is based on design depth, 3D/Silk interactive elements, CMS structure, API integrations, and conversion architecture.', 'Pricing & Scope', 0],
      ['How do 3D and Silk backgrounds affect load speed and Core Web Vitals?', 'We engineer our Three.js/Silk shaders with lazy initialization, strict DPR limits, frame throttling, and instant static CSS fallbacks for low-power or reduced-motion environments, achieving 90+ Lighthouse performance.', 'Performance & 3D', 1],
      ['What does your AI & Business Automation service include?', 'Starting from $1,200, we engineer custom lead capture pipelines, CRM workflows, automated customer routing, OpenAI/Gemini integrations, and operational dashboards tailored to your service business.', 'Services & Automation', 2],
      ['Do we own 100% of the code and assets upon completion?', 'Yes. Upon final invoice settlement, complete ownership, code repositories, custom design files, and deployment configurations are transferred to your organization.', 'Ownership & Delivery', 3],
    ];

    for (let i = 0; i < faqs.length; i++) {
      const [q, a, cat, order] = faqs[i];
      await client.query(`
        INSERT INTO "FAQ" (id, question, answer, category, "orderIndex", "isPublished", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;
      `, [`faq_${i + 1}`, q, a, cat, order]);
    }
    console.log('✅ FAQs seeded.');

    // 7. Blog Author & Category & Post
    await client.query(`
      INSERT INTO "Author" (id, name, slug, role, bio, "createdAt", "updatedAt")
      VALUES ('auth_1', 'CYBERSTYLE Engineering & Strategy', 'cyberstyle-editorial', 'Core Strategy Team', 'Technical essays on high-conversion architecture, 3D web systems, and AI operations.', NOW(), NOW())
      ON CONFLICT (slug) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO "Category" (id, name, slug, "createdAt", "updatedAt")
      VALUES ('cat_1', 'Web Architecture', 'web-architecture', NOW(), NOW())
      ON CONFLICT (slug) DO NOTHING;
    `);

    await client.query(`
      INSERT INTO "BlogPost" (id, title, slug, excerpt, content, status, "publishedAt", "readingTimeMinutes", "authorId", "categoryId", "createdAt", "updatedAt")
      VALUES ('post_1', 'Engineering Sub-Second 3D Web Experiences with Next.js and Three.js', 'engineering-sub-second-3d-web-experiences', 'How we achieve 90+ Lighthouse Core Web Vitals while running complex WebGL shader canvases on agency websites.', 'Building interactive 3D web experiences requires balancing visual richness with tight performance budgets...', 'PUBLISHED', NOW() - INTERVAL '15 days', 5, 'auth_1', 'cat_1', NOW(), NOW())
      ON CONFLICT (slug) DO NOTHING;
    `);
    console.log('✅ Blog Author, Category, and Post seeded.');

    // 8. Reviews
    await client.query(`
      INSERT INTO "Review" (id, "clientName", "clientTitle", "companyName", rating, quote, status, "isFeatured", "approvedAt", "createdAt", "updatedAt")
      VALUES 
        ('rev_1', 'Franklin Vance', 'Managing Director', 'Apex Capital Advisory', 5, 'CYBERSTYLE transformed our visual presence completely. Our inbound high-ticket inquiries increased significantly in the first 30 days.', 'APPROVED', true, NOW(), NOW(), NOW()),
        ('rev_2', 'Elena Rostova', 'Chief Product Officer', 'OmniFlow Logistics', 5, 'The 3D Silk background and automated AI intake workflow tripled our qualified prospect velocity. Exceptional technical rigor.', 'APPROVED', true, NOW(), NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('✅ Verified Client Reviews seeded.');

    // 9. CRM Inbound Leads
    await client.query(`
      INSERT INTO "Lead" (id, name, company, email, phone, country, "serviceNeeded", "approxBudget", "desiredTimeline", "projectGoals", message, stage, "createdAt", "updatedAt")
      VALUES 
        ('lead_1', 'Marcus Vance', 'Vance Robotics Inc.', 'm.vance@vancerobotics.com', '+1 (555) 234-5678', 'USA', 'AI & Business Automation ($1,200+)', '$3,000 - $6,000', '4-6 weeks', 'Automate inbound qualification and CRM lead distribution.', 'Looking to deploy an autonomous AI triage pipeline for enterprise inquiries.', 'NEW', NOW(), NOW()),
        ('lead_2', 'Sarah Lin', 'Lin & Co. Fine Jewels', 'sarah@linjewels.com', '+1 (555) 876-5432', 'USA', 'Premium Web Development ($800+)', '$1,500 - $3,000', '2-4 weeks', 'Modernize brand identity with interactive 3D elements.', 'Need a high-conversion 3D showroom for our new luxury watch collection.', 'QUALIFIED', NOW() - INTERVAL '2 hours', NOW())
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('✅ Inbound CRM Leads seeded.');

    await client.query('COMMIT');
    console.log('🎉 Database seeding completed 100% successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', err);
    throw err;
  } finally {
    await client.end();
  }
}

seed();
