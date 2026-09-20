/**
 * CYBERSTYLE API Client Helper
 */

export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    // Server-side (inside Docker or SSR server): route to internal API container
    return process.env.INTERNAL_API_URL || 'http://api:4000/api';
  }
  // Client-side (in browser):
  // 1. If explicitly configured with a non-localhost URL, use it
  if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('localhost:4000')) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // 2. If running on a remote host/domain (VPS, production, mobile), route relative to current origin /api
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${window.location.origin}/api`;
  }
  // 3. Fallback for local development
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  const pathname = window.location.pathname || '';
  const isPortalRoute = pathname.startsWith('/portal');

  // In portal routes, strictly isolate and prioritize portal client credentials
  if (isPortalRoute) {
    const portalLocal = localStorage.getItem('cyberstyle_portal_token') || localStorage.getItem('portal_token');
    if (portalLocal) return portalLocal;

    const portalSession = sessionStorage.getItem('cyberstyle_portal_session');
    if (portalSession) {
      try {
        const parsed = JSON.parse(portalSession);
        if (parsed.token) return parsed.token;
      } catch {}
    }

    const portalCookie = document.cookie.match(new RegExp('(^| )(portal_token|cyberstyle_portal_token)=([^;]+)'));
    if (portalCookie && portalCookie[3]) return decodeURIComponent(portalCookie[3]);

    // Never fall back to admin tokens on portal routes
    return null;
  }

  // In admin routes or general system calls, prioritize admin tokens
  const localAdminToken = localStorage.getItem('cyberstyle_admin_token');
  if (localAdminToken) return localAdminToken;

  const adminSession = sessionStorage.getItem('cyberstyle_admin_session');
  if (adminSession) {
    try {
      const parsed = JSON.parse(adminSession);
      if (parsed.token) return parsed.token;
    } catch {}
  }

  const cookieMatch = document.cookie.match(new RegExp('(^| )(cyberstyle_session|cyberstyle_admin_token|auth_token)=([^;]+)'));
  if (cookieMatch && cookieMatch[3]) {
    return decodeURIComponent(cookieMatch[3]);
  }

  return null;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; status?: number }> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    // Clean and normalize endpoint path
    let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Strip redundant leading /api if base URL already includes /api
    if (cleanEndpoint.startsWith('/api/')) {
      cleanEndpoint = cleanEndpoint.substring(4);
    }

    const baseUrl = getApiBaseUrl().replace(/\/+$/, '');
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${baseUrl}${cleanEndpoint}`;

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    let data: any;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        const text = await response.text().catch(() => '');
        data = { error: 'Invalid JSON response from API server', raw: text };
      }
    } else {
      const text = await response.text().catch(() => '');
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: response.ok, data: text };
      }
    }

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: data?.message || data?.error || `HTTP ${response.status}: Request failed`,
        data: data?.data || data,
      };
    }

    return {
      success: true,
      status: response.status,
      data: data?.data !== undefined ? data.data : data,
    };
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development' && !endpoint.includes('/content/') && !endpoint.includes('/faqs') && !endpoint.includes('/reviews')) {
      console.warn(`API Request Error [${endpoint}]:`, error.message || error);
    }
    return {
      success: false,
      error: error.message || 'Network communication failure with CYBERSTYLE Core API',
    };
  }
}

