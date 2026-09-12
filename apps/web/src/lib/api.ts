/**
 * CYBERSTYLE API Client Helper
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

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

    // Clean endpoint path
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    let data: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { success: response.ok, data: text };
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
    console.warn(`API Request Error [${endpoint}]:`, error.message || error);
    return {
      success: false,
      error: error.message || 'Network communication failure with CYBERSTYLE Core API',
    };
  }
}

