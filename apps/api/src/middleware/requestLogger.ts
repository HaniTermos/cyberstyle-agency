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

  // Format request summary
  console.log(`\n${GRAY}─────────────────────────────────────────────────────────────────${RESET}`);
  console.log(
    `${GRAY}[${timeStr}]${RESET} 📥 ${BOLD}${methodColor}${req.method}${RESET} ${BOLD}${req.originalUrl || req.url}${RESET}`
  );
  console.log(`${GRAY}├─ IP:${RESET} ${ip} ${GRAY}│ Origin:${RESET} ${origin}`);

  // Log Headers if present
  if (req.headers['authorization']) {
    console.log(`${GRAY}├─ Auth:${RESET} Bearer **********`);
  }

  // Log Query Parameters
  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`${GRAY}├─ Query Params:${RESET}`, JSON.stringify(req.query));
  }

  // Log Request Body (sanitized)
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitized = { ...req.body };
    if (sanitized.password) sanitized.password = '******';
    if (sanitized.token) sanitized.token = '******';
    if (sanitized.refreshToken) sanitized.refreshToken = '******';
    if (sanitized.secret) sanitized.secret = '******';

    const bodyStr = JSON.stringify(sanitized, null, 2);
    // Truncate if extremely long (e.g. huge batch leads array)
    if (bodyStr.length > 1000) {
      console.log(`${GRAY}├─ Body:${RESET} ${bodyStr.slice(0, 1000)}... ${GRAY}(truncated ${bodyStr.length} chars)${RESET}`);
    } else {
      console.log(`${GRAY}├─ Body:${RESET} ${bodyStr.replace(/\n/g, '\n' + GRAY + '│  ' + RESET)}`);
    }
  }

  // Hook into response finish event to print response outcome
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

    const icon = status >= 200 && status < 300 ? '✅' : status >= 400 ? '⚠️' : 'ℹ️';

    console.log(
      `${GRAY}├─ Status:${RESET} ${icon} ${BOLD}${statusColor}${status} ${res.statusMessage || ''}${RESET} ${GRAY}(took ${duration}ms)${RESET}`
    );

    // If response was an error (4xx or 5xx), print the exact response payload in detail
    if (status >= 400 && responseBody) {
      const errStr = typeof responseBody === 'object' ? JSON.stringify(responseBody, null, 2) : String(responseBody);
      console.log(`${GRAY}├─ Error Payload:${RESET} ${RED}${errStr.replace(/\n/g, '\n' + GRAY + '│  ' + RED)}${RESET}`);
    }

    console.log(`${GRAY}└────────────────────────────────────────────────────────────────${RESET}`);
  });

  next();
}
