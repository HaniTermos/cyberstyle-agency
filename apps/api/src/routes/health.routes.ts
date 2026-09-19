import { Router, Request, Response } from 'express';
import { prisma } from '../config/db';
import { getRedisClient } from '../config/redis';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Liveness probe: verifies the Express API process is alive
 * @access  Public
 */
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'cyberstyle-api',
    uptime: process.uptime(),
  });
});

/**
 * @route   GET /api/ready
 * @desc    Readiness probe: verifies PostgreSQL and Redis connectivity
 * @access  Public
 */
router.get('/ready', async (_req: Request, res: Response) => {
  let dbConnected = false;
  let dbError: string | null = null;
  let redisConnected = false;
  let redisError: string | null = null;

  // 1. Verify PostgreSQL
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbConnected = true;
  } catch (error: any) {
    dbError = error?.message || 'Database query failed';
  }

  // 2. Verify Redis
  try {
    const redis = getRedisClient();
    if (!redis) {
      redisError = 'Redis client not configured';
    } else {
      if (redis.status === 'wait' || redis.status === 'close') {
        await redis.connect();
      }
      const ping = await Promise.race([
        redis.ping(),
        new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error('Redis ping timeout')), 2000)
        ),
      ]);
      if (ping === 'PONG') {
        redisConnected = true;
      } else {
        redisError = `Unexpected ping response: ${ping}`;
      }
    }
  } catch (error: any) {
    redisError = error?.message || 'Redis ping failed';
  }

  const isReady = dbConnected && redisConnected;
  const statusCode = isReady ? 200 : 503;

  res.status(statusCode).json({
    status: isReady ? 'ready' : 'not_ready',
    database: dbConnected ? 'connected' : 'disconnected',
    redis: redisConnected ? 'connected' : 'disconnected',
    ...(dbError || redisError
      ? { errors: { ...(dbError ? { database: dbError } : {}), ...(redisError ? { redis: redisError } : {}) } }
      : {}),
    timestamp: new Date().toISOString(),
    service: 'cyberstyle-api',
  });
});

export default router;
