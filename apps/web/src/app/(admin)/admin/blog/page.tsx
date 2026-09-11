'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Globe2,
  BookOpen,
  SearchCode,
  MapPin,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  X,
  Clock,
  Tag,
  User,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category?: string | null;
  authorName?: string | null;
  coverImage?: string | null;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  tags: string[];
  readingTimeMinutes?: number | null;
  isFeatured: boolean;

  // SEO Fields
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  keywords?: string[];
  ogImage?: string | null;

  // Geo Fields
  geoCountry?: string | null;
  geoRegion?: string | null;
  geoCity?: string | null;
  geoCoordinates?: string | null;

  publishedAt?: string | null;
  updatedAt?: string;
  createdAt?: string;
  author?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

const CATEGORY_PRESETS = [
  'Web Architecture',
  'AI & Automation',
  'Product Engineering',
  'Enterprise Security',
  'Performance & CWV',
  'Growth & SEO',
];

const COUNTRY_PRESETS = [
  { code: 'GLOBAL', label: 'Global (Worldwide)' },
  { code: 'US', label: 'United States' },
  { code: 'CA', label: 'Canada' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'AE', label: 'United Arab Emirates (Dubai)' },
  { code: 'SA', label: 'Saudi Arabia' },
  { code: 'DE', label: 'Germany' },
  { code: 'FR', label: 'France' },
  { code: 'AU', label: 'Australia' },
];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeTab, setActiveTab] = useState<'editorial' | 'tags' | 'seo' | 'geo'>('editorial');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState<BlogPostItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formState, setFormState] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    authorName: string;
    category: string;
    status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
    tagsInput: string;
    readingTimeMinutes: number;
    isFeatured: boolean;
    coverImage: string;

    // SEO
    seoTitle: string;
    seoDescription: string;
    canonicalUrl: string;
    keywordsInput: string;
    ogImage: string;

    // Geo
    geoCountry: string;
    geoRegion: string;
    geoCity: string;
    geoCoordinates: string;
  }>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    authorName: 'CYBERSTYLE Core',
    category: 'Web Architecture',
    status: 'PUBLISHED',
    tagsInput: 'Next.js 15, Web Performance, Three.js',
    readingTimeMinutes: 5,
    isFeatured: false,
    coverImage: '',

    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    keywordsInput: 'Web Architecture, Next.js 15, Agency Engineering',
    ogImage: '',

    geoCountry: 'US',
    geoRegion: 'Global',
    geoCity: 'San Francisco, CA',
    geoCoordinates: '37.7749,-122.4194',
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ posts: BlogPostItem[]; total: number }>('/admin/posts');
      if (res.success && res.data?.posts) {
        setPosts(res.data.posts);
      } else {
        // Fallback to public posts route
        const pubRes = await apiRequest<{ posts: BlogPostItem[] }>('/posts');
        if (pubRes.success && pubRes.data?.posts) {
          setPosts(pubRes.data.posts);
        }
      }
    } catch (err: any) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Filtered list
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        search === '' ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        (post.authorName && post.authorName.toLowerCase().includes(search.toLowerCase())) ||
        (post.category && post.category.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        categoryFilter === 'ALL' || post.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'ALL' || post.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [posts, search, categoryFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: posts.length,
      published: posts.filter((p) => p.status === 'PUBLISHED').length,
      featured: posts.filter((p) => p.isFeatured).length,
      drafts: posts.filter((p) => p.status === 'DRAFT').length,
    };
  }, [posts]);

  // Open Create
  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setActiveTab('editorial');
    setErrorMessage(null);
    setFormState({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      authorName: 'CYBERSTYLE Core',
      category: 'Web Architecture',
      status: 'PUBLISHED',
      tagsInput: 'Next.js 15, Web Performance, AI Automation',
      readingTimeMinutes: 5,
      isFeatured: false,
      coverImage: '',

      seoTitle: '',
      seoDescription: '',
      canonicalUrl: '',
      keywordsInput: 'Next.js 15, Agency Engineering, Technical Architecture',
      ogImage: '',

      geoCountry: 'US',
      geoRegion: 'Global',
      geoCity: 'San Francisco, CA',
      geoCoordinates: '37.7749,-122.4194',
    });
    setIsModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (post: BlogPostItem) => {
    setModalMode('edit');
    setEditingId(post.id);
    setActiveTab('editorial');
    setErrorMessage(null);

    setFormState({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      authorName: post.authorName || 'CYBERSTYLE Core',
      category: post.category || 'Web Architecture',
      status: post.status,
      tagsInput: (post.tags || []).join(', '),
      readingTimeMinutes: post.readingTimeMinutes || 5,
      isFeatured: post.isFeatured || false,
      coverImage: post.coverImage || '',

      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      canonicalUrl: post.canonicalUrl || '',
      keywordsInput: (post.keywords || []).join(', '),
      ogImage: post.ogImage || '',

      geoCountry: post.geoCountry || 'GLOBAL',
      geoRegion: post.geoRegion || '',
      geoCity: post.geoCity || '',
      geoCoordinates: post.geoCoordinates || '',
    });
    setIsModalOpen(true);
  };

  // Title change triggers automatic slug & SEO suggestion
  const handleTitleChange = (val: string) => {
    const slugVal = val
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');

    // Estimate reading time from words
    const wordCount = (formState.content || val).trim().split(/\s+/).length;
    const estMinutes = Math.max(1, Math.ceil(wordCount / 200));

    setFormState((prev) => ({
      ...prev,
      title: val,
      slug: modalMode === 'create' && (!prev.slug || prev.slug === '') ? slugVal : prev.slug,
      seoTitle: modalMode === 'create' && (!prev.seoTitle || prev.seoTitle === '') ? `${val} | CYBERSTYLE Insights` : prev.seoTitle,
      readingTimeMinutes: prev.readingTimeMinutes || estMinutes,
    }));
  };

  // Save / Submit
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    const parsedTags = formState.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const parsedKeywords = formState.keywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const payload = {
      title: formState.title,
      slug: formState.slug || undefined,
      excerpt: formState.excerpt,
      content: formState.content,
      authorName: formState.authorName,
      category: formState.category,
      status: formState.status,
      tags: parsedTags,
      readingTimeMinutes: Number(formState.readingTimeMinutes) || 5,
      isFeatured: formState.isFeatured,
      coverImage: formState.coverImage || null,

      // SEO
      seoTitle: formState.seoTitle || `${formState.title} | CYBERSTYLE Insights`,
      seoDescription: formState.seoDescription || formState.excerpt,
      canonicalUrl: formState.canonicalUrl || `https://cyberstyle.agency/blog/${formState.slug}`,
      keywords: parsedKeywords,
      ogImage: formState.ogImage || null,

      // Geo
      geoCountry: formState.geoCountry || null,
      geoRegion: formState.geoRegion || null,
      geoCity: formState.geoCity || null,
      geoCoordinates: formState.geoCoordinates || null,
    };

    try {
      if (modalMode === 'create') {
        const res = await apiRequest<{ post: BlogPostItem }>('/admin/posts', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (!res.success) {
          throw new Error(res.error || 'Failed to create article');
        }

        showToast(`Article "${payload.title}" created successfully!`);
      } else if (editingId) {
        const res = await apiRequest<{ post: BlogPostItem }>(`/admin/posts/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });

        if (!res.success) {
          throw new Error(res.error || 'Failed to update article');
        }

        showToast(`Article "${payload.title}" updated successfully!`);
      }

      setIsModalOpen(false);
      await fetchPosts();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while saving the article.');
    } finally {
      setSaving(false);
    }
  };

  // Delete article
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await apiRequest(`/admin/posts/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!res.success) {
        throw new Error(res.error || 'Failed to delete article');
      }

      showToast(`Article "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      await fetchPosts();
    } catch (err: any) {
      alert(`Delete Error: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Toast */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-500/90 text-black px-4 py-3 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.5)] font-mono text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
              <FileText className="w-3 h-3" /> EDITORIAL CMS
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              TECHNICAL WRITING, SEO & LOCAL RELEVANCE
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Blog & Technical Articles
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-sans">
            Write, optimize, and publish high-authority engineering articles. Dynamically delivered to <code className="text-cyan-400 font-mono">/blog</code> and <code className="text-cyan-400 font-mono">/blog/[slug]</code> with automated Article Schema and OpenGraph data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPosts}
            disabled={loading}
            className="px-3 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            Refresh
          </button>

          <Link
            href="/blog"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            Public Blog
          </Link>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#00D0DF] text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            New Article
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
          <span className="text-[11px] font-mono text-zinc-400 block mb-1">TOTAL ARTICLES</span>
          <div className="text-2xl font-black text-white font-mono">{stats.total}</div>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
          <span className="text-[11px] font-mono text-emerald-400 block mb-1">PUBLISHED LIVE</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">{stats.published}</div>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
          <span className="text-[11px] font-mono text-amber-400 block mb-1">FEATURED ARTICLES</span>
          <div className="text-2xl font-black text-amber-400 font-mono">{stats.featured}</div>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
          <span className="text-[11px] font-mono text-zinc-400 block mb-1">DRAFT QUEUE</span>
          <div className="text-2xl font-black text-zinc-400 font-mono">{stats.drafts}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by title, excerpt, author, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Categories</option>
            {CATEGORY_PRESETS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950/90 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[11px]">
            <tr>
              <th className="p-4">Article Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Author</th>
              <th className="p-4">Reading Time</th>
              <th className="p-4">Geo / Location</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-sans">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-zinc-500 font-mono">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
                  Loading articles...
                </td>
              </tr>
            ) : filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-zinc-500">
                  <FileText className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p className="font-semibold text-zinc-300">No articles found.</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Try clearing your filter or add a new article.
                  </p>
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                          {post.title}
                        </span>
                        {post.isFeatured && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            FEATURED
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                        <code className="text-cyan-400/80">/blog/{post.slug}</code>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-zinc-800/90 text-cyan-300 border border-cyan-500/20">
                      {post.category || 'General'}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-zinc-300">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{post.authorName || post.author?.name || 'CYBERSTYLE'}</span>
                    </div>
                  </td>

                  <td className="p-4 font-mono text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{post.readingTimeMinutes || 5} min read</span>
                    </div>
                  </td>

                  <td className="p-4 font-mono text-zinc-400 text-[11px]">
                    <div className="flex items-center gap-1 text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{post.geoCity || post.geoRegion || post.geoCountry || 'Global'}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider font-bold border ${
                        post.status === 'PUBLISHED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : post.status === 'DRAFT'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                        title="View Public Article"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-cyan-500/20 text-zinc-300 hover:text-cyan-400 transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(post)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================================= */}
      {/* EDIT / CREATE MODAL DRAWER */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0E1118] border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/70">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest">
                    {modalMode === 'create' ? 'NEW ARTICLE' : 'EDIT ARTICLE'}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    PUBLIC /blog/{formState.slug || 'slug'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {modalMode === 'create' ? 'Write Technical Article' : `Edit: ${formState.title}`}
                </h2>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-zinc-800 bg-zinc-950/40 px-6 overflow-x-auto">
              {[
                { id: 'editorial', label: '1. Editorial & Markdown', icon: BookOpen },
                { id: 'tags', label: '2. Tags & Media', icon: Tag },
                { id: 'seo', label: '3. SEO & OpenGraph', icon: SearchCode },
                { id: 'geo', label: '4. Geo Targeting', icon: Globe2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3.5 px-4 text-xs font-mono uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'border-cyan-400 text-cyan-400 font-bold bg-cyan-400/5'
                        : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* TAB 1: EDITORIAL */}
              {activeTab === 'editorial' && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                      Article Headline *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Architecting High-Concurrency Next.js 15 Applications for Fintech"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        URL Slug *
                      </label>
                      <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-400">
                        <span>/blog/</span>
                        <input
                          type="text"
                          required
                          value={formState.slug}
                          onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                          placeholder="architecting-high-concurrency"
                          className="bg-transparent text-white focus:outline-none ml-1 flex-1 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Category
                      </label>
                      <select
                        value={formState.category}
                        onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      >
                        {CATEGORY_PRESETS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Author Name / Byline
                      </label>
                      <input
                        type="text"
                        value={formState.authorName}
                        onChange={(e) => setFormState({ ...formState, authorName: e.target.value })}
                        placeholder="CYBERSTYLE Core"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Publishing Status
                      </label>
                      <select
                        value={formState.status}
                        onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      >
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Estimated Reading Time (Minutes)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={formState.readingTimeMinutes}
                        onChange={(e) => setFormState({ ...formState, readingTimeMinutes: Number(e.target.value) })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <input
                        type="checkbox"
                        id="blogFeatured"
                        checked={formState.isFeatured}
                        onChange={(e) => setFormState({ ...formState, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded accent-cyan-400 bg-zinc-900 border-zinc-800 cursor-pointer"
                      />
                      <label htmlFor="blogFeatured" className="text-xs font-mono text-amber-300 cursor-pointer">
                        Pin to Featured Top
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                      Article Excerpt (Summary for Cards & RSS) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formState.excerpt}
                      onChange={(e) => setFormState({ ...formState, excerpt: e.target.value })}
                      placeholder="Brief teaser summarizing the key takeaway of this engineering insight..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                      Full Article Body (Markdown Supported) *
                    </label>
                    <textarea
                      rows={12}
                      required
                      value={formState.content}
                      onChange={(e) => setFormState({ ...formState, content: e.target.value })}
                      placeholder="Write your article in Markdown. Use # for H1, ## for H2, bullet lists (-), and code snippets (```)..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: TAGS & MEDIA */}
              {activeTab === 'tags' && (
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                      Topic Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formState.tagsInput}
                      onChange={(e) => setFormState({ ...formState, tagsInput: e.target.value })}
                      placeholder="Next.js 15, WebGL, BullMQ, TypeScript, Argon2id, Docker"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                    <p className="text-[11px] text-zinc-500">
                      Displayed on public article cards and used for category topic filtering.
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-4 border-t border-zinc-800">
                    <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                      Cover Banner Image URL
                    </label>
                    <input
                      type="text"
                      value={formState.coverImage}
                      onChange={(e) => setFormState({ ...formState, coverImage: e.target.value })}
                      placeholder="https://images.unsplash.com/... or /images/blog/..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: SEO & OPENGRAPH */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold mb-1">
                      <Sparkles className="w-4 h-4" /> SEO & STRUCTURED ARTICLE SCHEMA
                    </div>
                    <p className="text-xs text-zinc-400">
                      Automatically generates JSON-LD <code className="text-cyan-300">Article</code> schema for Google search rich snippets and OpenGraph cards for Twitter/LinkedIn.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <label className="text-zinc-300 uppercase tracking-wider">
                          SEO Title Tag
                        </label>
                        <span className={`text-[11px] ${formState.seoTitle.length > 60 ? 'text-amber-400' : 'text-zinc-500'}`}>
                          {formState.seoTitle.length}/60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formState.seoTitle}
                        onChange={(e) => setFormState({ ...formState, seoTitle: e.target.value })}
                        placeholder="Sub-Second 3D Web Experiences | CYBERSTYLE Insights"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <label className="text-zinc-300 uppercase tracking-wider">
                          SEO Meta Description
                        </label>
                        <span className={`text-[11px] ${formState.seoDescription.length > 160 ? 'text-amber-400' : 'text-zinc-500'}`}>
                          {formState.seoDescription.length}/160 chars
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={formState.seoDescription}
                        onChange={(e) => setFormState({ ...formState, seoDescription: e.target.value })}
                        placeholder="Guide on optimizing Three.js canvases, WebGL shaders, and Next.js 15 for 90+ Google Core Web Vitals."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Canonical URL
                      </label>
                      <input
                        type="url"
                        value={formState.canonicalUrl}
                        onChange={(e) => setFormState({ ...formState, canonicalUrl: e.target.value })}
                        placeholder={`https://cyberstyle.agency/blog/${formState.slug || 'article'}`}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Focus Keywords (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={formState.keywordsInput}
                        onChange={(e) => setFormState({ ...formState, keywordsInput: e.target.value })}
                        placeholder="Three.js Optimization, Next.js 3D Web, Core Web Vitals, WebGL Performance"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    {/* Google SERP Snippet */}
                    <div className="pt-4 border-t border-zinc-800 space-y-2">
                      <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
                        Google Search Preview
                      </span>
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1 max-w-xl">
                        <div className="text-[11px] text-zinc-400 font-sans">
                          https://cyberstyle.agency › blog › {formState.slug || 'article'}
                        </div>
                        <div className="text-base font-semibold text-[#8ab4f8] hover:underline cursor-pointer">
                          {formState.seoTitle || formState.title || 'Untitled Article | CYBERSTYLE Insights'}
                        </div>
                        <p className="text-xs text-zinc-300 line-clamp-2">
                          {formState.seoDescription || formState.excerpt || 'Technical essays on high-conversion web architecture.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: GEO TARGETING */}
              {activeTab === 'geo' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold mb-1">
                      <Globe2 className="w-4 h-4" /> REGIONAL SEARCH TARGETING
                    </div>
                    <p className="text-xs text-zinc-400">
                      Tag this article for local engineering relevance across target geographies (North America, Middle East, Europe).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Target Country
                      </label>
                      <select
                        value={formState.geoCountry}
                        onChange={(e) => setFormState({ ...formState, geoCountry: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      >
                        {COUNTRY_PRESETS.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Target Region / State
                      </label>
                      <input
                        type="text"
                        value={formState.geoRegion}
                        onChange={(e) => setFormState({ ...formState, geoRegion: e.target.value })}
                        placeholder="e.g. North America, MENA, Silicon Valley"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Target City
                      </label>
                      <input
                        type="text"
                        value={formState.geoCity}
                        onChange={(e) => setFormState({ ...formState, geoCity: e.target.value })}
                        placeholder="e.g. San Francisco, CA or Dubai, UAE"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Geo Coordinates (lat,lng)
                      </label>
                      <input
                        type="text"
                        value={formState.geoCoordinates}
                        onChange={(e) => setFormState({ ...formState, geoCoordinates: e.target.value })}
                        placeholder="e.g. 37.7749,-122.4194"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
                <div className="text-xs font-mono text-zinc-500">
                  {activeTab !== 'editorial' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('editorial')}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      ← Back to Editorial
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#00D0DF] text-black font-bold text-xs font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all cursor-pointer flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Saving to Database...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        {modalMode === 'create' ? 'Publish Article' : 'Save Changes'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0E1118] border border-rose-500/30 rounded-3xl p-6 space-y-4 shadow-2xl text-zinc-100">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Delete Article</h3>
            </div>

            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-white font-mono font-bold">"{deleteTarget.title}"</strong>?
              This will remove the public route <code className="text-rose-300">/blog/{deleteTarget.slug}</code> immediately.
            </p>

            <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono cursor-pointer flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
