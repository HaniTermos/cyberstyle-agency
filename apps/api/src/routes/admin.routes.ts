import { Router, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';
import { logAudit } from '../utils/auditLogger';
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

const router = Router();

// Guard all admin routes with SUPER_ADMIN / ADMIN roles
router.use(requireAuth);
router.use(requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]));

// ==============================================================================
// 1. EXECUTIVE DASHBOARD & TELEMETRY
// ==============================================================================

router.get('/dashboard', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [
      newLeadsCount,
      allLeads,
      activeProjects,
      invoices,
      retainers,
      pendingReviewsCount,
      unreadContactsCount,
      recentAuditLogs,
      todos,
      roadmapItems,
    ] = await Promise.all([
      prisma.lead.count({ where: { stage: LeadStage.NEW } }),
      prisma.lead.findMany({ orderBy: { createdAt: 'desc' } }),
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
          organization: true,
          milestones: { orderBy: { orderIndex: 'asc' } },
        },
      }),
      prisma.invoice.findMany({
        orderBy: { createdAt: 'desc' },
        include: { organization: true },
      }),
      prisma.retainer.findMany({
        where: { status: RetainerStatus.ACTIVE },
      }),
      prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
      prisma.contactSubmission.count({ where: { status: ContactStatus.UNREAD } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.todo.findMany({
        where: { userId: req.user.id },
        orderBy: [{ isCompleted: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.roadmapItem.findMany({
        orderBy: { orderIndex: 'asc' },
      }),
    ]);

    // Financial & Pipeline KPI Calculations
    const wonLeads = allLeads.filter((l) => l.stage === LeadStage.WON);
    const qualifiedLeads = allLeads.filter(
      (l) => l.stage !== LeadStage.NEW && l.stage !== LeadStage.ARCHIVED
    );
    const conversionRate =
      qualifiedLeads.length > 0
        ? Math.round((wonLeads.length / qualifiedLeads.length) * 100)
        : 0;

    const totalPipelineValue = allLeads.reduce(
      (acc, l) => acc + (l.estimatedValue ? Number(l.estimatedValue) : 0),
      0
    );

    const paidInvoicesTotal = invoices
      .filter((i) => i.status === InvoiceStatus.PAID)
      .reduce((acc, i) => acc + Number(i.totalAmount), 0);

    const outstandingInvoicesTotal = invoices
      .filter((i) => i.status === InvoiceStatus.SENT || i.status === InvoiceStatus.DRAFT)
      .reduce((acc, i) => acc + Number(i.amountDue), 0);

    const overdueInvoices = invoices.filter((i) => i.status === InvoiceStatus.OVERDUE);
    const overdueInvoicesTotal = overdueInvoices.reduce(
      (acc, i) => acc + Number(i.amountDue),
      0
    );

    const totalMRR = retainers.reduce((acc, r) => acc + Number(r.amount), 0);

    // Milestones due this week
    const now = new Date();
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const milestonesDueThisWeek = await prisma.milestone.count({
      where: {
        status: { in: [MilestoneStatus.NOT_STARTED, MilestoneStatus.IN_PROGRESS] },
        dueDate: { gte: now, lte: nextWeek },
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        kpis: {
          newLeadsCount,
          totalLeadsCount: allLeads.length,
          activeProjectsCount: activeProjects.length,
          milestonesDueThisWeek,
          totalPipelineValue,
          paidInvoicesTotal,
          outstandingInvoicesTotal,
          overdueInvoicesTotal,
          totalMRR,
          conversionRate,
          pendingReviewsCount,
          unreadContactsCount,
        },
        pipeline: {
          countsByStage: {
            NEW: allLeads.filter((l) => l.stage === LeadStage.NEW).length,
            CONTACTED: allLeads.filter((l) => l.stage === LeadStage.CONTACTED).length,
            QUALIFIED: allLeads.filter((l) => l.stage === LeadStage.QUALIFIED).length,
            PROPOSAL: allLeads.filter((l) => l.stage === LeadStage.PROPOSAL).length,
            WON: wonLeads.length,
            LOST: allLeads.filter((l) => l.stage === LeadStage.LOST).length,
            ARCHIVED: allLeads.filter((l) => l.stage === LeadStage.ARCHIVED).length,
          },
          recentLeads: allLeads.slice(0, 5),
        },
        activeProjects,
        invoices: invoices.slice(0, 5),
        overdueInvoices,
        recentAuditLogs,
        todos,
        roadmapItems,
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
    const { clientName, clientTitle, clientCompany, companyName, rating, quote, isFeatured, status, projectId } = req.body;

    const review = await prisma.review.create({
      data: {
        clientName,
        clientTitle,
        companyName: companyName || clientCompany || null,
        projectId: projectId || null,
        rating: Number(rating || 5),
        quote,
        isFeatured: Boolean(isFeatured),
        status: status || ReviewStatus.APPROVED,
        approvedAt: status === ReviewStatus.APPROVED ? new Date() : null,
      },
    });

    res.status(201).json({ status: 'success', data: { review } });
  } catch (error) {
    next(error);
  }
});

router.patch('/reviews/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, isFeatured, quote, rating, clientName, clientCompany, companyName } = req.body;

    const review = await prisma.review.update({
      where: { id },
      data: {
        ...(status ? { status, approvedAt: status === ReviewStatus.APPROVED ? new Date() : null } : {}),
        ...(isFeatured !== undefined ? { isFeatured } : {}),
        ...(quote !== undefined ? { quote } : {}),
        ...(rating !== undefined ? { rating: Number(rating) } : {}),
        ...(clientName ? { clientName } : {}),
        ...(companyName !== undefined ? { companyName } : clientCompany !== undefined ? { companyName: clientCompany } : {}),
      },
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

router.get('/users', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: [UserRole.SUPER_ADMIN, UserRole.ADMIN] } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        twoFactorEnabled: true,
        createdAt: true,
        adminProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ status: 'success', data: { users } });
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

export default router;
