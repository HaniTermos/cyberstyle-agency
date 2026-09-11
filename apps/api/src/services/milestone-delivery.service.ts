import { prisma } from '../config/db';
import { logAudit } from '../utils/auditLogger';
import { emailQueue } from '../queues/email.queue';
import { MilestoneStatus, MilestonePaymentStatus, MessageType } from '@prisma/client';
import { ProjectHealthService } from './project-health.service';

export class MilestoneDeliveryService {
  /**
   * Request client sign-off and approval on a milestone.
   */
  static async requestApproval(milestoneId: string, adminUser: any, req?: any) {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        project: {
          include: {
            organization: {
              include: {
                members: {
                  include: {
                    user: { select: { id: true, email: true, name: true, role: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!milestone) throw new Error('Milestone not found');

    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: MilestoneStatus.PENDING_APPROVAL,
        requestedApprovalAt: new Date(),
      },
    });

    // 1. Post System Card in Project Thread if exists
    const projectThread = await prisma.messageThread.findFirst({
      where: {
        organizationId: milestone.project.organizationId,
        contextType: 'PROJECT',
        contextId: milestone.projectId,
      },
    });

    if (projectThread) {
      await prisma.message.create({
        data: {
          threadId: projectThread.id,
          senderId: adminUser.id,
          content: `🚀 Milestone Ready for Review & Sign-Off: "${milestone.title}" (${milestone.amount ? `$${Number(milestone.amount).toLocaleString()}` : 'Deliverable Complete'}). Please review the staging build and confirm acceptance.`,
          messageType: MessageType.SYSTEM,
          isInternal: false,
        },
      });

      await prisma.messageThread.update({
        where: { id: projectThread.id },
        data: { lastMessageAt: new Date() },
      });
    }

    // 2. Dispatch Notifications and Email to client stakeholders
    const clientMembers = milestone.project.organization.members.filter(
      (m) => m.user.role === 'CLIENT'
    );

    for (const member of clientMembers) {
      // In-app notification
      await prisma.notification.create({
        data: {
          userId: member.user.id,
          title: `Milestone Sign-Off Requested: ${milestone.title}`,
          message: `The team has marked milestone "${milestone.title}" as ready for your acceptance review.`,
          type: 'SYSTEM',
          linkUrl: `/portal/projects/${milestone.projectId}`,
        },
      }).catch(() => {});

      // Email notification
      try {
        await emailQueue.add('milestone-approval-request', {
          to: member.user.email,
          subject: `Milestone Sign-Off Requested: ${milestone.title} – CYBERSTYLE`,
          template: 'milestone_approval_request',
          variables: {
            milestoneTitle: milestone.title,
            projectName: milestone.project.name,
            amount: milestone.amount ? `$${Number(milestone.amount).toLocaleString()}` : '',
            deepLink: `http://localhost:3000/portal/projects/${milestone.projectId}`,
          },
        });
      } catch {
        // Fallback for local dev
      }
    }

    // 3. Audit Log
    await logAudit({
      userId: adminUser.id,
      action: 'MILESTONE_APPROVAL_REQUESTED',
      entityType: 'Milestone',
      entityId: milestoneId,
      changes: {
        projectId: milestone.projectId,
        milestoneTitle: milestone.title,
        amount: milestone.amount,
      },
      req,
    });

    // 4. Recalculate Project Health
    await ProjectHealthService.recalculateProjectHealth(milestone.projectId, req);

    return updatedMilestone;
  }

  /**
   * Client signs off and approves milestone in portal.
   */
  static async approveMilestone(milestoneId: string, clientUser: any, req?: any) {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        project: {
          include: { organization: true },
        },
      },
    });

    if (!milestone) throw new Error('Milestone not found');

    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: MilestoneStatus.COMPLETED,
        completedDate: new Date(),
        approvedAt: new Date(),
        approvedById: clientUser.id,
        paymentStatus: milestone.invoiceId ? MilestonePaymentStatus.PARTIALLY_PAID : MilestonePaymentStatus.PAID,
      },
    });

    // 1. Post Confirmation Card in Project Thread
    const projectThread = await prisma.messageThread.findFirst({
      where: {
        organizationId: milestone.project.organizationId,
        contextType: 'PROJECT',
        contextId: milestone.projectId,
      },
    });

    if (projectThread) {
      await prisma.message.create({
        data: {
          threadId: projectThread.id,
          senderId: clientUser.id,
          content: `✅ Milestone Approved & Accepted: "${milestone.title}" was approved by ${clientUser.name || clientUser.email}. Escrow releases and next sprint phase are now unlocked.`,
          messageType: MessageType.SYSTEM,
          isInternal: false,
        },
      });

      await prisma.messageThread.update({
        where: { id: projectThread.id },
        data: { lastMessageAt: new Date() },
      });
    }

    // 2. Audit Log
    await logAudit({
      userId: clientUser.id,
      action: 'MILESTONE_APPROVED',
      entityType: 'Milestone',
      entityId: milestoneId,
      changes: {
        projectId: milestone.projectId,
        milestoneTitle: milestone.title,
        approvedAt: updatedMilestone.approvedAt,
        approvedById: clientUser.id,
      },
      req,
    });

    // 3. Recalculate Project Health
    await ProjectHealthService.recalculateProjectHealth(milestone.projectId, req);

    return updatedMilestone;
  }
}
