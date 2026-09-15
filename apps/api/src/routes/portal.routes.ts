import { Router, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { requireAuth, requireOrgBoundary, AuthenticatedRequest } from '../middleware/auth.middleware';
import { logAudit } from '../utils/auditLogger';
import { FileSecurityService } from '../services/file-security.service';
import { ScanState, FileFolder, FileVisibility } from '@prisma/client';
import { z } from 'zod';

const router = Router();

// All portal routes require authentication
router.use(requireAuth);

/**
 * @route   GET /api/portal/dashboard
 * @desc    Client Portal Overview: organization projects, active milestones, recent deliverables, invoices
 */
router.get('/dashboard', requireOrgBoundary, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const orgId = req.user.clientProfile?.organizationId;
    if (!orgId) {
      res.status(403).json({ status: 'error', code: 'NO_ORG_PROFILE', message: 'Client profile not found' });
      return;
    }

    const [organization, projects, invoices, recentDeliverables, pendingFeedback] = await Promise.all([
      prisma.clientOrganization.findUnique({ where: { id: orgId } }),
      prisma.project.findMany({
        where: { organizationId: orgId },
        include: {
          milestones: { orderBy: { orderIndex: 'asc' } },
          updates: { where: { isClientVisible: true }, orderBy: { createdAt: 'desc' }, take: 3 },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.invoice.findMany({
        where: { organizationId: orgId },
        orderBy: { dueDate: 'desc' },
      }),
      prisma.deliverable.findMany({
        where: { project: { organizationId: orgId }, isClientVisible: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.feedbackRequest.findMany({
        where: { project: { organizationId: orgId }, status: 'OPEN' },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        organization,
        projects,
        invoices,
        recentDeliverables,
        pendingFeedback,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/portal/projects/:id
 * @desc    Get single project detail with milestones and client-visible deliverables
 */
router.get('/projects/:id', requireOrgBoundary, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const orgId = req.user.clientProfile?.organizationId;

    const project = await prisma.project.findFirst({
      where: {
        id,
        ...(orgId ? { organizationId: orgId } : {}),
      },
      include: {
        milestones: { orderBy: { orderIndex: 'asc' } },
        updates: { where: { isClientVisible: true }, orderBy: { createdAt: 'desc' } },
        deliverables: { where: { isClientVisible: true }, orderBy: { createdAt: 'desc' } },
        feedbackRequests: { include: { comments: true } },
      },
    });

    if (!project) {
      res.status(404).json({ status: 'error', code: 'PROJECT_NOT_FOUND', message: 'Project not found' });
      return;
    }

    res.status(200).json({ status: 'success', data: { project } });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/portal/feedback
 * @desc    Submit a feedback request or question on a project
 */
const CreateFeedbackSchema = z.object({
  projectId: z.string(),
  milestoneId: z.string().optional(),
  title: z.string().min(3),
  description: z.string().min(10),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
});

router.post('/feedback', requireOrgBoundary, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = CreateFeedbackSchema.parse(req.body);
    const orgId = req.user.clientProfile?.organizationId;

    // Verify project belongs to user organization
    const project = await prisma.project.findFirst({
      where: { id: data.projectId, ...(orgId ? { organizationId: orgId } : {}) },
    });

    if (!project) {
      res.status(404).json({ status: 'error', code: 'PROJECT_NOT_FOUND', message: 'Invalid project reference' });
      return;
    }

    const feedback = await prisma.feedbackRequest.create({
      data: {
        projectId: data.projectId,
        authorId: req.user.id,
        title: data.title,
        description: data.milestoneId ? `[Milestone: ${data.milestoneId}] ${data.description}` : data.description,
        priority: data.priority,
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'CLIENT_FEEDBACK_SUBMITTED',
      entityType: 'FeedbackRequest',
      entityId: feedback.id,
      req,
    });

    res.status(201).json({ status: 'success', data: { feedback } });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/portal/projects/:id/tasks
 * @desc    Get client-visible tasks for project
 */
router.get('/projects/:id/tasks', requireOrgBoundary, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const orgId = req.user.clientProfile?.organizationId;

    const project = await prisma.project.findFirst({
      where: { id, ...(orgId ? { organizationId: orgId } : {}) },
    });

    if (!project) {
      res.status(404).json({ status: 'error', code: 'PROJECT_NOT_FOUND', message: 'Project not found' });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { projectId: id, isClientVisible: true },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        milestone: { select: { id: true, title: true } },
      },
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
    });

    res.status(200).json({ status: 'success', data: { tasks } });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/portal/milestones/:id/approve
 * @desc    Client approval and sign-off on a milestone deliverable
 */
router.post('/milestones/:id/approve', requireOrgBoundary, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const orgId = req.user.clientProfile?.organizationId;

    const milestone = await prisma.milestone.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!milestone || (orgId && milestone.project.organizationId !== orgId)) {
      res.status(404).json({ status: 'error', code: 'MILESTONE_NOT_FOUND', message: 'Milestone not found or unauthorized' });
      return;
    }

    const { MilestoneDeliveryService } = await import('../services/milestone-delivery.service');
    const updated = await MilestoneDeliveryService.approveMilestone(id, req.user, req);

    res.status(200).json({ status: 'success', data: { milestone: updated } });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/portal/reports
 * @desc    Get published monthly reports for client organization
 */
router.get('/reports', requireOrgBoundary, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const orgId = req.user.clientProfile?.organizationId;
    if (!orgId) {
      res.status(403).json({ status: 'error', code: 'NO_ORG_PROFILE', message: 'Client organization profile missing' });
      return;
    }

    const reports = await prisma.report.findMany({
      where: {
        organizationId: orgId,
        status: 'PUBLISHED',
      },
      include: {
        project: { select: { id: true, name: true } },
      },
      orderBy: { periodStartDate: 'desc' },
    });

    res.status(200).json({ status: 'success', data: { reports } });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/portal/reports/:id
 * @desc    Get single published monthly report details
 */
router.get('/reports/:id', requireOrgBoundary, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const orgId = req.user.clientProfile?.organizationId;

    const report = await prisma.report.findFirst({
      where: {
        id,
        status: 'PUBLISHED',
        ...(orgId ? { organizationId: orgId } : {}),
      },
      include: {
        organization: true,
        project: true,
      },
    });

    if (!report) {
      res.status(404).json({ status: 'error', code: 'REPORT_NOT_FOUND', message: 'Report not found or not published' });
      return;
    }

    // Record view timestamp
    if (!report.viewedAt) {
      await prisma.report.update({
        where: { id },
        data: { viewedAt: new Date() },
      });
    }

    res.status(200).json({ status: 'success', data: { report } });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/portal/reports/:id/pdf
 * @desc    Download published report PDF
 */
router.get('/reports/:id/pdf', requireOrgBoundary, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const orgId = req.user.clientProfile?.organizationId;

    const report = await prisma.report.findFirst({
      where: {
        id,
        status: 'PUBLISHED',
        ...(orgId ? { organizationId: orgId } : {}),
      },
      include: { organization: true },
    });

    if (!report) {
      res.status(404).json({ status: 'error', code: 'REPORT_NOT_FOUND', message: 'Report not found or not published' });
      return;
    }

    await logAudit({
      userId: req.user.id,
      action: 'REPORT_DOWNLOADED',
      entityType: 'Report',
      entityId: report.id,
      changes: { period: report.period },
      req,
    });

    const { ReportPdfService } = await import('../services/report-pdf.service');
    const buffer = await ReportPdfService.generateReportBuffer({
      reportId: report.id,
      title: report.title,
      organizationName: report.organization.name,
      period: report.period,
      reportType: report.reportType,
      executiveSummary: report.executiveSummary,
      keyAccomplishments: (report.keyAccomplishments as string[]) || [],
      nextMonthPlan: report.nextMonthPlan || undefined,
      nextMonthPriorities: (report.nextMonthPriorities as string[]) || [],
      metrics: (report.metrics as any) || undefined,
      deliverables: (report.deliverables as any) || undefined,
      healthSnapshot: (report.healthSnapshot as any) || undefined,
      invoicesSummary: (report.invoicesSummary as any) || undefined,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="report_${report.period.toLowerCase().replace(/\s+/g, '_')}.pdf"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// PHASE 3 SECURE CLIENT FILES & DELIVERABLES
// ==============================================================================

/**
 * @route   GET /api/portal/files
 * @desc    Get client-visible, virus-scanned CLEAN deliverables for client organization
 */
router.get('/files', requireOrgBoundary, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const orgId = req.user.clientProfile?.organizationId;
    if (!orgId) {
      res.status(403).json({ status: 'error', code: 'NO_ORG_PROFILE', message: 'Client organization profile missing' });
      return;
    }

    const { folder, projectId, search } = req.query;

    const files = await prisma.fileAsset.findMany({
      where: {
        organizationId: orgId,
        visibility: FileVisibility.CLIENT_VISIBLE,
        isDeleted: false,
        // Strict Security: Only expose files whose latest version is CLEAN
        versions: {
          some: {
            scanState: ScanState.CLEAN,
          },
        },
        ...(folder ? { folder: folder as FileFolder } : {}),
        ...(projectId ? { projectId: String(projectId) } : {}),
        ...(search ? { filename: { contains: String(search), mode: 'insensitive' } } : {}),
      },
      include: {
        project: { select: { id: true, name: true } },
        versions: {
          where: { scanState: ScanState.CLEAN },
          orderBy: { versionNumber: 'desc' },
          take: 3,
        },
        uploader: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      data: files,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/portal/files/:id/signed-url
 * @desc    Generate expiring signed download link for client file
 */
router.post('/files/:id/signed-url', requireOrgBoundary, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const orgId = req.user.clientProfile?.organizationId;
    const { id } = req.params;

    const file = await prisma.fileAsset.findFirst({
      where: {
        id,
        organizationId: orgId,
        visibility: FileVisibility.CLIENT_VISIBLE,
        isDeleted: false,
      },
      include: {
        versions: {
          where: { scanState: ScanState.CLEAN },
          orderBy: { versionNumber: 'desc' },
          take: 1,
        },
      },
    });

    if (!file || file.versions.length === 0) {
      res.status(404).json({
        status: 'error',
        code: 'FILE_NOT_FOUND',
        message: 'File not found, quarantined, or undergoing security scanning.',
      });
      return;
    }

    const token = FileSecurityService.generateSignedDownloadToken(file.id, file.versions[0]?.id);
    const signedUrl = `/api/v1/files/download/${token}`;

    await FileSecurityService.logFileAccess({
      fileAssetId: file.id,
      fileVersionId: file.versions[0]?.id,
      userId: req.user.id,
      action: 'VIEW',
      req,
    });

    res.status(200).json({
      status: 'success',
      data: {
        signedUrl,
        filename: file.filename,
        expiresInSeconds: 300,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
