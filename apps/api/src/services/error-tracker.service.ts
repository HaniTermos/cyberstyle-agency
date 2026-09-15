import { Request } from 'express';
import { sanitizeLogData } from '../utils/logger';
import { env } from '../config/env';

export interface TrackedErrorEvent {
  id: string;
  timestamp: string;
  message: string;
  name: string;
  stack?: string;
  correlationId?: string;
  userId?: string;
  organizationId?: string;
  route?: string;
  method?: string;
  statusCode?: number;
  environment: string;
  metadata?: Record<string, any>;
}

/**
 * Enterprise Error Tracking Service
 * Sentry-compatible event capture and operational telemetry buffer.
 */
class ErrorTrackerService {
  private recentErrors: TrackedErrorEvent[] = [];
  private readonly MAX_BUFFER_SIZE = 100;
  private errorCount24h = 0;

  constructor() {
    // Global process handlers for uncaught exceptions and unhandled promise rejections
    process.on('uncaughtException', (err: Error) => {
      this.captureException(err, { source: 'uncaughtException' });
    });

    process.on('unhandledRejection', (reason: any) => {
      const err = reason instanceof Error ? reason : new Error(String(reason));
      this.captureException(err, { source: 'unhandledRejection' });
    });
  }

  /**
   * Capture an exception with full operational context and correlation tracking
   */
  captureException(
    error: Error | any,
    context?: {
      req?: Request;
      correlationId?: string;
      userId?: string;
      organizationId?: string;
      statusCode?: number;
      metadata?: Record<string, any>;
      source?: string;
    }
  ): TrackedErrorEvent {
    const correlationId =
      context?.correlationId ||
      (context?.req as any)?.correlationId ||
      'internal-' + Math.random().toString(36).substring(2, 9);

    const user = (context?.req as any)?.user;
    const userId = context?.userId || user?.id;
    const organizationId = context?.organizationId || user?.organizationId;

    const event: TrackedErrorEvent = {
      id: 'err_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      name: error?.name || 'Error',
      message: error?.message || String(error),
      stack: error?.stack ? error.stack.split('\n').slice(0, 10).join('\n') : undefined,
      correlationId,
      userId,
      organizationId,
      route: context?.req ? (context.req.originalUrl || context.req.url).split('?')[0] : undefined,
      method: context?.req?.method,
      statusCode: context?.statusCode || (error as any)?.statusCode || 500,
      environment: env.NODE_ENV,
      metadata: sanitizeLogData(context?.metadata || {}),
    };

    // Store in circular buffer for admin monitoring dashboard
    this.recentErrors.unshift(event);
    if (this.recentErrors.length > this.MAX_BUFFER_SIZE) {
      this.recentErrors.pop();
    }
    this.errorCount24h++;

    // Emit structured JSON error log
    console.error(
      JSON.stringify({
        level: 'ERROR',
        service: 'api',
        type: 'EXCEPTION_TRACKED',
        errorId: event.id,
        correlationId: event.correlationId,
        message: event.message,
        statusCode: event.statusCode,
        route: event.route,
        timestamp: event.timestamp,
      })
    );

    return event;
  }

  /**
   * Retrieve recent tracked errors for admin monitoring
   */
  getRecentErrors(limit = 50): TrackedErrorEvent[] {
    return this.recentErrors.slice(0, limit);
  }

  /**
   * Get 24-hour error count
   */
  getErrorCount(): number {
    return this.errorCount24h;
  }

  /**
   * Reset error buffer (useful for testing)
   */
  clear() {
    this.recentErrors = [];
    this.errorCount24h = 0;
  }
}

export const ErrorTracker = new ErrorTrackerService();
