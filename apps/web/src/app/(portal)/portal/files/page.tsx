'use client';

import React from 'react';
import { FileText, Download, ShieldCheck, Lock } from 'lucide-react';

export default function PortalFilesPage() {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Deliverable Vault & Assets</h1>
          <p className="text-xs text-zinc-400 mt-1">Encrypted specifications, brand tokens, and staging builds.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'Architecture_Spec_v2.pdf', size: '2.4 MB', date: 'Aug 20, 2026', type: 'PDF' },
          { name: 'Figma_Design_Tokens_Export.json', size: '420 KB', date: 'Aug 22, 2026', type: 'JSON' },
          { name: 'Database_Schema_Migration_Log.sql', size: '85 KB', date: 'Sep 01, 2026', type: 'SQL' },
          { name: 'SLA_Agreement_Signed.pdf', size: '1.1 MB', date: 'Aug 01, 2026', type: 'PDF' },
        ].map((file, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-400 font-mono text-xs">
                {file.type}
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-200 truncate max-w-[160px]">{file.name}</p>
                <p className="text-[10px] text-zinc-500 font-mono">{file.size} • {file.date}</p>
              </div>
            </div>
            <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
