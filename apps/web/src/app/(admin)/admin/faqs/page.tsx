'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Globe
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  displayPages: string[];
  orderIndex: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const PAGE_TARGETS = [
  { id: 'home', label: 'Homepage' },
  { id: 'faq', label: 'FAQ Page' },
  { id: 'pricing', label: 'Pricing Page' },
  { id: 'premium-web', label: 'Service: Premium Web' },
  { id: 'ai-automation', label: 'Service: AI Automation' },
  { id: 'custom-saas', label: 'Service: Custom SaaS' },
];

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPageFilter, setSelectedPageFilter] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeFaq, setActiveFaq] = useState<FAQItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    category: 'General',
    question: '',
    answer: '',
    displayPages: ['faq', 'home'] as string[],
    orderIndex: 1,
    isPublished: true,
  });

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ faqs: FAQItem[] } | FAQItem[]>('/admin/faqs');
      if (res.success && res.data) {
        const list = Array.isArray(res.data)
          ? res.data
          : (res.data as any).faqs || [];
        setFaqs(list);
      }
    } catch (err) {
      console.error('Failed to fetch FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return Array.from(set);
  }, [faqs]);

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiRequest<{ faq: FAQItem }>('/admin/faqs', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.success && res.data?.faq) {
        setFaqs((prev) => [...prev, res.data!.faq].sort((a, b) => a.orderIndex - b.orderIndex));
      } else {
        await fetchFaqs();
      }

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
      const res = await apiRequest<{ faq: FAQItem }>(`/admin/faqs/${activeFaq.id}`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });

      if (res.success && res.data?.faq) {
        setFaqs((prev) =>
          prev
            .map((f) => (f.id === activeFaq.id ? res.data!.faq : f))
            .sort((a, b) => a.orderIndex - b.orderIndex)
        );
      } else {
        await fetchFaqs();
      }

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
    } catch (err) {
      console.error(err);
    }
  };

  const togglePageTarget = (pageId: string) => {
    setFormData((prev) => {
      const exists = prev.displayPages.includes(pageId);
      return {
        ...prev,
        displayPages: exists
          ? prev.displayPages.filter((p) => p !== pageId)
          : [...prev.displayPages, pageId],
      };
    });
  };

  const resetForm = () => {
    setFormData({
      category: 'General',
      question: '',
      answer: '',
      displayPages: ['faq', 'home'],
      orderIndex: faqs.length + 1,
      isPublished: true,
    });
  };

  const openEdit = (faq: FAQItem) => {
    setActiveFaq(faq);
    setFormData({
      category: faq.category || 'General',
      question: faq.question,
      answer: faq.answer,
      displayPages: Array.isArray(faq.displayPages) ? faq.displayPages : ['faq', 'home'],
      orderIndex: faq.orderIndex || 1,
      isPublished: faq.isPublished,
    });
    setShowEditModal(true);
  };

  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      const matchesSearch =
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCategory === 'ALL' || f.category === selectedCategory;
      const matchesPage =
        selectedPageFilter === 'ALL' ||
        (Array.isArray(f.displayPages) && f.displayPages.includes(selectedPageFilter));
      return matchesSearch && matchesCat && matchesPage;
    });
  }, [faqs, search, selectedCategory, selectedPageFilter]);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#00F0FF]" />
              FAQ Management &amp; Multi-Page Feeds
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              POSTGRES LIVE SYNCED
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Control all FAQs across the Homepage, FAQ page, Pricing, and Services pages. Choose which pages display each question with single-click synchronization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/faq"
            target="_blank"
            className="px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-700 flex items-center gap-1.5 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>View Public /faq</span>
          </Link>

          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-[#00F0FF] text-black font-semibold text-xs font-mono flex items-center gap-2 hover:bg-[#00D8E6] transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            <Plus className="w-4 h-4" />
            <span>Add FAQ Question</span>
          </button>
        </div>
      </div>

      {/* Page Target Filter Tabs */}
      <div className="space-y-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>Filter by Target Public Page:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedPageFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              selectedPageFilter === 'ALL'
                ? 'bg-[#00F0FF] text-black font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            All Pages ({faqs.length})
          </button>
          {PAGE_TARGETS.map((target) => {
            const count = faqs.filter(
              (f) => Array.isArray(f.displayPages) && f.displayPages.includes(target.id)
            ).length;
            return (
              <button
                key={target.id}
                onClick={() => setSelectedPageFilter(target.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  selectedPageFilter === target.id
                    ? 'bg-[#00F0FF] text-black font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {target.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions or answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]"
          />
        </div>

        {categories.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-mono text-zinc-500 whitespace-nowrap">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00F0FF] font-mono"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* FAQs List */}
      {loading ? (
        <div className="py-16 text-center text-zinc-500 text-xs font-mono animate-pulse">
          Loading FAQ records from database...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl space-y-2">
          <p className="text-sm font-semibold text-zinc-400">No FAQ entries matched your filter</p>
          <p className="text-xs text-zinc-600">Try clearing your search query or selecting All Pages.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 transition-all hover:border-zinc-700 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div
                    className="flex-1 cursor-pointer flex items-start gap-3"
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  >
                    <button className="mt-0.5 text-zinc-400 hover:text-white shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#00F0FF]" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          #{faq.orderIndex}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-[#00F0FF] border border-cyan-800/50">
                          {faq.category}
                        </span>
                        {faq.isPublished ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 flex items-center gap-1">
                            <Eye className="w-2.5 h-2.5" /> LIVE
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 flex items-center gap-1">
                            <EyeOff className="w-2.5 h-2.5" /> HIDDEN
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-[#00F0FF] transition-colors">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => togglePublish(faq.id, faq.isPublished)}
                      title={faq.isPublished ? 'Unpublish FAQ' : 'Publish FAQ'}
                      className={`p-2 rounded-lg border text-xs transition-colors ${
                        faq.isPublished
                          ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400 hover:bg-emerald-900/40'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {faq.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => openEdit(faq)}
                      title="Edit FAQ"
                      className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setActiveFaq(faq);
                        setShowDeleteModal(true);
                      }}
                      title="Delete FAQ"
                      className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-red-400 hover:bg-red-950/40 hover:border-red-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Target Pages Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-zinc-800/50">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Appears on:</span>
                  {Array.isArray(faq.displayPages) && faq.displayPages.length > 0 ? (
                    faq.displayPages.map((p) => {
                      const match = PAGE_TARGETS.find((t) => t.id === p);
                      return (
                        <span
                          key={p}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800"
                        >
                          {match ? match.label : p}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-600 italic">None specified</span>
                  )}
                </div>

                {/* Expanded Answer */}
                {isExpanded && (
                  <div className="pt-2 text-xs text-zinc-300 bg-zinc-900/40 rounded-lg p-3 border border-zinc-800/60 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {showAddModal ? (
                  <>
                    <Plus className="w-5 h-5 text-[#00F0FF]" />
                    <span>Create New FAQ Question</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="w-5 h-5 text-[#00F0FF]" />
                    <span>Edit FAQ Question</span>
                  </>
                )}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setActiveFaq(null);
                }}
                className="text-zinc-500 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={showAddModal ? handleCreateFaq : handleEditFaq} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Build Fees & Scope, Performance, AI"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData({ ...formData, orderIndex: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">
                  Question
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How are project fees structured?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">
                  Detailed Answer
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide a clear, honest answer in plain English..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] text-xs leading-relaxed"
                />
              </div>

              {/* Multi-Page Selector */}
              <div className="space-y-2 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <label className="block text-zinc-300 font-mono uppercase text-[11px] font-semibold">
                  Display On Public Pages (Multi-Select)
                </label>
                <p className="text-[11px] text-zinc-400">
                  Select which public pages should display this FAQ entry automatically:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {PAGE_TARGETS.map((target) => {
                    const isChecked = formData.displayPages.includes(target.id);
                    return (
                      <label
                        key={target.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer select-none transition-colors ${
                          isChecked
                            ? 'bg-cyan-950/40 border-[#00F0FF]/50 text-white'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePageTarget(target.id)}
                          className="rounded text-[#00F0FF] focus:ring-0 cursor-pointer"
                        />
                        <span className="font-mono text-[11px]">{target.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded text-[#00F0FF] focus:ring-0"
                  />
                  <span className="text-zinc-300 font-mono text-xs">Publish immediately to selected pages</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setActiveFaq(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#00F0FF] text-black font-semibold hover:bg-[#00D8E6] font-mono shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                  {showAddModal ? 'Create FAQ' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && activeFaq && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              Delete FAQ Entry
            </h2>
            <p className="text-xs text-zinc-400">
              Are you sure you want to permanently delete: <strong className="text-white">"{activeFaq.question}"</strong>?
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
