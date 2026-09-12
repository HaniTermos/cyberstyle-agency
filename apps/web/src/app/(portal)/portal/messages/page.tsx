'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare,
  Send,
  Paperclip,
  Plus,
  Briefcase,
  Receipt,
  Download,
  FileText,
  X,
  Radio,
  Sparkles,
  AlertCircle,
  Building2,
  Clock
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

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
  deletedAt?: string | null;
  editedAt?: string | null;
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
  messages?: MessageItem[];
}

export default function PortalMessagesPage() {
  const [threads, setThreads] = useState<ThreadItem[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<ThreadItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Compose State
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // New Thread Modal State
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContextType, setNewContextType] = useState<'GENERAL' | 'PROJECT' | 'INVOICE'>('GENERAL');
  const [newContextId, setNewContextId] = useState('');
  const [newInitialMessage, setNewInitialMessage] = useState('');
  const [creatingThread, setCreatingThread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load client threads
  const loadThreads = useCallback(async (selectFirst = false) => {
    try {
      const res = await apiRequest<any>('/messaging/threads');
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
      console.error('Failed to load client threads:', err);
    } finally {
      setLoading(false);
    }
  }, [activeThreadId]);

  useEffect(() => {
    loadThreads(true);
  }, [loadThreads]);

  // Load active thread details
  const loadThreadDetail = useCallback(async (threadId: string) => {
    try {
      const res = await apiRequest<any>(`/messaging/threads/${threadId}`);
      if (res.success && res.data) {
        const threadObj: ThreadItem = res.data.thread || res.data;
        const msgs: MessageItem[] = res.data.messages || threadObj.messages || [];
        setActiveThread(threadObj);
        setMessages(msgs);
        setTimeout(scrollToBottom, 50);

        // Mark read
        await apiRequest(`/messaging/threads/${threadId}/read`, { method: 'POST' });
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

  // Live polling (every 3.5 seconds)
  useEffect(() => {
    if (!activeThreadId || activeThreadId.startsWith('demo_')) return;

    const pollInterval = setInterval(async () => {
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
      } catch {
        // Quiet poll error handler
      }
    }, 3500);

    return () => clearInterval(pollInterval);
  }, [activeThreadId, messages]);

  // Send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeThreadId || (!inputText.trim() && !selectedFile)) return;

    const messageText = inputText.trim();
    const fileToUpload = selectedFile;
    setInputText('');
    setSelectedFile(null);
    setSending(true);

    const safetyTimer = setTimeout(() => {
      setSending(false);
      setUploadingFile(false);
    }, 6000);

    let uploadedFileId: string | null = null;

    try {
      // 1. Upload file if selected
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

      // 2. Post message to thread
      const res = await apiRequest<MessageItem>(`/messaging/threads/${activeThreadId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          content: messageText || (fileToUpload ? `Shared file: ${fileToUpload.name}` : ''),
          messageType: uploadedFileId ? 'FILE' : 'TEXT',
          fileId: uploadedFileId,
          isInternal: false,
        }),
      });

      if (res.success && res.data) {
        const newMsg = (res.data as any).message || res.data;
        setMessages((prev) => [...prev, newMsg]);
        setTimeout(scrollToBottom, 50);
      } else if (activeThreadId.startsWith('demo_')) {
        // Demo fallback
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_${Date.now()}`,
            threadId: activeThreadId,
            senderId: 'client_me',
            senderName: 'You',
            senderRole: 'CLIENT',
            content: messageText,
            messageType: 'TEXT',
            isInternal: false,
            createdAt: new Date().toISOString(),
          },
        ]);
        setTimeout(scrollToBottom, 50);
      }
    } catch (err) {
      console.error('Failed to send client message:', err);
    } finally {
      clearTimeout(safetyTimer);
      setSending(false);
      setUploadingFile(false);
    }
  };

  // Create new thread modal
  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newInitialMessage.trim()) return;

    setCreatingThread(true);
    try {
      const res = await apiRequest<ThreadItem>('/messaging/threads', {
        method: 'POST',
        body: JSON.stringify({
          title: newTitle.trim(),
          contextType: newContextType,
          contextId: newContextId.trim() || undefined,
          initialMessage: newInitialMessage.trim(),
        }),
      });

      if (res.success && res.data) {
        const newThread = (res.data as any).thread || res.data;
        setShowNewThreadModal(false);
        setNewTitle('');
        setNewInitialMessage('');
        setNewContextId('');
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

  return (
    <div className="space-y-6 font-sans text-zinc-100">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
              Direct Engineering Comms
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]">
              DIRECT SQUAD CHANNEL
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Encrypted direct communication channel with your assigned CYBERSTYLE architecture & engineering team.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>ENCRYPTED CHANNEL // ACTIVE</span>
          </div>
          <button
            onClick={() => setShowNewThreadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-250px)] min-h-[580px]">
        {/* Left: Threads List */}
        <div className="lg:col-span-4 flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/40">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              Active Communication Threads
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60 scrollbar-thin scrollbar-thumb-zinc-800">
            {loading ? (
              <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                Loading secure threads...
              </div>
            ) : threads.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 font-mono text-xs space-y-2">
                <AlertCircle className="w-6 h-6 text-zinc-600 mx-auto" />
                <p>No active conversations found.</p>
              </div>
            ) : (
              threads.map((thread) => {
                const isSelected = thread.id === activeThreadId;
                const contextIcon =
                  thread.contextType === 'PROJECT' ? (
                    <Briefcase className="w-3 h-3 text-cyan-400" />
                  ) : thread.contextType === 'INVOICE' ? (
                    <Receipt className="w-3 h-3 text-cyan-400" />
                  ) : (
                    <MessageSquare className="w-3 h-3 text-zinc-400" />
                  );

                return (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full text-left p-4 transition-all relative flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-500/10 border-l-4 border-l-cyan-400'
                        : 'hover:bg-zinc-900/40 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 bg-zinc-900 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 border border-zinc-800">
                        {contextIcon}
                        {thread.contextType}
                      </span>
                      {thread.status === 'CLOSED' ? (
                        <span className="text-[9px] font-mono text-zinc-500">CLOSED</span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                      )}
                    </div>

                    <h3 className={`text-xs font-semibold line-clamp-1 ${isSelected ? 'text-cyan-400' : 'text-zinc-200'}`}>
                      {thread.title}
                    </h3>

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-1">
                      <span>Status: {thread.status}</span>
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

        {/* Right: Active Chat View */}
        <div className="lg:col-span-8 flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
          {activeThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    {activeThread.title}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold ${
                        activeThread.status === 'OPEN'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_8px_rgba(0,240,255,0.1)]'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {activeThread.status}
                    </span>
                  </h2>
                  <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                    Context: {activeThread.contextType} {activeThread.contextId && `(#${activeThread.contextId})`}
                  </p>
                </div>
                <div>
                  <button
                    onClick={async () => {
                      try {
                        const res = await apiRequest<{ data: any; filename: string }>(`/messaging/threads/${activeThread.id}/export`);
                        if (res.success && res.data) {
                          const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `thread-export-${activeThread.id}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        } else {
                          const exportData = { thread: activeThread, messages, exportedAt: new Date().toISOString() };
                          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `thread-export-${activeThread.id}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }
                      } catch {
                        const exportData = { thread: activeThread, messages, exportedAt: new Date().toISOString() };
                        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `thread-export-${activeThread.id}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/60 text-[10px] font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export History</span>
                  </button>
                </div>
              </div>

              {/* Message Stream */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-zinc-900/20 scrollbar-thin scrollbar-thumb-zinc-800">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-zinc-500 font-mono text-xs">
                    Conversation ready. Type below to reach your team.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isStaff = msg.senderRole === 'ADMIN' || msg.senderRole === 'SUPER_ADMIN';
                    const isDeleted = Boolean(msg.deletedAt);

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isStaff ? 'items-start' : 'items-end'}`}
                      >
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span
                            className={`text-[11px] font-mono font-semibold ${
                              isStaff ? 'text-zinc-300' : 'text-cyan-400'
                            }`}
                          >
                            {isStaff ? 'CYBERSTYLE Engineering' : 'You'}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {msg.editedAt && !isDeleted && (
                            <span className="text-[9px] font-mono text-zinc-500 italic">(edited)</span>
                          )}
                        </div>

                        <div
                          className={`p-4 rounded-2xl max-w-xl text-xs ${
                            isDeleted
                              ? 'bg-zinc-900/50 border border-dashed border-zinc-800 text-zinc-500 italic'
                              : isStaff
                              ? 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-none'
                              : 'bg-cyan-500 text-black font-semibold rounded-tr-none shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                          }`}
                        >
                          {isDeleted ? (
                            <p className="flex items-center gap-1.5 text-zinc-500">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>This message was deleted by an admin.</span>
                            </p>
                          ) : (
                            <>
                              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                              {/* Attached File */}
                              {msg.file && (
                                <div className={`mt-3 p-2.5 rounded-xl flex items-center justify-between gap-3 ${
                                  isStaff ? 'bg-black/50 border border-zinc-800' : 'bg-cyan-600 text-black font-bold'
                                }`}>
                                  <div className="flex items-center gap-2 min-w-0">
                                    <FileText className="w-4 h-4 shrink-0" />
                                    <div className="truncate">
                                      <p className="text-[11px] font-mono truncate">{msg.file.filename}</p>
                                      <p className="text-[9px] opacity-70">
                                        {(msg.file.sizeBytes / 1024).toFixed(1)} KB
                                      </p>
                                    </div>
                                  </div>
                                  <a
                                    href={`http://localhost:4000/api/v1/messaging/files/${msg.file.id}`}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 transition-colors"
                                    title="Download File"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Compose Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800 bg-[#080A10] space-y-2">
                {selectedFile && (
                  <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="truncate">{selectedFile.name}</span>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="p-1 text-zinc-500 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-cyan-400 transition-colors"
                    title="Attach File"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message to the engineering team..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />

                  <button
                    type="submit"
                    disabled={sending || uploadingFile || (!inputText.trim() && !selectedFile)}
                    className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all flex items-center gap-2 disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sending ? 'Sending...' : 'Send'}</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center text-zinc-500 font-mono text-xs">
              Select or create a conversation thread.
            </div>
          )}
        </div>
      </div>

      {/* New Conversation Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Start New Conversation
              </h2>
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Scope query regarding staging build"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Topic Area</label>
                  <select
                    value={newContextType}
                    onChange={(e) => setNewContextType(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
                  >
                    <option value="GENERAL">General Support</option>
                    <option value="PROJECT">Active Project / Build</option>
                    <option value="INVOICE">Invoicing / Retainer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Entity ID (Optional)</label>
                  <input
                    type="text"
                    value={newContextId}
                    onChange={(e) => setNewContextId(e.target.value)}
                    placeholder="e.g. Project or Invoice ID"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={newInitialMessage}
                  onChange={(e) => setNewInitialMessage(e.target.value)}
                  placeholder="Describe your inquiry or feedback..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none font-sans"
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
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
                >
                  {creatingThread ? 'Starting...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
