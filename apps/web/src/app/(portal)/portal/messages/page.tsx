'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare,
  Send,
  Plus,
  Briefcase,
  Receipt,
  Download,
  FileText,
  X,
  AlertCircle,
  Clock,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { MESSAGE_CATEGORIES, MessageCategory } from '@/lib/constants/portal';

interface MessageItem {
  id: string;
  threadId: string;
  senderName: string;
  senderRole: string;
  content: string;
  createdAt: string;
}

interface ThreadItem {
  id: string;
  title: string;
  category: MessageCategory;
  projectName: string;
  status: 'Open' | 'Waiting on CYBERSTYLE' | 'Waiting on client' | 'Resolved';
  lastMessageAt: string;
  unreadCount: number;
}

const SAMPLE_THREADS: ThreadItem[] = [
  {
    id: 'th-1',
    title: 'Homepage preview adjustments and feedback',
    category: 'Feedback',
    projectName: 'Sample Website Project',
    status: 'Waiting on CYBERSTYLE',
    lastMessageAt: '2026-09-13T14:30:00Z',
    unreadCount: 0,
  },
  {
    id: 'th-2',
    title: 'Domain DNS verification records for launch',
    category: 'Access issue',
    projectName: 'Sample Website Project',
    status: 'Waiting on client',
    lastMessageAt: '2026-09-12T10:15:00Z',
    unreadCount: 1,
  },
  {
    id: 'th-3',
    title: 'Question regarding Invoice #INV-SAMPLE-001',
    category: 'Billing question',
    projectName: 'Sample Website Project',
    status: 'Resolved',
    lastMessageAt: '2026-09-05T16:00:00Z',
    unreadCount: 0,
  },
];

const SAMPLE_MESSAGES: Record<string, MessageItem[]> = {
  'th-1': [
    {
      id: 'm1',
      threadId: 'th-1',
      senderName: 'Demo Client',
      senderRole: 'Client Owner',
      content: 'We reviewed the desktop wireframe v1.2. The typography looks great, but we would like to ensure the call-to-action in the hero section is more prominent.',
      createdAt: '2026-09-13T14:10:00Z',
    },
    {
      id: 'm2',
      threadId: 'th-1',
      senderName: 'Alex Rivers',
      senderRole: 'CYBERSTYLE PM',
      content: 'Thanks for the feedback! Our design team is updating the button contrast and spacing in the preview. We will share the revised link shortly.',
      createdAt: '2026-09-13T14:30:00Z',
    },
  ],
  'th-2': [
    {
      id: 'm3',
      threadId: 'th-2',
      senderName: 'Alex Rivers',
      senderRole: 'CYBERSTYLE PM',
      content: 'Hello! To prepare for testing, please add the TXT and CNAME verification records provided in the project plan to your domain registrar.',
      createdAt: '2026-09-12T10:15:00Z',
    },
  ],
  'th-3': [
    {
      id: 'm4',
      threadId: 'th-3',
      senderName: 'Demo Client',
      senderRole: 'Client Owner',
      content: 'Could you confirm whether the deposit covers the discovery phase deliverables?',
      createdAt: '2026-09-05T15:30:00Z',
    },
    {
      id: 'm5',
      threadId: 'th-3',
      senderName: 'CYBERSTYLE Finance',
      senderRole: 'Finance Team',
      content: 'Yes, exactly. The invoice reflects discovery and initial design direction. Receipt has been issued.',
      createdAt: '2026-09-05T16:00:00Z',
    },
  ],
};

export default function PortalMessagesPage() {
  const [threads, setThreads] = useState<ThreadItem[]>(SAMPLE_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>('th-1');
  const [inputText, setInputText] = useState('');
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MessageCategory>('Project question');
  const [newMessage, setNewMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThreadId]);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0] || {
    id: 'none',
    title: 'No active thread',
    category: 'Project question' as MessageCategory,
    projectName: 'Sample Website Project',
    status: 'Open' as const,
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
  };
  const messages = SAMPLE_MESSAGES[activeThreadId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: MessageItem = {
      id: `m_${Date.now()}`,
      threadId: activeThreadId,
      senderName: 'Demo Client',
      senderRole: 'Client Owner',
      content: inputText.trim(),
      createdAt: new Date().toISOString(),
    };

    if (!SAMPLE_MESSAGES[activeThreadId]) {
      SAMPLE_MESSAGES[activeThreadId] = [];
    }
    SAMPLE_MESSAGES[activeThreadId].push(newMsg);
    setInputText('');
    setTimeout(scrollToBottom, 50);
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    const newId = `th-${Date.now()}`;
    const threadObj: ThreadItem = {
      id: newId,
      title: newTitle.trim(),
      category: newCategory,
      projectName: 'Sample Website Project',
      status: 'Waiting on CYBERSTYLE',
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
    };

    SAMPLE_MESSAGES[newId] = [
      {
        id: `msg_${Date.now()}`,
        threadId: newId,
        senderName: 'Demo Client',
        senderRole: 'Client Owner',
        content: newMessage.trim(),
        createdAt: new Date().toISOString(),
      },
    ];

    setThreads([threadObj, ...threads]);
    setActiveThreadId(newId);
    setShowNewThreadModal(false);
    setNewTitle('');
    setNewMessage('');
  };

  return (
    <div className="space-y-6 font-sans text-zinc-100 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-cyan-400" />
            Project Messages
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Keep questions, updates, files, and decisions organized by project.
          </p>
        </div>

        <button
          onClick={() => setShowNewThreadModal(true)}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New conversation</span>
        </button>
      </div>

      {/* Support Expectations Guidance Banner */}
      <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-300 leading-relaxed">
          <strong>Communication guidelines:</strong> Project communication is handled through the channels and hours agreed in your proposal or support plan. Keeping one topic per conversation helps keep your project history organized.
        </p>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[620px]">
        {/* Left: Threads List */}
        <div className="lg:col-span-4 flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/40">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              Conversations
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60">
            {threads.map((thread) => {
              const isSelected = thread.id === activeThreadId;
              return (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full text-left p-4 transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-500/10 border-l-4 border-l-cyan-400'
                      : 'hover:bg-zinc-900/40 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800">
                      {thread.category}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {thread.status}
                    </span>
                  </div>

                  <h3 className={`text-xs font-semibold line-clamp-1 ${isSelected ? 'text-cyan-400' : 'text-zinc-200'}`}>
                    {thread.title}
                  </h3>

                  <div className="text-[10px] font-mono text-zinc-500">
                    {thread.projectName}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat View */}
        <div className="lg:col-span-8 flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
          {/* Thread Header */}
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                {activeThread.title}
              </h2>
              <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                Category: {activeThread.category} • Related project: {activeThread.projectName}
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-zinc-800 text-zinc-300">
              {activeThread.status}
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isMe = msg.senderRole.includes('Client');
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-zinc-300">{msg.senderName}</span>
                    <span className="text-[10px] font-mono text-zinc-500">({msg.senderRole})</span>
                    <span className="text-[10px] font-mono text-zinc-600">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-cyan-500/10 border border-cyan-500/30 text-zinc-100'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-zinc-800 bg-zinc-900/40 flex items-center gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* New Conversation Modal */}
      {showNewThreadModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white">Start new project conversation</h3>
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Design review feedback or questions"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1">
                  Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as MessageCategory)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                >
                  {MESSAGE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Provide complete details..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-800 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-xl"
                >
                  Create conversation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
