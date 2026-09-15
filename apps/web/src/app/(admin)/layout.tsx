'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { AdminEnvBanner } from '@/components/admin/AdminEnvBanner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Verify session
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('cyberstyle_admin_session');
      if (!session) {
        // In dev, if direct URL entered without login, route to login
        router.replace('/admin/login');
      } else {
        setAuthorized(true);
      }
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#040609] flex items-center justify-center text-white font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
          <span>Verifying administrative authorization...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040609] text-white flex flex-col font-sans selection:bg-[#00F0FF] selection:text-black">
      <AdminEnvBanner />
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="pt-7">
        <AdminTopBar collapsed={collapsed} />
      </div>

      <main
        className={`pt-28 pb-16 px-6 sm:px-10 transition-all duration-300 min-h-[calc(100vh-64px)] ${
          collapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
