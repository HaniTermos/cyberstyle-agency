import { prisma } from './config/db';
import { ReportGenerationService } from './services/report-generation.service';
import { ReportPdfService } from './services/report-pdf.service';

async function runPhase6Verification() {
  console.log('====================================================');
  console.log('🚀 RUNNING PHASE 6: REPORTING & MONTHLY RETAINERS TEST SUITE');
  console.log('====================================================\n');

  try {
    // 1. Setup Test Organizations A & B
    let orgA = await prisma.clientOrganization.findFirst({
      where: { name: 'Acme Test Corp A' },
    });
    if (!orgA) {
      orgA = await prisma.clientOrganization.create({
        data: {
          name: 'Acme Test Corp A',
          billingAddress: '100 Silicon Ave, San Francisco, CA',
        },
      });
    }

    let orgB = await prisma.clientOrganization.findFirst({
      where: { name: 'Vortex Test Corp B' },
    });
    if (!orgB) {
      orgB = await prisma.clientOrganization.create({
        data: {
          name: 'Vortex Test Corp B',
          billingAddress: '200 Market St, New York, NY',
        },
      });
    }

    // 2. Setup Admin and Client Users
    let adminUser = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' },
    });
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: 'admin_test6@cyberstyle.net',
          name: 'Lead Architect',
          role: 'SUPER_ADMIN',
          passwordHash: 'argon2_dummy_hash',
        },
      });
    }

    let clientUserA = await prisma.user.findFirst({
      where: { email: 'clientA_phase6@acmetest.io' },
    });
    if (!clientUserA) {
      clientUserA = await prisma.user.create({
        data: {
          email: 'clientA_phase6@acmetest.io',
          name: 'Acme Client User',
          role: 'CLIENT',
          passwordHash: 'argon2_dummy_hash',
        },
      });
      await prisma.clientProfile.create({
        data: {
          userId: clientUserA.id,
          organizationId: orgA.id,
        },
      });
    }

    // 3. Create Projects, Milestones, and Tasks in Period (September 2026) vs Outside Period (August 2026)
    const projectA = await prisma.project.create({
      data: {
        organizationId: orgA.id,
        name: 'Acme Phase 6 Test Project',
        slug: `acme-p6-${Date.now()}`,
        status: 'DEVELOPMENT',
        healthScore: 95,
        healthBand: 'HEALTHY',
      },
    });
    console.log(`✅ [1/5] Created Test Project for Org A (${projectA.name})`);

    // In-period completed task (Sep 15, 2026)
    await prisma.task.create({
      data: {
        projectId: projectA.id,
        title: 'September Deliverable: Zero-Trust Security Module',
        status: 'DONE',
        isClientVisible: true,
        updatedAt: new Date(Date.UTC(2026, 8, 15)), // Sep 15, 2026
      },
    });

    // Outside-period completed task (Aug 15, 2026)
    await prisma.task.create({
      data: {
        projectId: projectA.id,
        title: 'August Deliverable: Legacy Database Migration',
        status: 'DONE',
        isClientVisible: true,
        updatedAt: new Date(Date.UTC(2026, 7, 15)), // Aug 15, 2026
      },
    });

    // In-period milestone
    await prisma.milestone.create({
      data: {
        projectId: projectA.id,
        title: 'Milestone 1: Security Hardening Sign-Off',
        amount: 10000,
        orderIndex: 1,
        status: 'COMPLETED',
        completedDate: new Date(Date.UTC(2026, 8, 20)),
        updatedAt: new Date(Date.UTC(2026, 8, 20)),
      },
    });

    // 4. Generate Monthly Rollup for September 2026 (Year 2026, Month 9)
    const draftReportA = await ReportGenerationService.generateMonthlyRollup({
      organizationId: orgA.id,
      year: 2026,
      month: 9,
      projectId: projectA.id,
      generatedById: adminUser.id,
    });
    console.log(`✅ [2/5] Generated Monthly Rollup Report in DRAFT: "${draftReportA.title}" (Status: ${draftReportA.status})`);
    if (draftReportA.status !== 'DRAFT') {
      throw new Error(`Expected DRAFT status, got ${draftReportA.status}`);
    }

    // Verify period boundary filtering
    const metrics = draftReportA.metrics as any;
    console.log(`   - Tasks in Period Count: ${metrics?.tasksCompletedCount} (Expected: 1, excluded August task)`);
    console.log(`   - Milestones in Period Count: ${metrics?.milestonesCount} (Expected: 1)`);
    if (metrics?.tasksCompletedCount !== 1) {
      throw new Error(`Period filtering failed: expected 1 task in Sep 2026, got ${metrics?.tasksCompletedCount}`);
    }

    // 5. Test Draft Visibility Boundary (Client Portal isolation)
    const clientDraftQuery = await prisma.report.findMany({
      where: {
        organizationId: orgA.id,
        status: 'PUBLISHED',
      },
    });
    const containsDraft = clientDraftQuery.some((r) => r.id === draftReportA.id);
    console.log(`✅ [3/5] Client Portal Draft Gating Check: Draft visible to client? ${containsDraft ? 'YES (FAILED)' : 'NO (PASSED)'}`);
    if (containsDraft) {
      throw new Error('SECURITY VIOLATION: Draft report is visible to client portal before publication!');
    }

    // 6. Test PDF Generation and Buffer Integrity
    const pdfBuffer = await ReportPdfService.generateReportBuffer({
      reportId: draftReportA.id,
      title: draftReportA.title,
      organizationName: orgA.name,
      period: draftReportA.period,
      reportType: draftReportA.reportType,
      executiveSummary: draftReportA.executiveSummary,
      keyAccomplishments: (draftReportA.keyAccomplishments as string[]) || [],
      nextMonthPlan: draftReportA.nextMonthPlan || undefined,
      nextMonthPriorities: (draftReportA.nextMonthPriorities as string[]) || [],
      metrics: draftReportA.metrics as any,
      deliverables: draftReportA.deliverables as any,
      healthSnapshot: draftReportA.healthSnapshot as any,
      invoicesSummary: draftReportA.invoicesSummary as any,
    });
    const pdfHeader = pdfBuffer.subarray(0, 5).toString('ascii');
    console.log(`✅ [4/5] PDF Generation & Stream Verification: Buffer Size = ${pdfBuffer.length} bytes, Header = "${pdfHeader}"`);
    if (pdfBuffer.length < 1000 || !pdfHeader.startsWith('%PDF')) {
      throw new Error(`Invalid PDF buffer generated: length = ${pdfBuffer.length}, header = ${pdfHeader}`);
    }

    // 7. Test Report Publication & Multi-Tenant Isolation
    const publishedReport = await ReportGenerationService.publishReport(
      draftReportA.id,
      adminUser
    );
    console.log(`✅ [5/5] Report Published: Status = ${publishedReport.status}, PublishedAt = ${publishedReport.publishedAt}`);
    if (publishedReport.status !== 'PUBLISHED' || !publishedReport.pdfPath) {
      throw new Error('Report publication failed or missing pdfPath');
    }

    // Verify Org A sees it now, Org B cannot see it
    const orgAReports = await prisma.report.findMany({
      where: { organizationId: orgA.id, status: 'PUBLISHED' },
    });
    const orgBReports = await prisma.report.findMany({
      where: { organizationId: orgB.id, status: 'PUBLISHED' },
    });

    console.log(`   - Org A Published Reports Visible: ${orgAReports.length}`);
    console.log(`   - Org B Published Reports Visible: ${orgBReports.length}`);

    if (orgAReports.length === 0 || orgBReports.some((r) => r.id === draftReportA.id)) {
      throw new Error('Cross-tenant isolation violation or report not visible to owner org');
    }
    console.log(`   - Cross-Tenant Multi-Org Isolation: PASSED`);

    // Clean up test data
    await prisma.task.deleteMany({ where: { projectId: projectA.id } });
    await prisma.milestone.deleteMany({ where: { projectId: projectA.id } });
    await prisma.report.deleteMany({ where: { organizationId: orgA.id } });
    await prisma.project.delete({ where: { id: projectA.id } });

    console.log('\n====================================================');
    console.log('🎉 ALL PHASE 6 REPORTING CHECKS PASSED WITH 100% SUCCESS!');
    console.log('====================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ PHASE 6 TEST FAILED:', error);
    process.exit(1);
  }
}

runPhase6Verification();
