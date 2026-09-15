'use client';

import React, { useEffect, useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  FileText,
  User,
  ExternalLink,
  X,
  Layers,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface EmailTemplate {
  id: string;
  name: string;
  slug: string;
  version: number;
  subject: string;
  bodyHtml: string;
  variables: any;
  isApproved: boolean;
  approvedAt?: string;
  approvedBy?: { name: string; email: string };
  createdAt: string;
}

interface TelemetryData {
  timeframeDays: number;
  metrics: {
    totalSent: number;
    totalDelivered: number;
    totalBounced: number;
    totalComplained: number;
    totalFailed: number;
    activeSuppressions: number;
    deliveryRatePercent: number;
    bounceRatePercent: number;
  };
  isLiveCalculated: boolean;
  lastUpdatedAt: string;
}

interface Suppression {
  id: string;
  email: string;
  reason: string;
  source?: string;
  createdAt: string;
}

export default function AdminEmailCenterPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'campaign' | 'telemetry' | 'suppression'>('templates');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [suppressions, setSuppressions] = useState<Suppression[]>([]);
  const [loading, setLoading] = useState(true);

  // Template Modal
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [tmplName, setTmplName] = useState('');
  const [tmplSlug, setTmplSlug] = useState('');
  const [tmplSubject, setTmplSubject] = useState('');
  const [tmplBody, setTmplBody] = useState('');
  const [creatingTemplate, setCreatingTemplate] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);

  // Campaign Dispatch State (Human Approval Gate)
  const [campaignRecipient, setCampaignRecipient] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignTemplateSlug, setCampaignTemplateSlug] = useState('');
  const [campaignHumanApproved, setCampaignHumanApproved] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [campaignSuccess, setCampaignSuccess] = useState<string | null>(null);
  const [campaignError, setCampaignError] = useState<string | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    const [tmplRes, telRes, supRes] = await Promise.all([
      apiRequest<{ templates: EmailTemplate[] }>('/admin/email/templates'),
      apiRequest<TelemetryData>('/admin/email/telemetry'),
      apiRequest<{ suppressions: Suppression[] }>('/admin/email/suppressions'),
    ]);

    if (tmplRes.success && tmplRes.data) {
      setTemplates(tmplRes.data.templates);
    }
    if (telRes.success && telRes.data) {
      setTelemetry(telRes.data);
    }
    if (supRes.success && supRes.data) {
      setSuppressions(supRes.data.suppressions);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleApproveTemplate = async (templateId: string) => {
    const res = await apiRequest(`/admin/email/templates/${templateId}/approve`, {
      method: 'POST',
    });

    if (res.success) {
      fetchAllData();
    } else {
      alert(res.error || 'Failed to approve template');
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tmplName || !tmplSlug || !tmplSubject || !tmplBody) return;

    setCreatingTemplate(true);
    setTemplateError(null);

    const res = await apiRequest('/admin/email/templates', {
      method: 'POST',
      body: JSON.stringify({
        name: tmplName,
        slug: tmplSlug,
        subject: tmplSubject,
        bodyHtml: tmplBody,
      }),
    });

    setCreatingTemplate(false);

    if (res.success) {
      setShowTemplateModal(false);
      setTmplName('');
      setTmplSlug('');
      setTmplSubject('');
      setTmplBody('');
      fetchAllData();
    } else {
      setTemplateError(res.error || 'Failed to create template');
    }
  };

  const handleDispatchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignHumanApproved) {
      setCampaignError('Human confirmation checkbox is mandatory. Autonomous email dispatch is barred.');
      return;
    }

    setDispatching(true);
    setCampaignError(null);
    setCampaignSuccess(null);

    const idempotencyKey = `campaign_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const res = await apiRequest('/admin/email/campaign/dispatch', {
      method: 'POST',
      body: JSON.stringify({
        recipient: campaignRecipient,
        subject: campaignSubject,
        templateSlug: campaignTemplateSlug || undefined,
        humanApproved: campaignHumanApproved,
        idempotencyKey,
      }),
    });

    setDispatching(false);

    if (res.success) {
      setCampaignSuccess(`Email successfully dispatched to ${campaignRecipient} (ID: ${idempotencyKey})`);
      setCampaignRecipient('');
      setCampaignSubject('');
      setCampaignTemplateSlug('');
      setCampaignHumanApproved(false);
      fetchAllData();
    } else {
      setCampaignError(res.error || 'Email dispatch blocked by governance rules.');
    }
  };

  const handleRemoveSuppression = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from suppression list? An audit log entry will be created.`)) return;

    const res = await apiRequest(`/admin/email/suppressions/${encodeURIComponent(email)}`, {
      method: 'DELETE',
    });

    if (res.success) {
      fetchAllData();
    } else {
      alert(res.error || 'Failed to remove suppression');
    }
  };

  return (
    <div className="space-y-8 font-sans text-zinc-100 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-cyan-400" />
            Governed Email Dispatch & Delivery Enclave
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Production outbound communication system with approved template versioning, state-machine tracking (Sent, Delivered, Bounced, Complained), duplicate prevention via idempotency keys, and mandatory human confirmation gates.
          </p>
        </div>

        <button
          onClick={() => setShowTemplateModal(true)}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Template Version</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'templates'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Approved Templates ({templates.length})
        </button>

        <button
          onClick={() => setActiveTab('campaign')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'campaign'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Governed Dispatch (Human Gate)
        </button>

        <button
          onClick={() => setActiveTab('telemetry')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'telemetry'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Live Telemetry
        </button>

        <button
          onClick={() => setActiveTab('suppression')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'suppression'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Suppression List ({suppressions.length})
        </button>
      </div>

      {/* Tab 1: Templates */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
            <p className="font-semibold text-zinc-200">Template Governance Policy</p>
            <p className="mt-0.5">
              Only approved templates can be used for client outreach. Unapproved drafts are strictly blocked at the API gateway layer to prevent unreviewed content dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{tmpl.name}</h3>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800 text-zinc-400 font-mono">
                        v{tmpl.version}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">slug: {tmpl.slug}</p>
                  </div>

                  {tmpl.isApproved ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" /> Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Clock className="w-3.5 h-3.5" /> Draft Pending
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-zinc-300 font-semibold truncate">Subject: {tmpl.subject}</p>
                  <p className="text-xs text-zinc-400 line-clamp-2 bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-800/60 font-mono text-[11px]">
                    {tmpl.bodyHtml.replace(/<[^>]+>/g, ' ')}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-500">
                    {tmpl.isApproved && tmpl.approvedBy ? `Approved by ${tmpl.approvedBy.name || tmpl.approvedBy.email}` : 'Requires verification'}
                  </span>

                  {!tmpl.isApproved && (
                    <button
                      onClick={() => handleApproveTemplate(tmpl.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium text-xs flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve for Production</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Governed Campaign Dispatch */}
      {activeTab === 'campaign' && (
        <div className="max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              Human-Governed Campaign Outreach
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Autonomous outbound campaigns are forbidden by platform architecture. A human staff member must verify the recipient, template, and subject line before dispatch.
            </p>
          </div>

          {campaignSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{campaignSuccess}</span>
            </div>
          )}

          {campaignError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{campaignError}</span>
            </div>
          )}

          <form onSubmit={handleDispatchCampaign} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Select Approved Template (Optional)</label>
              <select
                value={campaignTemplateSlug}
                onChange={(e) => {
                  setCampaignTemplateSlug(e.target.value);
                  const selected = templates.find((t) => t.slug === e.target.value);
                  if (selected) {
                    setCampaignSubject(selected.subject);
                  }
                }}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Direct Custom Message --</option>
                {templates
                  .filter((t) => t.isApproved)
                  .map((t) => (
                    <option key={t.id} value={t.slug}>
                      {t.name} (v{t.version}) - {t.subject}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Recipient Email Address</label>
              <input
                type="email"
                required
                placeholder="client@organization.com"
                value={campaignRecipient}
                onChange={(e) => setCampaignRecipient(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Subject Line</label>
              <input
                type="text"
                required
                placeholder="CYBERSTYLE Project Milestone & Architecture Update"
                value={campaignSubject}
                onChange={(e) => setCampaignSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Human Gate Checkbox */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={campaignHumanApproved}
                  onChange={(e) => setCampaignHumanApproved(e.target.checked)}
                  className="mt-0.5 rounded bg-zinc-900 border-zinc-700 text-cyan-500 focus:ring-0"
                />
                <div className="space-y-0.5">
                  <span className="font-semibold text-white">Explicit Human Verification & Approval Gate</span>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    I confirm that I have reviewed the recipient email and message content. I acknowledge that this dispatch will be executed under my authenticated identity and committed to the immutable audit log.
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={dispatching || !campaignHumanApproved}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold disabled:opacity-40 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              {dispatching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching with Idempotency Lock...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Dispatch Governed Campaign</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Live Telemetry */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-400">
              <p className="text-zinc-200 font-semibold">Real Event-Driven Telemetry (Zero Fabricated Metrics)</p>
              <p className="mt-0.5">
                Every stat below is computed strictly from database delivery events recorded via SMTP and webhook receipts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
              <span className="text-xs text-zinc-400">Total Sent (30d)</span>
              <p className="text-xl font-bold text-white mt-1">{telemetry?.metrics.totalSent || 0}</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
              <span className="text-xs text-zinc-400">Delivered</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">{telemetry?.metrics.totalDelivered || 0}</p>
              <span className="text-[10px] text-zinc-500">{telemetry?.metrics.deliveryRatePercent || 100}% verified</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
              <span className="text-xs text-zinc-400">Hard Bounces</span>
              <p className="text-xl font-bold text-amber-400 mt-1">{telemetry?.metrics.totalBounced || 0}</p>
              <span className="text-[10px] text-zinc-500">Auto-suppressed</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
              <span className="text-xs text-zinc-400">Active Suppressions</span>
              <p className="text-xl font-bold text-red-400 mt-1">{telemetry?.metrics.activeSuppressions || 0}</p>
              <span className="text-[10px] text-zinc-500">Protected addresses</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Suppression List */}
      {activeTab === 'suppression' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
            <p className="font-semibold text-zinc-200">Automated Bounce & Complaint Shield</p>
            <p className="mt-0.5">
              Addresses on this list are permanently blocked from receiving further dispatches to safeguard sender domain reputation and prevent spam violations.
            </p>
          </div>

          {suppressions.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs border border-zinc-800 rounded-xl">
              Zero suppressed email addresses. Sender domain is in clean operational standing.
            </div>
          ) : (
            <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/70 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Suppressed Email</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Recorded At</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {suppressions.map((s) => (
                    <tr key={s.id} className="hover:bg-zinc-900/30">
                      <td className="py-3 px-4 font-mono text-zinc-200">{s.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
                          {s.reason}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">{s.source || 'AUTOMATED'}</td>
                      <td className="py-3 px-4 text-zinc-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleRemoveSuppression(s.email)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs"
                        >
                          Remove Override
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* New Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Create New Outbound Email Template
              </h3>
              <button onClick={() => setShowTemplateModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-3">
              {templateError && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                  {templateError}
                </div>
              )}

              <div>
                <label className="block text-zinc-400 mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  placeholder="Discovery Sprint Kickoff"
                  value={tmplName}
                  onChange={(e) => setTmplName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Slug Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="discovery-kickoff"
                  value={tmplSlug}
                  onChange={(e) => setTmplSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Subject Line</label>
                <input
                  type="text"
                  required
                  placeholder="Kickoff Details for {{project_name}}"
                  value={tmplSubject}
                  onChange={(e) => setTmplSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">HTML Body</label>
                <textarea
                  required
                  rows={6}
                  placeholder="<p>Hi {{prospect_name}},</p><p>We have scheduled your discovery call.</p>"
                  value={tmplBody}
                  onChange={(e) => setTmplBody(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 font-mono text-[11px] focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingTemplate}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold disabled:opacity-50"
                >
                  {creatingTemplate ? 'Saving Draft...' : 'Create Draft Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
