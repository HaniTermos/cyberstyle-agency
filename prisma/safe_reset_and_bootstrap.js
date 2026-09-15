const { PrismaClient, UserRole, UserStatus } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function hashPassword(password) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

async function main() {
  console.log('🔄 Starting CYBERSTYLE safe database purge (Category A)...');

  // Verify we are preserving FAQs and Case Studies (including user case studies like 'hani')
  const initialFaqCount = await prisma.fAQ.count();
  const initialCaseStudyCount = await prisma.caseStudy.count();
  console.log(`ℹ️ Preserving all ${initialFaqCount} FAQs in database.`);
  console.log(`ℹ️ Preserving all ${initialCaseStudyCount} Case Studies in database (including 'hani').`);

  // 1. Delete dependent financial and billing records
  console.log('🗑️ Purging demo payments and invoices...');
  await prisma.payment.deleteMany({});
  await prisma.invoiceLineItem.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.retainer.deleteMany({});

  // 2. Delete project and milestone records
  console.log('🗑️ Purging demo tasks, deliverables, milestones, and projects...');
  await prisma.task.deleteMany({});
  await prisma.deliverable.deleteMany({});
  await prisma.projectHealthLog.deleteMany({});
  await prisma.projectUpdate.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.milestone.deleteMany({});
  await prisma.project.deleteMany({});

  // 3. Delete proposals
  console.log('🗑️ Purging demo proposals...');
  await prisma.proposal.deleteMany({});

  // 4. Delete leads and contacts
  console.log('🗑️ Purging demo leads and contacts...');
  await prisma.lead.deleteMany({});
  await prisma.contactSubmission.deleteMany({});

  // 5. Delete reviews, blog posts, and file records
  console.log('🗑️ Purging demo reviews, blog posts, and file records...');
  await prisma.review.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.fileAccessLog.deleteMany({});
  await prisma.fileVersion.deleteMany({});
  await prisma.fileAsset.deleteMany({});

  // 6. Delete messaging and feedback
  console.log('🗑️ Purging demo messages and feedback...');
  await prisma.message.deleteMany({});
  await prisma.messageParticipant.deleteMany({});
  await prisma.messageThread.deleteMany({});
  await prisma.feedbackComment.deleteMany({});
  await prisma.feedbackRequest.deleteMany({});

  // 7. Delete telemetry and SEO
  console.log('🗑️ Purging demo SEO findings, keywords, and geo queries...');
  await prisma.seoFinding.deleteMany({});
  await prisma.seoAudit.deleteMany({});
  await prisma.keywordSnapshot.deleteMany({});
  await prisma.keyword.deleteMany({});
  await prisma.seoReport.deleteMany({});
  await prisma.seoWorkspace.deleteMany({});
  await prisma.geoObservation.deleteMany({});
  await prisma.geoQuery.deleteMany({});

  // 8. Delete audit logs, notifications, and email logs
  console.log('🗑️ Purging logs and notifications...');
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.emailDeliveryEvent.deleteMany({});
  await prisma.emailMessage.deleteMany({});
  await prisma.emailThread.deleteMany({});
  await prisma.emailAccount.deleteMany({});
  await prisma.emailLog.deleteMany({});
  await prisma.emailTemplate.deleteMany({});
  await prisma.emailSuppression.deleteMany({});
  await prisma.aiUsageLog.deleteMany({});

  // 9. Delete sessions, accounts, and demo client organizations
  console.log('🗑️ Purging demo sessions, memberships, and client organizations...');
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.clientProfile.deleteMany({});
  await prisma.adminProfile.deleteMany({});
  await prisma.organizationMembership.deleteMany({});
  await prisma.clientOrganization.deleteMany({});

  // 10. Delete old demo users (e.g. admin@cyberstyle.net, client@apexcapital.com)
  console.log('🗑️ Purging demo user accounts...');
  await prisma.user.deleteMany({});

  // 11. Bootstrap single real administrator: Hani
  console.log('👑 Bootstrapping real administrator: hani.sites@gmail.com...');
  const haniPasswordPlain = process.env.ADMIN_INITIAL_PASSWORD || 'AdminHani2026!#Secure';
  const haniPasswordHash = await hashPassword(haniPasswordPlain);

  const haniAdmin = await prisma.user.create({
    data: {
      email: 'hani.sites@gmail.com',
      name: 'Hani',
      passwordHash: haniPasswordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      adminProfile: {
        create: {
          department: 'Executive Leadership',
          permissions: ['*'],
        },
      },
    },
  });

  const finalFaqCount = await prisma.fAQ.count();
  const finalCaseStudyCount = await prisma.caseStudy.count();
  const finalUserCount = await prisma.user.count();

  console.log('\n============================================================');
  console.log('🎉 SAFE RESET & BOOTSTRAP COMPLETE');
  console.log('============================================================');
  console.log(`✅ Administrator created: ${haniAdmin.email} (${haniAdmin.name})`);
  console.log(`🔑 Initial Password: ${haniPasswordPlain}`);
  console.log(`🛡️ Role: ${haniAdmin.role}`);
  console.log(`📚 Database FAQs Preserved: ${finalFaqCount} (Untouched)`);
  console.log(`💼 Database Case Studies Preserved: ${finalCaseStudyCount} (Untouched)`);
  console.log(`👥 Total Users in System: ${finalUserCount}`);
  console.log('============================================================\n');

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('❌ Error during safe reset and bootstrap:', e);
  await prisma.$disconnect();
  process.exit(1);
});
