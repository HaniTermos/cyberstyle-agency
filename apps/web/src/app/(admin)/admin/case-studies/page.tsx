'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Globe2,
  Layers,
  BarChart3,
  SearchCode,
  MapPin,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  X,
  PlusCircle,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudyItem {
  id: string;
  title: string;
  slug: string;
  clientName: string;
  clientIndustry: string;
  serviceCategory: string;
  summary: string;
  challenge?: string | null;
  solution?: string | null;
  results?: string | null;
  metrics?: CaseStudyMetric[] | any;
  techStack: string[];
  liveUrl?: string | null;
  coverImage?: string | null;
  testimonialQuote?: string | null;
  testimonialAuthor?: string | null;
  testimonialRole?: string | null;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  isFeatured: boolean;
  sortOrder: number;

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
  geoLatitude?: number | null;
  geoLongitude?: number | null;

  publishedAt?: string | null;
  updatedAt?: string;
  createdAt?: string;
}

const CATEGORY_OPTIONS = [
  'AI Systems & Automation',
  'Full-Stack Web App',
  'Custom SaaS & Cloud',
  'Enterprise SEO & Growth',
  'High-Performance E-Commerce',
];

const COUNTRY_PRESETS = [
  { code: 'GLOBAL', label: 'Global (Worldwide)' },
  { code: 'US', label: 'United States' },
  { code: 'CA', label: 'Canada' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'AE', label: 'United Arab Emirates (Dubai)' },
  { code: 'SA', label: 'Saudi Arabia (Riyadh)' },
  { code: 'DE', label: 'Germany' },
  { code: 'FR', label: 'France' },
  { code: 'AU', label: 'Australia' },
];

export default function AdminCaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeTab, setActiveTab] = useState<'content' | 'metrics' | 'seo' | 'geo'>('content');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState<CaseStudyItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formState, setFormState] = useState<{
    title: string;
    slug: string;
    clientName: string;
    clientIndustry: string;
    serviceCategory: string;
    summary: string;
    challenge: string;
    solution: string;
    results: string;
    metrics: CaseStudyMetric[];
    techStackInput: string;
    liveUrl: string;
    coverImage: string;
    testimonialQuote: string;
    testimonialAuthor: string;
    testimonialRole: string;
    status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
    isFeatured: boolean;
    sortOrder: number;

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
    geoLatitude: string;
    geoLongitude: string;
  }>({
    title: '',
    slug: '',
    clientName: '',
    clientIndustry: 'Technology',
    serviceCategory: 'AI Systems & Automation',
    summary: '',
    challenge: '',
    solution: '',
    results: '',
    metrics: [{ value: '+300%', label: 'Metric Increase' }],
    techStackInput: 'Next.js 15, TypeScript, PostgreSQL',
    liveUrl: '',
    coverImage: '',
    testimonialQuote: '',
    testimonialAuthor: '',
    testimonialRole: '',
    status: 'PUBLISHED',
    isFeatured: false,
    sortOrder: 0,

    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    keywordsInput: '',
    ogImage: '',

    geoCountry: 'US',
    geoRegion: 'North America',
    geoCity: 'New York, NY',
    geoLatitude: '40.7128',
    geoLongitude: '-74.0060',
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fetchCaseStudies = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ caseStudies: CaseStudyItem[]; total: number }>('/admin/case-studies');
      if (res.success && res.data?.caseStudies) {
        setCaseStudies(res.data.caseStudies);
      } else {
        // Fallback check public route
        const pubRes = await apiRequest<{ caseStudies: CaseStudyItem[] }>('/case-studies');
        if (pubRes.success && pubRes.data?.caseStudies) {
          setCaseStudies(pubRes.data.caseStudies);
        }
      }
    } catch (err: any) {
      console.error('Failed to load case studies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Filtered Items
  const filteredCaseStudies = useMemo(() => {
    return caseStudies.filter((cs) => {
      const matchesSearch =
        search === '' ||
        cs.title.toLowerCase().includes(search.toLowerCase()) ||
        cs.clientName.toLowerCase().includes(search.toLowerCase()) ||
        cs.summary.toLowerCase().includes(search.toLowerCase()) ||
        (cs.geoCity && cs.geoCity.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        categoryFilter === 'ALL' || cs.serviceCategory === categoryFilter;

      const matchesStatus =
        statusFilter === 'ALL' || cs.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [caseStudies, search, categoryFilter, statusFilter]);

  // Metric counts
  const stats = useMemo(() => {
    return {
      total: caseStudies.length,
      published: caseStudies.filter((c) => c.status === 'PUBLISHED').length,
      featured: caseStudies.filter((c) => c.isFeatured).length,
      drafts: caseStudies.filter((c) => c.status === 'DRAFT').length,
    };
  }, [caseStudies]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setActiveTab('content');
    setErrorMessage(null);
    setFormState({
      title: '',
      slug: '',
      clientName: '',
      clientIndustry: 'Technology',
      serviceCategory: 'AI Systems & Automation',
      summary: '',
      challenge: '',
      solution: '',
      results: '',
      metrics: [
        { value: '+340%', label: 'Lead Growth' },
        { value: '< 30s', label: 'AI Response Time' },
      ],
      techStackInput: 'Next.js 15, TypeScript, PostgreSQL, Docker',
      liveUrl: '',
      coverImage: '',
      testimonialQuote: '',
      testimonialAuthor: '',
      testimonialRole: '',
      status: 'PUBLISHED',
      isFeatured: false,
      sortOrder: caseStudies.length + 1,

      seoTitle: '',
      seoDescription: '',
      canonicalUrl: '',
      keywordsInput: 'AI Automation, Next.js Development, Agency Portfolio',
      ogImage: '',

      geoCountry: 'US',
      geoRegion: 'North America',
      geoCity: 'New York, NY',
      geoLatitude: '40.7128',
      geoLongitude: '-74.0060',
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (cs: CaseStudyItem) => {
    setModalMode('edit');
    setEditingId(cs.id);
    setActiveTab('content');
    setErrorMessage(null);

    const metricsArray: CaseStudyMetric[] = Array.isArray(cs.metrics)
      ? cs.metrics
      : typeof cs.metrics === 'object' && cs.metrics !== null
      ? Object.entries(cs.metrics).map(([label, value]) => ({ label, value: String(value) }))
      : [];

    setFormState({
      title: cs.title,
      slug: cs.slug,
      clientName: cs.clientName,
      clientIndustry: cs.clientIndustry || 'Technology',
      serviceCategory: cs.serviceCategory || 'AI Systems & Automation',
      summary: cs.summary || '',
      challenge: cs.challenge || '',
      solution: cs.solution || '',
      results: cs.results || '',
      metrics: metricsArray.length > 0 ? metricsArray : [{ value: '+100%', label: 'Efficiency' }],
      techStackInput: (cs.techStack || []).join(', '),
      liveUrl: cs.liveUrl || '',
      coverImage: cs.coverImage || '',
      testimonialQuote: cs.testimonialQuote || '',
      testimonialAuthor: cs.testimonialAuthor || '',
      testimonialRole: cs.testimonialRole || '',
      status: cs.status,
      isFeatured: cs.isFeatured || false,
      sortOrder: cs.sortOrder || 0,

      seoTitle: cs.seoTitle || '',
      seoDescription: cs.seoDescription || '',
      canonicalUrl: cs.canonicalUrl || '',
      keywordsInput: (cs.keywords || []).join(', '),
      ogImage: cs.ogImage || '',

      geoCountry: cs.geoCountry || 'GLOBAL',
      geoRegion: cs.geoRegion || '',
      geoCity: cs.geoCity || '',
      geoLatitude: cs.geoLatitude !== null && cs.geoLatitude !== undefined ? String(cs.geoLatitude) : '',
      geoLongitude: cs.geoLongitude !== null && cs.geoLongitude !== undefined ? String(cs.geoLongitude) : '',
    });
    setIsModalOpen(true);
  };

  // Auto-fill SEO if user enters Title
  const handleTitleChange = (val: string) => {
    const slugVal = val
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');

    setFormState((prev) => ({
      ...prev,
      title: val,
      slug: modalMode === 'create' && (!prev.slug || prev.slug === '') ? slugVal : prev.slug,
      seoTitle: modalMode === 'create' && (!prev.seoTitle || prev.seoTitle === '') ? `${val} | Case Study | CYBERSTYLE` : prev.seoTitle,
    }));
  };

  // Save / Submit
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    const parsedTechStack = formState.techStackInput
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
      clientName: formState.clientName,
      clientIndustry: formState.clientIndustry,
      serviceCategory: formState.serviceCategory,
      summary: formState.summary,
      challenge: formState.challenge || null,
      solution: formState.solution || null,
      results: formState.results || null,
      metrics: formState.metrics.filter((m) => m.value && m.label),
      techStack: parsedTechStack,
      liveUrl: formState.liveUrl || null,
      coverImage: formState.coverImage || null,
      testimonialQuote: formState.testimonialQuote || null,
      testimonialAuthor: formState.testimonialAuthor || null,
      testimonialRole: formState.testimonialRole || null,
      status: formState.status,
      isFeatured: formState.isFeatured,
      sortOrder: Number(formState.sortOrder) || 0,

      // SEO
      seoTitle: formState.seoTitle || `${formState.title} | CYBERSTYLE Case Study`,
      seoDescription: formState.seoDescription || formState.summary,
      canonicalUrl: formState.canonicalUrl || `https://cyberstyle.agency/work/${formState.slug}`,
      keywords: parsedKeywords,
      ogImage: formState.ogImage || null,

      // Geo
      geoCountry: formState.geoCountry || null,
      geoRegion: formState.geoRegion || null,
      geoCity: formState.geoCity || null,
      geoLatitude: formState.geoLatitude ? parseFloat(formState.geoLatitude) : null,
      geoLongitude: formState.geoLongitude ? parseFloat(formState.geoLongitude) : null,
    };

    try {
      if (modalMode === 'create') {
        const res = await apiRequest<{ caseStudy: CaseStudyItem }>('/admin/case-studies', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (!res.success) {
          throw new Error(res.error || 'Failed to create case study');
        }

        showToast(`Case study "${payload.title}" created successfully!`);
      } else if (editingId) {
        const res = await apiRequest<{ caseStudy: CaseStudyItem }>(`/admin/case-studies/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });

        if (!res.success) {
          throw new Error(res.error || 'Failed to update case study');
        }

        showToast(`Case study "${payload.title}" updated successfully!`);
      }

      setIsModalOpen(false);
      await fetchCaseStudies();
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await apiRequest(`/admin/case-studies/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!res.success) {
        throw new Error(res.error || 'Failed to delete case study');
      }

      showToast(`Case study "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      await fetchCaseStudies();
    } catch (err: any) {
      alert(`Delete Error: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Add metric row
  const addMetricRow = () => {
    setFormState((prev) => ({
      ...prev,
      metrics: [...prev.metrics, { value: '', label: '' }],
    }));
  };

  // Remove metric row
  const removeMetricRow = (idx: number) => {
    setFormState((prev) => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Toast Notification */}
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
              <Briefcase className="w-3 h-3" /> PORTFOLIO CMS
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              SEO & GEO OPTIMIZED SHOWCASE
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Case Studies Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-sans">
            Manage your agency portfolio specimens. Dynamically synced to public pages (<code className="text-cyan-400 font-mono">/work</code> and <code className="text-cyan-400 font-mono">/work/[slug]</code>) with instant Google Schema, OpenGraph tags, and geo-targeted ranking relevance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCaseStudies}
            disabled={loading}
            className="px-3 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            Refresh
          </button>

          <Link
            href="/work"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            Public Work
          </Link>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#00D0DF] text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            New Case Study
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
          <span className="text-[11px] font-mono text-zinc-400 block mb-1">TOTAL SPECIMENS</span>
          <div className="text-2xl font-black text-white font-mono">{stats.total}</div>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
          <span className="text-[11px] font-mono text-emerald-400 block mb-1">LIVE & PUBLISHED</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">{stats.published}</div>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
          <span className="text-[11px] font-mono text-amber-400 block mb-1">FEATURED SHOWCASE</span>
          <div className="text-2xl font-black text-amber-400 font-mono">{stats.featured}</div>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm">
          <span className="text-[11px] font-mono text-zinc-400 block mb-1">DRAFTS IN PROGRESS</span>
          <div className="text-2xl font-black text-zinc-400 font-mono">{stats.drafts}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, client name, industry, or target city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Categories</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
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

      {/* Case Studies Table */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950/90 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[11px]">
            <tr>
              <th className="p-4">Project & Client</th>
              <th className="p-4">Service Category</th>
              <th className="p-4">Impact Metrics</th>
              <th className="p-4">Geo Relevance</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-sans">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-zinc-500 font-mono">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
                  Loading case studies from database...
                </td>
              </tr>
            ) : filteredCaseStudies.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-zinc-500">
                  <Briefcase className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p className="font-semibold text-zinc-300">No case studies found.</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Try clearing your search or add a new case study.
                  </p>
                </td>
              </tr>
            ) : (
              filteredCaseStudies.map((cs) => {
                const metricsList: CaseStudyMetric[] = Array.isArray(cs.metrics)
                  ? cs.metrics
                  : [];

                return (
                  <tr key={cs.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                            {cs.title}
                          </span>
                          {cs.isFeatured && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              FEATURED
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                          <span className="text-zinc-200">{cs.clientName}</span>
                          <span>•</span>
                          <span className="text-zinc-500">{cs.clientIndustry}</span>
                          <span>•</span>
                          <code className="text-cyan-400/80">/work/{cs.slug}</code>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-zinc-800/90 text-zinc-300 border border-zinc-700/50">
                        {cs.serviceCategory}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {metricsList.length > 0 ? (
                          metricsList.slice(0, 2).map((m, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold"
                            >
                              {m.value} {m.label}
                            </span>
                          ))
                        ) : (
                          <span className="text-zinc-600 font-mono text-[10px]">No metrics set</span>
                        )}
                        {metricsList.length > 2 && (
                          <span className="text-zinc-500 font-mono text-[10px] self-center">
                            +{metricsList.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{cs.geoCity || cs.geoRegion || cs.geoCountry || 'Global'}</span>
                      </div>
                      {cs.geoCountry && (
                        <span className="text-[10px] text-zinc-500 block ml-5">
                          Region: {cs.geoCountry}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider font-bold border ${
                          cs.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : cs.status === 'DRAFT'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {cs.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/work/${cs.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                          title="View on Public Website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(cs)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-cyan-500/20 text-zinc-300 hover:text-cyan-400 transition-colors cursor-pointer"
                          title="Edit Case Study"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cs)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
                    {modalMode === 'create' ? 'NEW CASE STUDY' : 'EDIT SPECIMEN'}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    PUBLIC /work/{formState.slug || 'slug'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {modalMode === 'create' ? 'Create New Case Study' : `Edit: ${formState.title}`}
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
                { id: 'content', label: '1. Content & Narrative', icon: Layers },
                { id: 'metrics', label: '2. Metrics & Stack', icon: BarChart3 },
                { id: 'seo', label: '3. SEO Optimization', icon: SearchCode },
                { id: 'geo', label: '4. Geo-Targeting', icon: Globe2 },
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

            {/* Modal Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* TAB 1: CONTENT & NARRATIVE */}
              {activeTab === 'content' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Case Study Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. Nexus Enterprise Telemetry & AI Quote Routing"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        URL Slug * (Unique URL Path)
                      </label>
                      <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-400">
                        <span>/work/</span>
                        <input
                          type="text"
                          required
                          value={formState.slug}
                          onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                          placeholder="nexus-telemetry-os"
                          className="bg-transparent text-white focus:outline-none ml-1 flex-1 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Service Category *
                      </label>
                      <select
                        value={formState.serviceCategory}
                        onChange={(e) => setFormState({ ...formState, serviceCategory: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      >
                        {CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Client Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.clientName}
                        onChange={(e) => setFormState({ ...formState, clientName: e.target.value })}
                        placeholder="e.g. Nexus Global Logistics"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Client Industry
                      </label>
                      <input
                        type="text"
                        value={formState.clientIndustry}
                        onChange={(e) => setFormState({ ...formState, clientIndustry: e.target.value })}
                        placeholder="e.g. Logistics & Supply Chain, Fintech, SaaS"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Publishing Status
                      </label>
                      <select
                        value={formState.status}
                        onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      >
                        <option value="PUBLISHED">Published (Visible Publicly)</option>
                        <option value="DRAFT">Draft (Admin Only)</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Sort Order (Priority)
                      </label>
                      <input
                        type="number"
                        value={formState.sortOrder}
                        onChange={(e) => setFormState({ ...formState, sortOrder: Number(e.target.value) })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={formState.isFeatured}
                        onChange={(e) => setFormState({ ...formState, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded accent-cyan-400 bg-zinc-900 border-zinc-800 cursor-pointer"
                      />
                      <label htmlFor="isFeatured" className="text-xs font-mono text-amber-300 cursor-pointer">
                        Feature in Homepage Showcase
                      </label>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                      Executive Summary (Hero Paragraph) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formState.summary}
                      onChange={(e) => setFormState({ ...formState, summary: e.target.value })}
                      placeholder="Brief 1-3 sentences summarizing the problem, solution, and high-impact measurable outcome..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Deep Narrative */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        01 // The Problem / Challenge
                      </label>
                      <textarea
                        rows={4}
                        value={formState.challenge}
                        onChange={(e) => setFormState({ ...formState, challenge: e.target.value })}
                        placeholder="What bottlenecks or revenue leakages was the client experiencing?"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        02 // The Engineering Solution
                      </label>
                      <textarea
                        rows={4}
                        value={formState.solution}
                        onChange={(e) => setFormState({ ...formState, solution: e.target.value })}
                        placeholder="How did CYBERSTYLE architect and implement the technical system?"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                      03 // Business Impact & Results
                    </label>
                    <textarea
                      rows={3}
                      value={formState.results}
                      onChange={(e) => setFormState({ ...formState, results: e.target.value })}
                      placeholder="Detailed post-launch results, speed uplifts, conversion rates..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: METRICS & STACK */}
              {activeTab === 'metrics' && (
                <div className="space-y-6">
                  {/* Dynamic Metrics */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white font-mono">
                          Measurable Impact Metrics
                        </h3>
                        <p className="text-xs text-zinc-400">
                          Add the standout KPI numbers displayed in big glowing font on the public page.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addMetricRow}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-cyan-400 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Add Metric
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formState.metrics.map((m, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <input
                            type="text"
                            placeholder="Value (e.g. +340%, < 30s, $1.8M)"
                            value={m.value}
                            onChange={(e) => {
                              const updated = [...formState.metrics];
                              if (updated[idx]) {
                                updated[idx] = { ...updated[idx], value: e.target.value };
                                setFormState({ ...formState, metrics: updated });
                              }
                            }}
                            className="w-1/3 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-cyan-400"
                          />
                          <input
                            type="text"
                            placeholder="Label (e.g. Qualified Lead Growth, Pipeline Settled)"
                            value={m.label}
                            onChange={(e) => {
                              const updated = [...formState.metrics];
                              if (updated[idx]) {
                                updated[idx] = { ...updated[idx], label: e.target.value };
                                setFormState({ ...formState, metrics: updated });
                              }
                            }}
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                          />
                          {formState.metrics.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMetricRow(idx)}
                              className="p-2 text-zinc-500 hover:text-rose-400 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="space-y-2 pt-4 border-t border-zinc-800">
                    <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                      Technology Stack (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formState.techStackInput}
                      onChange={(e) => setFormState({ ...formState, techStackInput: e.target.value })}
                      placeholder="Next.js 15, TypeScript, Three.js, PostgreSQL, Docker, BullMQ"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                    <p className="text-[11px] text-zinc-500">
                      These will be rendered as interactive chip badges on the case study specimen page.
                    </p>
                  </div>

                  {/* Live URL & Media */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Live Production URL
                      </label>
                      <input
                        type="url"
                        value={formState.liveUrl}
                        onChange={(e) => setFormState({ ...formState, liveUrl: e.target.value })}
                        placeholder="https://client-production-system.com"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Cover / Hero Image URL
                      </label>
                      <input
                        type="text"
                        value={formState.coverImage}
                        onChange={(e) => setFormState({ ...formState, coverImage: e.target.value })}
                        placeholder="https://images.unsplash.com/... or /images/portfolio/..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>

                  {/* Testimonial Quote */}
                  <div className="space-y-3 pt-4 border-t border-zinc-800">
                    <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                      Client Endorsement / Quote
                    </label>
                    <textarea
                      rows={2}
                      value={formState.testimonialQuote}
                      onChange={(e) => setFormState({ ...formState, testimonialQuote: e.target.value })}
                      placeholder='"CYBERSTYLE transformed our pipeline and delivered 3 weeks ahead of schedule."'
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={formState.testimonialAuthor}
                        onChange={(e) => setFormState({ ...formState, testimonialAuthor: e.target.value })}
                        placeholder="Author Name (e.g. Alex Mercer)"
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                      <input
                        type="text"
                        value={formState.testimonialRole}
                        onChange={(e) => setFormState({ ...formState, testimonialRole: e.target.value })}
                        placeholder="Author Title (e.g. VP of Operations)"
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SEO OPTIMIZATION */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold mb-1">
                      <Sparkles className="w-4 h-4" /> SEARCH ENGINE RANKING BOOST
                    </div>
                    <p className="text-xs text-zinc-400">
                      These tags generate native JSON-LD metadata, Google Snippets, and OpenGraph Twitter/LinkedIn card previews automatically.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <label className="text-zinc-300 uppercase tracking-wider">
                          SEO Meta Title (Title Tag)
                        </label>
                        <span className={`text-[11px] ${formState.seoTitle.length > 60 ? 'text-amber-400' : 'text-zinc-500'}`}>
                          {formState.seoTitle.length}/60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formState.seoTitle}
                        onChange={(e) => setFormState({ ...formState, seoTitle: e.target.value })}
                        placeholder="Nexus Logistics AI Quote Routing Case Study | CYBERSTYLE"
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
                        placeholder="Learn how CYBERSTYLE built a 3D Next.js platform and automated AI lead qualification system that increased inquiries by 340%."
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
                        placeholder={`https://cyberstyle.agency/work/${formState.slug || 'slug'}`}
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
                        placeholder="Logistics Web Design, AI Automation Agency, Next.js 15 Case Study, High-Speed Web"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    {/* Google Search Result Preview Simulator */}
                    <div className="pt-4 border-t border-zinc-800 space-y-2">
                      <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
                        Google Search Result Preview
                      </span>
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1 max-w-xl">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                          <span className="text-[11px] text-zinc-400 font-sans">
                            https://cyberstyle.agency › work › {formState.slug || 'case-study'}
                          </span>
                        </div>
                        <div className="text-base font-semibold text-[#8ab4f8] hover:underline cursor-pointer">
                          {formState.seoTitle || formState.title || 'Untitled Case Study | CYBERSTYLE'}
                        </div>
                        <p className="text-xs text-zinc-300 line-clamp-2">
                          {formState.seoDescription || formState.summary || 'Discover how CYBERSTYLE builds custom enterprise platforms.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: GEO-TARGETING */}
              {activeTab === 'geo' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold mb-1">
                      <Globe2 className="w-4 h-4" /> LOCAL & REGIONAL SEARCH INTENT
                    </div>
                    <p className="text-xs text-zinc-400">
                      Geographic tagging indexes your case studies in targeted market regions (e.g. US, Canada, UAE/Dubai, Europe) so prospective clients searching locally find proven regional specimens.
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
                        Target Region / State / Territory
                      </label>
                      <input
                        type="text"
                        value={formState.geoRegion}
                        onChange={(e) => setFormState({ ...formState, geoRegion: e.target.value })}
                        placeholder="e.g. North America, MENA, Texas, California"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Target City / Metropolitan Area
                      </label>
                      <input
                        type="text"
                        value={formState.geoCity}
                        onChange={(e) => setFormState({ ...formState, geoCity: e.target.value })}
                        placeholder="e.g. New York, NY or Dubai, UAE or Toronto, ON"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Latitude Coordinate
                      </label>
                      <input
                        type="text"
                        value={formState.geoLatitude}
                        onChange={(e) => setFormState({ ...formState, geoLatitude: e.target.value })}
                        placeholder="e.g. 40.7128"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">
                        Longitude Coordinate
                      </label>
                      <input
                        type="text"
                        value={formState.geoLongitude}
                        onChange={(e) => setFormState({ ...formState, geoLongitude: e.target.value })}
                        placeholder="e.g. -74.0060"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
                <div className="text-xs font-mono text-zinc-500">
                  {activeTab !== 'content' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('content')}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      ← Back to Content
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
                        {modalMode === 'create' ? 'Publish Case Study' : 'Save Changes'}
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
              <h3 className="text-lg font-bold text-white">Delete Case Study</h3>
            </div>

            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-white font-mono font-bold">"{deleteTarget.title}"</strong>?
              This will remove the public route <code className="text-rose-300">/work/{deleteTarget.slug}</code> immediately.
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
