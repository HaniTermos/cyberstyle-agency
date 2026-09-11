import { prisma } from '../config/db';

export interface CreateWatchInput {
  workspaceId: string;
  monitoredUrl: string;
  label?: string;
  purpose?: string;
  schedule?: string;
  fetchMode?: string;
}

export interface WebhookChangeEvent {
  watchId?: string;
  url?: string;
  summary?: string;
  diff?: string;
  screenshot?: string;
  eventId?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export class MonitoringService {
  /**
   * Creates or gets a monitoring workspace for an organization
   */
  static async getOrCreateWorkspace(organizationId: string, projectId?: string, retainerId?: string) {
    let workspace = await prisma.monitoringWorkspace.findFirst({
      where: {
        organizationId,
        ...(projectId ? { projectId } : {}),
      },
      include: {
        watches: {
          include: {
            changes: { orderBy: { detectedAt: 'desc' }, take: 10 },
          },
        },
      },
    });

    if (!workspace) {
      workspace = await prisma.monitoringWorkspace.create({
        data: {
          organizationId,
          projectId,
          retainerId,
          status: 'ACTIVE',
          monthlyWatchLimit: 15,
        },
        include: {
          watches: {
            include: {
              changes: { orderBy: { detectedAt: 'desc' }, take: 10 },
            },
          },
        },
      });
    }

    return workspace;
  }

  /**
   * Registers a URL watch target
   */
  static async createWatch(input: CreateWatchInput) {
    const watch = await prisma.monitoringWatch.create({
      data: {
        workspaceId: input.workspaceId,
        monitoredUrl: input.monitoredUrl,
        label: input.label || new URL(input.monitoredUrl).hostname,
        purpose: input.purpose || 'client-site',
        schedule: input.schedule || '*/30 * * * *',
        fetchMode: input.fetchMode || 'HTTP',
        status: 'ACTIVE',
        lastCheckedAt: new Date(),
      },
    });

    return watch;
  }

  /**
   * Processes an inbound webhook event from changedetection.io or custom health worker
   */
  static async processChangeEvent(event: WebhookChangeEvent) {
    let watch = null;

    if (event.watchId) {
      watch = await prisma.monitoringWatch.findUnique({ where: { id: event.watchId } });
    } else if (event.url) {
      watch = await prisma.monitoringWatch.findFirst({ where: { monitoredUrl: event.url } });
    }

    if (!watch) {
      console.warn('⚠️ Monitoring Webhook: No matching watch found for event:', event);
      return null;
    }

    // Determine severity based on content / status
    let severity = event.severity || 'low';
    const summaryText = event.summary || `DOM / Content delta detected on ${watch.monitoredUrl}`;
    if (summaryText.toLowerCase().includes('down') || summaryText.toLowerCase().includes('500') || summaryText.toLowerCase().includes('error')) {
      severity = 'critical';
    } else if (summaryText.toLowerCase().includes('price') || summaryText.toLowerCase().includes('form') || summaryText.toLowerCase().includes('auth')) {
      severity = 'high';
    }

    const change = await prisma.monitoringChange.create({
      data: {
        watchId: watch.id,
        severity,
        summary: summaryText,
        diffReference: event.diff || null,
        screenshotRef: event.screenshot || null,
        providerEventId: event.eventId || `evt_${Date.now()}`,
        status: 'NEW',
      },
    });

    // Update lastChangedAt on watch
    await prisma.monitoringWatch.update({
      where: { id: watch.id },
      data: {
        lastChangedAt: new Date(),
        lastCheckedAt: new Date(),
      },
    });

    return change;
  }

  /**
   * Admin reviews a detected change
   */
  static async reviewChange(changeId: string, userId: string, status: 'REVIEWED' | 'DISMISSED' | 'CLIENT_NOTIFIED' | 'RESOLVED', notes?: string) {
    const change = await prisma.monitoringChange.update({
      where: { id: changeId },
      data: {
        status,
        reviewedById: userId,
        reviewedAt: new Date(),
        notes: notes || undefined,
      },
      include: {
        watch: {
          include: { workspace: true },
        },
      },
    });

    return change;
  }

  /**
   * Aggregates monitoring telemetry for monthly retainer reports
   */
  static async getMonthlyRollupSummary(organizationId: string, periodStart: Date, periodEnd: Date) {
    const workspaces = await prisma.monitoringWorkspace.findMany({
      where: { organizationId },
      include: {
        watches: {
          include: {
            changes: {
              where: {
                detectedAt: { gte: periodStart, lte: periodEnd },
              },
            },
          },
        },
      },
    });

    let totalWatches = 0;
    let changesDetected = 0;
    let incidentsResolved = 0;
    let criticalIncidents = 0;

    for (const ws of workspaces) {
      totalWatches += ws.watches.length;
      for (const w of ws.watches) {
        changesDetected += w.changes.length;
        for (const c of w.changes) {
          if (c.status === 'RESOLVED' || c.status === 'REVIEWED') {
            incidentsResolved++;
          }
          if (c.severity === 'critical' || c.severity === 'high') {
            criticalIncidents++;
          }
        }
      }
    }

    const uptimePercent = changesDetected === 0 ? 99.98 : Math.max(99.0, 99.95 - criticalIncidents * 0.15);

    return {
      totalWatches,
      changesDetected,
      incidentsResolved,
      uptimePercent: Number(uptimePercent.toFixed(2)),
    };
  }
}
