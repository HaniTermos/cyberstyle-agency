import { logger } from '../utils/logger';

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface OperationalAlert {
  id: string;
  type: '5XX_SPIKE' | 'BACKUP_FAILED' | 'STRIPE_WEBHOOK_FAILED' | 'QUEUE_BACKLOG' | 'DATABASE_UNREACHABLE' | 'CUSTOM';
  severity: AlertSeverity;
  title: string;
  description: string;
  triggeredAt: string;
  resolvedAt?: string;
  metadata?: Record<string, any>;
}

/**
 * Enterprise Alerting Engine & Operational Health Hooks
 */
class AlertService {
  private activeAlerts: OperationalAlert[] = [];
  private alertHistory: OperationalAlert[] = [];
  private readonly MAX_HISTORY = 100;

  // Windowed metrics tracking
  private recent5xxRequests: number[] = []; // timestamps
  private readonly FIVE_XX_THRESHOLD = 5; // >5 5xx in 5 mins triggers alert
  private readonly WINDOW_MS = 5 * 60 * 1000;

  /**
   * Track an incoming HTTP status for 5xx spike detection
   */
  recordResponseStatus(statusCode: number, route?: string) {
    if (statusCode >= 500) {
      const now = Date.now();
      this.recent5xxRequests.push(now);
      this.pruneOldRequests();

      if (this.recent5xxRequests.length >= this.FIVE_XX_THRESHOLD) {
        this.triggerAlert({
          type: '5XX_SPIKE',
          severity: 'CRITICAL',
          title: 'Elevated 5xx Error Rate Detected',
          description: `${this.recent5xxRequests.length} server errors occurred within the last 5 minutes. Last route: ${route || 'unknown'}`,
          metadata: { count: this.recent5xxRequests.length, windowMinutes: 5 },
        });
      }
    }
  }

  private pruneOldRequests() {
    const cutoff = Date.now() - this.WINDOW_MS;
    this.recent5xxRequests = this.recent5xxRequests.filter((t) => t > cutoff);
  }

  /**
   * Trigger an operational alert and dispatch to registered hooks (webhook/email/Slack simulation)
   */
  triggerAlert(alertData: Omit<OperationalAlert, 'id' | 'triggeredAt'>): OperationalAlert {
    const alert: OperationalAlert = {
      id: 'alt_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      triggeredAt: new Date().toISOString(),
      ...alertData,
    };

    // Check if an unresolved alert of the same type already exists
    const existing = this.activeAlerts.find((a) => a.type === alert.type && !a.resolvedAt);
    if (!existing) {
      this.activeAlerts.push(alert);
    }

    this.alertHistory.unshift(alert);
    if (this.alertHistory.length > this.MAX_HISTORY) {
      this.alertHistory.pop();
    }

    // Log structured alert
    logger.error(`[OPERATIONAL ALERT] ${alert.title}: ${alert.description}`, {
      metadata: { alertId: alert.id, type: alert.type, severity: alert.severity },
    });

    // Webhook/Slack dispatcher hook (can be pointed to webhook URL via env in production)
    this.dispatchToExternalChannels(alert);

    return alert;
  }

  /**
   * Resolve an active alert
   */
  resolveAlert(type: OperationalAlert['type'], resolutionNote?: string) {
    const alert = this.activeAlerts.find((a) => a.type === type && !a.resolvedAt);
    if (alert) {
      alert.resolvedAt = new Date().toISOString();
      if (resolutionNote) {
        alert.metadata = { ...alert.metadata, resolutionNote };
      }
      this.activeAlerts = this.activeAlerts.filter((a) => a.id !== alert.id);
      logger.info(`[ALERT RESOLVED] ${alert.title}`, { metadata: { alertId: alert.id, resolutionNote } });
    }
  }

  /**
   * Dispatcher for external notification hooks (Slack, Webhook, PagerDuty, Email)
   */
  private dispatchToExternalChannels(alert: OperationalAlert) {
    const webhookUrl = process.env.ALERT_WEBHOOK_URL;
    if (webhookUrl) {
      // In production, execute non-blocking fetch to external alerting webhook
      try {
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *[${alert.severity}] CYBERSTYLE Alert*: ${alert.title}\n${alert.description}`,
            alert,
          }),
        }).catch((err) => logger.warn(`Failed to dispatch alert to webhook: ${err.message}`));
      } catch {
        // Suppress non-blocking webhook error
      }
    }
  }

  /**
   * Get active alerts and recent history for monitoring
   */
  getAlertsSummary() {
    this.pruneOldRequests();
    return {
      activeAlerts: this.activeAlerts,
      recentAlerts: this.alertHistory.slice(0, 10),
      recent5xxCount5Min: this.recent5xxRequests.length,
      isHealthy: this.activeAlerts.length === 0,
    };
  }

  /**
   * Clear for test isolation
   */
  clear() {
    this.activeAlerts = [];
    this.alertHistory = [];
    this.recent5xxRequests = [];
  }
}

export const AlertServiceInstance = new AlertService();
