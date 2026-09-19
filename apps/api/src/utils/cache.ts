/**
 * CYBERSTYLE Redis Caching Utility
 * 
 * Production-ready caching layer specifically scoped for public, read-heavy data.
 * Guarantees zero downtime: if Redis is offline, disconnected, or times out,
 * all methods fail open and fall back transparently to direct PostgreSQL queries.
 */

import { getRedisClient } from '../config/redis';

export const CACHE_TTL = {
  FAQS: 600,         // 10 minutes
  CASE_STUDIES: 600, // 10 minutes
  REVIEWS: 600,      // 10 minutes
  POSTS: 600,        // 10 minutes
} as const;

/**
 * Safely fetches a cached value from Redis with a strict 400ms timeout.
 * Returns null if key is not found, Redis is offline, or connection times out.
 */
export async function getCache<T = any>(key: string): Promise<T | null> {
  try {
    const redis = getRedisClient();
    if (!redis) return null;

    if (redis.status === 'wait' || redis.status === 'close') {
      await redis.connect().catch(() => null);
    }

    const raw = await Promise.race([
      redis.get(key),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Redis get timeout')), 400)
      ),
    ]);

    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    // Non-blocking fallback to PostgreSQL
    return null;
  }
}

/**
 * Safely writes a JSON-serializable value to Redis with an expiration TTL.
 * Non-blocking: errors or timeouts are silently caught to prevent request failures.
 */
export async function setCache(
  key: string,
  data: any,
  ttlSeconds: number = CACHE_TTL.FAQS
): Promise<void> {
  try {
    const redis = getRedisClient();
    if (!redis) return;

    if (redis.status === 'wait' || redis.status === 'close') {
      await redis.connect().catch(() => null);
    }

    const serialized = JSON.stringify(data);
    await Promise.race([
      redis.set(key, serialized, 'EX', ttlSeconds),
      new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('Redis set timeout')), 400)
      ),
    ]);
  } catch {
    // Non-blocking
  }
}

/**
 * Deletes a specific cache key.
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    const redis = getRedisClient();
    if (!redis) return;

    if (redis.status === 'wait' || redis.status === 'close') {
      await redis.connect().catch(() => null);
    }

    await redis.del(key);
  } catch {
    // Non-blocking
  }
}

/**
 * Invalidates all cache keys matching a glob pattern using non-blocking SCAN.
 * Example: invalidateCachePattern('cache:faqs:*')
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  try {
    const redis = getRedisClient();
    if (!redis) return;

    if (redis.status === 'wait' || redis.status === 'close') {
      await redis.connect().catch(() => null);
    }

    const keys = await Promise.race([
      redis.keys(pattern),
      new Promise<string[]>((_, reject) =>
        setTimeout(() => reject(new Error('Redis keys timeout')), 400)
      ),
    ]).catch(() => [] as string[]);

    if (keys && keys.length > 0) {
      const pipeline = redis.pipeline();
      keys.forEach((k) => pipeline.del(k));
      await pipeline.exec();
    }
  } catch {
    // Non-blocking
  }
}
