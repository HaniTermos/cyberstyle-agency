import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';
import { MonitoringService } from '../services/monitoring.service';
import { logAudit } from '../utils/auditLogger';
import { UserRole } from '@prisma/client';
import { ErrorTracker } from '../services/error-tracker.service';
import { AlertServiceInstance } from '../services/alert.service';
import { BackupService } from '../services/backup.service';

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

// ==============================================================================
// 3. OPERATIONAL HEALTH, ERROR TRACKING & BACKUP MONITORING
// ==============================================================================

/**
 * @route   GET /api/monitoring/system-health
 * @desc    Real-time infrastructure health, DB latency, error tracker, alerts, and backup status
 */
router.get('/system-health', requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const startTime = Date.now();
    let dbStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN' = 'HEALTHY';
    let dbLatencyMs = 0;

    try {
      const dbCheckStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - dbCheckStart;
    } catch (dbErr: any) {
      dbStatus = 'DOWN';
      AlertServiceInstance.triggerAlert({
        type: 'DATABASE_UNREACHABLE',
        severity: 'CRITICAL',
        title: 'PostgreSQL Database Unreachable',
        description: `Database query probe failed: ${dbErr.message}`,
      });
    }

    const mem = process.memoryUsage();
    const uptimeSeconds = process.uptime();
    const alerts = AlertServiceInstance.getAlertsSummary();
    const recentErrors = ErrorTracker.getRecentErrors(10);
    const lastBackup = BackupService.getLatestBackupStatus();

    res.status(200).json({
      status: 'success',
      data: {
        timestamp: new Date().toISOString(),
        overallStatus: dbStatus === 'HEALTHY' && alerts.isHealthy ? 'HEALTHY' : 'WARNING',
        responseTimeMs: Date.now() - startTime,
        system: {
          uptimeSeconds: Math.floor(uptimeSeconds),
          environment: process.env.NODE_ENV || 'development',
          memoryRssMb: Math.round(mem.rss / 1024 / 1024),
          heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
          nodeVersion: process.version,
        },
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
          engine: 'PostgreSQL',
        },
        observability: {
          correlationId: req.correlationId,
          errorCount24h: ErrorTracker.getErrorCount(),
          recentErrors,
        },
        alerts: {
          isHealthy: alerts.isHealthy,
          activeAlerts: alerts.activeAlerts,
          recent5xxCount5Min: alerts.recent5xxCount5Min,
        },
        backups: {
          latestBackup: lastBackup,
          configuredRetentionDays: 14,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/monitoring/backups/run
 * @desc    Manually trigger an automated database backup
 */
router.post('/backups/run', requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const backup = await BackupService.executeBackup();
    await logAudit({
      userId: req.user.id,
      action: 'DATABASE_BACKUP_EXECUTED',
      entityType: 'Backup',
      entityId: backup.filename,
      changes: { status: backup.status, sizeBytes: backup.sizeBytes, checksum: backup.checksum },
      req,
    });

    res.status(backup.status === 'OK' ? 200 : 500).json({
      status: backup.status === 'OK' ? 'success' : 'error',
      data: { backup },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/monitoring/backups/restore-drill
 * @desc    Execute a disaster recovery restore drill and checksum validation
 */
router.post('/backups/restore-drill', requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]), async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
  try {
    const result = await BackupService.runRestoreDrill();
    await logAudit({
      userId: req.user.id,
      action: 'RESTORE_DRILL_EXECUTED',
      entityType: 'BackupDrill',
      entityId: result.backupFile,
      changes: { success: result.success, tablesVerified: result.tablesVerified },
      req,
    });

    res.status(200).json({
      status: 'success',
      data: { result },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      code: 'RESTORE_DRILL_FAILED',
      message: error.message,
    });
  }
});

export default router;
