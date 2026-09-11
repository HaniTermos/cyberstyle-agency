import { prisma } from '../config/db';
import { logAudit } from '../utils/auditLogger';
import { ProjectHealthBand, ProjectStatus, TaskStatus, InvoiceStatus, MilestoneStatus } from '@prisma/client';

export interface HealthDeductionFactor {
  factor: string;
  deduction: number;
  reason: string;
  entityId?: string;
  metadata?: Record<string, any>;
}

export interface ProjectHealthResult {
  projectId: string;
  score: number;
  band: ProjectHealthBand;
  factors: HealthDeductionFactor[];
}

/**
 * Project Health Score Engine
 *
 * Recalculation Strategy:
 * - Automatic triggers on: Invoice status changes, Milestone approvals/status, Task transitions (WAITING_ON_CLIENT), and Project thread messages.
 * - Deterministic formula: Base score 100 minus specific penalty factors.
 * - Score Bands: HEALTHY (80-100), AT_RISK (50-79), CRITICAL (0-49).
 * - Log Retention: Writes to ProjectHealthLog ONLY when score or band changes.
 */
export class ProjectHealthService {
  /**
   * Calculates the current health score and active penalty factors for a project.
   */
  static async calculateHealth(projectId: string): Promise<ProjectHealthResult> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        milestones: true,
        tasks: true,
        invoices: true,
        organization: {
          include: {
            retainers: true,
          },
        },
      },
    });

    if (!project) {
      throw new Error(`Project with ID ${projectId} not found.`);
    }

    const factors: HealthDeductionFactor[] = [];
    const now = new Date();

    // Factor 1: Overdue Invoices (-20 pts)
    const overdueInvoices = project.invoices.filter((inv) => {
      return inv.status === InvoiceStatus.OVERDUE || (inv.status === InvoiceStatus.SENT && inv.dueDate && inv.dueDate < now);
    });

    for (const inv of overdueInvoices) {
      factors.push({
        factor: 'OVERDUE_INVOICE',
        deduction: 20,
        reason: `Overdue invoice #${inv.invoiceNumber || inv.id} ($${Number(inv.totalAmount).toLocaleString()})`,
        entityId: inv.id,
      });
    }

    // Factor 2: Milestone Overdue by > 7 Days (-15 pts)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const overdueMilestones = project.milestones.filter((m) => {
      return (
        m.status !== MilestoneStatus.COMPLETED &&
        m.dueDate &&
        new Date(m.dueDate) < sevenDaysAgo
      );
    });

    for (const m of overdueMilestones) {
      const daysOverdue = Math.floor((now.getTime() - new Date(m.dueDate!).getTime()) / (24 * 60 * 60 * 1000));
      factors.push({
        factor: 'MILESTONE_OVERDUE',
        deduction: 15,
        reason: `Milestone "${m.title}" is ${daysOverdue} days overdue`,
        entityId: m.id,
      });
    }

    // Factor 3: Blocked on Client > 5 Days (-5 pts)
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const blockedTasks = project.tasks.filter((t) => {
      return t.status === TaskStatus.WAITING_ON_CLIENT && new Date(t.updatedAt) < fiveDaysAgo;
    });

    for (const t of blockedTasks) {
      factors.push({
        factor: 'BLOCKED_ON_CLIENT',
        deduction: 5,
        reason: `Task "${t.title}" has been waiting on client action for > 5 days`,
        entityId: t.id,
      });
    }

    // Factor 4: Unanswered Client Thread Message > 48 Hours (-10 pts)
    const projectThread = await prisma.messageThread.findFirst({
      where: {
        organizationId: project.organizationId,
        contextType: 'PROJECT',
        contextId: project.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { sender: { select: { role: true, name: true, email: true } } },
        },
      },
    });

    if (projectThread && projectThread.messages && projectThread.messages.length > 0) {
      const lastMsg = projectThread.messages[0];
      const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

      if (
        lastMsg &&
        lastMsg.sender.role === 'CLIENT' &&
        new Date(lastMsg.createdAt) < fortyEightHoursAgo
      ) {
        factors.push({
          factor: 'UNANSWERED_CLIENT_MSG',
          deduction: 10,
          reason: `Client message in project channel has been awaiting response for > 48 hours`,
          entityId: projectThread.id,
        });
      }
    }

    // Factor 5: Inactive Retainer Project > 30 Days (-5 pts)
    const activeRetainer = project.organization.retainers?.find((r) => r.status === 'ACTIVE');
    if (activeRetainer) {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const isRecentlyActive =
        new Date(project.updatedAt) > thirtyDaysAgo ||
        project.tasks.some((t) => new Date(t.updatedAt) > thirtyDaysAgo);

      if (!isRecentlyActive) {
        factors.push({
          factor: 'RETAINER_INACTIVITY',
          deduction: 5,
          reason: `Retainer is active but no tasks or project activity logged in > 30 days`,
          entityId: activeRetainer.id,
        });
      }
    }

    // Compute final score
    const totalDeductions = factors.reduce((sum, f) => sum + f.deduction, 0);
    const score = Math.max(0, Math.min(100, 100 - totalDeductions));

    let band: ProjectHealthBand = ProjectHealthBand.HEALTHY;
    if (score < 50) {
      band = ProjectHealthBand.CRITICAL;
    } else if (score < 80) {
      band = ProjectHealthBand.AT_RISK;
    }

    return {
      projectId,
      score,
      band,
      factors,
    };
  }

  /**
   * Recalculates and persists project health, appending a log entry if score or band changes.
   */
  static async recalculateProjectHealth(projectId: string, req?: any): Promise<ProjectHealthResult> {
    const prevProject = await prisma.project.findUnique({
      where: { id: projectId },
      select: { healthScore: true, healthBand: true, healthFactors: true },
    });

    const result = await this.calculateHealth(projectId);

    // Update project record
    await prisma.project.update({
      where: { id: projectId },
      data: {
        healthScore: result.score,
        healthBand: result.band,
        healthFactors: result.factors as any,
      },
    });

    const scoreChanged = prevProject?.healthScore !== result.score;
    const bandChanged = prevProject?.healthBand !== result.band;

    // Log history snapshot only when score or band changes to prevent database explosion
    if (scoreChanged || bandChanged) {
      await prisma.projectHealthLog.create({
        data: {
          projectId,
          score: result.score,
          band: result.band,
          factors: result.factors as any,
        },
      });

      // Audit Log when band changes or threshold is crossed (80 or 50)
      if (bandChanged || (prevProject && prevProject.healthScore >= 80 && result.score < 80) || (prevProject && prevProject.healthScore >= 50 && result.score < 50)) {
        await logAudit({
          action: 'PROJECT_HEALTH_RECALCULATED',
          entityType: 'Project',
          entityId: projectId,
          changes: {
            previousScore: prevProject?.healthScore,
            newScore: result.score,
            previousBand: prevProject?.healthBand,
            newBand: result.band,
            factorsCount: result.factors.length,
          },
          req,
        });
      }
    }

    return result;
  }

  /**
   * Nightly batch recalculator for all active/on-hold projects.
   */
  static async recalculateAllActiveProjects(): Promise<{ processed: number; errors: number }> {
    const activeProjects = await prisma.project.findMany({
      where: {
        status: {
          in: [ProjectStatus.DEVELOPMENT, ProjectStatus.DISCOVERY, ProjectStatus.DESIGN, ProjectStatus.REVIEW, ProjectStatus.ON_HOLD],
        },
      },
      select: { id: true },
    });

    let processed = 0;
    let errors = 0;

    for (const p of activeProjects) {
      try {
        await this.recalculateProjectHealth(p.id);
        processed++;
      } catch (err) {
        console.error(`Failed to calculate health for project ${p.id}:`, err);
        errors++;
      }
    }

    return { processed, errors };
  }
}
