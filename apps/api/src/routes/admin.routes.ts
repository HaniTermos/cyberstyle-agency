import { Router, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';
import { logAudit, verifyAuditChain, exportAuditLogsToCsv } from '../utils/auditLogger';
import {
  UserRole,
  LeadStage,
  ProjectStatus,
  MilestoneStatus,
  InvoiceStatus,
  ReviewStatus,
  ContactStatus,
  RoadmapStatus,
  RetainerStatus,
  ThreadContextType,
  ThreadStatus,
} from '@prisma/client';
import { ProjectHealthService } from '../services/project-health.service';
import { TaskService } from '../services/task.service';
import { MilestoneDeliveryService } from '../services/milestone-delivery.service';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { FileSecurityService, VALID_FOLDERS } from '../services/file-security.service';
import { ScanState, FileFolder, FileVisibility } from '@prisma/client';
import crypto from 'crypto';
import { z } from 'zod';

const router = Router();

// Guard all admin routes with SUPER_ADMIN / ADMIN roles
router.use(requireAuth);
router.use(requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]));

// ==============================================================================
// 1. EXECUTIVE DASHBOARD & TELEMETRY
// ==============================================================================

router.get('/dashboard', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      newLeads7Days,
      newLeads30Days,
      allLeads,
      leadsNeedingFollowUp,
      proposalsPendingDecision,
      activeProjectsRaw,
      invoicesNeedingAttention,
      recentInvoices,
      unreadClientMessagesCount,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.lead.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.lead.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.lead.findMany({
        where: {
          OR: [
            { nextFollowUpAt: { lte: now } },
            {
              stage: { in: [LeadStage.NEW, LeadStage.REVIEWING, LeadStage.QUALIFIED, LeadStage.CONTACTED] },
              createdAt: { lte: sevenDaysAgo },
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.proposal.count({
        where: { status: { in: ['SENT', 'APPROVED'] } },
      }),
      prisma.project.findMany({
        where: {
          status: {
            in: [
              ProjectStatus.DISCOVERY,
              ProjectStatus.DESIGN,
              ProjectStatus.DEVELOPMENT,
              ProjectStatus.REVIEW,
            ],
          },
        },
        include: {
          organization: { select: { id: true, name: true } },
          milestones: { orderBy: { orderIndex: 'asc' } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.invoice.findMany({
        where: {
          status: { in: [InvoiceStatus.DUE, InvoiceStatus.OVERDUE, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.DISPUTED] },
        },
        include: { organization: { select: { id: true, name: true } } },
        orderBy: { dueDate: 'asc' },
      }),
      prisma.invoice.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { organization: { select: { id: true, name: true } } },
      }),
      prisma.message.count({
        where: {
          visibility: 'CLIENT_VISIBLE',
          isInternal: false,
        },
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
    ]);

    // Format active projects with derived milestone counts ("X of Y milestones completed")
    const activeProjects = activeProjectsRaw.map((p) => {
      const totalMilestones = p.milestones.length;
      const completedMilestones = p.milestones.filter(
        (m) => m.status === MilestoneStatus.COMPLETED
      ).length;
      const percent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        status: p.status,
        organizationName: p.organization.name,
        totalMilestones,
        completedMilestones,
        milestoneProgress: `${completedMilestones} of ${totalMilestones} milestones completed`,
        percent,
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        kpis: {
          newLeads7Days,
          newLeads30Days,
          leadsNeedingFollowUpCount: leadsNeedingFollowUp.length,
          proposalsPendingDecision,
          activeProjectsCount: activeProjects.length,
          invoicesNeedingAttentionCount: invoicesNeedingAttention.length,
          unreadClientMessagesCount,
        },
        leadsNeedingFollowUp,
        recentLeads: allLeads,
        activeProjects,
        invoicesNeedingAttention,
        recentInvoices,
        recentAuditLogs,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 2. LEADS CRM CRUD & CSV EXPORT
// ==============================================================================

router.get('/leads', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { stage, search } = req.query;
    const leads = await prisma.lead.findMany({
      where: {
        ...(stage ? { stage: stage as LeadStage } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: String(search), mode: 'insensitive' } },
                { email: { contains: String(search), mode: 'insensitive' } },
                { company: { contains: String(search), mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: { leads } });
  } catch (error) {
    next(error);
  }
});

router.post('/leads', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      email,
      company,
      phone,
      website,
      country,
      serviceNeeded,
      approxBudget,
      desiredTimeline,
      projectGoals,
      message,
      stage,
      estimatedValue,
      notes,
    } = req.body;

    // Deduplication check on email and phone
    const existing = await prisma.lead.findFirst({
      where: {
        OR: [
          { email: { equals: email.trim(), mode: 'insensitive' } },
          ...(phone ? [{ phone: { equals: phone.trim() } }] : []),
        ],
      },
    });

    if (existing) {
      res.status(409).json({
        status: 'error',
        code: 'DUPLICATE_LEAD',
        message: `A lead with email "${email}" or phone already exists in stage [${existing.stage}].`,
        data: { existingLeadId: existing.id },
      });
      return;
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        company,
        phone,
        website,
        country,
        serviceNeeded: serviceNeeded || 'Custom SaaS / Web Platform',
        approxBudget,
        desiredTimeline,
        projectGoals,
        message: message || `Direct CRM Inbound: ${serviceNeeded || 'Development Project'}`,
        stage: stage || LeadStage.NEW,
        estimatedValue: estimatedValue ? Number(estimatedValue) : null,
        notes,
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'LEAD_CREATED',
      entityType: 'Lead',
      entityId: lead.id,
      changes: { name, email, company, estimatedValue },
      req,
    });

    res.status(201).json({ status: 'success', data: { lead } });
  } catch (error) {
    next(error);
  }
});

router.patch('/leads/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      company,
      phone,
      country,
      serviceNeeded,
      approxBudget,
      stage,
      notes,
      estimatedValue,
      assignedAdminId,
    } = req.body;

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
        ...(company !== undefined ? { company } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(country !== undefined ? { country } : {}),
        ...(serviceNeeded ? { serviceNeeded } : {}),
        ...(approxBudget !== undefined ? { approxBudget } : {}),
        ...(stage ? { stage } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(estimatedValue !== undefined ? { estimatedValue: estimatedValue ? Number(estimatedValue) : null } : {}),
        ...(assignedAdminId !== undefined ? { assignedAdminId } : {}),
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'LEAD_UPDATED',
      entityType: 'Lead',
      entityId: id,
      changes: { stage, notes, estimatedValue },
      req,
    });

    res.status(200).json({ status: 'success', data: { lead } });
  } catch (error) {
    next(error);
  }
});

router.delete('/leads/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.lead.delete({ where: { id } });

    await logAudit({
      userId: req.user.id,
      action: 'LEAD_DELETED',
      entityType: 'Lead',
      entityId: id,
      req,
    });

    res.status(200).json({ status: 'success', message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/leads/export/csv', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
    const headers = [
      'ID',
      'Name',
      'Email',
      'Company',
      'Phone',
      'Country',
      'Service',
      'Budget',
      'Timeline',
      'Stage',
      'Score',
      'Estimated Value',
      'Created At',
    ];

    const rows = leads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      l.email,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      l.phone || '',
      l.country || '',
      `"${l.serviceNeeded.replace(/"/g, '""')}"`,
      `"${l.approxBudget || ''}"`,
      `"${l.desiredTimeline || ''}"`,
      l.stage,
      l.aiScore ?? '',
      l.estimatedValue ? Number(l.estimatedValue) : '',
      l.createdAt.toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="cyberstyle_leads_export.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
});

router.post('/leads/:id/convert', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      res.status(404).json({ status: 'error', message: 'Lead not found' });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Organization
      const org = await tx.clientOrganization.create({
        data: {
          name: lead.company || `${lead.name} Organization`,
          country: lead.country,
        },
      });

      // 2. Create Project
      const projectSlug = `${(lead.company || lead.name).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
      const project = await tx.project.create({
        data: {
          name: `${lead.serviceNeeded} - ${lead.company || lead.name}`,
          slug: projectSlug,
          organizationId: org.id,
          status: ProjectStatus.DISCOVERY,
          budget: lead.estimatedValue,
          description: lead.projectGoals,
          milestones: {
            create: [
              { title: '01 Discovery & Strategy Specification', orderIndex: 0, status: MilestoneStatus.IN_PROGRESS },
              { title: '02 Architecture & Design System Prototyping', orderIndex: 1, status: MilestoneStatus.NOT_STARTED },
              { title: '03 Production Build & Integrations', orderIndex: 2, status: MilestoneStatus.NOT_STARTED },
              { title: '04 Quality Verification & Deployment', orderIndex: 3, status: MilestoneStatus.NOT_STARTED },
            ],
          },
        },
      });

      // 3. Auto-Create Onboarding Thread
      const onboardingThread = await tx.messageThread.create({
        data: {
          organizationId: org.id,
          title: `Onboarding – ${project.name}`,
          contextType: ThreadContextType.PROJECT,
          contextId: project.id,
          status: ThreadStatus.OPEN,
          participants: {
            create: [{ userId: req.user.id, role: 'ADMIN' }],
          },
          messages: {
            create: [
              {
                senderId: req.user.id,
                content: `Welcome to the CYBERSTYLE Workspace for ${project.name}! Our engineering squad has prepared your staging repository. Use this channel for sprint updates, asset drops, and sign-offs.`,
              },
            ],
          },
        },
      });

      // 4. Update Lead to WON
      await tx.lead.update({
        where: { id },
        data: { stage: LeadStage.WON },
      });

      return { org, project, onboardingThread };
    });

    await logAudit({
      userId: req.user.id,
      action: 'LEAD_CONVERTED_TO_PROJECT',
      entityType: 'Lead',
      entityId: id,
      changes: { organizationId: result.org.id, projectId: result.project.id },
      req,
    });

    res.status(201).json({
      status: 'success',
      message: 'Lead successfully converted into Client Organization and Project.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 3. CONTACT SUBMISSIONS CRUD
// ==============================================================================

router.get('/contacts', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const contacts = await prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ status: 'success', data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.post('/contacts', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, message, status } = req.body;
    const contact = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        subject,
        message,
        status: status || ContactStatus.UNREAD,
      },
    });
    res.status(201).json({ status: 'success', data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.patch('/contacts/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const contact = await prisma.contactSubmission.update({
      where: { id },
      data: { ...(status ? { status } : {}), ...(notes !== undefined ? { notes } : {}) },
    });
    res.status(200).json({ status: 'success', data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.delete('/contacts/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.contactSubmission.delete({ where: { id } });
    res.status(200).json({ status: 'success', message: 'Contact deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 4. CLIENT ORGANIZATIONS & PROJECTS CRUD
// ==============================================================================

router.get('/clients', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const clients = await prisma.clientOrganization.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        projects: true,
        invoices: true,
        retainers: true,
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });
    res.status(200).json({ status: 'success', data: { clients } });
  } catch (error) {
    next(error);
  }
});

router.post('/clients', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, domain, industry, country, billingAddress, notes } = req.body;
    const client = await prisma.clientOrganization.create({
      data: { name, domain, industry, country, billingAddress, notes },
    });

    await logAudit({
      userId: req.user.id,
      action: 'CLIENT_ORGANIZATION_CREATED',
      entityType: 'ClientOrganization',
      entityId: client.id,
      req,
    });

    res.status(201).json({ status: 'success', data: { client } });
  } catch (error) {
    next(error);
  }
});

router.patch('/clients/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, domain, industry, country, billingAddress, notes } = req.body;
    const client = await prisma.clientOrganization.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(domain !== undefined ? { domain } : {}),
        ...(industry !== undefined ? { industry } : {}),
        ...(country !== undefined ? { country } : {}),
        ...(billingAddress !== undefined ? { billingAddress } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'CLIENT_ORGANIZATION_UPDATED',
      entityType: 'ClientOrganization',
      entityId: id,
      req,
    });

    res.status(200).json({ status: 'success', data: { client } });
  } catch (error) {
    next(error);
  }
});

router.delete('/clients/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.clientOrganization.delete({ where: { id } });

    await logAudit({
      userId: req.user.id,
      action: 'CLIENT_ORGANIZATION_DELETED',
      entityType: 'ClientOrganization',
      entityId: id,
      req,
    });

    res.status(200).json({ status: 'success', message: 'Client Organization deleted' });
  } catch (error) {
    next(error);
  }
});

router.get('/projects', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        organization: true,
        milestones: { orderBy: { orderIndex: 'asc' } },
        invoices: true,
      },
    });
    res.status(200).json({ status: 'success', data: { projects } });
  } catch (error) {
    next(error);
  }
});

router.post('/projects', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, organizationId, status, description, budget, startDate, targetLaunchDate, repositoryUrl, stagingUrl } = req.body;
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const project = await prisma.project.create({
      data: {
        name,
        slug,
        organizationId,
        status: status || ProjectStatus.DISCOVERY,
        description,
        budget: budget ? Number(budget) : null,
        startDate: startDate ? new Date(startDate) : null,
        targetLaunchDate: targetLaunchDate ? new Date(targetLaunchDate) : null,
        repositoryUrl,
        stagingUrl,
      },
    });

    // Auto-create Onboarding Thread
    await prisma.messageThread.create({
      data: {
        organizationId,
        title: `Onboarding – ${name}`,
        contextType: ThreadContextType.PROJECT,
        contextId: project.id,
        status: ThreadStatus.OPEN,
        participants: {
          create: [{ userId: req.user.id, role: 'ADMIN' }],
        },
        messages: {
          create: [
            {
              senderId: req.user.id,
              content: `Onboarding initiated for ${name}. Track active sprints, verify deliverables, and communicate with lead engineers directly in this channel.`,
            },
          ],
        },
      },
    }).catch(() => {});

    await logAudit({
      userId: req.user.id,
      action: 'PROJECT_CREATED',
      entityType: 'Project',
      entityId: project.id,
      req,
    });

    res.status(201).json({ status: 'success', data: { project } });
  } catch (error) {
    next(error);
  }
});

router.patch('/projects/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, status, description, budget, startDate, targetLaunchDate, repositoryUrl, stagingUrl, productionUrl } = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(status ? { status } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(budget !== undefined ? { budget: budget ? Number(budget) : null } : {}),
        ...(startDate !== undefined ? { startDate: startDate ? new Date(startDate) : null } : {}),
        ...(targetLaunchDate !== undefined ? { targetLaunchDate: targetLaunchDate ? new Date(targetLaunchDate) : null } : {}),
        ...(repositoryUrl !== undefined ? { repositoryUrl } : {}),
        ...(stagingUrl !== undefined ? { stagingUrl } : {}),
        ...(productionUrl !== undefined ? { productionUrl } : {}),
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'PROJECT_UPDATED',
      entityType: 'Project',
      entityId: id,
      req,
    });

    res.status(200).json({ status: 'success', data: { project } });
  } catch (error) {
    next(error);
  }
});

router.delete('/projects/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });

    await logAudit({
      userId: req.user.id,
      action: 'PROJECT_DELETED',
      entityType: 'Project',
      entityId: id,
      req,
    });

    res.status(200).json({ status: 'success', message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/admin/projects/:id
 * @desc    Get detailed project with health, tasks, milestones, and invoice context
 */
router.get('/projects/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        organization: true,
        milestones: { orderBy: { orderIndex: 'asc' } },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true } },
            milestone: { select: { id: true, title: true } },
          },
          orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
        },
        invoices: { orderBy: { dueDate: 'desc' } },
        healthLogs: { orderBy: { recordedAt: 'desc' }, take: 10 },
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
 * @route   GET /api/admin/projects/:id/health
 * @desc    Get real-time health score calculation with active deduction factors
 */
router.get('/projects/:id/health', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const health = await ProjectHealthService.calculateHealth(id);
    res.status(200).json({ status: 'success', data: { health } });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/admin/projects/:id/recalculate-health
 * @desc    Force immediate health score recalculation and persistence
 */
router.post('/projects/:id/recalculate-health', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const health = await ProjectHealthService.recalculateProjectHealth(id, req);
    res.status(200).json({ status: 'success', data: { health } });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 4B. PROJECT TASK BOARD CRUD (PHASE 5)
// ==============================================================================

router.get('/projects/:id/tasks', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const tasks = await TaskService.listTasks(id, req.user.role);
    res.status(200).json({ status: 'success', data: { tasks } });
  } catch (error) {
    next(error);
  }
});

router.post('/projects/:id/tasks', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const task = await TaskService.createTask(id, req.body, req.user, req);
    res.status(201).json({ status: 'success', data: { task } });
  } catch (error) {
    next(error);
  }
});

router.patch('/projects/:id/tasks/:taskId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.taskId as string;
    const task = await TaskService.updateTask(taskId, req.body, req.user, req);
    res.status(200).json({ status: 'success', data: { task } });
  } catch (error) {
    next(error);
  }
});

router.delete('/projects/:id/tasks/:taskId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.taskId as string;
    const result = await TaskService.deleteTask(taskId, req.user, req);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 5. MILESTONES CRUD & PHASE 5 DELIVERY GATES
// ==============================================================================

router.get('/milestones', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.query;
    const milestones = await prisma.milestone.findMany({
      where: projectId ? { projectId: String(projectId) } : {},
      orderBy: { orderIndex: 'asc' },
      include: { project: { include: { organization: true } }, tasks: true },
    });
    res.status(200).json({ status: 'success', data: { milestones } });
  } catch (error) {
    next(error);
  }
});

router.post('/milestones', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, title, description, orderIndex, status, dueDate, amount, invoiceId } = req.body;
    const milestone = await prisma.milestone.create({
      data: {
        projectId,
        title,
        description,
        amount: amount ? Number(amount) : null,
        orderIndex: Number(orderIndex || 0),
        status: status || MilestoneStatus.NOT_STARTED,
        dueDate: dueDate ? new Date(dueDate) : null,
        invoiceId: invoiceId || null,
      },
    });
    res.status(201).json({ status: 'success', data: { milestone } });
  } catch (error) {
    next(error);
  }
});

router.patch('/milestones/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, completedDate, amount, invoiceId, paymentStatus } = req.body;

    const milestone = await prisma.milestone.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(status ? { status } : {}),
        ...(amount !== undefined ? { amount: amount ? Number(amount) : null } : {}),
        ...(invoiceId !== undefined ? { invoiceId } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
        ...(completedDate !== undefined ? { completedDate: completedDate ? new Date(completedDate) : null } : {}),
      },
    });

    // Trigger health recalculation if milestone status or due date modified
    await ProjectHealthService.recalculateProjectHealth(milestone.projectId, req);

    res.status(200).json({ status: 'success', data: { milestone } });
  } catch (error) {
    next(error);
  }
});

router.post('/milestones/:id/request-approval', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const milestone = await MilestoneDeliveryService.requestApproval(id, req.user, req);
    res.status(200).json({ status: 'success', data: { milestone } });
  } catch (error) {
    next(error);
  }
});

router.post('/milestones/:id/approve', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const milestone = await MilestoneDeliveryService.approveMilestone(id, req.user, req);
    res.status(200).json({ status: 'success', data: { milestone } });
  } catch (error) {
    next(error);
  }
});

router.delete('/milestones/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const milestone = await prisma.milestone.findUnique({ where: { id } });
    if (milestone) {
      await prisma.milestone.delete({ where: { id } });
      await ProjectHealthService.recalculateProjectHealth(milestone.projectId, req);
    }
    res.status(200).json({ status: 'success', message: 'Milestone deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 6. INVOICES & RETAINERS CRUD
// ==============================================================================

router.get('/invoices', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        organization: true,
        project: true,
        lineItems: true,
        payments: true,
      },
    });
    res.status(200).json({ status: 'success', data: { invoices } });
  } catch (error) {
    next(error);
  }
});

router.post('/invoices', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { organizationId, projectId, invoiceNumber, status, issueDate, dueDate, currency, subtotal, taxAmount, totalAmount, lineItems } = req.body;

    const invoice = await prisma.invoice.create({
      data: {
        organizationId,
        projectId: projectId || null,
        invoiceNumber: invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        status: status || InvoiceStatus.DRAFT,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        currency: currency || 'USD',
        subtotal: subtotal ? Number(subtotal) : 0,
        taxAmount: taxAmount ? Number(taxAmount) : 0,
        totalAmount: totalAmount ? Number(totalAmount) : 0,
        amountDue: totalAmount ? Number(totalAmount) : 0,
        lineItems: Array.isArray(lineItems) && lineItems.length > 0
          ? {
              create: lineItems.map((li: any, idx: number) => ({
                description: li.description || 'Engineering Deliverable',
                quantity: Number(li.quantity || 1),
                unitPrice: Number(li.unitPrice || 0),
                totalPrice: Number(li.totalPrice || li.amount || (Number(li.quantity || 1) * Number(li.unitPrice || 0))),
                orderIndex: idx,
              })),
            }
          : undefined,
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'INVOICE_CREATED',
      entityType: 'Invoice',
      entityId: invoice.id,
      req,
    });

    res.status(201).json({ status: 'success', data: { invoice } });
  } catch (error) {
    next(error);
  }
});

router.patch('/invoices/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, dueDate, totalAmount, amountPaid, notes } = req.body;

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(dueDate ? { dueDate: new Date(dueDate) } : {}),
        ...(totalAmount !== undefined ? { totalAmount: Number(totalAmount) } : {}),
        ...(amountPaid !== undefined ? { amountPaid: Number(amountPaid) } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    res.status(200).json({ status: 'success', data: { invoice } });
  } catch (error) {
    next(error);
  }
});

router.delete('/invoices/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.invoice.delete({ where: { id } });
    res.status(200).json({ status: 'success', message: 'Invoice deleted successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/retainers', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const retainers = await prisma.retainer.findMany({
      orderBy: { createdAt: 'desc' },
      include: { organization: true },
    });
    res.status(200).json({ status: 'success', data: { retainers } });
  } catch (error) {
    next(error);
  }
});

router.post('/retainers', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { organizationId, name, amount, slaResponseHours, status, interval, slaDescription } = req.body;

    const retainer = await prisma.retainer.create({
      data: {
        organizationId,
        name,
        amount: Number(amount || 0),
        interval: interval || 'MONTHLY',
        slaDescription: slaDescription || (slaResponseHours ? `< ${slaResponseHours} Hours Guaranteed SLA` : undefined),
        status: status || RetainerStatus.ACTIVE,
      },
    });

    res.status(201).json({ status: 'success', data: { retainer } });
  } catch (error) {
    next(error);
  }
});

router.patch('/retainers/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, amount, status, slaDescription } = req.body;

    const retainer = await prisma.retainer.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(amount !== undefined ? { amount: Number(amount) } : {}),
        ...(status ? { status } : {}),
        ...(slaDescription !== undefined ? { slaDescription } : {}),
      },
    });

    res.status(200).json({ status: 'success', data: { retainer } });
  } catch (error) {
    next(error);
  }
});

router.delete('/retainers/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.retainer.delete({ where: { id } });
    res.status(200).json({ status: 'success', message: 'Retainer deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 7. REVIEWS & FAQS CRUD
// ==============================================================================

router.get('/reviews', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: { project: true },
    });
    res.status(200).json({ status: 'success', data: { reviews } });
  } catch (error) {
    next(error);
  }
});

router.post('/reviews', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const {
      clientName,
      clientTitle,
      clientCompany,
      companyName,
      rating,
      quote,
      isFeatured,
      status,
      projectId,
      provenance,
      consent,
      displayPermission,
      source,
      reviewDate,
    } = req.body;

    const review = await prisma.review.create({
      data: {
        clientName,
        clientTitle,
        companyName: companyName || clientCompany || null,
        projectId: projectId || null,
        rating: Number(rating || 5),
        quote,
        isFeatured: Boolean(isFeatured),
        status: status || ReviewStatus.PENDING,
        approvedAt: status === ReviewStatus.APPROVED ? new Date() : null,
        provenance: provenance || 'Direct Feedback',
        consent: Boolean(consent),
        displayPermission: Boolean(displayPermission),
        source: source || 'admin_entry',
        reviewDate: reviewDate ? new Date(reviewDate) : new Date(),
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'REVIEW_CREATED',
      entityType: 'Review',
      entityId: review.id,
      changes: { clientName, status: review.status, displayPermission: review.displayPermission },
      req,
    });

    res.status(201).json({ status: 'success', data: { review } });
  } catch (error) {
    next(error);
  }
});

router.patch('/reviews/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      status,
      isFeatured,
      quote,
      rating,
      clientName,
      clientCompany,
      companyName,
      provenance,
      consent,
      displayPermission,
    } = req.body;

    const review = await prisma.review.update({
      where: { id },
      data: {
        ...(status ? { status, approvedAt: status === ReviewStatus.APPROVED ? new Date() : null } : {}),
        ...(isFeatured !== undefined ? { isFeatured } : {}),
        ...(quote !== undefined ? { quote } : {}),
        ...(rating !== undefined ? { rating: Number(rating) } : {}),
        ...(clientName ? { clientName } : {}),
        ...(companyName !== undefined ? { companyName } : clientCompany !== undefined ? { companyName: clientCompany } : {}),
        ...(provenance !== undefined ? { provenance } : {}),
        ...(consent !== undefined ? { consent: Boolean(consent) } : {}),
        ...(displayPermission !== undefined ? { displayPermission: Boolean(displayPermission) } : {}),
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'REVIEW_UPDATED',
      entityType: 'Review',
      entityId: id,
      changes: { status: review.status, displayPermission: review.displayPermission },
      req,
    });

    res.status(200).json({ status: 'success', data: { review } });
  } catch (error) {
    next(error);
  }
});

router.delete('/reviews/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.status(200).json({ status: 'success', message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 7B. FAQS CRUD (ADMIN)
// ==============================================================================

router.get('/faqs', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
    });
    res.status(200).json({ status: 'success', data: { faqs } });
  } catch (error) {
    next(error);
  }
});

router.post('/faqs', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { question, answer, category, displayPages, orderIndex, isPublished } = req.body;
    if (!question || !answer) {
      res.status(400).json({ status: 'error', message: 'Question and answer are required' });
      return;
    }

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category: category || 'General',
        displayPages: Array.isArray(displayPages) ? displayPages.map((p: string) => p.toLowerCase()) : ['faq', 'home'],
        orderIndex: Number(orderIndex || 0),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'FAQ_CREATED',
      entityType: 'FAQ',
      entityId: faq.id,
      changes: { question, category },
      req,
    });

    res.status(201).json({ status: 'success', data: { faq } });
  } catch (error) {
    next(error);
  }
});

router.patch('/faqs/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { question, answer, category, displayPages, orderIndex, isPublished } = req.body;

    const data: any = {};
    if (question !== undefined) data.question = question;
    if (answer !== undefined) data.answer = answer;
    if (category !== undefined) data.category = category;
    if (displayPages !== undefined && Array.isArray(displayPages)) {
      data.displayPages = displayPages.map((p: string) => p.toLowerCase());
    }
    if (orderIndex !== undefined) data.orderIndex = Number(orderIndex);
    if (isPublished !== undefined) data.isPublished = Boolean(isPublished);

    const faq = await prisma.fAQ.update({
      where: { id },
      data,
    });

    await logAudit({
      userId: req.user.id,
      action: 'FAQ_UPDATED',
      entityType: 'FAQ',
      entityId: faq.id,
      changes: data,
      req,
    });

    res.status(200).json({ status: 'success', data: { faq } });
  } catch (error) {
    next(error);
  }
});

router.delete('/faqs/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.fAQ.delete({ where: { id } });

    await logAudit({
      userId: req.user.id,
      action: 'FAQ_DELETED',
      entityType: 'FAQ',
      entityId: id,
      changes: { deleted: true },
      req,
    });

    res.status(200).json({ status: 'success', message: 'FAQ deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 8. ROADMAP & SPRINT CRUD
// ==============================================================================

router.get('/roadmap', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.roadmapItem.findMany({ orderBy: { orderIndex: 'asc' } });
    res.status(200).json({ status: 'success', data: { items } });
  } catch (error) {
    next(error);
  }
});

router.post('/roadmap', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, quarter, phase, category, status, orderIndex } = req.body;
    const item = await prisma.roadmapItem.create({
      data: {
        title,
        description,
        phase: phase || quarter || 'Q3 2026',
        category: category || 'Core Architecture',
        status: status || RoadmapStatus.IN_PROGRESS,
        orderIndex: Number(orderIndex || 0),
      },
    });
    res.status(201).json({ status: 'success', data: { item } });
  } catch (error) {
    next(error);
  }
});

router.patch('/roadmap/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, quarter, phase, category, status } = req.body;
    const item = await prisma.roadmapItem.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(phase ? { phase } : quarter ? { phase: quarter } : {}),
        ...(category ? { category } : {}),
        ...(status ? { status, completedAt: status === RoadmapStatus.COMPLETED ? new Date() : null } : {}),
      },
    });
    res.status(200).json({ status: 'success', data: { item } });
  } catch (error) {
    next(error);
  }
});

router.delete('/roadmap/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.roadmapItem.delete({ where: { id } });
    res.status(200).json({ status: 'success', message: 'Roadmap item deleted' });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 10. TODOS & AUDIT LOGS
// ==============================================================================

router.get('/todos', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.user.id },
      orderBy: [{ isCompleted: 'asc' }, { createdAt: 'desc' }],
    });
    res.status(200).json({ status: 'success', data: { todos } });
  } catch (error) {
    next(error);
  }
});

router.post('/todos', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, priority, entityType, entityId, dueDate } = req.body;
    const todo = await prisma.todo.create({
      data: {
        userId: req.user.id,
        title,
        priority: priority || 'MEDIUM',
        entityType,
        entityId,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });
    res.status(201).json({ status: 'success', data: { todo } });
  } catch (error) {
    next(error);
  }
});

router.patch('/todos/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isCompleted, title, priority } = req.body;
    const todo = await prisma.todo.update({
      where: { id, userId: req.user.id },
      data: {
        ...(isCompleted !== undefined ? { isCompleted } : {}),
        ...(title ? { title } : {}),
        ...(priority ? { priority } : {}),
      },
    });
    res.status(200).json({ status: 'success', data: { todo } });
  } catch (error) {
    next(error);
  }
});

router.delete('/todos/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.todo.delete({ where: { id, userId: req.user.id } });
    res.status(200).json({ status: 'success', message: 'Todo deleted' });
  } catch (error) {
    next(error);
  }
});

router.get('/audit-logs', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { limit = '50', entityType } = req.query;
    const logs = await prisma.auditLog.findMany({
      where: { ...(entityType ? { entityType: String(entityType) } : {}) },
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Number(limit), 100),
    });
    res.status(200).json({ status: 'success', data: { logs } });
  } catch (error) {
    next(error);
  }
});

// ------------------------------------------------------------------------------
// PHASE 6: REPORTING & MONTHLY RETAINER REPORTS
// ------------------------------------------------------------------------------

/**
 * @route   GET /api/v1/reports
 * @desc    List all reports with optional filters
 */
router.get('/reports', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { organizationId, status, search } = req.query;
    const reports = await prisma.report.findMany({
      where: {
        ...(organizationId ? { organizationId: String(organizationId) } : {}),
        ...(status ? { status: status as any } : {}),
        ...(search ? { title: { contains: String(search), mode: 'insensitive' } } : {}),
      },
      include: {
        organization: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
        publishedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { periodStartDate: 'desc' },
    });
    res.status(200).json({ status: 'success', data: { reports } });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/reports/:id
 * @desc    Get single report details
 */
router.get('/reports/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        organization: true,
        project: true,
        publishedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!report) {
      res.status(404).json({ status: 'error', message: 'Report not found' });
      return;
    }

    res.status(200).json({ status: 'success', data: { report } });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/reports/generate
 * @desc    Generate a monthly rollup report in DRAFT status
 */
router.post('/reports/generate', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { organizationId, year, month, projectId, reportType } = req.body;
    if (!organizationId || !year || !month) {
      res.status(400).json({ status: 'error', message: 'organizationId, year, and month are required' });
      return;
    }

    const { ReportGenerationService } = await import('../services/report-generation.service');
    const report = await ReportGenerationService.generateMonthlyRollup({
      organizationId,
      year: Number(year),
      month: Number(month),
      projectId,
      reportType,
      generatedById: req.user.id,
    });

    res.status(201).json({ status: 'success', data: { report } });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/v1/reports/:id
 * @desc    Update draft report content
 */
router.put('/reports/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { title, executiveSummary, keyAccomplishments, nextMonthPlan, nextMonthPriorities } = req.body;

    const { ReportGenerationService } = await import('../services/report-generation.service');
    const updated = await ReportGenerationService.updateDraftReport(
      id,
      { title, executiveSummary, keyAccomplishments, nextMonthPlan, nextMonthPriorities },
      req.user
    );

    res.status(200).json({ status: 'success', data: { report: updated } });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/reports/:id/publish
 * @desc    Generate PDF and publish report to Client Portal
 */
router.post('/reports/:id/publish', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { ReportGenerationService } = await import('../services/report-generation.service');
    const published = await ReportGenerationService.publishReport(id, req.user, req);

    res.status(200).json({ status: 'success', data: { report: published } });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/reports/:id/pdf
 * @desc    Download / view rendered report PDF
 */
router.get('/reports/:id/pdf', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const report = await prisma.report.findUnique({
      where: { id },
      include: { organization: true },
    });

    if (!report) {
      res.status(404).json({ status: 'error', message: 'Report not found' });
      return;
    }

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

/**
 * @route   DELETE /api/v1/reports/:id
 * @desc    Delete a report (admin only)
 */
router.delete('/reports/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.report.delete({ where: { id } });

    await logAudit({
      userId: req.user.id,
      action: 'REPORT_DELETED',
      entityType: 'Report',
      entityId: id,
      req,
    });

    res.status(200).json({ status: 'success', message: 'Report deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 11. USER & CLIENT ACCESS CONTROL MANAGEMENT
// ==============================================================================

/**
 * @route   GET /api/v1/admin/users
 * @desc    Fetch all administrative and client users
 */
router.get('/users', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        twoFactorEnabled: true,
        isEmailVerified: true,
        createdAt: true,
        clientProfile: {
          include: {
            organization: {
              select: {
                id: true,
                name: true,
                domain: true,
                industry: true,
              },
            },
          },
        },
        adminProfile: {
          select: {
            department: true,
            permissions: true,
          },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: users,
      users,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/admin/clients
 * @desc    Fetch client organizations for portal management
 */
router.get('/clients', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const clients = await prisma.clientOrganization.findMany({
      orderBy: { name: 'asc' },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                status: true,
                twoFactorEnabled: true,
              },
            },
          },
        },
        projects: {
          select: { id: true, name: true, status: true },
        },
        invoices: {
          where: { status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] } },
          select: { id: true, totalAmount: true, status: true },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: clients,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/admin/users/invite
 * @desc    Invite/create a new Admin or Client user with branded email dispatch
 */
router.post('/users/invite', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      name: z.string().optional(),
      role: z.nativeEnum(UserRole).default(UserRole.ADMIN),
      organizationId: z.string().optional(),
      organizationName: z.string().optional(),
      department: z.string().optional(),
    });

    const body = schema.parse(req.body);
    const email = body.email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({
        status: 'error',
        message: 'A user with this email address already exists in the system.',
      });
      return;
    }

    // Generate temporary password
    const rawTempPassword = `CS-${crypto.randomBytes(4).toString('hex').toUpperCase()}!9`;
    const passwordHash = await AuthService.hashPassword(rawTempPassword);

    const newUser = await prisma.$transaction(async (tx) => {
      let resolvedOrgId = body.organizationId;

      if (body.role === UserRole.CLIENT) {
        if (!resolvedOrgId && body.organizationName) {
          const newOrg = await tx.clientOrganization.create({
            data: { name: body.organizationName.trim() },
          });
          resolvedOrgId = newOrg.id;
        } else if (!resolvedOrgId) {
          // Default organization if none specified
          const defaultOrg = await tx.clientOrganization.findFirst({
            orderBy: { createdAt: 'asc' },
          });
          resolvedOrgId = defaultOrg ? defaultOrg.id : (await tx.clientOrganization.create({
            data: { name: body.name ? `${body.name}'s Organization` : 'Client Organization' },
          })).id;
        }
      }

      const user = await tx.user.create({
        data: {
          email,
          name: body.name || email.split('@')[0],
          passwordHash,
          role: body.role,
          status: 'ACTIVE',
          isEmailVerified: true,
        },
      });

      if (body.role === UserRole.CLIENT && resolvedOrgId) {
        await tx.clientProfile.create({
          data: {
            userId: user.id,
            organizationId: resolvedOrgId,
            jobTitle: 'Client Representative',
          },
        });
      } else if (body.role === UserRole.ADMIN || body.role === UserRole.SUPER_ADMIN) {
        await tx.adminProfile.create({
          data: {
            userId: user.id,
            department: body.department || 'Operations',
            permissions: ['READ', 'WRITE', 'TELEMETRY'],
          },
        });
      }

      return user;
    });

    const loginUrl = body.role === UserRole.CLIENT
      ? 'http://localhost:3000/portal/login'
      : 'http://localhost:3000/admin/login';

    // Dispatch branded invitation email
    await EmailService.sendMail({
      to: newUser.email,
      subject: `⚡ Welcome to CYBERSTYLE // Access Invitation (${body.role === UserRole.CLIENT ? 'Client Workspace' : 'Staff Console'})`,
      html: `
        <p>Hello <strong>${newUser.name}</strong>,</p>
        <p>You have been authorized by an Executive Administrator to access the <strong>CYBERSTYLE ${body.role === UserRole.CLIENT ? 'Client Enclave' : 'Admin Operations Console'}</strong>.</p>
        
        <div style="margin: 24px 0; padding: 20px; background-color: rgba(0, 240, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 12px;">
          <p style="margin: 0 0 10px 0; font-size: 11px; font-family: monospace; text-transform: uppercase; color: #00F0FF; letter-spacing: 1.5px;">Your Access Credentials</p>
          <p style="margin: 4px 0; font-family: monospace; font-size: 13px; color: #E2E8F0;">Username: <strong>${newUser.email}</strong></p>
          <p style="margin: 4px 0; font-family: monospace; font-size: 13px; color: #E2E8F0;">Temporary Password: <span style="background-color: #000; padding: 2px 8px; border-radius: 4px; border: 1px solid #334155; color: #00F0FF; font-weight: bold;">${rawTempPassword}</span></p>
          <p style="margin: 10px 0 0 0; font-size: 11px; color: #94A3B8;">Please log in and update your security credentials upon first session authorization.</p>
        </div>

        <div style="margin: 28px 0;">
          <a href="${loginUrl}" style="display: inline-block; background-color: #00F0FF; color: #000000; font-weight: 800; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px; box-shadow: 0 0 20px rgba(0, 240, 255, 0.35);">
            Launch ${body.role === UserRole.CLIENT ? 'Client Portal' : 'Admin Console'} &rarr;
          </a>
        </div>
      `,
    });

    await logAudit({
      userId: req.user.id,
      action: 'USER_INVITED',
      entityType: 'User',
      entityId: newUser.id,
      metadata: { email: newUser.email, role: newUser.role },
      req,
    });

    res.status(201).json({
      status: 'success',
      message: `User ${newUser.email} successfully created and dispatched credentials email.`,
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        tempPassword: rawTempPassword,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/admin/users/:id/reset-2fa
 * @desc    Reset 2FA requirement and secrets for a user
 */
router.post('/users/:id/reset-2fa', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const targetUser = await prisma.user.findUnique({ where: { id } });

    if (!targetUser) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    await prisma.user.update({
      where: { id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: [],
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'ADMIN_2FA_RESET',
      entityType: 'User',
      entityId: id,
      metadata: { targetEmail: targetUser.email },
      req,
    });

    res.status(200).json({
      status: 'success',
      message: `Two-factor authentication reset for ${targetUser.email}. User can re-enroll upon login.`,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/admin/users/:id/reset-password
 * @desc    Admin forces password reset and generates/emails temporary credentials
 */
router.post('/users/:id/reset-password', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const targetUser = await prisma.user.findUnique({ where: { id } });

    if (!targetUser) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    const rawTempPassword = `CS-${crypto.randomBytes(4).toString('hex').toUpperCase()}!7`;
    const passwordHash = await AuthService.hashPassword(rawTempPassword);

    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    // Invalidate existing sessions
    await AuthService.invalidateAllUserSessions(id);

    // Send notification email
    await EmailService.sendMail({
      to: targetUser.email,
      subject: '🔐 CYBERSTYLE Account Security: Temporary Password Issued by Administrator',
      html: `
        <p>Hello ${targetUser.name || 'User'},</p>
        <p>An authorized administrator has reset your password.</p>
        <p>Your new temporary password is: <span style="background-color: #000; padding: 2px 8px; border-radius: 4px; border: 1px solid #334155; color: #00F0FF; font-weight: bold;">${rawTempPassword}</span></p>
        <p>Please log in immediately and update your password.</p>
      `,
    });

    await logAudit({
      userId: req.user.id,
      action: 'ADMIN_FORCE_PASSWORD_RESET',
      entityType: 'User',
      entityId: id,
      metadata: { targetEmail: targetUser.email },
      req,
    });

    res.status(200).json({
      status: 'success',
      message: `Temporary password generated and dispatched to ${targetUser.email}.`,
      data: { tempPassword: rawTempPassword },
    });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 12. MEDIA & DIGITAL ASSETS MANAGEMENT
// ==============================================================================

/**
 * @route   GET /api/v1/admin/media
 * @desc    Fetch all stored media assets
 */
router.get('/media', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const assets = await prisma.fileAsset.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        organization: { select: { id: true, name: true } },
        uploader: { select: { id: true, name: true, email: true } },
        versions: { orderBy: { versionNumber: 'desc' } },
      },
    });

    res.status(200).json({
      status: 'success',
      data: assets.map((a) => ({
        id: a.id,
        filename: a.filename,
        folder: a.folder || 'CONTENT_BRAND',
        visibility: a.visibility,
        isQuarantined: a.isQuarantined,
        currentVersion: a.currentVersion,
        mimeType: a.mimeType,
        sizeBytes: a.sizeBytes,
        storageKey: a.storageKey,
        url: a.url || `/uploads/clean/${a.storageKey}`,
        publicUrl: `/images/${a.filename}`,
        organization: a.organization?.name || 'CYBERSTYLE Agency Global',
        uploader: a.uploader?.name || a.uploader?.email || 'Executive Admin',
        versions: a.versions || [],
        createdAt: a.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/admin/media
 * @desc    Register a new media asset or CDN asset
 */
router.post('/media', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const schema = z.object({
      filename: z.string().min(1),
      mimeType: z.string().default('application/octet-stream'),
      sizeBytes: z.number().default(0),
      url: z.string().url().optional(),
      organizationId: z.string().optional(),
    });

    const body = schema.parse(req.body);

    let orgId = body.organizationId;
    if (!orgId) {
      const firstOrg = await prisma.clientOrganization.findFirst({ orderBy: { createdAt: 'asc' } });
      orgId = firstOrg?.id || (await prisma.clientOrganization.create({ data: { name: 'CYBERSTYLE Global Assets' } })).id;
    }

    const asset = await prisma.fileAsset.create({
      data: {
        filename: body.filename,
        mimeType: body.mimeType,
        sizeBytes: body.sizeBytes,
        url: body.url || null,
        storageKey: `media/${Date.now()}_${body.filename.replace(/\s+/g, '_')}`,
        organizationId: orgId,
        uploaderId: req.user.id,
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'MEDIA_ASSET_CREATED',
      entityType: 'FileAsset',
      entityId: asset.id,
      metadata: { filename: asset.filename },
      req,
    });

    res.status(201).json({ status: 'success', data: asset });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PATCH /api/v1/admin/media/:id
 * @desc    Update media asset metadata
 */
router.patch('/media/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { filename, url } = req.body;

    const asset = await prisma.fileAsset.update({
      where: { id },
      data: {
        ...(filename ? { filename } : {}),
        ...(url !== undefined ? { url } : {}),
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'MEDIA_ASSET_UPDATED',
      entityType: 'FileAsset',
      entityId: id,
      metadata: { filename: asset.filename },
      req,
    });

    res.status(200).json({ status: 'success', data: asset });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/v1/admin/media/:id
 * @desc    Delete a media asset
 */
router.delete('/media/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.fileAsset.delete({ where: { id } });

    await logAudit({
      userId: req.user.id,
      action: 'MEDIA_ASSET_DELETED',
      entityType: 'FileAsset',
      entityId: id,
      req,
    });

    res.status(200).json({ status: 'success', message: 'Asset removed successfully' });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 12. ENVIRONMENT-SCOPED SYSTEM SETTINGS
// ==============================================================================

const SettingsPayloadSchema = z.object({
  brandLegalName: z.string().min(2),
  primaryProductionDomain: z.string().min(3),
  strictTotpEnforcement: z.boolean().default(true),
  autoSessionRotation: z.boolean().default(true),
});

/**
 * @route   GET /api/v1/admin/settings
 * @desc    Fetch system settings for current environment
 */
router.get('/settings', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const environment = process.env.NODE_ENV || 'development';

    const records = await prisma.systemSetting.findMany({
      where: { environment },
    });

    const settingsMap: Record<string, any> = {
      environment,
      brandLegalName: 'CYBERSTYLE LLC',
      primaryProductionDomain: 'cyberstyle.net',
      strictTotpEnforcement: true,
      autoSessionRotation: true,
    };

    records.forEach((r) => {
      try {
        settingsMap[r.key] = JSON.parse(r.value);
      } catch {
        settingsMap[r.key] = r.value;
      }
    });

    res.status(200).json({ status: 'success', data: settingsMap });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/v1/admin/settings
 * @desc    Save system settings for current environment
 */
router.put('/settings', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const environment = process.env.NODE_ENV || 'development';
    const payload = SettingsPayloadSchema.parse(req.body);

    const entries = [
      { key: 'brandLegalName', value: JSON.stringify(payload.brandLegalName) },
      { key: 'primaryProductionDomain', value: JSON.stringify(payload.primaryProductionDomain) },
      { key: 'strictTotpEnforcement', value: JSON.stringify(payload.strictTotpEnforcement) },
      { key: 'autoSessionRotation', value: JSON.stringify(payload.autoSessionRotation) },
    ];

    await prisma.$transaction(
      entries.map((entry) =>
        prisma.systemSetting.upsert({
          where: {
            environment_key: {
              environment,
              key: entry.key,
            },
          },
          update: {
            value: entry.value,
            updatedById: req.user.id,
          },
          create: {
            environment,
            key: entry.key,
            value: entry.value,
            updatedById: req.user.id,
          },
        })
      )
    );

    await logAudit({
      userId: req.user.id,
      action: 'SYSTEM_SETTINGS_UPDATED',
      entityType: 'SystemSetting',
      entityId: environment,
      metadata: { environment, updatedKeys: entries.map((e) => e.key) },
      req,
    });

    res.status(200).json({
      status: 'success',
      message: `System settings for [${environment}] updated successfully.`,
      data: payload,
    });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 13. USER MANAGEMENT & ROLE GOVERNANCE
// ==============================================================================

router.put('/users/:id/role', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(UserRole).includes(role)) {
      res.status(400).json({ status: 'error', message: 'Invalid role specified.' });
      return;
    }

    const previousUser = await prisma.user.findUnique({ where: { id } });
    if (!previousUser) {
      res.status(404).json({ status: 'error', message: 'User not found.' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true },
    });

    await logAudit({
      userId: req.user.id,
      action: 'USER_ROLE_CHANGED',
      entityType: 'User',
      entityId: id,
      changes: { from: previousUser.role, to: role },
      req,
    });

    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 14. TAMPER-EVIDENT AUDIT LOG TRAIL & CSV EXPORT
// ==============================================================================

router.get('/audit-logs', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { format, organizationId, entityType, limit = '100' } = req.query;

    const logs = await prisma.auditLog.findMany({
      where: {
        ...(organizationId ? { organizationId: String(organizationId) } : {}),
        ...(entityType ? { entityType: String(entityType) } : {}),
      },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Number(limit) || 100, 500),
    });

    // Verify cryptographic forward-hash chain (in chronological order)
    const verification = verifyAuditChain(logs.slice().reverse());

    if (format === 'csv') {
      const csv = exportAuditLogsToCsv(logs);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${Date.now()}.csv"`);
      res.status(200).send(csv);
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        logs,
        verification,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 12. PHASE 3 SECURE MEDIA & FILE ASSET MANAGEMENT
// ==============================================================================

/**
 * @route   GET /api/admin/media
 * @desc    List secure, versioned file assets with scan states & folder taxonomy
 */
router.get('/media', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { folder, organizationId, search, scanState } = req.query;

    const files = await prisma.fileAsset.findMany({
      where: {
        isDeleted: false,
        ...(folder && VALID_FOLDERS.includes(folder as FileFolder) ? { folder: folder as FileFolder } : {}),
        ...(organizationId ? { organizationId: String(organizationId) } : {}),
        ...(scanState ? { versions: { some: { scanState: scanState as ScanState } } } : {}),
        ...(search ? { filename: { contains: String(search), mode: 'insensitive' } } : {}),
      },
      include: {
        organization: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
        uploader: { select: { id: true, name: true, email: true, role: true } },
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
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
 * @route   POST /api/admin/media/upload
 * @desc    Quarantine upload with MIME signature validation, virus scan, and versioning
 */
router.post('/media/upload', async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
  try {
    const {
      filename,
      base64Data,
      organizationId,
      projectId,
      folder,
      visibility,
      existingAssetId,
    } = req.body;

    if (!filename || !base64Data) {
      res.status(400).json({ status: 'error', code: 'INVALID_PAYLOAD', message: 'Filename and base64Data are required.' });
      return;
    }

    // Resolve target organization (use first active org if not specified for agency files)
    let targetOrgId = organizationId;
    if (!targetOrgId) {
      const defaultOrg = await prisma.clientOrganization.findFirst();
      targetOrgId = defaultOrg ? defaultOrg.id : 'org_default';
    }

    const buffer = Buffer.from(base64Data.replace(/^data:.*?;base64,/, ''), 'base64');

    const result = await FileSecurityService.quarantineUpload({
      organizationId: targetOrgId,
      projectId: projectId || undefined,
      uploaderId: req.user.id,
      filename,
      buffer,
      folder: folder as FileFolder | undefined,
      visibility: visibility as FileVisibility | undefined,
      existingAssetId: existingAssetId || undefined,
    }, req);

    res.status(201).json({
      status: 'success',
      data: {
        fileAsset: result.fileAsset,
        version: result.version,
        scanState: result.version.scanState,
        message: 'File uploaded into secure quarantine enclave. Security scanning in progress.',
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      code: 'UPLOAD_FAILED',
      message: error.message || 'File upload rejected by security validation.',
    });
  }
});

/**
 * @route   POST /api/admin/media/:id/signed-url
 * @desc    Generate expiring signed download URL
 */
router.post('/media/:id/signed-url', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { versionId } = req.body;

    const file = await prisma.fileAsset.findUnique({
      where: { id },
      include: { versions: { orderBy: { versionNumber: 'desc' }, take: 1 } },
    });

    if (!file || file.isDeleted) {
      res.status(404).json({ status: 'error', code: 'FILE_NOT_FOUND', message: 'File asset not found.' });
      return;
    }

    const token = FileSecurityService.generateSignedDownloadToken(file.id, versionId);
    const signedUrl = `/api/v1/files/download/${token}`;

    await FileSecurityService.logFileAccess({
      fileAssetId: file.id,
      fileVersionId: versionId || file.versions[0]?.id,
      userId: req.user.id,
      action: 'VIEW',
      req,
    });

    res.status(200).json({
      status: 'success',
      data: {
        signedUrl,
        token,
        expiresInSeconds: 300,
        filename: file.filename,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/admin/media/:id
 * @desc    Soft delete file asset with audit trail
 */
router.delete('/media/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const file = await prisma.fileAsset.update({
      where: { id },
      data: { isDeleted: true },
    });

    await logAudit({
      userId: req.user.id,
      organizationId: file.organizationId,
      action: 'FILE_DELETED',
      entityType: 'FileAsset',
      entityId: file.id,
      changes: { isDeleted: true },
      req,
    });

    await FileSecurityService.logFileAccess({
      fileAssetId: file.id,
      userId: req.user.id,
      action: 'DELETE',
      req,
    });

    res.status(200).json({ status: 'success', message: 'File successfully deleted.' });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// 13. PHASE 3 AI GOVERNANCE & TELEMETRY
// ==============================================================================

/**
 * @route   GET /api/admin/ai/usage
 * @desc    Get live AI token consumption, feature distribution, and budget telemetry
 */
router.get('/ai/usage', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [recentLogs, totalUsageRaw] = await Promise.all([
      prisma.aiUsageLog.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
          organization: { select: { id: true, name: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.aiUsageLog.aggregate({
        _sum: { totalTokens: true, promptTokens: true, completionTokens: true },
        _count: { id: true },
      }),
    ]);

    const budgetPolicies = await prisma.aiBudgetPolicy.findMany({
      include: { organization: { select: { id: true, name: true } } },
    });

    res.status(200).json({
      status: 'success',
      data: {
        summary: {
          totalCalls: totalUsageRaw._count.id || 0,
          totalTokens: totalUsageRaw._sum.totalTokens || 0,
          promptTokens: totalUsageRaw._sum.promptTokens || 0,
          completionTokens: totalUsageRaw._sum.completionTokens || 0,
        },
        budgetPolicies,
        recentLogs,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/admin/ai/budget
 * @desc    Configure or update tenant AI token budget and rate limits
 */
router.post('/ai/budget', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { organizationId, monthlyTokenBudget, rateLimitPerMinute, isEnforced } = req.body;

    const policy = await prisma.aiBudgetPolicy.upsert({
      where: { organizationId: organizationId || null },
      create: {
        organizationId: organizationId || null,
        monthlyTokenBudget: Number(monthlyTokenBudget) || 500000,
        rateLimitPerMinute: Number(rateLimitPerMinute) || 60,
        isEnforced: isEnforced !== undefined ? Boolean(isEnforced) : true,
      },
      update: {
        monthlyTokenBudget: monthlyTokenBudget !== undefined ? Number(monthlyTokenBudget) : undefined,
        rateLimitPerMinute: rateLimitPerMinute !== undefined ? Number(rateLimitPerMinute) : undefined,
        isEnforced: isEnforced !== undefined ? Boolean(isEnforced) : undefined,
      },
    });

    await logAudit({
      userId: req.user.id,
      organizationId: organizationId || undefined,
      action: 'AI_BUDGET_POLICY_UPDATED',
      entityType: 'AiBudgetPolicy',
      entityId: policy.id,
      changes: { monthlyTokenBudget, rateLimitPerMinute, isEnforced },
      req,
    });

    res.status(200).json({ status: 'success', data: policy });
  } catch (error) {
    next(error);
  }
});

export default router;
