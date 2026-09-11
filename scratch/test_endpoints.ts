import { AnalyticsService } from '../apps/api/src/services/analytics.service';
import { EmailService } from '../apps/api/src/services/email.service';
import { prisma } from '../apps/api/src/config/db';

async function runDiagnostics() {
  console.log('🧪 Starting CyberStyle System Diagnostics...');

  // 1. Analytics Service
  console.log('\n--- 1. Testing AnalyticsService ---');
  const overview = await AnalyticsService.getOverview(30);
  console.log('✅ Overview Stats:', {
    sessions: overview.metrics.sessions,
    users: overview.metrics.users,
    pageviews: overview.metrics.pageviews,
    bounceRate: overview.metrics.bounceRate,
    trafficSourcesCount: overview.trafficSources.length,
    conversions: overview.conversions.totalConversions,
  });

  const topPages = await AnalyticsService.getTopPages(30);
  console.log('✅ Top Pages:', topPages.length);

  const searchPerf = await AnalyticsService.getSearchPerformance(30);
  console.log('✅ Search Console Performance:', {
    clicks: searchPerf.totals.clicks,
    impressions: searchPerf.totals.impressions,
    ctr: searchPerf.totals.avgCtr,
    topQueriesCount: searchPerf.queries.length,
  });

  // 2. Email Service
  console.log('\n--- 2. Testing EmailService ---');
  const transportMode = EmailService.getTransportMode();
  console.log('✅ Transport Mode:', transportMode);

  const threads = await EmailService.listThreads();
  console.log('✅ Email Threads in DB:', threads.length);

  const logs = EmailService.getLogs();
  console.log('✅ Logged Emails:', logs.length);

  // 3. GEO Queries
  console.log('\n--- 3. Testing GEO Queries in DB ---');
  const geoQueries = await prisma.geoQuery.findMany();
  console.log('✅ Geo Queries Seeded/Present:', geoQueries.length);
  if (geoQueries.length > 0) {
    console.log('Sample Query:', {
      query: geoQueries[0].query,
      rankScore: geoQueries[0].rankScore,
      appearsInChatGPT: geoQueries[0].appearsInChatGPT,
      appearsInPerplexity: geoQueries[0].appearsInPerplexity,
    });
  }

  console.log('\n🎉 ALL SYSTEM CHECKS PASSED PERFECTLY!');
  process.exit(0);
}

runDiagnostics().catch((err) => {
  console.error('❌ Diagnostics failed:', err);
  process.exit(1);
});
