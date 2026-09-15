import { env } from '../config/env';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface StructuredLogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  environment: string;
  correlationId?: string;
  userId?: string;
  organizationId?: string;
  route?: string;
  method?: string;
  statusCode?: number;
  latencyMs?: number;
  message: string;
  metadata?: Record<string, any>;
}

// Sensitive field patterns to redact automatically
const SENSITIVE_KEYS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'password',
  'newpassword',
  'currentpassword',
  'token',
  'refreshtoken',
  'secret',
  'apikey',
  'creditcard',
  'cardnumber',
  'cvv',
  'ssn',
]);

/**
 * Deeply redacts sensitive keys and values from objects before logging
 */
export function sanitizeLogData(data: any): any {
  if (!data) return data;
  if (typeof data === 'string') {
    // Redact bearer tokens or sk_ keys
    return data
      .replace(/\bBearer\s+[a-zA-Z0-9._\-]+/gi, 'Bearer [REDACTED]')
      .replace(/\b(sk_[a-zA-Z0-9_\-]+)\b/g, '[REDACTED_API_KEY]')
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_SSN]')
      .replace(/\b(?:\d[ -]*?){13,16}\b/g, '[REDACTED_CARD]');
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeLogData);
  }

  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.has(lowerKey) || lowerKey.includes('password') || lowerKey.includes('secret') || lowerKey.includes('token')) {
        cleaned[key] = '[REDACTED]';
      } else {
        cleaned[key] = sanitizeLogData(value);
      }
    }
    return cleaned;
  }

  return data;
}

/**
 * Enterprise Structured JSON Logger
 */
class Logger {
  private serviceName = 'api';

  private output(entry: StructuredLogEntry) {
    // Sanitize metadata
    if (entry.metadata) {
      entry.metadata = sanitizeLogData(entry.metadata);
    }

    const jsonString = JSON.stringify(entry);

    if (entry.level === 'ERROR') {
      console.error(jsonString);
    } else if (entry.level === 'WARN') {
      console.warn(jsonString);
    } else {
      console.log(jsonString);
    }
  }

  info(message: string, context?: Partial<StructuredLogEntry>) {
    this.output({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      service: this.serviceName,
      environment: env.NODE_ENV,
      message,
      ...context,
    });
  }

  warn(message: string, context?: Partial<StructuredLogEntry>) {
    this.output({
      timestamp: new Date().toISOString(),
      level: 'WARN',
      service: this.serviceName,
      environment: env.NODE_ENV,
      message,
      ...context,
    });
  }

  error(message: string, context?: Partial<StructuredLogEntry>) {
    this.output({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      service: this.serviceName,
      environment: env.NODE_ENV,
      message,
      ...context,
    });
  }

  debug(message: string, context?: Partial<StructuredLogEntry>) {
    if (env.NODE_ENV === 'development') {
      this.output({
        timestamp: new Date().toISOString(),
        level: 'DEBUG',
        service: this.serviceName,
        environment: env.NODE_ENV,
        message,
        ...context,
      });
    }
  }
}

export const logger = new Logger();
