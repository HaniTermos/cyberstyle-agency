/**
 * CYBERSTYLE API Client Helper
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // 1. Check cookies for cyberstyle_session, auth_token, or portal_token
  const cookieMatch = document.cookie.match(new RegExp('(^| )(cyberstyle_session|auth_token|portal_token)=([^;]+)'));
  if (cookieMatch && cookieMatch[3]) {
    return decodeURIComponent(cookieMatch[3]);
  }

  // 2. Check localStorage
  const localToken =
    localStorage.getItem('cyberstyle_admin_token') ||
    localStorage.getItem('cyberstyle_portal_token') ||
    localStorage.getItem('auth_token');
  if (localToken) return localToken;

  // 3. Check sessionStorage (Admin or Client Portal)
  const adminSession = sessionStorage.getItem('cyberstyle_admin_session');
  if (adminSession) {
    try {
      const parsed = JSON.parse(adminSession);
      if (parsed.token) return parsed.token;
    } catch {}
  }

  const portalSession = sessionStorage.getItem('cyberstyle_portal_session');
  if (portalSession) {
    try {
      const parsed = JSON.parse(portalSession);
      if (parsed.token) return parsed.token;
    } catch {}
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

