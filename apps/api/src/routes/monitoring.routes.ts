import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';
import { MonitoringService } from '../services/monitoring.service';
import { logAudit } from '../utils/auditLogger';
import { UserRole } from '@prisma/client';

const router = Router();

// ==============================================================================
// 1. WEBHOOK INGESTION (changedetection.io or custom health checks)
// ==============================================================================

router.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = req.body;
    const change = await MonitoringService.processChangeEvent({
      watchId: event.watch_id || event.watchId,
      url: event.url || event.monitoredUrl,
      summary: event.summary || event.title || event.notification_title,
      diff: event.diff || event.notification_body,
      screenshot: event.screenshot || event.screenshot_url,
      eventId: event.event_id || event.eventId,
      severity: event.severity || 'low',
    });

    res.status(200).json({
      status: 'success',
      message: 'Monitoring webhook event processed',
      data: { change },
    });
  } catch (error) {
    next(error);
  }
});

// Guard subsequent routes with Super Admin / Admin
router.use(requireAuth);

// ==============================================================================
// 2. ADMIN & PORTAL MONITORING WORKSPACES
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

    const workspaces = await prisma.monitoringWorkspace.findMany({
      where: {
        ...(organizationId ? { organizationId } : {}),
      },
      include: {
        organization: true,
        watches: {
          include: {
            changes: {
              orderBy: { detectedAt: 'desc' },
              take: 5,
            },
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
    const { organizationId, projectId, retainerId } = req.body;

    if (!organizationId) {
      res.status(400).json({ status: 'error', message: 'organizationId is required' });
      return;
    }

    const workspace = await MonitoringService.getOrCreateWorkspace(organizationId, projectId, retainerId);

    await logAudit({
      userId: req.user.id,
      action: 'MONITORING_WORKSPACE_CREATED',
      entityType: 'MonitoringWorkspace',
      entityId: workspace.id,
      changes: { organizationId, projectId },
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

router.post('/watches', requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { workspaceId, monitoredUrl, label, purpose, schedule, fetchMode } = req.body;

    if (!workspaceId || !monitoredUrl) {
      res.status(400).json({ status: 'error', message: 'workspaceId and monitoredUrl are required' });
      return;
    }

    const watch = await MonitoringService.createWatch({
      workspaceId,
      monitoredUrl,
      label,
      purpose,
      schedule,
      fetchMode,
    });

    await logAudit({
      userId: req.user.id,
      action: 'MONITORING_WATCH_CREATED',
      entityType: 'MonitoringWatch',
      entityId: watch.id,
      changes: { monitoredUrl, label },
      req,
    });

    res.status(201).json({
      status: 'success',
      data: { watch },
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/changes/:id/review', requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!id) {
      res.status(400).json({ status: 'error', message: 'change ID is required' });
      return;
    }

    const change = await MonitoringService.reviewChange(id, req.user.id, status, notes);

    await logAudit({
      userId: req.user.id,
      action: 'MONITORING_CHANGE_REVIEWED',
      entityType: 'MonitoringChange',
      entityId: id,
      changes: { status, notes },
      req,
    });

    res.status(200).json({
      status: 'success',
      message: `Change marked as ${status}`,
      data: { change },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
