import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ErrorTracker } from '../services/error-tracker.service';
import { AlertServiceInstance } from '../services/alert.service';

const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GRAY = '\x1b[90m';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const timeStr = new Date().toLocaleTimeString();
  const statusCode = err.statusCode || err.status || (err instanceof ZodError ? 400 : 500);

  // Capture exception in operational tracker with correlationId and user context
  ErrorTracker.captureException(err, { req, statusCode });

  // Record 5xx occurrences in Alert Service
  if (statusCode >= 500) {
    AlertServiceInstance.recordResponseStatus(statusCode, req.originalUrl || req.url);
  }

  console.error(`\n${RED}╔═════════════════════════════════════════════════════════════════${RESET}`);
  console.error(`${RED}║ 🚨 EXCEPTION CAUGHT [${timeStr}] ON ${req.method} ${req.originalUrl || req.url}${RESET}`);
  console.error(`${RED}╠═════════════════════════════════════════════════════════════════${RESET}`);

  // 1. Body-Parser JSON Syntax Error (Malformed JSON payload)
  if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
    console.error(`${YELLOW}║ [BODY PARSER MALFORMED JSON]${RESET} ${err.message}`);
    console.error(`${RED}╚═════════════════════════════════════════════════════════════════${RESET}\n`);

    return res.status(400).json({
      status: 'error',
      code: 'INVALID_JSON',
      message: 'Malformed JSON payload in request body',
    });
  }

  // 2. Zod Validation Error
  if (err instanceof ZodError) {
    console.error(`${YELLOW}║ [ZOD VALIDATION FAILED]${RESET}`);
    err.errors.forEach((e, idx) => {
      console.error(`${GRAY}║ ${idx + 1}. Path:${RESET} ${e.path.join('.')} ${GRAY}| Code:${RESET} ${e.code} ${GRAY}| Message:${RESET} ${RED}${e.message}${RESET}`);
    });
    console.error(`${RED}╚═════════════════════════════════════════════════════════════════${RESET}\n`);

    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Invalid request payload',
      errors: err.errors,
    });
  }

  // 2. Custom Application Error
  if (err.statusCode) {
    console.error(`${YELLOW}║ [APPLICATION ERROR (${err.statusCode})]${RESET} ${err.code || 'API_ERROR'}: ${err.message}`);
    if (err.stack) {
      console.error(`${GRAY}║ Stack:${RESET}\n${err.stack.split('\n').slice(0, 5).map((l: string) => `${GRAY}║   ${l}${RESET}`).join('\n')}`);
    }
    console.error(`${RED}╚═════════════════════════════════════════════════════════════════${RESET}\n`);

    return res.status(err.statusCode).json({
      status: 'error',
      code: err.code || 'API_ERROR',
      message: err.message,
    });
  }

  // 3. Prisma / Database Error
  if (err.name?.includes('Prisma') || err.code?.startsWith('P')) {
    console.error(`${YELLOW}║ [DATABASE / PRISMA ERROR ${err.code || ''}]${RESET} ${err.message}`);
    if (err.meta) {
      console.error(`${GRAY}║ Meta:${RESET}`, JSON.stringify(err.meta));
    }
    console.error(`${RED}╚═════════════════════════════════════════════════════════════════${RESET}\n`);

    return res.status(500).json({
      status: 'error',
      code: 'DATABASE_ERROR',
      message: 'Database operation failed',
      details: process.env.NODE_ENV === 'production' ? undefined : err.message,
    });
  }

  // 4. Fallback Internal Server Error
  console.error(`${RED}║ [INTERNAL UNHANDLED EXCEPTION]${RESET} ${err.name || 'Error'}: ${err.message || 'Unknown error'}`);
  if (err.stack) {
    console.error(`${GRAY}║ Stack Trace:${RESET}\n${err.stack.split('\n').slice(0, 6).map((l: string) => `${GRAY}║   ${l}${RESET}`).join('\n')}`);
  }
  console.error(`${RED}╚═════════════════════════════════════════════════════════════════${RESET}\n`);

  const isProd = process.env.NODE_ENV === 'production';
  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: isProd ? 'An unexpected internal error occurred' : err.message || 'Internal Server Error',
    ...(isProd ? {} : { stack: err.stack }),
  });
}
