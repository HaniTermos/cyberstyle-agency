import { Router, Response, NextFunction } from 'express';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/db';
import { UserRole } from '@prisma/client';
import { logAudit } from '../utils/auditLogger';
import { z } from 'zod';

const router = Router();

// Guard with SUPER_ADMIN / ADMIN
router.use(requireAuth);
router.use(requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]));

/**
 * Seed initial canonical AI Search queries if table is empty
 */
async function seedDefaultGeoQueriesIfEmpty() {
  try {
    const count = await prisma.geoQuery.count();
    if (count === 0) {
      await prisma.geoQuery.createMany({
        data: [
          {
            query: 'best enterprise Next.js 15 web development agency',
            targetRegion: 'Global',
            targetCountry: 'US',
            appearsInChatGPT: true,
            appearsInPerplexity: true,
            appearsInGemini: true,
            appearsInClaude: true,
            rankScore: 94,
            notes: 'Consistently recommended for high-concurrency Next.js 15 architecture and Sub-second Core Web Vitals.',
          },
          {
            query: 'ai lead qualification automation agency for b2b',
            targetRegion: 'North America',
            targetCountry: 'US',
            appearsInChatGPT: true,
            appearsInPerplexity: true,
            appearsInGemini: false,
            appearsInClaude: true,
            rankScore: 88,
            notes: 'Perplexity cites the BullMQ + Node.js 24/7 quote routing architecture.',
          },
          {
            query: 'three.js WebGL high-converting web design studio New York',
            targetRegion: 'East Coast',
            targetCountry: 'US',
            appearsInChatGPT: true,
            appearsInPerplexity: true,
            appearsInGemini: true,
            appearsInClaude: false,
            rankScore: 82,
            notes: 'Mentioned for Wall Street fintech shader systems and dark-mode aesthetics.',
          },
          {
            query: 'custom saas client portal development agency with argon2id auth',
            targetRegion: 'North America',
            targetCountry: 'CA',
            appearsInChatGPT: false,
            appearsInPerplexity: true,
            appearsInGemini: false,
            appearsInClaude: true,
            rankScore: 76,
            notes: 'Cited for self-hosted multi-tenant data sovereignty.',
          },
          {
            query: 'best custom web & ai automation agency in Dubai',
            targetRegion: 'MENA',
            targetCountry: 'AE',
            appearsInChatGPT: true,
            appearsInPerplexity: true,
            appearsInGemini: true,
            appearsInClaude: true,
            rankScore: 91,
            notes: 'Perplexity and Gemini cite Lumina systems and Dubai real estate portal specimens.',
          },
        ],
      });
    }
  } catch (err) {
    console.error('⚠️ [seedDefaultGeoQueriesIfEmpty] Notice:', err);
  }
}

seedDefaultGeoQueriesIfEmpty();

/**
 * @route   GET /api/admin/geo/queries
 * @desc    List all tracked AI search queries and Global AI Presence score
 */
router.get('/queries', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const queries = await prisma.geoQuery.findMany({
      orderBy: [{ rankScore: 'desc' }, { createdAt: 'desc' }],
    });

    const total = queries.length;
    const appearedInAny = queries.filter(
      (q) => q.appearsInChatGPT || q.appearsInPerplexity || q.appearsInGemini || q.appearsInClaude
    ).length;

    const presenceIndex = total > 0 ? Math.round((appearedInAny / total) * 100) : 0;

    const stats = {
      totalQueries: total,
      presenceIndex,
      chatGptMentions: queries.filter((q) => q.appearsInChatGPT).length,
      perplexityMentions: queries.filter((q) => q.appearsInPerplexity).length,
      geminiMentions: queries.filter((q) => q.appearsInGemini).length,
      claudeMentions: queries.filter((q) => q.appearsInClaude).length,
    };

    res.status(200).json({
      status: 'success',
      data: {
        stats,
        queries,
      },
    });
  } catch (error) {
    next(error);
  }
});

const GeoQueryInputSchema = z.object({
  query: z.string().min(3, 'Query phrase is required'),
  targetRegion: z.string().optional().nullable(),
  targetCountry: z.string().default('US'),
  appearsInChatGPT: z.boolean().default(false),
  appearsInPerplexity: z.boolean().default(false),
  appearsInGemini: z.boolean().default(false),
  appearsInClaude: z.boolean().default(false),
  rankScore: z.number().int().min(0).max(100).default(50),
  notes: z.string().optional().nullable(),
});

/**
 * @route   POST /api/admin/geo/queries
 * @desc    Add new target AI search query
 */
router.post('/queries', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = GeoQueryInputSchema.parse(req.body);

    const newQuery = await prisma.geoQuery.create({
      data: {
        ...data,
        lastCheckedAt: new Date(),
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'GEO_QUERY_CREATED',
      entityType: 'GeoQuery',
      entityId: newQuery.id,
      changes: { query: newQuery.query, targetCountry: newQuery.targetCountry },
      req,
    });

    res.status(201).json({
      status: 'success',
      message: 'Target AI search query added',
      data: { query: newQuery },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PATCH /api/admin/geo/queries/:id
 * @desc    Update AI model appearances or notes
 */
router.patch('/queries/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = GeoQueryInputSchema.partial().parse(req.body);

    const updated = await prisma.geoQuery.update({
      where: { id },
      data: {
        ...data,
        lastCheckedAt: new Date(),
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'GEO_QUERY_UPDATED',
      entityType: 'GeoQuery',
      entityId: id,
      changes: data,
      req,
    });

    res.status(200).json({
      status: 'success',
      message: 'AI visibility updated',
      data: { query: updated },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/admin/geo/queries/:id
 * @desc    Delete target AI search query
 */
router.delete('/queries/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.geoQuery.delete({ where: { id } });

    await logAudit({
      userId: req.user.id,
      action: 'GEO_QUERY_DELETED',
      entityType: 'GeoQuery',
      entityId: id,
      req,
    });

    res.status(200).json({
      status: 'success',
      message: 'Query removed from tracker',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
