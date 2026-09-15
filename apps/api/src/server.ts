import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import healthRoutes from './routes/health.routes';
import leadsRoutes from './routes/leads.routes';
import authRoutes from './routes/auth.routes';
import contentRoutes from './routes/content.routes';
import portalRoutes from './routes/portal.routes';
import adminRoutes from './routes/admin.routes';
import aiRoutes from './routes/ai.routes';
import invoicesRoutes from './routes/invoices.routes';
import messagingRoutes from './routes/messaging.routes';
import monitoringRoutes from './routes/monitoring.routes';
import seoRoutes from './routes/seo.routes';
import emailRoutes from './routes/email.routes';
import analyticsRoutes from './routes/analytics.routes';
import geoRoutes from './routes/geo.routes';
import fileRoutes from './routes/file.routes';
import { detailedRequestLogger } from './middleware/requestLogger';
import path from 'path';
import { correlationIdMiddleware } from './middleware/correlationId';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/env';

export function createServer() {
  const app = express();

  // Static uploads directory for media assets & public images
  const uploadsPath = path.resolve(process.cwd(), 'uploads');
  const cleanUploadsPath = path.resolve(process.cwd(), 'uploads', 'clean');
  app.use('/uploads', express.static(uploadsPath));
  app.use('/uploads/clean', express.static(cleanUploadsPath));

  // CORS Configuration
  const allowedOrigins = env.CORS_ORIGINS.split(',').map((o: string) => o.trim());

  // Security Headers with Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: ["'self'", ...allowedOrigins],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  app.use(cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'stripe-signature', 'x-correlation-id', 'x-request-id'],
  }));

  // Correlation ID Tracing & Body Parsing & Detailed Request Logging
  app.use(correlationIdMiddleware);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(detailedRequestLogger);

  // Favicon & Common Browser Requests
  app.get('/favicon.ico', (_req, res) => res.status(204).end());

  // Public projects shortcut (redirects to published case studies)
  app.get(['/api/projects', '/api/v1/projects'], (_req, res) => {
    res.redirect(307, '/api/content/case-studies');
  });

  // API Routes (mounted under both /api and /api/v1)
  const mountRoutes = (prefix: string) => {
    app.use(`${prefix}`, healthRoutes);
    app.use(`${prefix}`, leadsRoutes);
    app.use(`${prefix}/admin`, leadsRoutes);
    app.use(`${prefix}/auth`, authRoutes);
    app.use(`${prefix}/content`, contentRoutes);
    app.use(`${prefix}`, contentRoutes);
    app.use(`${prefix}/portal`, portalRoutes);
    app.use(`${prefix}/admin`, adminRoutes);
    app.use(`${prefix}/admin/ai`, aiRoutes);
    app.use(`${prefix}/admin`, aiRoutes);
    app.use(`${prefix}/admin/email`, emailRoutes);
    app.use(`${prefix}/invoices`, invoicesRoutes);
    app.use(`${prefix}/messaging`, messagingRoutes);
    app.use(`${prefix}/monitoring`, monitoringRoutes);
    app.use(`${prefix}/admin/monitoring`, monitoringRoutes);
    app.use(`${prefix}/seo`, seoRoutes);
    app.use(`${prefix}/admin/seo`, seoRoutes);
    app.use(`${prefix}/analytics`, analyticsRoutes);
    app.use(`${prefix}/admin/analytics`, analyticsRoutes);
    app.use(`${prefix}/admin/geo`, geoRoutes);
    app.use(`${prefix}/geo`, geoRoutes);
    app.use(`${prefix}/files`, fileRoutes);
  };

  mountRoutes('/api');
  mountRoutes('/api/v1');

  // Fallback 404
  app.use((_req, res) => {
    res.status(404).json({
      status: 'error',
      code: 'NOT_FOUND',
      message: 'API route not found',
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
