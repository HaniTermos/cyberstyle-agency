import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';
import { logAudit } from '../utils/auditLogger';
import { ReviewStatus, PostStatus, UserRole } from '@prisma/client';
import { z } from 'zod';

const router = Router();

// ==============================================================================
// UTILITIES
// ==============================================================================

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Ensures initial default case studies and blog articles exist if database is fresh.
 */
async function seedDefaultContentIfEmpty() {
  try {
    const csCount = await prisma.caseStudy.count();
    if (csCount === 0) {
      await prisma.caseStudy.createMany({
        data: [
          {
            title: 'Nexus Enterprise Telemetry & AI Routing OS',
            slug: 'nexus-logistics-ai-routing',
            clientName: 'Nexus Global Logistics',
            clientIndustry: 'Logistics & Supply Chain',
            serviceCategory: 'AI Systems & Automation',
            summary: 'Engineered a bespoke 3D web platform paired with automated 24/7 AI quote routing and CRM synchronization.',
            challenge: 'Fragmented inquiries and slow follow-ups were leaking high-value prospects. The client operated on an outdated legacy template with high bounce rates on mobile devices.',
            solution: 'Replaced the legacy stack with a Next.js 15 App Router platform featuring fluid Three.js Silk canvases and crisp editorial typography. In parallel, built an Express & BullMQ worker pipeline that ingests inquiries and runs instant prompt-based qualification.',
            results: 'Eliminated inquiry latency from 18 hours to under 30 seconds. Organic search conversions climbed over 340% within 90 days.',
            metrics: [
              { value: '+340%', label: 'Lead Growth' },
              { value: '< 30s', label: 'AI Response Time' },
              { value: '$1.8M', label: 'Pipeline Generated' },
            ],
            techStack: ['Next.js 15', 'TypeScript', 'Node.js', 'PostgreSQL', 'Three.js', 'Docker'],
            liveUrl: 'https://nexuslogistics.example.com',
            status: PostStatus.PUBLISHED,
            isFeatured: true,
            sortOrder: 1,
            seoTitle: 'Nexus Logistics AI Routing & 3D Platform Case Study | CYBERSTYLE',
            seoDescription: 'How CYBERSTYLE built a 3D Next.js platform and automated AI lead qualification system that increased qualified inquiries by 340%.',
            canonicalUrl: 'https://cyberstyle.agency/work/nexus-logistics-ai-routing',
            keywords: ['Logistics Web Design', 'AI Automation Agency', 'Next.js 15 Case Study', 'Enterprise Telemetry'],
            geoCountry: 'US',
            geoRegion: 'North America',
            geoCity: 'Chicago, IL',
            geoLatitude: 41.8781,
            geoLongitude: -87.6298,
          },
          {
            title: 'Apex Capital High-Impact Editorial Web Platform',
            slug: 'apex-capital-web-experience',
            clientName: 'Apex Capital Advisory',
            clientIndustry: 'Financial Advisory',
            serviceCategory: 'Full-Stack Web App',
            summary: 'Redesigned brand identity, created fluid interactive Silk visual backgrounds, and boosted conversion velocity.',
            challenge: 'Apex needed an institutional-grade brand presence that projected digital authority while satisfying strict performance requirements for international institutional investors.',
            solution: 'Crafted a custom dark-mode aesthetic with custom GLSL shaders, headless content architecture, and sub-second page transitions.',
            results: 'Achieved a perfect 99/100 Core Web Vitals score on mobile while delivering a 2.4x lift in accredited investor inquiries.',
            metrics: [
              { value: '99/100', label: 'Core Web Vitals' },
              { value: '2.4x', label: 'Investor Inquiries' },
              { value: '0.6s', label: 'Average LCP' },
            ],
            techStack: ['Next.js 15', 'Tailwind CSS', 'GLSL Shaders', 'PostgreSQL', 'Prisma'],
            liveUrl: 'https://apexcapital.example.com',
            status: PostStatus.PUBLISHED,
            isFeatured: true,
            sortOrder: 2,
            seoTitle: 'Apex Capital Financial Platform Case Study | CYBERSTYLE',
            seoDescription: 'Case study on building a high-speed editorial web platform with Three.js shaders for private equity firm Apex Capital.',
            canonicalUrl: 'https://cyberstyle.agency/work/apex-capital-web-experience',
            keywords: ['Fintech Web Design', 'WebGL Development', 'High-Speed Web Platforms', 'Wall Street Agency'],
            geoCountry: 'US',
            geoRegion: 'East Coast',
            geoCity: 'New York, NY',
            geoLatitude: 40.7128,
            geoLongitude: -74.0060,
          },
          {
            title: 'Lumina Multi-Tenant Client Operations Portal',
            slug: 'lumina-saas-client-portal',
            clientName: 'Lumina Digital Systems',
            clientIndustry: 'Enterprise SaaS',
            serviceCategory: 'Custom SaaS & Cloud',
            summary: 'Built full-stack operations portal with Argon2id auth, Stripe hosted billing, milestone tracking, and deliverable vault.',
            challenge: 'SaaS client was losing client transparency and wasting 20+ hours per week sending manual billing PDFs and progress emails.',
            solution: 'Engineered a unified multi-tenant operations portal with real-time milestone reviews, Stripe checkout integrations, and encrypted deliverable storage.',
            results: 'Reduced client management overhead by 75% and accelerated invoice settlement speed by 4.2x.',
            metrics: [
              { value: '4.2x', label: 'Faster Payment Settlement' },
              { value: '-75%', label: 'Admin Overhead' },
              { value: '100%', label: 'Deliverable Transparency' },
            ],
            techStack: ['Next.js 15', 'Express.js', 'PostgreSQL', 'Stripe', 'Argon2id', 'Redis'],
            liveUrl: 'https://luminasystems.example.com',
            status: PostStatus.PUBLISHED,
            isFeatured: true,
            sortOrder: 3,
            seoTitle: 'Lumina Multi-Tenant Portal Architecture | CYBERSTYLE',
            seoDescription: 'How CYBERSTYLE built a secure client portal with automated Stripe billing and milestone management.',
            canonicalUrl: 'https://cyberstyle.agency/work/lumina-saas-client-portal',
            keywords: ['Client Portal Development', 'Stripe Integration', 'Custom SaaS Agency', 'Argon2id Auth'],
            geoCountry: 'AE',
            geoRegion: 'MENA',
            geoCity: 'Dubai',
            geoLatitude: 25.2048,
            geoLongitude: 55.2708,
          },
        ],
      });
    }

    const defaultPosts = [
      {
        slug: 'engineering-sub-second-3d-web-experiences',
        title: 'Engineering Sub-Second 3D Web Experiences with Next.js and Three.js',
        excerpt: 'How we achieve 90+ Lighthouse Core Web Vitals while running complex WebGL shader canvases on high-conversion agency websites.',
        content: `Traditional agency websites often force a false trade-off: either build a flat, static layout to satisfy Google Lighthouse, or load heavy 3D assets that cause mobile devices to stutter and bounce high-intent buyers.\n\n## 1. The Problem with Unconstrained WebGL\nWhen a standard Three.js canvas initializes without device-pixel-ratio (DPR) limits or dynamic geometry subdivision, high-resolution retina screens can easily attempt to render 4K buffers at 60 FPS. This exhausts mobile GPU memory and delays the Largest Contentful Paint (LCP).\n\n## 2. Our Architecture: The Three-Tier Rendering Strategy\nAt CYBERSTYLE, we employ a three-tier rendering pipeline:\n- **Instant CSS Fallback:** Server-rendered gradient geometry displays in 0ms without waiting for WebGL shaders to compile.\n- **Device-Aware DPR Clamping:** We limit canvas DPR strictly to [1.0, 1.5], preserving 95% visual sharpness while reducing pixel fill rate by over 60%.\n- **Reduced-Motion Gate:** For users with vestibular sensitivity or battery saver mode active, the Three.js loop automatically pauses without layout shifts.\n\n## 3. Measurable Performance Results\nBy treating 3D elements as non-blocking ambient layers, you achieve unforgettable visual prestige while maintaining 90+ Core Web Vitals across every global jurisdiction.`,
        category: 'Web Architecture',
        authorName: 'CYBERSTYLE Core',
        readingTimeMinutes: 4,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        tags: ['Next.js 15', 'Three.js', 'Core Web Vitals', 'Performance'],
        isFeatured: true,
        seoTitle: 'Sub-Second 3D Web Experiences with Next.js & Three.js | CYBERSTYLE',
        seoDescription: 'Guide on optimizing Three.js canvases, WebGL shaders, and Next.js 15 for 90+ Google Core Web Vitals.',
        canonicalUrl: 'https://cyberstyle.agency/blog/engineering-sub-second-3d-web-experiences',
        keywords: ['Three.js Optimization', 'Next.js 3D Web', 'Core Web Vitals', 'WebGL Performance'],
        geoCountry: 'US',
        geoRegion: 'Global',
        geoCity: 'San Francisco, CA',
        geoCoordinates: '37.7749,-122.4194',
      },
      {
        slug: 'ai-lead-qualification-architecture',
        title: 'Building 24/7 AI Lead Qualification Pipelines with Node.js and BullMQ',
        excerpt: 'A practical breakdown of how automated scoring and prompt routing turns cold website visitors into booked client calls in under 30 seconds.',
        content: `Speed to lead is the single highest predictor of conversion in B2B service sales. If a prospect waits longer than 5 minutes for a response, lead qualification drops by over 80%.\n\n## 1. Event-Driven Architecture with BullMQ\nWhen a prospect submits an inquiry via the public CYBERSTYLE website, an asynchronous BullMQ worker intercepts the payload immediately.\n\n## 2. Multi-Model AI Qualification & Scoring\nThe ingestion worker runs structured LLM inference to parse budget, timeline, technical scope, and domain authority. Leads scoring above 70 receive instant personalized calendar invites with dynamic pricing previews.\n\n## 3. Resilience and Failover\nIf the AI provider encounters latency spikes, Redis retry queues safeguard every lead with exponential backoff and instant fallback notification channels.`,
        category: 'AI & Automation',
        authorName: 'AI Systems Team',
        readingTimeMinutes: 5,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        tags: ['AI Pipelines', 'Node.js', 'BullMQ', 'Lead Gen'],
        isFeatured: true,
        seoTitle: 'Building 24/7 AI Lead Qualification Pipelines | CYBERSTYLE',
        seoDescription: 'Learn how to architect event-driven AI lead qualification engines with Node.js, BullMQ, and PostgreSQL.',
        canonicalUrl: 'https://cyberstyle.agency/blog/ai-lead-qualification-architecture',
        keywords: ['AI Automation', 'BullMQ Pipeline', 'Lead Qualification AI', 'Node.js CRM Sync'],
        geoCountry: 'US',
        geoRegion: 'Global',
        geoCity: 'Austin, TX',
        geoCoordinates: '30.2672,-97.7431',
      },
      {
        slug: 'self-hosted-auth-vs-third-party-saas',
        title: 'Why We Build Custom SaaS Platforms with Self-Hosted Argon2id Auth',
        excerpt: 'Eliminating expensive per-user pricing jumps, securing tenant boundaries, and ensuring 100% data sovereignty on Linux VPS deployments.',
        content: `Many modern startups blindly integrate third-party authentication services, only to face staggering monthly API costs as their active user base scales.\n\n## 1. Total Data Sovereignty\nBy implementing RFC 9106 Argon2id password hashing paired with cryptographic refresh token rotation in PostgreSQL, your business retains full ownership of user identity assets without vendor lock-in.\n\n## 2. Hardened Tenant Isolation\nUsing PostgreSQL Row-Level Security (RLS) combined with cryptographically signed session tokens, multi-tenant data leaks are mathematically prevented at the database kernel level.\n\n## 3. Cost Predictability\nSelf-hosted authentication runs on your existing VPS infrastructure with zero marginal cost per active user, protecting agency margins as client applications scale.`,
        category: 'Product Engineering',
        authorName: 'SecOps Team',
        readingTimeMinutes: 6,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        tags: ['Security', 'Argon2id', 'Authentication', 'PostgreSQL'],
        isFeatured: false,
        seoTitle: 'Self-Hosted Argon2id Auth vs Third-Party SaaS | CYBERSTYLE',
        seoDescription: 'Technical comparison of self-hosted Argon2id authentication versus hosted identity providers.',
        canonicalUrl: 'https://cyberstyle.agency/blog/self-hosted-auth-vs-third-party-saas',
        keywords: ['Argon2id Auth', 'Next.js Security', 'Self Hosted Authentication', 'PostgreSQL RLS'],
        geoCountry: 'CA',
        geoRegion: 'North America',
        geoCity: 'Toronto, ON',
        geoCoordinates: '43.6532,-79.3832',
      },
    ];

    for (const p of defaultPosts) {
      await prisma.blogPost.upsert({
        where: { slug: p.slug },
        update: {
          category: p.category,
          authorName: p.authorName,
          readingTimeMinutes: p.readingTimeMinutes,
          seoTitle: p.seoTitle,
          seoDescription: p.seoDescription,
          canonicalUrl: p.canonicalUrl,
          keywords: p.keywords,
          geoCountry: p.geoCountry,
          geoRegion: p.geoRegion,
          geoCity: p.geoCity,
          geoCoordinates: p.geoCoordinates,
          tags: p.tags,
          isFeatured: p.isFeatured,
        },
        create: p,
      });
    }
  } catch (err) {
    console.error('⚠️ [seedDefaultContentIfEmpty] Notice:', err);
  }
}

// Kick off background check without blocking
seedDefaultContentIfEmpty();

// ==============================================================================
// 1. PUBLIC CASE STUDIES
// ==============================================================================

/**
 * Public: Get published case studies with filtering & geo targeting
 */
router.get('/case-studies', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, industry, geoCountry, featured, search } = req.query;

    const where: any = {
      status: PostStatus.PUBLISHED,
    };

    if (category && category !== 'all') {
      where.serviceCategory = { contains: String(category), mode: 'insensitive' };
    }
    if (industry) {
      where.clientIndustry = { contains: String(industry), mode: 'insensitive' };
    }
    if (geoCountry) {
      where.geoCountry = String(geoCountry).toUpperCase();
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (search) {
      const q = String(search);
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { clientName: { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
      ];
    }

    const caseStudies = await prisma.caseStudy.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
    });

    res.status(200).json({
      status: 'success',
      data: {
        caseStudies,
        total: caseStudies.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Public: Get single published case study by slug
 */
router.get('/case-studies/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const caseStudy = await prisma.caseStudy.findUnique({
      where: { slug },
    });

    if (!caseStudy || caseStudy.status !== PostStatus.PUBLISHED) {
      res.status(404).json({
        status: 'error',
        code: 'CASE_STUDY_NOT_FOUND',
        message: 'Case study not found or not published yet',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { caseStudy },
    });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 2. ADMIN CASE STUDIES (CRUD)
// ==============================================================================

const CaseStudyInputSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().optional().nullable(),
  clientName: z.string().min(1, 'Client name is required'),
  clientIndustry: z.string().default('Technology'),
  serviceCategory: z.string().default('AI Systems & Automation'),
  summary: z.string().min(5, 'Summary is required'),
  challenge: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  results: z.string().optional().nullable(),
  metrics: z.any().optional().nullable(),
  techStack: z.array(z.string()).default([]),
  liveUrl: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  galleryImages: z.array(z.string()).default([]),
  testimonialQuote: z.string().optional().nullable(),
  testimonialAuthor: z.string().optional().nullable(),
  testimonialRole: z.string().optional().nullable(),
  status: z.nativeEnum(PostStatus).default(PostStatus.PUBLISHED),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),

  // SEO Fields
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  keywords: z.array(z.string()).default([]),
  ogImage: z.string().optional().nullable(),

  // Geo Fields
  geoCountry: z.string().optional().nullable(),
  geoRegion: z.string().optional().nullable(),
  geoCity: z.string().optional().nullable(),
  geoLatitude: z.number().optional().nullable(),
  geoLongitude: z.number().optional().nullable(),
});

/**
 * Admin: List all case studies (Drafts, Published, Archived)
 */
router.get(
  '/admin/case-studies',
  requireAuth,
  requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { status, category, search } = req.query;
      const where: any = {};

      if (status && status !== 'ALL') {
        where.status = status as PostStatus;
      }
      if (category && category !== 'ALL') {
        where.serviceCategory = { contains: String(category), mode: 'insensitive' };
      }
      if (search) {
        const q = String(search);
        where.OR = [
          { title: { contains: q, mode: 'insensitive' } },
          { clientName: { contains: q, mode: 'insensitive' } },
          { summary: { contains: q, mode: 'insensitive' } },
        ];
      }

      const caseStudies = await prisma.caseStudy.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
      });

      res.status(200).json({
        status: 'success',
        data: { caseStudies, total: caseStudies.length },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Admin: Get single case study by ID
 */
router.get(
  '/admin/case-studies/:id',
  requireAuth,
  requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const caseStudy = await prisma.caseStudy.findUnique({
        where: { id },
      });

      if (!caseStudy) {
        res.status(404).json({ status: 'error', code: 'NOT_FOUND', message: 'Case study not found' });
        return;
      }

      res.status(200).json({ status: 'success', data: { caseStudy } });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Admin: Create Case Study
 */
router.post(
  '/admin/case-studies',
  requireAuth,
  requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const data = CaseStudyInputSchema.parse(req.body);

      let targetSlug = data.slug ? slugify(data.slug) : slugify(data.title);
      // Ensure unique slug
      let uniqueSlug = targetSlug;
      let counter = 1;
      while (await prisma.caseStudy.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${targetSlug}-${counter}`;
        counter++;
      }

      const caseStudy = await prisma.caseStudy.create({
        data: {
          ...data,
          slug: uniqueSlug,
          publishedAt: data.status === PostStatus.PUBLISHED ? new Date() : null,
        },
      });

      await logAudit({
        userId: req.user.id,
        action: 'CASE_STUDY_CREATED',
        entityType: 'CaseStudy',
        entityId: caseStudy.id,
        changes: { title: caseStudy.title, slug: caseStudy.slug, status: caseStudy.status },
        req,
      });

      res.status(201).json({
        status: 'success',
        message: 'Case study created successfully',
        data: { caseStudy },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Admin: Update Case Study
 */
router.patch(
  '/admin/case-studies/:id',
  requireAuth,
  requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = CaseStudyInputSchema.partial().parse(req.body);

      // Verify exists
      const existing = await prisma.caseStudy.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ status: 'error', code: 'NOT_FOUND', message: 'Case study not found' });
        return;
      }

      let updatedSlug = existing.slug;
      if (data.slug && data.slug !== existing.slug) {
        const sanitized = slugify(data.slug);
        const collision = await prisma.caseStudy.findFirst({
          where: { slug: sanitized, id: { not: id } },
        });
        if (collision) {
          res.status(400).json({ status: 'error', code: 'SLUG_TAKEN', message: 'This slug is already used' });
          return;
        }
        updatedSlug = sanitized;
      }

      const updated = await prisma.caseStudy.update({
        where: { id },
        data: {
          ...data,
          slug: updatedSlug,
          publishedAt:
            data.status === PostStatus.PUBLISHED && !existing.publishedAt
              ? new Date()
              : data.status === PostStatus.DRAFT
              ? null
              : existing.publishedAt,
        },
      });

      await logAudit({
        userId: req.user.id,
        action: 'CASE_STUDY_UPDATED',
        entityType: 'CaseStudy',
        entityId: id,
        changes: data,
        req,
      });

      res.status(200).json({
        status: 'success',
        message: 'Case study updated successfully',
        data: { caseStudy: updated },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Admin: Delete Case Study
 */
router.delete(
  '/admin/case-studies/:id',
  requireAuth,
  requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const existing = await prisma.caseStudy.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ status: 'error', code: 'NOT_FOUND', message: 'Case study not found' });
        return;
      }

      await prisma.caseStudy.delete({ where: { id } });

      await logAudit({
        userId: req.user.id,
        action: 'CASE_STUDY_DELETED',
        entityType: 'CaseStudy',
        entityId: id,
        changes: { title: existing.title, slug: existing.slug },
        req,
      });

      res.status(200).json({
        status: 'success',
        message: 'Case study deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// ==============================================================================
// 3. PUBLIC BLOG POSTS
// ==============================================================================

/**
 * Public: Get published blog posts
 */
router.get('/posts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tag, category, geoCountry, search } = req.query;

    const where: any = {
      status: PostStatus.PUBLISHED,
    };

    if (tag) {
      where.tags = { has: String(tag) };
    }
    if (category && category !== 'all') {
      where.category = { contains: String(category), mode: 'insensitive' };
    }
    if (geoCountry) {
      where.geoCountry = String(geoCountry).toUpperCase();
    }
    if (search) {
      const q = String(search);
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { excerpt: { contains: q, mode: 'insensitive' } },
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
    });

    res.status(200).json({
      status: 'success',
      data: { posts, total: posts.length },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Public: Get single published blog post by slug
 */
router.get('/posts/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    if (!post || post.status !== PostStatus.PUBLISHED) {
      res.status(404).json({
        status: 'error',
        code: 'POST_NOT_FOUND',
        message: 'Article not found or not published yet',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { post },
    });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 4. ADMIN BLOG POSTS (CRUD)
// ==============================================================================

const BlogPostInputSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().optional().nullable(),
  excerpt: z.string().min(5, 'Excerpt is required'),
  content: z.string().min(10, 'Content is required'),
  coverImage: z.string().optional().nullable(),
  authorName: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  status: z.nativeEnum(PostStatus).default(PostStatus.DRAFT),
  tags: z.array(z.string()).default([]),
  readingTimeMinutes: z.number().int().default(5),
  isFeatured: z.boolean().default(false),

  // SEO Fields
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  keywords: z.array(z.string()).default([]),
  ogImage: z.string().optional().nullable(),

  // Geo Fields
  geoCountry: z.string().optional().nullable(),
  geoRegion: z.string().optional().nullable(),
  geoCity: z.string().optional().nullable(),
  geoCoordinates: z.string().optional().nullable(),
});

/**
 * Admin: List all posts (Drafts, Published, Archived)
 */
router.get(
  '/admin/posts',
  requireAuth,
  requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { status, category, search } = req.query;
      const where: any = {};

      if (status && status !== 'ALL') {
        where.status = status as PostStatus;
      }
      if (category && category !== 'ALL') {
        where.category = { contains: String(category), mode: 'insensitive' };
      }
      if (search) {
        const q = String(search);
        where.OR = [
          { title: { contains: q, mode: 'insensitive' } },
          { excerpt: { contains: q, mode: 'insensitive' } },
        ];
      }

      const posts = await prisma.blogPost.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
        orderBy: [{ updatedAt: 'desc' }],
      });

      res.status(200).json({
        status: 'success',
        data: { posts, total: posts.length },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Admin: Get single post by ID
 */
router.get(
  '/admin/posts/:id',
  requireAuth,
  requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const post = await prisma.blogPost.findUnique({
        where: { id },
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
      });

      if (!post) {
        res.status(404).json({ status: 'error', code: 'NOT_FOUND', message: 'Article not found' });
        return;
      }

      res.status(200).json({ status: 'success', data: { post } });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Admin: Create Blog Post
 */
router.post(
  '/admin/posts',
  requireAuth,
  requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const data = BlogPostInputSchema.parse(req.body);

      let targetSlug = data.slug ? slugify(data.slug) : slugify(data.title);
      let uniqueSlug = targetSlug;
      let counter = 1;
      while (await prisma.blogPost.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${targetSlug}-${counter}`;
        counter++;
      }

      const post = await prisma.blogPost.create({
        data: {
          ...data,
          slug: uniqueSlug,
          authorId: req.user.id,
          authorName: data.authorName || req.user.name || 'CYBERSTYLE Core',
          publishedAt: data.status === PostStatus.PUBLISHED ? new Date() : null,
        },
      });

      await logAudit({
        userId: req.user.id,
        action: 'BLOG_POST_CREATED',
        entityType: 'BlogPost',
        entityId: post.id,
        changes: { title: post.title, slug: post.slug, status: post.status },
        req,
      });

      res.status(201).json({
        status: 'success',
        message: 'Article created successfully',
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Admin: Update Blog Post
 */
router.patch(
  '/admin/posts/:id',
  requireAuth,
  requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = BlogPostInputSchema.partial().parse(req.body);

      const existing = await prisma.blogPost.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ status: 'error', code: 'NOT_FOUND', message: 'Article not found' });
        return;
      }

      let updatedSlug = existing.slug;
      if (data.slug && data.slug !== existing.slug) {
        const sanitized = slugify(data.slug);
        const collision = await prisma.blogPost.findFirst({
          where: { slug: sanitized, id: { not: id } },
        });
        if (collision) {
          res.status(400).json({ status: 'error', code: 'SLUG_TAKEN', message: 'This slug is already used' });
          return;
        }
        updatedSlug = sanitized;
      }

      const updated = await prisma.blogPost.update({
        where: { id },
        data: {
          ...data,
          slug: updatedSlug,
          publishedAt:
            data.status === PostStatus.PUBLISHED && !existing.publishedAt
              ? new Date()
              : data.status === PostStatus.DRAFT
              ? null
              : existing.publishedAt,
        },
      });

      await logAudit({
        userId: req.user.id,
        action: 'BLOG_POST_UPDATED',
        entityType: 'BlogPost',
        entityId: id,
        changes: data,
        req,
      });

      res.status(200).json({
        status: 'success',
        message: 'Article updated successfully',
        data: { post: updated },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Admin: Delete Blog Post
 */
router.delete(
  '/admin/posts/:id',
  requireAuth,
  requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const existing = await prisma.blogPost.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ status: 'error', code: 'NOT_FOUND', message: 'Article not found' });
        return;
      }

      await prisma.blogPost.delete({ where: { id } });

      await logAudit({
        userId: req.user.id,
        action: 'BLOG_POST_DELETED',
        entityType: 'BlogPost',
        entityId: id,
        changes: { title: existing.title, slug: existing.slug },
        req,
      });

      res.status(200).json({
        status: 'success',
        message: 'Article deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// ==============================================================================
// 5. REVIEWS & MODERATION
// ==============================================================================

/**
 * Public: Get approved reviews only
 */
router.get('/reviews', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: ReviewStatus.APPROVED },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: { reviews } });
  } catch (error) {
    next(error);
  }
});

/**
 * Public: Submit a review for moderation
 */
const SubmitReviewSchema = z.object({
  clientName: z.string().min(2),
  clientTitle: z.string().optional(),
  companyName: z.string().min(2),
  rating: z.number().int().min(1).max(5),
  quote: z.string().min(10),
  fullReview: z.string().optional(),
});

router.post('/reviews', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = SubmitReviewSchema.parse(req.body);

    const review = await prisma.review.create({
      data: {
        ...data,
        status: ReviewStatus.PENDING,
      },
    });

    await logAudit({
      action: 'REVIEW_SUBMITTED_FOR_MODERATION',
      entityType: 'Review',
      entityId: review.id,
      changes: { clientName: review.clientName, companyName: review.companyName },
      req,
    });

    res.status(201).json({
      status: 'success',
      message: 'Thank you for your feedback. Your review has been submitted for moderation.',
      data: { reviewId: review.id },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Admin: Moderation action (Approve / Reject / Edit)
 */
router.patch(
  '/admin/reviews/:id',
  requireAuth,
  requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status, isFeatured } = z
        .object({
          status: z.nativeEnum(ReviewStatus),
          isFeatured: z.boolean().optional(),
        })
        .parse(req.body);

      const updated = await prisma.review.update({
        where: { id },
        data: {
          status,
          isFeatured,
          approvedAt: status === ReviewStatus.APPROVED ? new Date() : undefined,
        },
      });

      await logAudit({
        userId: req.user.id,
        action: `REVIEW_STATUS_${status}`,
        entityType: 'Review',
        entityId: id,
        changes: { status, isFeatured },
        req,
      });

      res.status(200).json({ status: 'success', data: { review: updated } });
    } catch (error) {
      next(error);
    }
  }
);

// ==============================================================================
// 6. FAQS
// ==============================================================================

router.get('/faqs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, category, search } = req.query;

    const where: any = {
      isPublished: true,
    };

    if (page && page !== 'all') {
      where.displayPages = {
        has: String(page).toLowerCase(),
      };
    }

    if (category && category !== 'all') {
      where.category = {
        contains: String(category),
        mode: 'insensitive',
      };
    }

    if (search) {
      const q = String(search);
      where.OR = [
        { question: { contains: q, mode: 'insensitive' } },
        { answer: { contains: q, mode: 'insensitive' } },
      ];
    }

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
    });

    res.status(200).json({ status: 'success', data: { faqs } });
  } catch (error) {
    next(error);
  }
});

export default router;
