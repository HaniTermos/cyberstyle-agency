import { prisma } from './config/db';
import { MonitoringService } from './services/monitoring.service';
import { SeoService } from './services/seo.service';
import { ReportGenerationService } from './services/report-generation.service';

async function runPhase7TestSuite() {
  console.log('🧪 Starting CYBERSTYLE Phase 7 (Monitoring & OpenSEO Engine) Test Suite...\n');

  // Setup Test Organization
  const testOrg = await prisma.clientOrganization.create({
    data: {
      name: `Test Monitored Org ${Date.now()}`,
      domain: 'apex-demo-test.io',
      industry: 'FinTech Platform',
      country: 'United States',
    },
  });

  console.log(`🏢 Created Test Organization: ${testOrg.name} (${testOrg.id})\n`);

  try {
    // 1. Test Monitoring Workspace & Watch Creation
    console.log('1️⃣ Testing Monitoring Workspace & URL Watch registration...');
    const mWorkspace = await MonitoringService.getOrCreateWorkspace(testOrg.id);
    const watch = await MonitoringService.createWatch({
      workspaceId: mWorkspace.id,
      monitoredUrl: 'https://apex-demo-test.io/investor-portal',
      label: 'Investor Portal Main Gateway',
      purpose: 'client-site',
    });

    console.log('   Watch created:', { id: watch.id, url: watch.monitoredUrl, status: watch.status });
    if (watch.status !== 'ACTIVE' || !watch.id) {
      throw new Error('Monitoring watch creation failed');
    }
    console.log('   ✅ PASS: Monitoring watch registered.\n');

    // 2. Test Inbound Webhook Event Processing
    console.log('2️⃣ Testing Inbound Webhook Event Processing (changedetection.io)...');
    const changeEvent = await MonitoringService.processChangeEvent({
      watchId: watch.id,
      summary: 'Auth endpoint upgraded to MFA Token Gate',
      diff: 'Line 20: - input type="password"\nLine 20: + input type="mfa-token"',
      severity: 'medium',
    });

    if (!changeEvent || changeEvent.status !== 'NEW') {
      throw new Error('Failed to process monitoring webhook change event');
    }
    console.log('   Change event logged:', { id: changeEvent.id, severity: changeEvent.severity, status: changeEvent.status });

    // Review Change
    const reviewed = await MonitoringService.reviewChange(changeEvent.id, 'admin-user-id', 'RESOLVED', 'Verified OAuth upgrade.');
    if (reviewed.status !== 'RESOLVED') {
      throw new Error('Failed to review monitoring change');
    }
    console.log('   ✅ PASS: Change event processed and marked RESOLVED.\n');

    // 3. Test SEO Workspace, Audit & Keyword Tracking
    console.log('3️⃣ Testing SEO Workspace & Technical Audit Generation...');
    const seoWorkspace = await SeoService.getOrCreateSeoWorkspace(testOrg.id, 'apex-demo-test.io');
    const audit = await SeoService.runTechnicalAudit(seoWorkspace.id);

    console.log('   Audit Result:', {
      score: audit.score,
      findingsCount: audit.findingsCount,
      topFinding: audit.findings[0]?.title,
    });

    if (!audit.score || audit.score < 50 || audit.findings.length === 0) {
      throw new Error('SEO technical audit failed to generate valid score or findings');
    }
    console.log('   ✅ PASS: Technical SEO audit generated with structured findings.\n');

    // 4. Test Keyword Tracking & Rank Snapshots
    console.log('4️⃣ Testing Keyword Tracking & Position Captures...');
    const kw = await SeoService.addKeyword(seoWorkspace.id, 'institutional asset management portal');
    const snapshots = await SeoService.captureKeywordRanks(seoWorkspace.id);

    console.log('   Tracked Keyword:', { phrase: kw.phrase, currentRank: kw.currentRank, snapshotsCount: snapshots.length });
    if (snapshots.length === 0) {
      throw new Error('Failed to capture keyword rank snapshot');
    }
    console.log('   ✅ PASS: Keyword rank snapshot captured.\n');

    // 5. Test Monthly Retainer Report Telemetry Bundling
    console.log('5️⃣ Testing Monthly Retainer Report Bundling with Phase 7 Telemetry...');
    const report = await ReportGenerationService.generateMonthlyRollup({
      organizationId: testOrg.id,
      year: 2026,
      month: 9,
    });

    console.log('   Generated Report:', {
      title: report.title,
      status: report.status,
      period: report.period,
      monitoringSummary: report.monitoringSummary,
      seoSummary: report.seoSummary,
    });

    const monitoringData: any = report.monitoringSummary;
    const seoData: any = report.seoSummary;

    if (!monitoringData || monitoringData.totalWatches === 0) {
      throw new Error('Monitoring summary missing from monthly retainer report');
    }
    if (!seoData || !seoData.auditScore) {
      throw new Error('SEO summary missing from monthly retainer report');
    }
    console.log('   ✅ PASS: Monthly report successfully synthesized with monitoring and SEO telemetry.\n');

    console.log('🎉 ALL 5 PHASE 7 INTEGRATION TESTS PASSED WITH 100% SUCCESS!\n');
  } finally {
    // Clean up test data
    await prisma.clientOrganization.delete({ where: { id: testOrg.id } });
    console.log('🧹 Cleaned up Phase 7 test organization.\n');
  }
}

runPhase7TestSuite()
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
