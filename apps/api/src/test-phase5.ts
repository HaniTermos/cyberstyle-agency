import { prisma } from './config/db';
import { ProjectHealthService } from './services/project-health.service';
import { TaskService } from './services/task.service';
import { MilestoneDeliveryService } from './services/milestone-delivery.service';

async function runPhase5Verification() {
  console.log('====================================================');
  console.log('🚀 RUNNING PHASE 5: DELIVERY & PROJECT HEALTH TEST SUITE');
  console.log('====================================================\n');

  try {
    // 1. Get or create test organization
    let org = await prisma.clientOrganization.findFirst({
      where: { name: 'Acme Test Corp' },
    });
    if (!org) {
      org = await prisma.clientOrganization.create({
        data: {
          name: 'Acme Test Corp',
          billingAddress: '100 Silicon Ave, San Francisco, CA',
        },
      });
    }

    // 2. Get or create test admin user and test client user
    let adminUser = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' },
    });
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: 'admin_test@cyberstyle.net',
          name: 'Lead Architect',
          role: 'SUPER_ADMIN',
          passwordHash: 'argon2_dummy_hash',
        },
      });
    }

    let clientUser = await prisma.user.findFirst({
      where: { role: 'CLIENT' },
    });
    if (!clientUser) {
      clientUser = await prisma.user.create({
        data: {
          email: 'client_test@acmetest.io',
          name: 'Acme VP Eng',
          role: 'CLIENT',
          passwordHash: 'argon2_dummy_hash',
        },
      });
    }

    // Ensure client user has client profile
    let clientProfile = await prisma.clientProfile.findFirst({
      where: { userId: clientUser.id },
    });
    if (!clientProfile) {
      clientProfile = await prisma.clientProfile.create({
        data: {
          userId: clientUser.id,
          organizationId: org.id,
        },
      });
    }

    // 3. Create a test project for health scoring
    const projectSlug = `phase5-health-test-${Date.now()}`;
    const project = await prisma.project.create({
      data: {
        organizationId: org.id,
        name: 'Phase 5 Health Verification Project',
        slug: projectSlug,
        status: 'DEVELOPMENT',
        healthScore: 100,
        healthBand: 'HEALTHY',
      },
    });
    console.log(`✅ [1/5] Created Test Project: ${project.name} (${project.id})`);

    // 4. Test initial health score (should be 100 HEALTHY)
    const initialHealth = await ProjectHealthService.calculateHealth(project.id);
    console.log(`✅ [2/5] Initial Health Calculation: Score = ${initialHealth.score}, Band = ${initialHealth.band}`);
    if (initialHealth.score !== 100 || initialHealth.band !== 'HEALTHY') {
      throw new Error(`Expected initial score 100 HEALTHY, got ${initialHealth.score} ${initialHealth.band}`);
    }

    // 5. Test Tasks CRUD & Visibility Boundaries
    const clientVisibleTask = await TaskService.createTask(
      project.id,
      {
        title: 'Public Deliverable: High-Level UI Specs',
        description: 'Client visible preview of UI layout',
        status: 'TODO',
        isClientVisible: true,
      },
      adminUser
    );

    const internalTask = await TaskService.createTask(
      project.id,
      {
        title: 'Internal Ops: Rotate AWS KMS Secrets',
        description: 'Zero-trust secret rotation',
        status: 'WAITING_ON_CLIENT',
        isClientVisible: false,
      },
      adminUser
    );

    // List tasks as Client vs Admin
    const clientViewTasks = await TaskService.listTasks(project.id, 'CLIENT');
    const adminViewTasks = await TaskService.listTasks(project.id, 'SUPER_ADMIN');

    console.log(`✅ [3/5] Task Boundary Validation:`);
    console.log(`   - Client View Task Count (only isClientVisible: true): ${clientViewTasks.length}`);
    console.log(`   - Admin View Task Count (all tasks): ${adminViewTasks.length}`);

    const hasClientVisibleInClientView = clientViewTasks.some((t) => t.id === clientVisibleTask.id);
    const hasInternalInClientView = clientViewTasks.some((t) => t.id === internalTask.id);
    if (!hasClientVisibleInClientView) {
      throw new Error('FAILED: Client-visible task missing from client view');
    }
    if (hasInternalInClientView) {
      throw new Error('SECURITY VIOLATION: Internal task was exposed in client view!');
    }
    console.log(`   - Zero-Trust Task Visibility Filter: PASSED`);

    // 6. Test Milestone Approval Workflow
    const milestone = await prisma.milestone.create({
      data: {
        projectId: project.id,
        title: 'Milestone 1: Core Architecture Sign-Off',
        amount: 15000,
        orderIndex: 1,
        status: 'IN_PROGRESS',
      },
    });

    // Request Approval
    const pendingMilestone = await MilestoneDeliveryService.requestApproval(
      milestone.id,
      adminUser
    );
    console.log(`✅ [4/5] Milestone Approval Requested: Status = ${pendingMilestone.status}, RequestedAt = ${pendingMilestone.requestedApprovalAt}`);
    if (pendingMilestone.status !== 'PENDING_APPROVAL') {
      throw new Error('Expected status PENDING_APPROVAL');
    }

    // Client Approves Milestone
    const approvedMilestone = await MilestoneDeliveryService.approveMilestone(
      milestone.id,
      clientUser
    );
    console.log(`   - Milestone Approved: Status = ${approvedMilestone.status}, ApprovedAt = ${approvedMilestone.approvedAt}`);
    if (approvedMilestone.status !== 'COMPLETED') {
      throw new Error('Expected status COMPLETED after approval');
    }

    // 7. Test Health Recalculation & Deductions
    // Add an overdue invoice
    const overdueInvoice = await prisma.invoice.create({
      data: {
        organizationId: org.id,
        projectId: project.id,
        invoiceNumber: `CS-INV-OVERDUE-${Date.now()}`,
        status: 'OVERDUE',
        subtotal: 5000,
        taxAmount: 0,
        totalAmount: 5000,
        amountDue: 5000,
        currency: 'USD',
        issueDate: new Date(Date.now() - 15 * 86400000),
        dueDate: new Date(Date.now() - 5 * 86400000),
      },
    });

    const updatedHealth = await ProjectHealthService.recalculateProjectHealth(project.id);
    console.log(`✅ [5/5] Recalculated Health with Overdue Invoice Penalty: Score = ${updatedHealth.score}, Band = ${updatedHealth.band}`);
    console.log(`   - Active Factors:`, JSON.stringify(updatedHealth.factors, null, 2));

    if (updatedHealth.score >= 100) {
      throw new Error('Expected score deduction for overdue invoice');
    }

    // Check ProjectHealthLog
    const healthLogs = await prisma.projectHealthLog.findMany({
      where: { projectId: project.id },
    });
    console.log(`   - Health Log Entries Saved: ${healthLogs.length}`);

    // Clean up test data
    await prisma.invoice.delete({ where: { id: overdueInvoice.id } });
    await prisma.task.deleteMany({ where: { projectId: project.id } });
    await prisma.milestone.deleteMany({ where: { projectId: project.id } });
    await prisma.projectHealthLog.deleteMany({ where: { projectId: project.id } });
    await prisma.project.delete({ where: { id: project.id } });

    console.log('\n====================================================');
    console.log('🎉 ALL PHASE 5 HEALTH & DELIVERY CHECKS PASSED WITH 100% SUCCESS!');
    console.log('====================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ PHASE 5 TEST FAILED:', error);
    process.exit(1);
  }
}

runPhase5Verification();
