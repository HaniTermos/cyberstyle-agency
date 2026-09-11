import React from 'react';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalTopBar } from '@/components/portal/PortalTopBar';

export const metadata = {
  title: 'Client Portal // CYBERSTYLE OS',
  description: 'Secure Client Workspace for Builds, Milestones, Invoices, and Comms',
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-row antialiased selection:bg-emerald-500 selection:text-black">
      {/* Sidebar Navigation */}
      <PortalSidebar />

      {/* Main Execution View */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950 overflow-x-hidden">
        <PortalTopBar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
