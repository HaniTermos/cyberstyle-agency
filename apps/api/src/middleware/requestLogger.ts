import { Request, Response, NextFunction } from 'express';

// Terminal ANSI color codes for cyberpunk readability
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const MAGENTA = '\x1b[35m';
const GRAY = '\x1b[90m';

export function detailedRequestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const timeStr = new Date().toLocaleTimeString();

  const methodColor =
    req.method === 'GET'
      ? CYAN
      : req.method === 'POST'
      ? GREEN
      : req.method === 'PUT' || req.method === 'PATCH'
      ? YELLOW
      : req.method === 'DELETE'
      ? RED
      : MAGENTA;

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const origin = req.headers['origin'] || req.headers['referer'] || 'direct';

  // Capture original res.send & res.json to log response body / error details
  let responseBody: any = null;
  const originalJson = res.json;
  const originalSend = res.send;

  res.json = function (body: any) {
    responseBody = body;
    return originalJson.call(this, body);
  };

  res.send = function (body: any) {
    if (!responseBody) {
      try {
        responseBody = typeof body === 'string' ? JSON.parse(body) : body;
      } catch {
        responseBody = body;
      }
    }
    return originalSend.call(this, body);
  };

  const url = req.originalUrl || req.url;
  const isPollingOrHealth = url.includes('/poll') || url.includes('/health') || url.includes('/ready');

  // Hook into response finish event
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    const statusColor =
      status >= 200 && status < 300
        ? GREEN
        : status >= 300 && status < 400
        ? CYAN
        : status >= 400 && status < 500
        ? YELLOW
        : RED;

    const icon = status >= 200 && status < 300 ? '✓' : status >= 400 ? '⚠' : '○';

    // If polling or health check, print a clean single line matching Next.js terminal style
    if (isPollingOrHealth) {
      if (status !== 304 || process.env.LOG_POLLING === 'true') {
        console.log(
          `${GRAY}[${timeStr}]${RESET} ${icon} ${BOLD}${methodColor}${req.method}${RESET} ${url} ${statusColor}${status}${RESET} ${GRAY}(${duration}ms)${RESET}`
        );
      }
      return;
    }

    // Format standard request summary
    console.log(`\n${GRAY}─────────────────────────────────────────────────────────────────${RESET}`);
    console.log(
      `${GRAY}[${timeStr}]${RESET} 📥 ${BOLD}${methodColor}${req.method}${RESET} ${BOLD}${url}${RESET}`
    );
    console.log(`${GRAY}├─ IP:${RESET} ${ip} ${GRAY}│ Origin:${RESET} ${origin}`);

    if (req.headers['authorization']) {
      console.log(`${GRAY}├─ Auth:${RESET} Bearer **********`);
    }

    if (req.query && Object.keys(req.query).length > 0) {
      console.log(`${GRAY}├─ Query Params:${RESET}`, JSON.stringify(req.query));
    }

    if (req.body && Object.keys(req.body).length > 0) {
      const sanitized = { ...req.body };
      if (sanitized.password) sanitized.password = '******';
      if (sanitized.token) sanitized.token = '******';
      if (sanitized.refreshToken) sanitized.refreshToken = '******';
      if (sanitized.secret) sanitized.secret = '******';

      const bodyStr = JSON.stringify(sanitized, null, 2);
      if (bodyStr.length > 800) {
        console.log(`${GRAY}├─ Body:${RESET} ${bodyStr.slice(0, 800)}... ${GRAY}(truncated)${RESET}`);
      } else {
        console.log(`${GRAY}├─ Body:${RESET} ${bodyStr.replace(/\n/g, '\n' + GRAY + '│  ' + RESET)}`);
      }
    }

    console.log(
      `${GRAY}├─ Status:${RESET} ${icon} ${BOLD}${statusColor}${status} ${res.statusMessage || ''}${RESET} ${GRAY}(took ${duration}ms)${RESET}`
    );

    if (status >= 400 && responseBody) {
      const errStr = typeof responseBody === 'object' ? JSON.stringify(responseBody, null, 2) : String(responseBody);
      console.log(`${GRAY}├─ Error Payload:${RESET} ${RED}${errStr.replace(/\n/g, '\n' + GRAY + '│  ' + RED)}${RESET}`);
    }

    console.log(`${GRAY}└────────────────────────────────────────────────────────────────${RESET}`);
  });

  next();
}
