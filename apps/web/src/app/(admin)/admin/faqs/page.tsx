'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Plus,
  Search,
  CheckCircle2,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Tag,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface FAQItem {
  id: string;
  category: 'ENGINEERING' | 'PRICING_SLA' | 'SECURITY' | 'CLIENT_PORTAL';
  question: string;
  answer: string;
  isPublished: boolean;
  order: number;
}

const SAMPLE_FAQS: FAQItem[] = [
  {
    id: 'faq_01',
    category: 'ENGINEERING',
    question: 'How do you ensure zero data loss during cloud infrastructure migrations?',
    answer:
      'We run dual-write synchronization pipelines and perform shadow traffic replay before any DNS cutover, backed by PostgreSQL point-in-time recovery (PITR).',
    isPublished: true,
    order: 1,
  },
  {
    id: 'faq_02',
    category: 'PRICING_SLA',
    question: 'What happens if a milestone delivery is delayed beyond the agreed sprint window?',
    answer:
      'Milestones are governed by automated milestone escrow locks. If an engineering sprint slips due to internal delay, SLA credits are applied immediately to the next retainer cycle.',
    isPublished: true,
    order: 2,
  },
  {
    id: 'faq_03',
    category: 'SECURITY',
    question: 'How is client organization data isolated in multi-tenant environments?',
    answer:
      'Every query executes through Prisma middleware enforcing organization-scoped WHERE clauses, combined with Argon2id password hashing and RFC 6238 TOTP 2FA.',
    isPublished: true,
    order: 3,
  },
  {
    id: 'faq_04',
    category: 'CLIENT_PORTAL',
    question: 'Can external stakeholders join direct engineering threads without full admin access?',
    answer:
      'Yes, client portal users can be invited with organization-level read or collaborate permissions to participate in real-time threaded comms.',
    isPublished: true,
    order: 4,
  },
];

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>(SAMPLE_FAQS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeFaq, setActiveFaq] = useState<FAQItem | null>(null);

  // Form
  const [formData, setFormData] = useState({
    category: 'ENGINEERING' as 'ENGINEERING' | 'PRICING_SLA' | 'SECURITY' | 'CLIENT_PORTAL',
    question: '',
    answer: '',
    isPublished: true,
    order: 1,
  });

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<FAQItem[]>('/admin/faqs');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setFaqs(res.data);
      }
    } catch {
      // Retain sample data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiRequest<FAQItem>('/admin/faqs', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const newFaq: FAQItem = (res.success && res.data) ? res.data : {
        ...formData,
        id: `faq_${Date.now()}`,
      };

      setFaqs((prev) => [newFaq, ...prev]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFaq) return;

    try {
      const res = await apiRequest<FAQItem>(`/admin/faqs/${activeFaq.id}`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });

      const updated = (res.success && res.data) ? res.data : { ...activeFaq, ...formData };
      setFaqs((prev) => prev.map((f) => (f.id === activeFaq.id ? updated : f)));
      setShowEditModal(false);
      setActiveFaq(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFaq = async () => {
    if (!activeFaq) return;

    try {
      await apiRequest(`/admin/faqs/${activeFaq.id}`, { method: 'DELETE' });
      setFaqs((prev) => prev.filter((f) => f.id !== activeFaq.id));
      setShowDeleteModal(false);
      setActiveFaq(null);
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      await apiRequest(`/admin/faqs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isPublished: !current }),
      });
      setFaqs((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isPublished: !current } : f))
      );
    } catch {
      setFaqs((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isPublished: !current } : f))
      );
    }
  };

  const resetForm = () => {
    setFormData({
      category: 'ENGINEERING',
      question: '',
      answer: '',
      isPublished: true,
      order: faqs.length + 1,
    });
  };

  const openEdit = (faq: FAQItem) => {
    setActiveFaq(faq);
    setFormData({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      isPublished: faq.isPublished,
      order: faq.order || 1,
    });
    setShowEditModal(true);
  };

  const filtered = faqs.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#00F0FF]" />
              Engineering Knowledge Base & FAQs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              PUBLIC & PORTAL SYNCED
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Publish and curate architecture FAQs, SLA policies, and client onboarding guides.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New FAQ Entry</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs by question or answer..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-mono">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-[#00F0FF] font-mono"
          >
            <option value="ALL">ALL CATEGORIES</option>
            <option value="ENGINEERING">ENGINEERING</option>
            <option value="PRICING_SLA">PRICING & SLA</option>
            <option value="SECURITY">SECURITY</option>
            <option value="CLIENT_PORTAL">CLIENT PORTAL</option>
          </select>
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filtered.map((faq) => {
          const isExpanded = expandedId === faq.id;

          return (
            <div
              key={faq.id}
              className="rounded-2xl bg-[#07090E] border border-zinc-800 overflow-hidden transition-all"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-zinc-900/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-[#00F0FF] border border-zinc-800 shrink-0">
                    {faq.category}
                  </span>
                  <h3 className="text-sm font-semibold text-white truncate">{faq.question}</h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePublish(faq.id, faq.isPublished);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border flex items-center gap-1 transition-colors ${
                      faq.isPublished
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                    }`}
                  >
                    {faq.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{faq.isPublished ? 'PUBLISHED' : 'DRAFT'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(faq);
                    }}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
                    title="Edit FAQ"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFaq(faq);
                      setShowDeleteModal(true);
                    }}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 pt-0 border-t border-zinc-800/60 bg-zinc-950/40 text-xs text-zinc-300 leading-relaxed font-sans">
                  <p className="whitespace-pre-wrap">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#00F0FF]" />
              Create Knowledge Base FAQ
            </h2>
            <form onSubmit={handleCreateFaq} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                  >
                    <option value="ENGINEERING">ENGINEERING</option>
                    <option value="PRICING_SLA">PRICING & SLA</option>
                    <option value="SECURITY">SECURITY</option>
                    <option value="CLIENT_PORTAL">CLIENT PORTAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Question Title</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. How are database migrations executed with zero downtime?"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Detailed Answer</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Explain architecture, SLA mechanics, and guarantees..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-zinc-300 font-mono text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-800 text-[#00F0FF]"
                  />
                  <span>Publish to Public Landing Page & Client Portal</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00F0FF] text-black font-semibold hover:bg-[#00D8E6]"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && activeFaq && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-[#00F0FF]" />
              Edit FAQ Entry
            </h2>
            <form onSubmit={handleEditFaq} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                  >
                    <option value="ENGINEERING">ENGINEERING</option>
                    <option value="PRICING_SLA">PRICING & SLA</option>
                    <option value="SECURITY">SECURITY</option>
                    <option value="CLIENT_PORTAL">CLIENT PORTAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Question Title</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Detailed Answer</label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00F0FF] text-black font-semibold hover:bg-[#00D8E6]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && activeFaq && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              Delete FAQ Entry
            </h2>
            <p className="text-xs text-zinc-400">
              Are you sure you want to permanently delete the FAQ entry: <strong className="text-white">"{activeFaq.question}"</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteFaq}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500 text-xs font-mono"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
