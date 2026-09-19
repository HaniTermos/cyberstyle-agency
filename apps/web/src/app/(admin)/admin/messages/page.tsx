'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  Send,
  Paperclip,
  ShieldAlert,
  CheckCircle2,
  Lock,
  FileText,
  Download,
  Building2,
  Briefcase,
  Receipt,
  Users,
  ChevronRight,
  Filter,
  X,
  Radio,
  Clock,
  Sparkles,
  AlertCircle,
  Edit2,
  Trash2
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface Participant {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  lastReadAt?: string;
}

interface FileAsset {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

interface MessageItem {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  messageType: 'TEXT' | 'SYSTEM' | 'FILE';
  fileId?: string | null;
  file?: FileAsset | null;
  isInternal: boolean;
  createdAt: string;
}

interface ThreadItem {
  id: string;
  organizationId: string;
  organizationName?: string;
  title: string;
  status: 'OPEN' | 'CLOSED';
  contextType: 'LEAD' | 'PROJECT' | 'INVOICE' | 'GENERAL';
  contextId?: string | null;
  lastMessageAt: string;
  createdAt: string;
  unreadCount: number;
  participants: Participant[];
  messages?: MessageItem[];
  _count?: {
    messages: number;
  };
}

const FALLBACK_ORGANIZATIONS = [
  { id: 'org_acme_corp', name: 'Acme Global Corp' },
  { id: 'org_vortex_ai', name: 'Vortex AI Trading' },
  { id: 'org_nexus_health', name: 'Nexus Health Systems' },
];

export default function AdminMessagesPage() {
  const [threads, setThreads] = useState<ThreadItem[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<ThreadItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'NEEDS_REPLY' | 'CLOSED'>('OPEN');
  const [contextFilter, setContextFilter] = useState<string>('ALL');

  // Compose State
  const [inputText, setInputText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // New Thread Modal State
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newThreadOrgId, setNewThreadOrgId] = useState(FALLBACK_ORGANIZATIONS[0]?.id || 'org_acme_corp');
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContextType, setNewThreadContextType] = useState<'GENERAL' | 'PROJECT' | 'INVOICE' | 'LEAD'>('GENERAL');
  const [newThreadContextId, setNewThreadContextId] = useState('');
  const [newThreadInitialMessage, setNewThreadInitialMessage] = useState('');
  const [creatingThread, setCreatingThread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch all threads
  const loadThreads = useCallback(async (selectFirst = false) => {
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'ALL') queryParams.append('status', statusFilter);
      if (contextFilter !== 'ALL') queryParams.append('contextType', contextFilter);

      const res = await apiRequest<any>(`/messaging/threads?${queryParams.toString()}`);
      if (res.success && res.data) {
        const threadList: ThreadItem[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.threads)
          ? res.data.threads
          : [];
        setThreads(threadList);
        if (selectFirst && threadList[0] && !activeThreadId) {
          setActiveThreadId(threadList[0].id);
        }
      } else {
        setThreads([]);
      }
    } catch (err) {
      console.error('Failed to load threads:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, contextFilter, activeThreadId]);

  // Initial load
  useEffect(() => {
    loadThreads(true);
  }, [loadThreads]);

  // Load single thread detail and initial messages
  const loadThreadDetail = useCallback(async (threadId: string) => {
    try {
      const res = await apiRequest<any>(`/messaging/threads/${threadId}`);
      if (res.success && res.data) {
        const threadObj: ThreadItem = res.data.thread || res.data;
        const msgs: MessageItem[] = res.data.messages || threadObj.messages || [];
        setActiveThread(threadObj);
        setMessages(msgs);
        setTimeout(scrollToBottom, 100);

        // Mark read
        await apiRequest(`/messaging/threads/${threadId}/read`, { method: 'POST' });
        
        // Update unread badge in list
        setThreads((prev) =>
          prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t))
        );
      }
    } catch (err) {
      console.error('Failed to load thread detail:', err);
    }
  }, []);

  useEffect(() => {
    if (activeThreadId) {
      loadThreadDetail(activeThreadId);
    }
  }, [activeThreadId, loadThreadDetail]);

  // Polling mechanism (incremental via ?since=<lastMsgId>) with bfcache lifecycle awareness
  useEffect(() => {
    if (!activeThreadId) return;

    let isPaused = false;
    let pollInterval: NodeJS.Timeout | null = null;

    const startPolling = () => {
      if (pollInterval) clearInterval(pollInterval);
      pollInterval = setInterval(async () => {
        if (isPaused || document.hidden) return;
        const lastMsg = messages[messages.length - 1];
        const sinceParam = lastMsg ? `?since=${lastMsg.id}` : '';
        try {
          const res = await apiRequest<{
            threadId: string;
            messages: MessageItem[];
            hasMore: boolean;
          }>(`/messaging/threads/${activeThreadId}/poll${sinceParam}`);

          if (res.success && res.data && res.data.messages.length > 0) {
            setMessages((prev) => {
              const existingIds = new Set(prev.map((m) => m.id));
              const newOnes = res.data!.messages.filter((m) => !existingIds.has(m.id));
              if (newOnes.length > 0) {
                setTimeout(scrollToBottom, 50);
                return [...prev, ...newOnes];
              }
              return prev;
            });
          }
        } catch (err) {
          // Silent polling error handling
        }
      }, 3500);
      pollTimerRef.current = pollInterval;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPaused = true;
      } else {
        isPaused = false;
        loadThreadDetail(activeThreadId);
      }
    };

    const handlePageHide = () => {
      isPaused = true;
      if (pollInterval) clearInterval(pollInterval);
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      isPaused = false;
      startPolling();
      if (event.persisted) {
        loadThreadDetail(activeThreadId);
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [activeThreadId, messages, loadThreadDetail]);

  // Send Message Handler
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeThreadId || (!inputText.trim() && !selectedFile)) return;

    const messageText = inputText.trim();
    const fileToUpload = selectedFile;
    const internalNoteFlag = isInternalNote;

    setInputText('');
    setSelectedFile(null);
    setIsInternalNote(false);
    setSending(true);

    const safetyTimer = setTimeout(() => {
      setSending(false);
      setUploadingFile(false);
    }, 6000);

    let uploadedFileId: string | null = null;

    try {
      // 1. Upload file if attached
      if (fileToUpload) {
        setUploadingFile(true);
        const formData = new FormData();
        formData.append('file', fileToUpload);
        if (activeThread?.organizationId) {
          formData.append('organizationId', activeThread.organizationId);
        }

        const uploadRes = await fetch('http://localhost:4000/api/v1/messaging/files', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        const uploadJson = await uploadRes.json();
        if (uploadJson.success && uploadJson.data) {
          uploadedFileId = uploadJson.data.id;
        }
        setUploadingFile(false);
      }

      // 2. Post Message
      const res = await apiRequest<MessageItem>(`/messaging/threads/${activeThreadId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          content: messageText || (fileToUpload ? `Shared file: ${fileToUpload.name}` : ''),
          messageType: uploadedFileId ? 'FILE' : 'TEXT',
          fileId: uploadedFileId,
          isInternal: internalNoteFlag,
        }),
      });

      if (res.success && res.data) {
        const newMsg = (res.data as any).message || res.data;
        setMessages((prev) => [...prev, newMsg]);
        setTimeout(scrollToBottom, 50);

        // Refresh threads list snippet
        setThreads((prev) =>
          prev.map((t) =>
            t.id === activeThreadId
              ? { ...t, lastMessageAt: new Date().toISOString() }
              : t
          )
        );
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      clearTimeout(safetyTimer);
      setSending(false);
      setUploadingFile(false);
    }
  };

  // Toggle Thread Status (OPEN / CLOSED)
  const handleToggleStatus = async () => {
    if (!activeThread) return;
    const nextStatus = activeThread.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      const res = await apiRequest<{ thread: ThreadItem }>(`/messaging/threads/${activeThread.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.success && res.data) {
        setActiveThread({ ...activeThread, status: nextStatus });
        setThreads((prev) =>
          prev.map((t) => (t.id === activeThread.id ? { ...t, status: nextStatus } : t))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Soft Delete Message (Admin Only)
  const handleSoftDeleteMessage = async (messageId: string) => {
    if (!activeThreadId) return;
    if (!confirm('Are you sure you want to soft-delete this message?')) return;
    try {
      const res = await apiRequest(`/messaging/threads/${activeThreadId}/messages/${messageId}`, {
        method: 'DELETE',
      });
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? { ...m, content: 'This message was deleted by an admin', file: null }
              : m
          )
        );
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  // Edit Message
  const handleEditMessage = async (messageId: string, currentContent: string) => {
    if (!activeThreadId) return;
    const newContent = prompt('Edit message content:', currentContent);
    if (!newContent || newContent.trim() === currentContent) return;

    try {
      const res = await apiRequest<{ message: MessageItem }>(
        `/messaging/threads/${activeThreadId}/messages/${messageId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ content: newContent.trim() }),
        }
      );
      if (res.success && res.data) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, content: newContent.trim() } : m
          )
        );
      }
    } catch (err) {
      console.error('Failed to edit message:', err);
    }
  };

  // Export Thread JSON
  const handleExportThreadJSON = async () => {
    if (!activeThreadId) return;
    try {
      const res = await apiRequest<any>(`/messaging/threads/${activeThreadId}/export`);
      if (res.success && res.data) {
        const dataStr =
          'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = `thread_export_${activeThreadId}.json`;
        a.click();
      }
    } catch (err) {
      console.error('Failed to export thread:', err);
    }
  };

  // Create New Thread
  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadInitialMessage.trim()) return;

    setCreatingThread(true);
    try {
      const res = await apiRequest<ThreadItem>('/messaging/threads', {
        method: 'POST',
        body: JSON.stringify({
          organizationId: newThreadOrgId,
          title: newThreadTitle.trim(),
          contextType: newThreadContextType,
          contextId: newThreadContextId.trim() || undefined,
          initialMessage: newThreadInitialMessage.trim(),
        }),
      });

      if (res.success && res.data) {
        const newThread = (res.data as any).thread || res.data;
        setShowNewThreadModal(false);
        setNewThreadTitle('');
        setNewThreadInitialMessage('');
        setNewThreadContextId('');
        await loadThreads(false);
        if (newThread?.id) {
          setActiveThreadId(newThread.id);
        }
      }
    } catch (err) {
      console.error('Failed to create thread:', err);
    } finally {
      setCreatingThread(false);
    }
  };

  // Filtered threads list
  const filteredThreads = threads.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.organizationName && t.organizationName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.contextType.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'NEEDS_REPLY') {
      return (
        t.status === 'OPEN' &&
        (t.unreadCount > 0 ||
          (t.messages && t.messages.length > 0 && t.messages[t.messages.length - 1]?.senderRole === 'CLIENT'))
      );
    }
    if (statusFilter === 'OPEN') return t.status === 'OPEN';
    if (statusFilter === 'CLOSED') return t.status === 'CLOSED';
    return true;
  });

  const needsReplyCount = threads.filter(
    (t) =>
      t.status === 'OPEN' &&
      (t.unreadCount > 0 ||
        (t.messages && t.messages.length > 0 && t.messages[t.messages.length - 1]?.senderRole === 'CLIENT'))
  ).length;

  return (
    <div className="space-y-6 font-sans text-zinc-100">
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#00F0FF]" />
              Client Live Messaging
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              PHASE 4 // ENCRYPTED MESH
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Threaded, contextual client communication with internal admin note isolation and authenticated asset streaming.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>REALTIME POLLING ACTIVE (3.5s)</span>
          </div>
          <button
            onClick={() => setShowNewThreadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-black font-semibold text-xs rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Thread</span>
          </button>
        </div>
      </div>

      {/* Main Split-Pane Inbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-250px)] min-h-[600px]">
        {/* Left Pane: Threads Master List */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col bg-[#07090E] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
          {/* Search & Filters Header */}
          <div className="p-4 border-b border-zinc-800/80 space-y-3 bg-zinc-950/60">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search threads, clients, contexts..."
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/60 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 overflow-x-auto">
                <button
                  onClick={() => setStatusFilter('NEEDS_REPLY')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                    statusFilter === 'NEEDS_REPLY'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                      : 'text-zinc-400 hover:text-amber-300'
                  }`}
                >
                  <span>Needs Reply</span>
                  {needsReplyCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[9px] font-bold">
                      {needsReplyCount}
                    </span>
                  )}
                </button>

                {(['OPEN', 'CLOSED', 'ALL'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium transition-all shrink-0 ${
                      statusFilter === st
                        ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <select
                value={contextFilter}
                onChange={(e) => setContextFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-mono rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#00F0FF]/60 shrink-0"
              >
                <option value="ALL">All Contexts</option>
                <option value="PROJECT">Projects</option>
                <option value="INVOICE">Invoices</option>
                <option value="LEAD">Leads</option>
                <option value="GENERAL">General</option>
              </select>
            </div>
          </div>

          {/* Thread List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40 scrollbar-thin scrollbar-thumb-zinc-800">
            {loading ? (
              <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                <div className="w-5 h-5 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading message channels...
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 font-mono text-xs space-y-2">
                <AlertCircle className="w-6 h-6 text-zinc-600 mx-auto" />
                <p>No conversation threads match the selected filters.</p>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = thread.id === activeThreadId;
                const isClientTurn =
                  thread.status === 'OPEN' &&
                  (thread.unreadCount > 0 ||
                    (thread.messages &&
                      thread.messages.length > 0 &&
                      thread.messages[thread.messages.length - 1]?.senderRole === 'CLIENT'));

                const contextIcon =
                  thread.contextType === 'PROJECT' ? (
                    <Briefcase className="w-3 h-3 text-cyan-400" />
                  ) : thread.contextType === 'INVOICE' ? (
                    <Receipt className="w-3 h-3 text-emerald-400" />
                  ) : thread.contextType === 'LEAD' ? (
                    <Users className="w-3 h-3 text-amber-400" />
                  ) : (
                    <MessageSquare className="w-3 h-3 text-zinc-400" />
                  );

                return (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full text-left p-4 transition-all relative group flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-[#00F0FF]/10 border-l-4 border-l-[#00F0FF]'
                        : 'hover:bg-zinc-900/40 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 font-medium truncate">
                        <Building2 className="w-3 h-3 text-zinc-500" />
                        {thread.organizationName || 'Client Organization'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isClientTurn && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
                            REPLY
                          </span>
                        )}
                        {thread.status === 'CLOSED' ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-zinc-800 text-zinc-400">
                            CLOSED
                          </span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                        )}
                        {thread.unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00F0FF] text-black shadow-[0_0_8px_#00F0FF]">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className={`text-xs font-semibold line-clamp-1 ${isSelected ? 'text-[#00F0FF]' : 'text-zinc-200'}`}>
                      {thread.title}
                    </h3>

                    <div className="flex items-center justify-between gap-2 mt-1 text-[10px] font-mono text-zinc-500">
                      <span className="inline-flex items-center gap-1 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
                        {contextIcon}
                        {thread.contextType}
                        {thread.contextId ? ` #${thread.contextId.slice(-6)}` : ''}
                      </span>
                      <span>
                        {new Date(thread.lastMessageAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Conversation Detail */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col bg-[#07090E] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
          {activeThread ? (
            <>
              {/* Active Thread Header */}
              <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-sm font-bold text-white truncate">{activeThread.title}</h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                        activeThread.status === 'OPEN'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {activeThread.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#00F0FF]" />
                      {activeThread.organizationName || 'Client Organization'}
                    </span>
                    <span>•</span>
                    <span className="text-zinc-500">
                      Context: <span className="text-zinc-300">{activeThread.contextType}</span>
                      {activeThread.contextId && ` (${activeThread.contextId})`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleExportThreadJSON}
                    className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-[#00F0FF] hover:border-[#00F0FF] transition-colors flex items-center gap-1.5 text-xs font-mono"
                    title="Export Thread History (JSON)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  <button
                    onClick={handleToggleStatus}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-colors ${
                      activeThread.status === 'OPEN'
                        ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                    }`}
                  >
                    {activeThread.status === 'OPEN' ? 'Close Thread' : 'Reopen Thread'}
                  </button>
                </div>
              </div>

              {/* Message Stream */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-black/40 scrollbar-thin scrollbar-thumb-zinc-800">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-zinc-500 font-mono text-xs">
                    <div>
                      <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
                      <p>Conversation initialized. Send the first message below.</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isSystem = msg.messageType === 'SYSTEM';
                    const isStaff = msg.senderRole === 'ADMIN' || msg.senderRole === 'SUPER_ADMIN';
                    const isDeleted = msg.content === 'This message was deleted by an admin';

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="flex justify-center my-2">
                          <div className="px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-[#00F0FF]" />
                            {msg.content}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col group ${isStaff ? 'items-end' : 'items-start'}`}
                      >
                        {/* Header info */}
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span
                            className={`text-[11px] font-mono font-semibold ${
                              isStaff ? 'text-[#00F0FF]' : 'text-emerald-400'
                            }`}
                          >
                            {msg.senderName}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800/80 text-zinc-400">
                            {msg.senderRole}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>

                          {/* Admin Moderation Actions */}
                          {!isDeleted && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditMessage(msg.id, msg.content)}
                                className="p-0.5 text-zinc-500 hover:text-white"
                                title="Edit Message"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleSoftDeleteMessage(msg.id)}
                                className="p-0.5 text-zinc-500 hover:text-rose-400"
                                title="Delete Message (Admin)"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Bubble Body */}
                        <div
                          className={`p-4 rounded-2xl max-w-xl text-xs relative ${
                            isDeleted
                              ? 'bg-zinc-950 border border-zinc-800 text-zinc-500 italic'
                              : msg.isInternal
                              ? 'bg-amber-950/40 border-2 border-amber-500/50 text-amber-100 rounded-tr-none shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                              : isStaff
                              ? 'bg-zinc-900 border border-[#00F0FF]/30 text-zinc-100 rounded-tr-none'
                              : 'bg-zinc-900/90 border border-emerald-500/30 text-zinc-100 rounded-tl-none'
                          }`}
                        >
                          {/* Internal Note Banner */}
                          {msg.isInternal && !isDeleted && (
                            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-400 mb-2 pb-1.5 border-b border-amber-500/30">
                              <Lock className="w-3 h-3 text-amber-400" />
                              <span>INTERNAL ADMIN NOTE // HIDDEN FROM CLIENT</span>
                            </div>
                          )}

                          {/* Message Content */}
                          <p className={`whitespace-pre-wrap leading-relaxed ${isDeleted ? 'italic text-zinc-500 flex items-center gap-1.5' : ''}`}>
                            {isDeleted && <Trash2 className="w-3.5 h-3.5 text-zinc-600" />}
                            {msg.content}
                          </p>

                          {/* File Attachment Card */}
                          {msg.file && !isDeleted && (
                            <div className="mt-3 p-2.5 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-4 h-4 text-[#00F0FF] shrink-0" />
                                <div className="truncate">
                                  <p className="text-[11px] font-mono text-zinc-200 truncate">
                                    {msg.file.filename}
                                  </p>
                                  <p className="text-[9px] font-mono text-zinc-500">
                                    {(msg.file.sizeBytes / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <a
                                href={`http://localhost:4000/api/v1/messaging/files/${msg.file.id}`}
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-[#00F0FF] hover:text-black text-zinc-300 transition-colors"
                                title="Download Secure Asset"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Compose Message Box */}
              <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/90 space-y-3">
                {/* File Attachment Preview */}
                {selectedFile && (
                  <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span className="truncate">{selectedFile.name}</span>
                      <span className="text-zinc-500 text-[10px]">
                        ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="p-1 text-zinc-500 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Internal Note Toggle Bar */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-900"
                    />
                    <span
                      className={`text-xs font-mono font-medium flex items-center gap-1.5 ${
                        isInternalNote ? 'text-amber-400 font-bold' : 'text-zinc-400'
                      }`}
                    >
                      <Lock className="w-3 h-3" />
                      Make Internal Admin Note (Client cannot see)
                    </span>
                  </label>

                  <span className="text-[10px] font-mono text-zinc-500">
                    Press <kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">Enter</kbd> to send
                  </span>
                </div>

                {/* Input Textarea & Send Button */}
                <form
                  onSubmit={handleSendMessage}
                  className={`flex items-end gap-2 p-2 rounded-2xl border transition-all ${
                    isInternalNote
                      ? 'bg-amber-950/20 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                      : 'bg-zinc-900/90 border-zinc-800 focus-within:border-[#00F0FF]/60'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="Attach file (PDF, image, spec, etc.)"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <textarea
                    rows={2}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={
                      isInternalNote
                        ? 'Draft internal note visible exclusively to admins...'
                        : 'Type message to client engineering contacts...'
                    }
                    className="flex-1 bg-transparent border-none text-xs text-white placeholder-zinc-500 resize-none focus:outline-none py-1.5"
                  />

                  <button
                    type="submit"
                    disabled={sending || uploadingFile || (!inputText.trim() && !selectedFile)}
                    className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all ${
                      isInternalNote
                        ? 'bg-amber-500 text-black hover:bg-amber-400'
                        : 'bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sending ? 'Sending...' : isInternalNote ? 'Post Note' : 'Send'}</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-zinc-500 font-mono space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400 shadow-inner">
                <MessageSquare className="w-8 h-8 text-[#00F0FF]" />
              </div>
              <div className="max-w-sm">
                <h3 className="text-sm font-bold text-zinc-300">No Thread Selected</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Select a communication channel from the left panel or initialize a new context-attached thread.
                </p>
              </div>
              <button
                onClick={() => setShowNewThreadModal(true)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-[#00F0FF]/40 text-[#00F0FF] text-xs font-mono rounded-xl transition-all"
              >
                + Initialize Thread
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Thread Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#07090E] border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#00F0FF]" />
                <h2 className="text-base font-bold text-white">Create New Thread</h2>
              </div>
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="p-1 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Target Client Organization</label>
                <select
                  value={newThreadOrgId}
                  onChange={(e) => setNewThreadOrgId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
                >
                  {FALLBACK_ORGANIZATIONS.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Thread Title / Subject</label>
                <input
                  type="text"
                  required
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  placeholder="e.g. Milestone 3 Security Review & Deployment Schedule"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Context Type</label>
                  <select
                    value={newThreadContextType}
                    onChange={(e) => setNewThreadContextType(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="GENERAL">General Communication</option>
                    <option value="PROJECT">Project / Build</option>
                    <option value="INVOICE">Invoice / Retainer</option>
                    <option value="LEAD">Lead / Discovery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Context ID (Optional)</label>
                  <input
                    type="text"
                    value={newThreadContextId}
                    onChange={(e) => setNewThreadContextId(e.target.value)}
                    placeholder="e.g. proj_acme_01"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Initial Opening Message</label>
                <textarea
                  rows={4}
                  required
                  value={newThreadInitialMessage}
                  onChange={(e) => setNewThreadInitialMessage(e.target.value)}
                  placeholder="Provide context or updates to the client..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00F0FF] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-400 hover:text-white text-xs font-mono rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingThread}
                  className="px-5 py-2 bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
                >
                  {creatingThread ? 'Initializing...' : 'Launch Thread'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
