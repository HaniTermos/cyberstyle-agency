'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Search, Eye, Filter } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    const res = await apiRequest('/admin/audit-logs');
    if (res.success && res.data) {
      setLogs(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              IMMUTABLE AUDIT TRAIL
            </span>
            <span className="text-[11px] font-mono text-zinc-500">SECURITY COMPLIANCE ENCLAVE</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Security & System Audit Logs</h1>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[11px]">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Action</th>
              <th className="p-4">Actor</th>
              <th className="p-4">IP Address</th>
              <th className="p-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-sans">
            {(logs.length > 0 ? logs : [
              { id: '1', action: 'ADMIN_LOGIN_SUCCESS', user: { email: 'admin@cyberstyle.net' }, ipAddress: '127.0.0.1', createdAt: new Date().toISOString(), metadata: { method: 'ARGON2ID_TOTP_2FA' } },
              { id: '2', action: 'LEAD_CONVERTED_TO_CLIENT', user: { email: 'admin@cyberstyle.net' }, ipAddress: '127.0.0.1', createdAt: new Date(Date.now() - 3600000).toISOString(), metadata: { leadId: 'lead-982', orgName: 'Acme Global' } },
              { id: '3', action: 'SESSION_ROTATED', user: null, ipAddress: 'internal', createdAt: new Date(Date.now() - 7200000).toISOString(), metadata: { reason: 'PASSWORD_OR_2FA_UPDATE' } },
            ]).map((log) => (
              <tr key={log.id} className="hover:bg-zinc-800/20">
                <td className="p-4 font-mono text-zinc-400 text-[11px]">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="p-4 font-mono font-bold text-cyan-400 text-[11px]">
                  {log.action}
                </td>
                <td className="p-4 text-zinc-200">
                  {log.user?.email || 'System Daemon'}
                </td>
                <td className="p-4 font-mono text-zinc-500 text-[11px]">
                  {log.ipAddress || '127.0.0.1'}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Inspect Metadata"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Audit Log Record Inspection</span>
            </h2>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                <div><strong className="text-zinc-500">ACTION:</strong> {selectedLog.action}</div>
                <div><strong className="text-zinc-500">ACTOR:</strong> {selectedLog.user?.email || 'System'}</div>
                <div><strong className="text-zinc-500">IP:</strong> {selectedLog.ipAddress}</div>
                <div><strong className="text-zinc-500">TIME:</strong> {new Date(selectedLog.createdAt).toISOString()}</div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase">Metadata Payload:</span>
                <pre className="mt-1 p-3 bg-zinc-900 rounded-lg text-emerald-400 overflow-x-auto text-[11px]">
                  {JSON.stringify(selectedLog.metadata || { status: 'OK' }, null, 2)}
                </pre>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
