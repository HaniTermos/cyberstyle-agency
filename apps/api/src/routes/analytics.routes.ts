import { Router, Response, NextFunction } from 'express';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';
import { AnalyticsService } from '../services/analytics.service';
import { UserRole } from '@prisma/client';

const router = Router();

// Guard analytics routes with SUPER_ADMIN / ADMIN
router.use(requireAuth);
router.use(requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]));

/**
 * @route   GET /api/v1/analytics/overview
 * @desc    Get aggregate traffic, device breakdown, geo breakdown, and conversion pulse
 */
router.get('/overview', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const days = parseInt(String(req.query.days || '30'), 10);
    const data = await AnalyticsService.getOverview(days);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/analytics/top-pages
 * @desc    Get top performing pages, engagement, and bounce rate
 */
router.get('/top-pages', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(String(req.query.limit || '10'), 10);
    const pages = await AnalyticsService.getTopPages(limit);
    res.status(200).json({ status: 'success', data: { pages } });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/analytics/search-performance
 * @desc    Get Google Search Console queries, clicks, impressions, and CTR
 */
router.get('/search-performance', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const days = parseInt(String(req.query.days || '30'), 10);
    const searchData = await AnalyticsService.getSearchPerformance(days);
    res.status(200).json({ status: 'success', data: searchData });
  } catch (error) {
    next(error);
  }
});

export default router;
