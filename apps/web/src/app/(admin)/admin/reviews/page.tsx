'use client';

import React, { useEffect, useState } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Search,
  MessageSquare,
  Sparkles,
  Building2
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface ReviewItem {
  id: string;
  authorName: string;
  company?: string;
  companyName?: string;
  clientRole?: string;
  content: string;
  rating: number;
  isVerified: boolean;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  createdAt?: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeReview, setActiveReview] = useState<ReviewItem | null>(null);

  // Form
  const [formData, setFormData] = useState({
    authorName: '',
    company: '',
    clientRole: 'CTO / VP Engineering',
    content: '',
    rating: 5,
    isVerified: true,
    status: 'APPROVED' as 'APPROVED' | 'REJECTED' | 'PENDING',
  });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<any>('/admin/reviews');
      if (res.success && res.data) {
        const rawList: any[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.reviews)
          ? res.data.reviews
          : [];
        const mapped: ReviewItem[] = rawList.map((r: any) => ({
          id: r.id,
          authorName: r.clientName || r.authorName || 'Verified Client',
          company: r.companyName || r.company || 'Enterprise Partner',
          clientRole: r.clientTitle || r.clientRole || 'Client Stakeholder',
          content: r.quote || r.content || '',
          rating: r.rating || 5,
          isVerified: r.isFeatured ?? (r.status === 'APPROVED'),
          status: r.status || 'PENDING',
          createdAt: r.createdAt,
        }));
        setReviews(mapped);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiRequest<any>('/admin/reviews', {
        method: 'POST',
        body: JSON.stringify({
          clientName: formData.authorName,
          companyName: formData.company,
          clientTitle: formData.clientRole,
          quote: formData.content,
          rating: formData.rating,
          isFeatured: formData.isVerified,
          status: formData.status,
        }),
      });

      if (res.success && res.data) {
        const r = res.data.review || res.data;
        const newRev: ReviewItem = {
          id: r.id,
          authorName: r.clientName || formData.authorName,
          company: r.companyName || formData.company,
          clientRole: r.clientTitle || formData.clientRole,
          content: r.quote || formData.content,
          rating: r.rating || formData.rating,
          isVerified: r.isFeatured ?? formData.isVerified,
          status: r.status || formData.status,
          createdAt: r.createdAt || new Date().toISOString(),
        };
        setReviews((prev) => [newRev, ...prev]);
      }
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Failed to create review:', err);
    }
  };

  const handleEditReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReview) return;

    try {
      const res = await apiRequest<any>(`/admin/reviews/${activeReview.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          clientName: formData.authorName,
          companyName: formData.company,
          clientTitle: formData.clientRole,
          quote: formData.content,
          rating: formData.rating,
          isFeatured: formData.isVerified,
          status: formData.status,
        }),
      });

      const r = (res.success && res.data) ? (res.data.review || res.data) : null;
      const updated: ReviewItem = r ? {
        id: r.id,
        authorName: r.clientName || formData.authorName,
        company: r.companyName || formData.company,
        clientRole: r.clientTitle || formData.clientRole,
        content: r.quote || formData.content,
        rating: r.rating || formData.rating,
        isVerified: r.isFeatured ?? formData.isVerified,
        status: r.status || formData.status,
        createdAt: r.createdAt || activeReview.createdAt,
      } : { ...activeReview, ...formData };

      setReviews((prev) => prev.map((item) => (item.id === activeReview.id ? updated : item)));
      setShowEditModal(false);
      setActiveReview(null);
    } catch (err) {
      console.error('Failed to edit review:', err);
    }
  };

  const handleDeleteReview = async () => {
    if (!activeReview) return;

    try {
      await apiRequest(`/admin/reviews/${activeReview.id}`, { method: 'DELETE' });
      setReviews((prev) => prev.filter((r) => r.id !== activeReview.id));
      setShowDeleteModal(false);
      setActiveReview(null);
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  const handleToggleVerified = async (id: string, current: boolean) => {
    try {
      await apiRequest(`/admin/reviews/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isFeatured: !current }),
      });
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isVerified: !current } : r)));
    } catch {
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isVerified: !current } : r)));
    }
  };

  const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    try {
      await apiRequest(`/admin/reviews/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch {
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    }
  };

  const resetForm = () => {
    setFormData({
      authorName: '',
      company: '',
      clientRole: 'CTO / VP Engineering',
      content: '',
      rating: 5,
      isVerified: true,
      status: 'APPROVED',
    });
  };

  const openEdit = (rev: ReviewItem) => {
    setActiveReview(rev);
    setFormData({
      authorName: rev.authorName,
      company: rev.company || rev.companyName || '',
      clientRole: rev.clientRole || 'CTO / VP Engineering',
      content: rev.content,
      rating: rev.rating || 5,
      isVerified: rev.isVerified ?? true,
      status: rev.status || 'APPROVED',
    });
    setShowEditModal(true);
  };

  const filtered = reviews.filter(
    (r) =>
      r.authorName?.toLowerCase().includes(search.toLowerCase()) ||
      (r.company || r.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
      r.content?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              MODERATION
            </span>
            <span className="text-[11px] font-mono text-zinc-500">PUBLIC TESTIMONIAL VERIFICATION</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reviews & Testimonials Moderation</h1>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-3.5 py-2 rounded-lg bg-[#00F0FF] hover:bg-[#00D8E6] text-black text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Testimonial</span>
        </button>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reviews..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]"
        />
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[11px]">
            <tr>
              <th className="p-4">Author & Client</th>
              <th className="p-4">Review & Content</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Verified Badge</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-sans">
            {filtered.map((rev) => (
              <tr key={rev.id} className="hover:bg-zinc-800/20">
                <td className="p-4">
                  <div className="font-semibold text-zinc-100">{rev.authorName}</div>
                  <div className="text-[11px] text-zinc-400 font-mono">{rev.company || rev.companyName || 'Enterprise Client'}</div>
                </td>
                <td className="p-4 max-w-sm">
                  <p className="text-zinc-300 line-clamp-2">{rev.content}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggleVerified(rev.id, rev.isVerified)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border flex items-center gap-1 transition-colors ${
                      rev.isVerified
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>{rev.isVerified ? 'VERIFIED' : 'UNVERIFIED'}</span>
                  </button>
                </td>
                <td className="p-4">
                  <select
                    value={rev.status}
                    onChange={(e) => handleUpdateStatus(rev.id, e.target.value as any)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border focus:outline-none bg-zinc-950 ${
                      rev.status === 'APPROVED'
                        ? 'text-emerald-400 border-emerald-500/30'
                        : rev.status === 'REJECTED'
                        ? 'text-red-400 border-red-500/30'
                        : 'text-amber-400 border-amber-500/30'
                    }`}
                  >
                    <option value="APPROVED">APPROVED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openEdit(rev)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                      title="Edit Review"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveReview(rev);
                        setShowDeleteModal(true);
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Add Client Testimonial
            </h2>
            <form onSubmit={handleCreateReview} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Author Name</label>
                  <input
                    type="text"
                    required
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="e.g. Alex Mercer"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Company / Organization</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Apex Fintech Labs"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Client Role / Title</label>
                  <input
                    type="text"
                    value={formData.clientRole}
                    onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                    placeholder="e.g. Chief Technology Officer"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Testimonial Content</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Feedback on engineering delivery and performance..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-zinc-300 font-mono text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-800 text-[#00F0FF]"
                  />
                  <span>Mark as Cryptographically / Audit Verified</span>
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
                  Publish Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && activeReview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-[#00F0FF]" />
              Edit Testimonial
            </h2>
            <form onSubmit={handleEditReview} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Author Name</label>
                  <input
                    type="text"
                    required
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Company</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Testimonial Content</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
      {showDeleteModal && activeReview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              Delete Testimonial
            </h2>
            <p className="text-xs text-zinc-400">
              Are you sure you want to permanently delete the testimonial from <strong className="text-white">{activeReview.authorName}</strong>?
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
                onClick={handleDeleteReview}
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
