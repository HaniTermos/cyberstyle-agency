'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Sparkles,
  Server,
  RefreshCw,
  FileText,
  User,
  ArrowRight,
  Inbox,
  Check,
  Layers,
  Key,
  MessageSquare,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  status: 'SENT' | 'FAILED' | 'MOCKED';
  sentAt: string;
  provider: string;
  messageId?: string;
  error?: string;
}

interface EmailThread {
  id: string;
  threadId: string;
  subject: string;
  snippet?: string;
  status: 'OPEN' | 'REPLIED' | 'CLOSED';
  lastMessageAt: string;
  participantEmail?: string;
  relatedType?: string;
  relatedId?: string;
  messages?: EmailMessage[];
}

interface EmailMessage {
  id: string;
  threadId: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  direction: 'inbound' | 'outbound';
  sentAt: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: string;
  body: string;
}

interface TransportStatus {
  transportMode: 'GMAIL_API' | 'SMTP' | 'SIMULATED';
  configuredFrom: string;
  smtpConfigured: boolean;
  gmailApiConfigured: boolean;
  accounts: Array<{
    id: string;
    email: string;
    provider: string;
    isActive: boolean;
    lastSyncedAt: string;
  }>;
}

export default function AdminEmailHubPage() {
  const [activeTab, setActiveTab] = useState<'compose' | 'inbox' | 'templates' | 'settings' | 'logs'>('compose');

  // Status & Transport
  const [transportStatus, setTransportStatus] = useState<TransportStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Outreach & Quick Compose
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [relatedType, setRelatedType] = useState<'GENERAL' | 'LEAD' | 'CLIENT' | 'PROJECT' | 'INVOICE'>('GENERAL');
  const [relatedId, setRelatedId] = useState('');
  const [sendingCustom, setSendingCustom] = useState(false);
  const [composeFeedback, setComposeFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Inbox & Threads
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Templates
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Logs
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Diagnostic Test
  const [testEmail, setTestEmail] = useState('hanitormos45@gmail.com');
  const [testNote, setTestNote] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testFeedback, setTestFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Gmail Connect Form
  const [connectEmail, setConnectEmail] = useState('');
  const [connectRefreshToken, setConnectRefreshToken] = useState('');
  const [connectingAccount, setConnectingAccount] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoadingStatus(true);
      const res = await apiRequest<TransportStatus>('/admin/email/status');
      if (res && res.data) {
        setTransportStatus(res.data);
      }
    } catch (e) {
      console.warn('Could not fetch email status:', e);
    } finally {
      setLoadingStatus(false);
    }
  };

  const fetchThreads = async () => {
    try {
      setLoadingThreads(true);
      const res = await apiRequest<{ threads: EmailThread[] }>('/admin/email/threads');
      if (res && res.data) {
        setThreads(res.data.threads || []);
        if (res.data.threads?.length > 0 && !selectedThread) {
          setSelectedThread(res.data.threads[0] || null);
        }
      }
    } catch (e) {
      console.warn('Could not fetch email threads:', e);
    } finally {
      setLoadingThreads(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const res = await apiRequest<{ templates: EmailTemplate[] }>('/admin/email/templates');
      if (res && res.data) {
        setTemplates(res.data.templates || []);
      }
    } catch (e) {
      console.warn('Could not fetch templates:', e);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoadingLogs(true);
      const res = await apiRequest<{ logs: EmailLog[] }>('/admin/email/logs');
      if (res && res.data) {
        setLogs(res.data.logs || []);
      }
    } catch (e) {
      console.warn('Could not fetch email logs:', e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchThreads();
    fetchTemplates();
    fetchLogs();
  }, []);

  // Quick Compose Action
  const handleSendCompose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail || !subject || !htmlBody) return;

    try {
      setSendingCustom(true);
      setComposeFeedback(null);

      const res = await apiRequest('/admin/email/send-custom', {
        method: 'POST',
        body: JSON.stringify({
          to: toEmail,
          subject,
          html: htmlBody,
          relatedType: relatedType !== 'GENERAL' ? relatedType : undefined,
          relatedId: relatedId || undefined,
        }),
      });

      if (res.success) {
        setComposeFeedback({
          success: true,
          message: `Email dispatched successfully to ${toEmail}. Thread & audit log recorded.`,
        });
        fetchLogs();
        fetchThreads();
      } else {
        setComposeFeedback({
          success: false,
          message: res.error || 'Failed to dispatch email.',
        });
      }
    } catch (err: any) {
      setComposeFeedback({
        success: false,
        message: err.message || 'Network error while dispatching email.',
      });
    } finally {
      setSendingCustom(false);
    }
  };

  // Reply In Thread
  const handleSendReply = async () => {
    if (!selectedThread || !replyBody.trim()) return;

    try {
      setSendingReply(true);
      const recipient = selectedThread.participantEmail || selectedThread.messages?.[0]?.recipient || 'client@example.com';

      const res = await apiRequest(`/admin/email/threads/${selectedThread.id}/reply`, {
        method: 'POST',
        body: JSON.stringify({
          to: recipient,
          subject: selectedThread.subject.startsWith('Re:') ? selectedThread.subject : `Re: ${selectedThread.subject}`,
          body: replyBody,
        }),
      });

      if (res.success) {
        setReplyBody('');
        // Reload single thread
        const updated = await apiRequest<{ thread: EmailThread }>(`/admin/email/threads/${selectedThread.id}`);
        if (updated && updated.data?.thread) {
          setSelectedThread(updated.data.thread);
        }
        fetchThreads();
        fetchLogs();
      }
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setSendingReply(false);
    }
  };

  // Template Loader
  const loadTemplateIntoComposer = (tmpl: EmailTemplate) => {
    setSubject(tmpl.subject);
    setHtmlBody(tmpl.body);
    if (tmpl.category.includes('LEAD')) setRelatedType('LEAD');
    else if (tmpl.category.includes('PROPOSAL')) setRelatedType('PROJECT');
    else if (tmpl.category.includes('INVOICE')) setRelatedType('INVOICE');
    else if (tmpl.category.includes('RETAINER')) setRelatedType('CLIENT');
    setActiveTab('compose');
  };

  // Test Dispatcher
  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSendingTest(true);
      setTestFeedback(null);

      const res = await apiRequest<{ message: string }>('/admin/email/send-test', {
        method: 'POST',
        body: JSON.stringify({
          toEmail: testEmail,
          message: testNote || undefined,
        }),
      });

      if (res.success) {
        setTestFeedback({
          success: true,
          message: res.data?.message || `Diagnostic email dispatched to ${testEmail}!`,
        });
        fetchLogs();
      } else {
        setTestFeedback({
          success: false,
          message: res.error || 'Failed to dispatch test email.',
        });
      }
    } catch (err: any) {
      setTestFeedback({
        success: false,
        message: err.message || 'Network error.',
      });
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Mail className="w-6 h-6 text-[#00F0FF]" />
              Email &amp; Communication Command Hub
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border flex items-center gap-1.5 ${
                transportStatus?.transportMode === 'GMAIL_API'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : transportStatus?.transportMode === 'SMTP'
                  ? 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              <Server className="w-3 h-3" />
              MODE: {transportStatus?.transportMode || 'DETECTING...'}
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Professional Gmail API OAuth dispatch, Google SMTP failover, bi-directional client threads, and executive outreach workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchStatus();
              fetchThreads();
              fetchLogs();
            }}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono rounded-xl border border-zinc-700/80 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin' : ''}`} />
            <span>Sync Engine</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('compose')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'compose'
              ? 'border-[#00F0FF] text-[#00F0FF] bg-[#00F0FF]/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Outreach &amp; Compose</span>
        </button>

        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'inbox'
              ? 'border-[#00F0FF] text-[#00F0FF] bg-[#00F0FF]/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Inbox &amp; Threads</span>
          {threads.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-800 text-[#00F0FF] font-bold">
              {threads.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'templates'
              ? 'border-[#00F0FF] text-[#00F0FF] bg-[#00F0FF]/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Agency Playbooks</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'border-[#00F0FF] text-[#00F0FF] bg-[#00F0FF]/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Gmail &amp; Transport</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'logs'
              ? 'border-[#00F0FF] text-[#00F0FF] bg-[#00F0FF]/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Audit Ledger</span>
          {logs.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-800 text-zinc-400">
              {logs.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: OUTREACH & QUICK COMPOSE */}
      {activeTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          <div className="lg:col-span-2 rounded-2xl bg-[#07090E] border border-zinc-800 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF]">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">Executive Email Composer</h3>
                  <p className="text-[11px] text-zinc-400">Threaded outbound dispatch with entity linking</p>
                </div>
              </div>

              <div className="text-[11px] font-mono text-zinc-500">
                From: <span className="text-zinc-300">{transportStatus?.configuredFrom || 'info@cyberstyle.net'}</span>
              </div>
            </div>

            {composeFeedback && (
              <div
                className={`p-4 rounded-xl text-xs flex items-start gap-3 ${
                  composeFeedback.success
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                }`}
              >
                {composeFeedback.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{composeFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSendCompose} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-300 uppercase">Recipient (To)</label>
                  <input
                    type="email"
                    required
                    value={toEmail}
                    onChange={(e) => setToEmail(e.target.value)}
                    placeholder="client@acmecorp.com"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-300 uppercase">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="CYBERSTYLE Project Milestone & Architecture Update"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              {/* Entity Linking */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
                <div className="space-y-1.5">
                  <label className="text-zinc-400 uppercase text-[10px]">Link to CRM Entity</label>
                  <select
                    value={relatedType}
                    onChange={(e) => setRelatedType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 text-xs focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="GENERAL">General Email</option>
                    <option value="LEAD">Lead Record</option>
                    <option value="CLIENT">Client Account</option>
                    <option value="PROJECT">Project / Proposal</option>
                    <option value="INVOICE">Invoice Settlement</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 uppercase text-[10px]">Entity ID (Optional)</label>
                  <input
                    type="text"
                    value={relatedId}
                    onChange={(e) => setRelatedId(e.target.value)}
                    placeholder="e.g. lead_123 or inv_456"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-zinc-300">
                  <label className="uppercase">Message Body (HTML Supported)</label>
                  <span className="text-[10px] text-zinc-500 font-sans">
                    Supports &lt;p&gt;, &lt;strong&gt;, &lt;a&gt;, &lt;ul&gt;
                  </span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={htmlBody}
                  onChange={(e) => setHtmlBody(e.target.value)}
                  placeholder="<p>Dear Partner,</p><p>We are pleased to inform you that your Next.js 15 WebGL architectural deployment is complete.</p>"
                  className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#00F0FF] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-500">Insert tag:</span>
                  {['{{contactName}}', '{{portalUrl}}', '{{invoiceAmount}}'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setHtmlBody((prev) => prev + ` ${t}`)}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={sendingCustom}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className={`w-3.5 h-3.5 ${sendingCustom ? 'animate-spin' : ''}`} />
                  <span>{sendingCustom ? 'Transmitting...' : 'Dispatch Email'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar: Contextual Workflow Helpers */}
          <div className="space-y-5">
            <div className="rounded-2xl bg-[#07090E] border border-zinc-800 p-5 space-y-4">
              <div className="flex items-center gap-2 text-white font-mono font-bold text-xs">
                <Sparkles className="w-4 h-4 text-[#00F0FF]" />
                <span>Quick Playbook Insertion</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                Populate the composer with battle-tested agency copy for cold leads, proposals, and overdue balances:
              </p>

              <div className="space-y-2">
                {templates.slice(0, 3).map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => loadTemplateIntoComposer(tmpl)}
                    className="w-full text-left p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 transition-colors group"
                  >
                    <div className="text-xs font-semibold text-zinc-200 group-hover:text-[#00F0FF] transition-colors">
                      {tmpl.name}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{tmpl.category}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#07090E] border border-zinc-800 p-5 space-y-3 font-mono text-xs">
              <div className="text-zinc-400 uppercase text-[10px]">Active Routing</div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div className="text-white font-semibold flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  {transportStatus?.transportMode === 'GMAIL_API' ? 'Gmail API OAuth (Native)' : 'Nodemailer SMTP Gateway'}
                </div>
                <div className="text-[11px] text-zinc-400">
                  Logs &amp; threading enabled on PostgreSQL
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INBOX & THREADS */}
      {activeTab === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Left Thread List */}
          <div className="rounded-2xl bg-[#07090E] border border-zinc-800 overflow-hidden flex flex-col h-[650px]">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-[#00F0FF]" />
                <h3 className="text-xs font-bold text-white font-mono uppercase">Conversation Threads</h3>
              </div>
              <button
                onClick={fetchThreads}
                className="text-zinc-500 hover:text-white p-1 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingThreads ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60">
              {threads.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                  No active conversation threads. Sent emails and replies will automatically form threads here.
                </div>
              ) : (
                threads.map((thr) => (
                  <div
                    key={thr.id}
                    onClick={() => setSelectedThread(thr)}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedThread?.id === thr.id
                        ? 'bg-[#00F0FF]/10 border-l-2 border-[#00F0FF]'
                        : 'hover:bg-zinc-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-white truncate max-w-[160px]">
                        {thr.participantEmail || 'Client Conversation'}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {new Date(thr.lastMessageAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-300 font-medium truncate mb-1">{thr.subject}</div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-zinc-500">{thr.relatedType || 'GENERAL'}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] ${
                          thr.status === 'REPLIED'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {thr.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Message Thread Detail */}
          <div className="lg:col-span-2 rounded-2xl bg-[#07090E] border border-zinc-800 p-6 flex flex-col h-[650px]">
            {selectedThread ? (
              <>
                <div className="border-b border-zinc-800/80 pb-4 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{selectedThread.subject}</h3>
                    <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
                      <span>Thread ID: {selectedThread.threadId}</span>
                      <span>&bull;</span>
                      <span>Status: {selectedThread.status}</span>
                    </div>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {(selectedThread.messages && selectedThread.messages.length > 0) ? (
                    selectedThread.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-xl border text-xs font-sans space-y-2 ${
                          msg.direction === 'outbound'
                            ? 'bg-zinc-900/80 border-[#00F0FF]/30 ml-8'
                            : 'bg-zinc-900/40 border-zinc-800 mr-8'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 border-b border-zinc-800 pb-2">
                          <span className="text-white font-semibold">
                            {msg.direction === 'outbound' ? 'CYBERSTYLE (You)' : msg.sender}
                          </span>
                          <span>{new Date(msg.sentAt).toLocaleTimeString()}</span>
                        </div>
                        <div
                          className="text-zinc-200 leading-relaxed font-sans"
                          dangerouslySetInnerHTML={{ __html: msg.body }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400 font-mono">
                      Initial thread envelope established. Awaiting client inbound response.
                    </div>
                  )}
                </div>

                {/* In-Thread Reply Box */}
                <div className="pt-4 border-t border-zinc-800 space-y-3">
                  <textarea
                    rows={3}
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder="Type your reply to maintain thread continuity in Gmail..."
                    className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-[#00F0FF]"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSendReply}
                      disabled={sendingReply || !replyBody.trim()}
                      className="flex items-center gap-2 px-5 py-2 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Send className={`w-3.5 h-3.5 ${sendingReply ? 'animate-spin' : ''}`} />
                      <span>{sendingReply ? 'Sending...' : 'Reply in Thread'}</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 font-mono text-xs">
                <MessageSquare className="w-8 h-8 mb-2 opacity-40 text-[#00F0FF]" />
                <span>Select a thread from the left column to read or reply.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AGENCY PLAYBOOK TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="rounded-2xl bg-[#07090E] border border-zinc-800 p-6 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-semibold">
                    {tmpl.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                  {tmpl.name}
                </h3>
                <div className="text-xs font-mono text-zinc-400 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/80">
                  Subject: <span className="text-zinc-200 font-sans">{tmpl.subject}</span>
                </div>
                <div
                  className="text-xs text-zinc-400 line-clamp-4 font-sans leading-relaxed border-t border-zinc-800 pt-3"
                  dangerouslySetInnerHTML={{ __html: tmpl.body }}
                />
              </div>

              <button
                onClick={() => loadTemplateIntoComposer(tmpl)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-900 hover:bg-[#00F0FF] text-zinc-300 hover:text-black font-semibold text-xs font-mono rounded-xl border border-zinc-800 hover:border-[#00F0FF] transition-all cursor-pointer"
              >
                <span>Load into Composer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: GMAIL & TRANSPORT SETTINGS */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {/* Card 1: Diagnostic Live Test Sender */}
          <div className="rounded-2xl bg-[#07090E] border border-zinc-800 p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-4">
              <div className="p-2 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF]">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">Live Diagnostic Sender</h3>
                <p className="text-[11px] text-zinc-400">Verifies deliverability via current transport engine</p>
              </div>
            </div>

            {testFeedback && (
              <div
                className={`p-4 rounded-xl text-xs flex items-start gap-3 ${
                  testFeedback.success
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                }`}
              >
                {testFeedback.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{testFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSendTest} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-zinc-300 uppercase">Target Recipient</label>
                <input
                  type="email"
                  required
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 uppercase">Diagnostic Memo</label>
                <input
                  type="text"
                  value={testNote}
                  onChange={(e) => setTestNote(e.target.value)}
                  placeholder="Testing Google OAuth / SMTP pipeline verification..."
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <button
                type="submit"
                disabled={sendingTest}
                className="w-full py-3 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
              >
                {sendingTest ? 'Transmitting...' : `Send Diagnostic Email to ${testEmail}`}
              </button>
            </form>
          </div>

          {/* Card 2: Transport Configuration & Connected Accounts */}
          <div className="rounded-2xl bg-[#07090E] border border-zinc-800 p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-4">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">Transport Architecture</h3>
                <p className="text-[11px] text-zinc-400">Gmail API OAuth vs Nodemailer SMTP</p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div className="text-zinc-400 uppercase text-[10px]">Active Provider Mode</div>
                <div className="text-white font-semibold flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      transportStatus?.transportMode === 'GMAIL_API'
                        ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]'
                        : 'bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]'
                    }`}
                  />
                  <span>{transportStatus?.transportMode}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div className="text-zinc-400 uppercase text-[10px]">Configured Sender Address</div>
                <div className="text-zinc-200">{transportStatus?.configuredFrom || 'info@cyberstyle.net'}</div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-[11px] text-zinc-400 font-sans leading-relaxed">
                💡 <strong>Gmail API Credentials:</strong> When ready to send via your official Google Workspace account, configure <code className="text-[#00F0FF]">GMAIL_CLIENT_ID</code>, <code className="text-[#00F0FF]">GMAIL_CLIENT_SECRET</code>, and <code className="text-[#00F0FF]">GMAIL_REFRESH_TOKEN</code> in your environment. The system will automatically promote to native Gmail API with zero downtime.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DELIVERY & AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="rounded-2xl bg-[#07090E] border border-zinc-800 overflow-hidden shadow-xl animate-in fade-in duration-200">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00F0FF]" />
              <h3 className="text-sm font-bold text-white font-mono">Dispatch Audit Ledger</h3>
            </div>
            <span className="text-xs text-zinc-400 font-mono">{logs.length} logged entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-zinc-900/60 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Recipient</th>
                  <th className="px-5 py-3.5">Subject</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Provider</th>
                  <th className="px-5 py-3.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-zinc-500">
                      No email dispatches recorded in ledger yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-white">{log.to}</td>
                      <td className="px-5 py-3.5 text-zinc-300 max-w-xs truncate">{log.subject}</td>
                      <td className="px-5 py-3.5">
                        {log.status === 'SENT' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> SENT
                          </span>
                        ) : log.status === 'MOCKED' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30">
                            SIMULATED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                            <AlertCircle className="w-3 h-3" /> FAILED
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-zinc-400 text-[11px]">{log.provider}</td>
                      <td className="px-5 py-3.5 text-right text-zinc-500 text-[11px]">
                        {new Date(log.sentAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
