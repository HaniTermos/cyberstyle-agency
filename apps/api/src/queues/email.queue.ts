import { Queue } from 'bullmq';
import { env } from '../config/env';

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
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});
