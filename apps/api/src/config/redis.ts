import Redis from 'ioredis';
import { env } from './env';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (redisClient) {
    return redisClient;
  }

  try {
    const client = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 3) {
          return null; // Stop retrying if Redis is not locally available
        }
        return Math.min(times * 100, 1000);
      },
    });

    client.on('error', (err) => {
      // Graceful logger for development resilience
      if (process.env.NODE_ENV !== 'production') {
        // Suppress repeated local connection warning
      } else {
        console.error('❌ Redis Connection Error:', err);
      }
    });

    redisClient = client;
    return redisClient;
  } catch (error) {
    console.warn('⚠️ Redis initialization fallback: Using memory storage for rate limiting.');
    return null;
  }
}
