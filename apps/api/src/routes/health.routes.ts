import { Router, Request, Response } from 'express';
import { prisma } from '../config/db';

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
 * @desc    Readiness probe: verifies database connectivity
 * @access  Public
 */
router.get('/ready', async (_req: Request, res: Response) => {
  try {
    // Ping database with a simple query
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString(),
      service: 'cyberstyle-api',
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'not_ready',
      database: 'disconnected',
      error: error?.message || 'Database query failed',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
