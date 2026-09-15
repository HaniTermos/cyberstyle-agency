import React from 'react';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalTopBar } from '@/components/portal/PortalTopBar';

export const metadata = {
  title: 'Client Workspace // CYBERSTYLE',
  description: 'Client workspace for projects, review items, deliverables, invoices, and communication.',
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#080A10] text-zinc-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-black">
      <div className="flex-1 flex flex-row min-h-0">
        {/* Sidebar Navigation */}
        <PortalSidebar />

        {/* Main View Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0A0C14] overflow-x-hidden">
          <PortalTopBar />
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
