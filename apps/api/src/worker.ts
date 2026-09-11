import { emailWorker } from './queues/email.worker';
import { prisma } from './config/db';

console.log('🚀 CYBERSTYLE BullMQ Background Worker running...');

emailWorker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully.`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err.message);
});

process.on('SIGTERM', async () => {
  console.log('[Worker] Graceful shutdown initiated...');
  await emailWorker.close();
  await prisma.$disconnect();
  process.exit(0);
});
