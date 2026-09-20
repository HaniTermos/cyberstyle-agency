import { URL } from 'url';

/**
 * OWASP A10:2021 - Server-Side Request Forgery (SSRF) Prevention Utility
 * Validates outgoing URLs to ensure they cannot reach internal network infrastructure,
 * cloud metadata endpoints (169.254.169.254), or non-routable loopback addresses.
 */

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '169.254.169.254', // AWS / GCP / Azure metadata endpoint
  'metadata.google.internal',
  'instance-data',
]);

const PRIVATE_IP_RANGES = [
  // IPv4 Loopback: 127.0.0.0/8
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  // IPv4 Link-Local / Cloud Metadata: 169.254.0.0/16
  /^169\.254\.\d{1,3}\.\d{1,3}$/,
  // RFC 1918 Class A: 10.0.0.0/8
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  // RFC 1918 Class B: 172.16.0.0/12 (172.16 - 172.31)
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/,
  // RFC 1918 Class C: 192.168.0.0/16
  /^192\.168\.\d{1,3}\.\d{1,3}$/,
  // Broadcast
  /^255\.255\.255\.255$/,
];

export interface SsrfValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  error?: string;
}

export function validateSafeExternalUrl(inputUrl: string): SsrfValidationResult {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { isValid: false, error: 'URL must be a non-empty string' };
  }

  try {
    const parsed = new URL(inputUrl.trim());

    // 1. Only allow HTTP and HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: `Disallowed protocol: ${parsed.protocol}. Only http: and https: allowed.` };
    }

    const hostname = parsed.hostname.toLowerCase();

    // 2. Reject explicit blocklisted hostnames & metadata services
    if (BLOCKED_HOSTNAMES.has(hostname)) {
      return { isValid: false, error: `SSRF blocked: Hostname ${hostname} is disallowed.` };
    }

    // 3. Reject private and loopback IP address ranges
    for (const regex of PRIVATE_IP_RANGES) {
      if (regex.test(hostname)) {
        return { isValid: false, error: `SSRF blocked: IP address ${hostname} falls in private/reserved subnet.` };
      }
    }

    // 4. Reject localhost aliases and internal TLDs
    if (hostname.endsWith('.localhost') || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
      return { isValid: false, error: `SSRF blocked: Internal domain ${hostname} is disallowed.` };
    }

    // 5. Block port 22, 25, 5432, 6379, 27017, etc. (internal services)
    if (parsed.port) {
      const portNum = parseInt(parsed.port, 10);
      const disallowedPorts = [22, 25, 110, 143, 5432, 5433, 5434, 6379, 6380, 27017, 9200, 11211];
      if (disallowedPorts.includes(portNum)) {
        return { isValid: false, error: `SSRF blocked: Destination port ${portNum} is restricted.` };
      }
    }

    return { isValid: true, sanitizedUrl: parsed.toString() };
  } catch (err: any) {
    return { isValid: false, error: `Invalid URL structure: ${err.message}` };
  }
}
