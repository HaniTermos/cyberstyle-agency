'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/api';

/**
 * Portal Authentication Guard
 * Protects all client portal routes from unauthenticated access.
 * If no valid portal token or session exists, immediately redirects to /portal/login.
 */
export function PortalAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = getAuthToken();
      const session = sessionStorage.getItem('cyberstyle_portal_session');
      const localToken =
        localStorage.getItem('cyberstyle_portal_token') ||
        localStorage.getItem('portal_token');

      if (!token && !session && !localToken) {
        router.replace('/portal/login');
      } else {
        setAuthorized(true);
      }
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#080A10] flex items-center justify-center text-cyan-400 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>Verifying client workspace authorization...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
