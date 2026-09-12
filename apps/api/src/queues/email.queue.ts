import { Queue } from 'bullmq';
import { env } from '../config/env';
import { EmailService } from '../services/email.service';

export interface EmailJobData {
  to: string | string[];
  subject: string;
  template: string;
  variables: Record<string, any>;
  metadata?: Record<string, any>;
}

export const emailQueue = new Queue<EmailJobData>('email-delivery', {
  connection: {
    url: env.REDIS_URL || 'redis://localhost:6379',
    maxRetriesPerRequest: 1,
    connectTimeout: 2000,
  },
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 3000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

// Suppress unhandled Redis connection error noise in dev
emailQueue.on('error', () => {
  // Silent fallback when running locally without standalone Redis server
});

/**
 * Non-blocking safe job dispatch:
 * Adds job to BullMQ queue with a 1.5s timeout; if Redis is down, dispatches directly or falls back cleanly
 */
export async function safeAddEmailJob(
  jobName: string,
  data: EmailJobData
): Promise<void> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Redis queue timeout')), 1500)
  );

  try {
    await Promise.race([
      emailQueue.add(jobName, data),
      timeoutPromise,
    ]);
  } catch {
    // If Redis is not running, dispatch directly via live SMTP so emails still send!
    const targetEmail = Array.isArray(data.to) ? data.to[0] : data.to;
    if (targetEmail) {
      EmailService.sendMail({
        to: targetEmail,
        subject: data.subject,
        html: `<p>${data.variables?.excerpt || data.subject}</p>`,
      }).catch(() => {});
    }
  }
}

