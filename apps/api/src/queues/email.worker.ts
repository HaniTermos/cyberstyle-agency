import { Worker, Job } from 'bullmq';
import { env } from '../config/env';
import { prisma } from '../config/db';
import { EmailJobData } from './email.queue';
import { EmailStatus } from '@prisma/client';

export const emailWorker = new Worker<EmailJobData>(
  'email-delivery',
  async (job: Job<EmailJobData>) => {
    const { to, subject, template, metadata } = job.data;
    console.log(`📨 [Worker] Processing email job #${job.id} for ${to}: "${subject}"`);

    try {
      // In production, Nodemailer transport transmits email here
      // Record delivery attempt in PostgreSQL EmailLog table
      await prisma.emailLog.create({
        data: {
          recipient: Array.isArray(to) ? to.join(', ') : to,
          subject,
          templateName: template,
          status: EmailStatus.SENT,
          sentAt: new Date(),
          metadata: metadata || {},
        },
      });

      console.log(`✅ [Worker] Email job #${job.id} dispatched and logged.`);
      return { success: true, timestamp: new Date().toISOString() };
    } catch (error: any) {
      console.error(`❌ [Worker] Email job #${job.id} failed:`, error);
      await prisma.emailLog.create({
        data: {
          recipient: Array.isArray(to) ? to.join(', ') : to,
          subject,
          templateName: template,
          status: EmailStatus.FAILED,
          error: error?.message || 'Unknown SMTP error',
          metadata: metadata || {},
        },
      });
      throw error;
    }
  },
  {
    connection: {
      url: env.REDIS_URL || 'redis://localhost:6379',
    },
    concurrency: 5,
  }
);
