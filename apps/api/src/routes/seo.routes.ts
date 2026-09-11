import { Router, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';
import { SeoService } from '../services/seo.service';
import { logAudit } from '../utils/auditLogger';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(requireAuth);

// ==============================================================================
// 1. SEO WORKSPACES & OVERVIEW
// ==============================================================================

router.get('/workspaces', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const isClient = req.user.role === UserRole.CLIENT;
    let organizationId = req.query.organizationId as string;

    if (isClient) {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: req.user.id },
      });
      if (!clientProfile) {
        res.status(403).json({ status: 'error', message: 'Client profile missing' });
        return;
      }
      organizationId = clientProfile.organizationId;
    }

    const workspaces = await prisma.seoWorkspace.findMany({
      where: {
        ...(organizationId ? { organizationId } : {}),
      },
      include: {
        organization: true,
        audits: {
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: { findings: true },
        },
        keywords: {
          include: {
            snapshots: { orderBy: { capturedAt: 'desc' }, take: 5 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      data: { workspaces },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/workspaces', requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { organizationId, domain, locale } = req.body;

    if (!organizationId || !domain) {
      res.status(400).json({ status: 'error', message: 'organizationId and domain are required' });
      return;
    }

    const workspace = await SeoService.getOrCreateSeoWorkspace(organizationId, domain, locale);

    await logAudit({
      userId: req.user.id,
      action: 'SEO_WORKSPACE_CREATED',
      entityType: 'SeoWorkspace',
      entityId: workspace.id,
      changes: { domain, organizationId },
      req,
    });

    res.status(201).json({
      status: 'success',
      data: { workspace },
    });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 2. LIVE AUDIT EXECUTION
// ==============================================================================

router.post('/workspaces/:id/audit', requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ status: 'error', message: 'workspace ID is required' });
      return;
    }
    const audit = await SeoService.runTechnicalAudit(id);

    await logAudit({
      userId: req.user.id,
      action: 'SEO_AUDIT_EXECUTED',
      entityType: 'SeoAudit',
      entityId: audit.id,
      changes: { workspaceId: id, score: audit.score, findingsCount: audit.findingsCount },
      req,
    });

    res.status(200).json({
      status: 'success',
      message: 'Technical SEO audit generated successfully.',
      data: { audit },
    });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 3. KEYWORD TRACKING & RANK CAPTURE
// ==============================================================================

router.post('/workspaces/:id/keywords', requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { phrase, locale } = req.body;

    if (!id || !phrase) {
      res.status(400).json({ status: 'error', message: 'workspace ID and phrase are required' });
      return;
    }

    const keyword = await SeoService.addKeyword(id, phrase, locale);

    await logAudit({
      userId: req.user.id,
      action: 'SEO_KEYWORD_ADDED',
      entityType: 'Keyword',
      entityId: keyword.id,
      changes: { phrase, workspaceId: id },
      req,
    });

    res.status(201).json({
      status: 'success',
      data: { keyword },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/workspaces/:id/capture-ranks', requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ status: 'error', message: 'workspace ID is required' });
      return;
    }
    const snapshots = await SeoService.captureKeywordRanks(id);

    res.status(200).json({
      status: 'success',
      message: `Captured ranks for ${snapshots.length} keywords.`,
      data: { snapshots },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
