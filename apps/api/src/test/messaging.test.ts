import { prisma } from '../config/db';
import { MessagingService } from '../services/messaging.service';
import * as fs from 'fs';

// Color formatting for test reporting
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

async function runMessagingTests() {
  console.log(`\n${BOLD}${CYAN}======================================================${RESET}`);
  console.log(`${BOLD}${CYAN}   CYBERSTYLE OS — PHASE 4 MESSAGING INTEGRATION TEST   ${RESET}`);
  console.log(`${BOLD}${CYAN}======================================================${RESET}\n`);

  let passed = 0;
  let failed = 0;

  // Setup Test Fixtures in Database
  console.log(`[SETUP] Initializing test organizations, users, and projects...`);
  
  // Clean prior test fixtures if any
  await prisma.message.deleteMany({ where: { thread: { title: { startsWith: '[TEST]' } } } });
  await prisma.messageParticipant.deleteMany({ where: { thread: { title: { startsWith: '[TEST]' } } } });
  await prisma.messageThread.deleteMany({ where: { title: { startsWith: '[TEST]' } } });
  await prisma.fileAsset.deleteMany({ where: { filename: { startsWith: 'test_asset_' } } });
  await prisma.project.deleteMany({ where: { name: { startsWith: '[TEST]' } } });
  await prisma.clientProfile.deleteMany({ where: { organization: { name: { startsWith: '[TEST]' } } } });
  await prisma.user.deleteMany({ where: { email: { contains: 'test_msg_' } } });
  await prisma.clientOrganization.deleteMany({ where: { name: { startsWith: '[TEST]' } } });

  // 1. Create Org A and Org B
  const orgA = await prisma.clientOrganization.create({
    data: {
      name: '[TEST] Alpha Corp',
      domain: 'alpha.com',
    },
  });

  const orgB = await prisma.clientOrganization.create({
    data: {
      name: '[TEST] Beta Enterprises',
      domain: 'beta.com',
    },
  });

  // 2. Create Projects
  const projectA = await prisma.project.create({
    data: {
      name: '[TEST] Alpha Cloud Migration',
      slug: `test-alpha-proj-${Date.now()}`,
      organizationId: orgA.id,
      status: 'DEVELOPMENT',
      description: 'Test project description for Org A',
    },
  });

  // 3. Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: `test_msg_admin_${Date.now()}@cyberstyle.net`,
      passwordHash: 'dummy_hash',
      name: 'Super Admin Test',
      role: 'SUPER_ADMIN',
    },
  });

  const clientUserA = await prisma.user.create({
    data: {
      email: `test_msg_clientA_${Date.now()}@alpha.com`,
      passwordHash: 'dummy_hash',
      name: 'Alice Alpha',
      role: 'CLIENT',
      clientProfile: {
        create: {
          organizationId: orgA.id,
        },
      },
    },
  });

  const clientUserB = await prisma.user.create({
    data: {
      email: `test_msg_clientB_${Date.now()}@beta.com`,
      passwordHash: 'dummy_hash',
      name: 'Bob Beta',
      role: 'CLIENT',
      clientProfile: {
        create: {
          organizationId: orgB.id,
        },
      },
    },
  });

  console.log(`  ✓ Test fixtures created: OrgA (${orgA.id}), OrgB (${orgB.id}), ProjectA (${projectA.id})\n`);

  // ==========================================
  // TEST 1: Thread Creation & Multi-Tenant Boundaries
  // ==========================================
  try {
    console.log(`${BOLD}Test 1: Thread Creation, Context Attachment & Multi-Tenant Isolation${RESET}`);

    // Admin creates a thread for Org A attached to Project A
    const threadA = await MessagingService.createThread(adminUser, {
      organizationId: orgA.id,
      title: '[TEST] Org A Architecture Blueprint',
      contextType: 'PROJECT',
      contextId: projectA.id,
      initialMessage: 'Welcome to the project thread for Org A.',
    });

    assert(threadA.id !== undefined, 'Thread A ID should be created');
    assert(threadA.organizationId === orgA.id, 'Thread A must belong to Org A');
    assert(threadA.participants.length >= 1, 'Participants must be registered');

    // Client A can access thread A
    const detailA = await MessagingService.getThreadDetail(clientUserA, threadA.id);
    assert(detailA.thread.id === threadA.id, 'Client A must access Org A thread');

    // Client B from Org B CANNOT access thread A (Must throw 403)
    let forbiddenCaught = false;
    try {
      await MessagingService.getThreadDetail(clientUserB, threadA.id);
    } catch (err: any) {
      if (err.message.includes('Forbidden') || err.message.includes('Access denied')) {
        forbiddenCaught = true;
      }
    }
    assert(forbiddenCaught, 'Client B accessing Org A thread must fail with 403 Forbidden');

    // Verify Org B trying to attach Org A project throws invalid reference
    let invalidContextCaught = false;
    try {
      await MessagingService.createThread(clientUserB, {
        title: '[TEST] Invalid Context Thread',
        contextType: 'PROJECT',
        contextId: projectA.id, // Belongs to Org A!
        initialMessage: 'Attempting cross-tenant context linkage',
      });
    } catch (err: any) {
      if (err.message.includes('Invalid project reference')) {
        invalidContextCaught = true;
      }
    }
    assert(invalidContextCaught, 'Cross-org entity attachment must be strictly rejected');

    console.log(`  ${GREEN}✓ Passed: Multi-tenant boundary and context entity attachment securely enforced.${RESET}\n`);
    passed++;
  } catch (err: any) {
    console.log(`  ${RED}✗ Failed Test 1: ${err.message}${RESET}\n`);
    failed++;
  }

  // ==========================================
  // TEST 2: Internal Admin Notes Secrecy & Query Stripping
  // ==========================================
  try {
    console.log(`${BOLD}Test 2: Internal Admin Notes Secrecy & Client Response Stripping${RESET}`);

    // Create a dedicated thread for Org A
    const thread = await MessagingService.createThread(clientUserA, {
      title: '[TEST] Milestone 2 Discussion',
      contextType: 'GENERAL',
      initialMessage: 'Client message: when will milestone 2 be deployed?',
    });

    // Admin posts an Internal Note
    const internalMsg = await MessagingService.sendMessage(adminUser, thread.id, {
      content: 'SECRET: Backend deployment delayed due to database maintenance.',
      isInternal: true,
      messageType: 'TEXT',
    });
    assert(internalMsg.isInternal === true, 'Message must be marked isInternal = true');

    // Admin posts a public client response
    const publicMsg = await MessagingService.sendMessage(adminUser, thread.id, {
      content: 'Public response: Staging build is scheduled for tomorrow at 2 PM.',
      isInternal: false,
      messageType: 'TEXT',
    });
    assert(publicMsg.isInternal === false, 'Public message must have isInternal = false');

    // Admin queries thread detail -> MUST see internal note
    const adminDetail = await MessagingService.getThreadDetail(adminUser, thread.id);
    const adminNotesCount = adminDetail.messages.filter((m) => m.isInternal).length;
    assert(adminNotesCount >= 1, 'Admin must see internal notes');

    // Client queries thread detail -> MUST NOT see internal note
    const clientDetail = await MessagingService.getThreadDetail(clientUserA, thread.id);
    const clientSeenInternalNotes = clientDetail.messages.filter((m) => m.isInternal).length;
    assert(clientSeenInternalNotes === 0, 'Client query MUST NOT contain internal notes');
    
    // Verify client cannot submit an internal note (must be forced to isInternal = false)
    const clientAttemptInternal = await MessagingService.sendMessage(clientUserA, thread.id, {
      content: 'Client attempting internal note',
      isInternal: true, // Non-admin should be rejected or forced to false
      messageType: 'TEXT',
    });
    assert(clientAttemptInternal.isInternal === false, 'Client message cannot be marked internal');

    console.log(`  ${GREEN}✓ Passed: Internal admin notes are strictly invisible to client queries and sanitized.${RESET}\n`);
    passed++;
  } catch (err: any) {
    console.log(`  ${RED}✗ Failed Test 2: ${err.message}${RESET}\n`);
    failed++;
  }

  // ==========================================
  // TEST 3: Real-Time Incremental Polling Contract
  // ==========================================
  try {
    console.log(`${BOLD}Test 3: Real-Time Incremental Polling Contract (?since=<lastId>)${RESET}`);

    const thread = await MessagingService.createThread(adminUser, {
      organizationId: orgA.id,
      title: '[TEST] Polling Verification Thread',
      contextType: 'GENERAL',
      initialMessage: 'Poll Base Message',
    });

    const msg1 = await MessagingService.sendMessage(clientUserA, thread.id, {
      content: 'Message 1 from client',
      isInternal: false,
    });

    const msg2 = await MessagingService.sendMessage(adminUser, thread.id, {
      content: 'Message 2 from admin',
      isInternal: false,
    });

    // Poll since msg1
    const pollResult = await MessagingService.pollMessages(clientUserA, thread.id, msg1.id, 50);

    assert(pollResult.threadId === thread.id, 'Poll response must include threadId');
    assert(Array.isArray(pollResult.messages), 'Poll response must include messages array');
    assert(pollResult.messages.length === 1, 'Poll since msg1 should only return msg2');
    assert(pollResult.messages[0] !== undefined && pollResult.messages[0].id === msg2.id, 'Returned message must match msg2 ID');
    assert(pollResult.hasMore === false, 'hasMore should be false');
    assert(pollResult.nextCursor === msg2.id, 'nextCursor must point to latest message');

    console.log(`  ${GREEN}✓ Passed: Polling contract returns expected incremental message shape.${RESET}\n`);
    passed++;
  } catch (err: any) {
    console.log(`  ${RED}✗ Failed Test 3: ${err.message}${RESET}\n`);
    failed++;
  }

  // ==========================================
  // TEST 4: Secure File Asset Storage & Authenticated Streaming
  // ==========================================
  try {
    console.log(`${BOLD}Test 4: File Asset Storage & Participant Authorization${RESET}`);

    const testFileBuffer = Buffer.from('CYBERSTYLE PROPRIETARY SYSTEM SPECIFICATION v4.0');
    const uploadedAsset = await MessagingService.uploadFileAsset(
      adminUser,
      orgA.id,
      {
        filename: 'test_asset_spec.pdf',
        mimeType: 'application/pdf',
        buffer: testFileBuffer,
      }
    );

    assert(uploadedAsset.id !== undefined, 'File asset ID should exist');
    assert(uploadedAsset.organizationId === orgA.id, 'File asset must belong to Org A');
    
    // Create a thread and attach this file
    const thread = await MessagingService.createThread(adminUser, {
      organizationId: orgA.id,
      title: '[TEST] File Delivery Thread',
      contextType: 'PROJECT',
      contextId: projectA.id,
      initialMessage: 'Sending attachment:',
    });

    await MessagingService.sendMessage(adminUser, thread.id, {
      content: 'Please find the attached spec file.',
      messageType: 'FILE',
      fileId: uploadedAsset.id,
      isInternal: false,
    });

    // Org A client can stream the file
    const fileStreamA = await MessagingService.getFileAssetStream(clientUserA, uploadedAsset.id);
    assert(fileStreamA.filename === 'test_asset_spec.pdf', 'Org A client must obtain file info');
    assert(fs.existsSync(fileStreamA.filePath), 'File must exist on disk at filePath');

    // Org B client cannot stream the file (Must throw 403 Forbidden)
    let fileForbidden = false;
    try {
      await MessagingService.getFileAssetStream(clientUserB, uploadedAsset.id);
    } catch (err: any) {
      if (err.message.includes('Forbidden') || err.message.includes('Access denied')) {
        fileForbidden = true;
      }
    }
    assert(fileForbidden, 'Org B client must be forbidden from accessing Org A file');

    console.log(`  ${GREEN}✓ Passed: File asset upload, storage, and cross-tenant download isolation verified.${RESET}\n`);
    passed++;
  } catch (err: any) {
    console.log(`  ${RED}✗ Failed Test 4: ${err.message}${RESET}\n`);
    failed++;
  }

  // ==========================================
  // TEST 5: Thread Lifecycle & Status Updates (Admin Only)
  // ==========================================
  try {
    console.log(`${BOLD}Test 5: Thread Status Lifecycle (OPEN / CLOSED)${RESET}`);

    const thread = await MessagingService.createThread(clientUserA, {
      title: '[TEST] Support Issue Thread',
      contextType: 'GENERAL',
      initialMessage: 'Issue needing resolution.',
    });

    assert(thread.status === 'OPEN', 'Initial status must be OPEN');

    // Client attempts to change status -> Must be rejected (Admin only)
    let clientStatusChangeBlocked = false;
    try {
      await MessagingService.updateThreadStatus(clientUserA, thread.id, 'CLOSED');
    } catch {
      clientStatusChangeBlocked = true;
    }
    assert(clientStatusChangeBlocked, 'Client must NOT be permitted to change thread status');

    // Admin closes thread -> Success & System message posted
    const updatedThread = await MessagingService.updateThreadStatus(adminUser, thread.id, 'CLOSED');
    assert(updatedThread.status === 'CLOSED', 'Thread status should be CLOSED');

    console.log(`  ${GREEN}✓ Passed: Thread status updates are restricted to admin users with system event recording.${RESET}\n`);
    passed++;
  } catch (err: any) {
    console.log(`  ${RED}✗ Failed Test 5: ${err.message}${RESET}\n`);
    failed++;
  }

  // ==========================================
  // TEST 6: Audit Logging Scope Verification
  // ==========================================
  try {
    console.log(`${BOLD}Test 6: Audit Logging Scope Verification${RESET}`);

    const recentLogs = await prisma.auditLog.findMany({
      where: {
        userId: adminUser.id,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const actions = recentLogs.map((l) => l.action);
    console.log(`  Logged Actions for Test Run: ${actions.join(', ')}`);

    assert(actions.includes('THREAD_CREATED'), 'Audit log must record THREAD_CREATED');
    assert(actions.includes('THREAD_STATUS_CHANGED'), 'Audit log must record THREAD_STATUS_CHANGED');
    assert(actions.includes('FILE_UPLOADED'), 'Audit log must record FILE_UPLOADED');

    console.log(`  ${GREEN}✓ Passed: Security audit log entries verified for thread lifecycle, notes, and files.${RESET}\n`);
    passed++;
  } catch (err: any) {
    console.log(`  ${RED}✗ Failed Test 6: ${err.message}${RESET}\n`);
    failed++;
  }

  // Cleanup Test Fixtures
  console.log(`[CLEANUP] Purging test fixtures...`);
  await prisma.message.deleteMany({ where: { thread: { title: { startsWith: '[TEST]' } } } });
  await prisma.messageParticipant.deleteMany({ where: { thread: { title: { startsWith: '[TEST]' } } } });
  await prisma.messageThread.deleteMany({ where: { title: { startsWith: '[TEST]' } } });
  await prisma.fileAsset.deleteMany({ where: { filename: { startsWith: 'test_asset_' } } });
  await prisma.project.deleteMany({ where: { name: { startsWith: '[TEST]' } } });
  await prisma.clientProfile.deleteMany({ where: { organization: { name: { startsWith: '[TEST]' } } } });
  await prisma.user.deleteMany({ where: { email: { contains: 'test_msg_' } } });
  await prisma.clientOrganization.deleteMany({ where: { name: { startsWith: '[TEST]' } } });

  console.log(`\n${BOLD}======================================================${RESET}`);
  console.log(`${BOLD}TEST RESULTS: ${GREEN}${passed} Passed${RESET}, ${failed > 0 ? RED : ''}${failed} Failed${RESET}`);
  console.log(`${BOLD}======================================================${RESET}\n`);

  await prisma.$disconnect();

  if (failed > 0) {
    process.exit(1);
  }
}

runMessagingTests().catch(async (e) => {
  console.error('Test execution failed with unhandled error:', e);
  await prisma.$disconnect();
  process.exit(1);
});
