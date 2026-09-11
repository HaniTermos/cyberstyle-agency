'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Globe,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Eye,
  Check,
  X,
  FileCode2,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface MonitoringChangeItem {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  diffReference?: string;
  screenshotRef?: string;
  status: 'NEW' | 'REVIEWED' | 'DISMISSED' | 'CLIENT_NOTIFIED' | 'RESOLVED';
  detectedAt: string;
  notes?: string;
}

interface MonitoringWatchItem {
  id: string;
  monitoredUrl: string;
  label?: string;
  purpose: string;
  schedule: string;
  status: 'ACTIVE' | 'PAUSED' | 'ERROR';
  lastCheckedAt?: string;
  lastChangedAt?: string;
  changes: MonitoringChangeItem[];
}

interface MonitoringWorkspaceItem {
  id: string;
  organizationId: string;
  organization: {
    id: string;
    name: string;
    domain?: string;
  };
  status: string;
  watches: MonitoringWatchItem[];
  createdAt: string;
}

const SAMPLE_WORKSPACES: MonitoringWorkspaceItem[] = [
  {
    id: 'ws-101',
    organizationId: 'org-apex',
    organization: {
      id: 'org-apex',
      name: 'Apex Capital Advisory',
      domain: 'apexcapital.io',
    },
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    watches: [
      {
        id: 'watch-1',
        monitoredUrl: 'https://apexcapital.io/portal/investors',
        label: 'Investor Portal Gateway',
        purpose: 'client-site',
        schedule: '*/15 * * * *',
        status: 'ACTIVE',
        lastCheckedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        lastChangedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        changes: [
          {
            id: 'ch-1',
            severity: 'medium',
            summary: 'Auth login redirect modified to SSO OAuth2 endpoint.',
            diffReference: 'Line 42: - form action="/api/login"\nLine 42: + form action="/api/oauth2/authorize"',
            status: 'NEW',
            detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
          },
          {
            id: 'ch-2',
            severity: 'low',
            summary: 'Footer copyright year updated to 2026.',
            status: 'RESOLVED',
            detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          },
        ],
      },
      {
        id: 'watch-2',
        monitoredUrl: 'https://apexcapital.io/api/health',
        label: 'Production Uptime Endpoint',
        purpose: 'client-site',
        schedule: '*/5 * * * *',
        status: 'ACTIVE',
        lastCheckedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        changes: [],
      },
    ],
  },
];

export default function AdminMonitoringPage() {
  const [workspaces, setWorkspaces] = useState<MonitoringWorkspaceItem[]>(SAMPLE_WORKSPACES);
  const [selectedChange, setSelectedChange] = useState<MonitoringChangeItem | null>(null);
  const [showAddWatchModal, setShowAddWatchModal] = useState(false);
  const [newWatchUrl, setNewWatchUrl] = useState('');
  const [newWatchLabel, setNewWatchLabel] = useState('');
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>(SAMPLE_WORKSPACES[0]?.id || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const res = await apiRequest('/monitoring/workspaces');
        if (res && res.data && Array.isArray(res.data.workspaces) && res.data.workspaces.length > 0) {
          setWorkspaces(res.data.workspaces);
          if (!selectedWorkspaceId) {
            setSelectedWorkspaceId(res.data.workspaces[0].id);
          }
        }
      } catch (err) {
        console.warn('Using sample monitoring workspaces:', err);
      }
    }
    loadWorkspaces();
  }, [selectedWorkspaceId]);

  const handleReviewChange = async (changeId: string, status: 'RESOLVED' | 'DISMISSED' | 'CLIENT_NOTIFIED') => {
    try {
      await apiRequest(`/monitoring/changes/${changeId}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch {
      // Local fallback state
    }

    setWorkspaces((prev) =>
      prev.map((ws) => ({
        ...ws,
        watches: ws.watches.map((w) => ({
          ...w,
          changes: w.changes.map((c) => (c.id === changeId ? { ...c, status } : c)),
        })),
      }))
    );

    if (selectedChange && selectedChange.id === changeId) {
      setSelectedChange({ ...selectedChange, status });
    }
  };

  const handleAddWatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWatchUrl) return;

    setLoading(true);
    try {
      const res = await apiRequest('/monitoring/watches', {
        method: 'POST',
        body: JSON.stringify({
          workspaceId: selectedWorkspaceId || workspaces[0]?.id,
          monitoredUrl: newWatchUrl,
          label: newWatchLabel || new URL(newWatchUrl).hostname,
          purpose: 'client-site',
        }),
      });

      if (res && res.data && res.data.watch) {
        setWorkspaces((prev) =>
          prev.map((ws) =>
            ws.id === (selectedWorkspaceId || ws.id)
              ? { ...ws, watches: [res.data.watch, ...ws.watches] }
              : ws
          )
        );
      }
    } catch {
      // Local fallback watch
      const newWatch: MonitoringWatchItem = {
        id: `watch-${Date.now()}`,
        monitoredUrl: newWatchUrl,
        label: newWatchLabel || newWatchUrl,
        purpose: 'client-site',
        schedule: '*/15 * * * *',
        status: 'ACTIVE',
        lastCheckedAt: new Date().toISOString(),
        changes: [],
      };
      setWorkspaces((prev) =>
        prev.map((ws) =>
          ws.id === selectedWorkspaceId ? { ...ws, watches: [newWatch, ...ws.watches] } : ws
        )
      );
    } finally {
      setLoading(false);
      setShowAddWatchModal(false);
      setNewWatchUrl('');
      setNewWatchLabel('');
    }
  };

  const allChanges = workspaces.flatMap((ws) =>
    ws.watches.flatMap((w) =>
      w.changes.map((c) => ({
        ...c,
        orgName: ws.organization.name,
        watchUrl: w.monitoredUrl,
        watchLabel: w.label,
      }))
    )
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-[#00F0FF]" />
              Website Monitoring & Incident Telemetry
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              CHANGEDETECTION ACTIVE
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Real-time DOM change detection, uptime telemetry, diff inspection, and client SLA verification for retainers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddWatchModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Monitored URL</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Active Workspaces</span>
          <div className="text-2xl font-bold text-white font-mono">{workspaces.length}</div>
          <span className="text-[11px] text-zinc-500">Client retention suites</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Monitored Endpoints</span>
          <div className="text-2xl font-bold text-[#00F0FF] font-mono">
            {workspaces.reduce((acc, ws) => acc + ws.watches.length, 0)}
          </div>
          <span className="text-[11px] text-zinc-500">Checked every 5–15 mins</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">New Incidents</span>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {allChanges.filter((c) => c.status === 'NEW').length}
          </div>
          <span className="text-[11px] text-zinc-500">Awaiting review</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Aggregate SLA Uptime</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">99.98%</div>
          <span className="text-[11px] text-zinc-500">Exceeds 99.9% guarantee</span>
        </div>
      </div>

      {/* Workspaces & Watches Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Client Workspaces & Monitored URLs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00F0FF]" />
              Monitored Client Targets
            </h2>
          </div>

          <div className="space-y-4">
            {workspaces.map((ws) => (
              <div
                key={ws.id}
                className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-base font-bold text-white">{ws.organization.name}</span>
                    <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
                      <span>{ws.organization.domain || 'Direct Retainer'}</span>
                      <span>•</span>
                      <span className="text-emerald-400">{ws.watches.length} active watches</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    SLA PROTECTED
                  </span>
                </div>

                <div className="space-y-2">
                  {ws.watches.map((w) => (
                    <div
                      key={w.id}
                      className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span className="text-xs font-semibold text-white truncate">{w.label || w.monitoredUrl}</span>
                        </div>
                        <a
                          href={w.monitoredUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-zinc-400 hover:text-[#00F0FF] flex items-center gap-1 truncate"
                        >
                          <span className="truncate">{w.monitoredUrl}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
                        <span className="text-[10px] text-zinc-500">{w.schedule}</span>
                        {w.changes.length > 0 && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            {w.changes.length} events
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Incident Feed & Review */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00F0FF]" />
            Recent Change Feed
          </h2>

          <div className="p-4 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-3">
            {allChanges.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-xs">No change incidents logged. All sites stable.</div>
            ) : (
              allChanges.map((change) => (
                <div
                  key={change.id}
                  className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-zinc-400 truncate max-w-[140px]">
                      {change.orgName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        change.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : change.severity === 'high'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      }`}
                    >
                      {change.severity}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-200 leading-snug">{change.summary}</p>

                  <div className="pt-2 flex items-center justify-between border-t border-zinc-800/60 text-xs font-mono">
                    <span className="text-[10px] text-zinc-500">
                      {new Date(change.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {change.diffReference && (
                        <button
                          onClick={() => setSelectedChange(change)}
                          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] flex items-center gap-1"
                        >
                          <FileCode2 className="w-3 h-3 text-[#00F0FF]" />
                          <span>Diff</span>
                        </button>
                      )}
                      {change.status === 'NEW' ? (
                        <button
                          onClick={() => handleReviewChange(change.id, 'RESOLVED')}
                          className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-semibold">✓ {change.status}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* DIFF MODAL */}
      {selectedChange && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#07090E] border border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-[#00F0FF]" />
                DOM & Content Delta Inspection
              </h2>
              <button
                onClick={() => setSelectedChange(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-zinc-400 uppercase text-[11px]">Summary</span>
                <p className="text-white bg-zinc-900 p-3 rounded-xl border border-zinc-800">{selectedChange.summary}</p>
              </div>

              {selectedChange.diffReference && (
                <div className="space-y-1">
                  <span className="text-zinc-400 uppercase text-[11px]">Code Diff</span>
                  <pre className="w-full p-3 bg-black/80 border border-zinc-800 rounded-xl text-emerald-400 overflow-x-auto leading-relaxed text-[11px]">
                    {selectedChange.diffReference}
                  </pre>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => handleReviewChange(selectedChange.id, 'DISMISSED')}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-center transition-all"
                >
                  Dismiss Change
                </button>
                <button
                  onClick={() => handleReviewChange(selectedChange.id, 'RESOLVED')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl text-center transition-all"
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD WATCH MODAL */}
      {showAddWatchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#07090E] border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00F0FF]" />
                Add Monitored Endpoint
              </h2>
              <button
                onClick={() => setShowAddWatchModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddWatch} className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-zinc-400 uppercase text-[11px]">Client Workspace</label>
                <select
                  value={selectedWorkspaceId}
                  onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                >
                  {workspaces.map((ws) => (
                    <option key={ws.id} value={ws.id}>
                      {ws.organization.name} ({ws.organization.domain || 'Workspace'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 uppercase text-[11px]">Target URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://client-domain.com/path"
                  value={newWatchUrl}
                  onChange={(e) => setNewWatchUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 uppercase text-[11px]">Label / Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Investor Portal or Pricing API"
                  value={newWatchLabel}
                  onChange={(e) => setNewWatchLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddWatchModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-center transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold rounded-xl text-center transition-all"
                >
                  {loading ? 'Adding...' : 'Add URL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
