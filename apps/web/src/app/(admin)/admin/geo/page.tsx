'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe2,
  Bot,
  Sparkles,
  Search,
  Plus,
  RefreshCw,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Sliders,
  ExternalLink,
  Trash2,
  Edit3,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  BarChart,
  Cpu,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface GeoQuery {
  id: string;
  query: string;
  targetRegion: string | null;
  targetCountry: string;
  appearsInChatGPT: boolean;
  appearsInPerplexity: boolean;
  appearsInGemini: boolean;
  appearsInClaude: boolean;
  rankScore: number;
  notes: string | null;
  lastCheckedAt: string;
  createdAt: string;
}

interface GeoStats {
  totalQueries: number;
  presenceIndex: number;
  chatGptMentions: number;
  perplexityMentions: number;
  geminiMentions: number;
  claudeMentions: number;
}

export default function AdminGeoPage() {
  const [queries, setQueries] = useState<GeoQuery[]>([]);
  const [stats, setStats] = useState<GeoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterModel, setFilterModel] = useState<'all' | 'chatgpt' | 'perplexity' | 'gemini' | 'claude'>('all');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQueryText, setNewQueryText] = useState('');
  const [newTargetCountry, setNewTargetCountry] = useState('US');
  const [newTargetRegion, setNewTargetRegion] = useState('Global');
  const [newRankScore, setNewRankScore] = useState(75);
  const [newNotes, setNewNotes] = useState('');
  const [newInChatGPT, setNewInChatGPT] = useState(false);
  const [newInPerplexity, setNewInPerplexity] = useState(false);
  const [newInGemini, setNewInGemini] = useState(false);
  const [newInClaude, setNewInClaude] = useState(false);
  const [savingQuery, setSavingQuery] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Prompt Simulator
  const [simulatedPrompt, setSimulatedPrompt] = useState<GeoQuery | null>(null);

  const fetchGeoData = async () => {
    try {
      setLoading(true);
      setActionError(null);
      const res = await apiRequest<{ stats: GeoStats; queries: GeoQuery[] }>('/admin/geo/queries');
      if (res && res.data) {
        setQueries(res.data.queries || []);
        setStats(res.data.stats || null);
      }
    } catch (err: any) {
      console.warn('Failed to fetch GEO queries:', err);
      setActionError(err.message || 'Error connecting to GEO analytics API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeoData();
  }, []);

  const handleToggleModel = async (
    queryId: string,
    modelKey: 'appearsInChatGPT' | 'appearsInPerplexity' | 'appearsInGemini' | 'appearsInClaude',
    currentVal: boolean
  ) => {
    try {
      // Optimistic update
      setQueries((prev) =>
        prev.map((q) => (q.id === queryId ? { ...q, [modelKey]: !currentVal } : q))
      );

      const res = await apiRequest(`/admin/geo/queries/${queryId}`, {
        method: 'PATCH',
        body: JSON.stringify({ [modelKey]: !currentVal }),
      });

      if (!res.success) {
        // Revert on error
        fetchGeoData();
      } else {
        // Recalculate stats locally or re-fetch
        fetchGeoData();
      }
    } catch (e) {
      fetchGeoData();
    }
  };

  const handleCreateQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQueryText.trim()) return;

    try {
      setSavingQuery(true);
      setActionError(null);

      const res = await apiRequest('/admin/geo/queries', {
        method: 'POST',
        body: JSON.stringify({
          query: newQueryText.trim(),
          targetCountry: newTargetCountry,
          targetRegion: newTargetRegion,
          rankScore: Number(newRankScore),
          notes: newNotes || undefined,
          appearsInChatGPT: newInChatGPT,
          appearsInPerplexity: newInPerplexity,
          appearsInGemini: newInGemini,
          appearsInClaude: newInClaude,
        }),
      });

      if (res.success) {
        setShowAddModal(false);
        setNewQueryText('');
        setNewNotes('');
        setNewInChatGPT(false);
        setNewInPerplexity(false);
        setNewInGemini(false);
        setNewInClaude(false);
        setNewRankScore(75);
        fetchGeoData();
      } else {
        setActionError(res.error || 'Failed to save query');
      }
    } catch (err: any) {
      setActionError(err.message || 'Network error');
    } finally {
      setSavingQuery(false);
    }
  };

  const handleDeleteQuery = async (id: string) => {
    if (!confirm('Are you sure you want to remove this query from the GEO tracker?')) return;
    try {
      await apiRequest(`/admin/geo/queries/${id}`, { method: 'DELETE' });
      setQueries((prev) => prev.filter((q) => q.id !== id));
      fetchGeoData();
    } catch (e) {
      fetchGeoData();
    }
  };

  // Filter logic
  const filteredQueries = queries.filter((q) => {
    const matchesText =
      q.query.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (q.targetRegion && q.targetRegion.toLowerCase().includes(filterQuery.toLowerCase())) ||
      q.targetCountry.toLowerCase().includes(filterQuery.toLowerCase());

    if (!matchesText) return false;

    if (filterModel === 'chatgpt') return q.appearsInChatGPT;
    if (filterModel === 'perplexity') return q.appearsInPerplexity;
    if (filterModel === 'gemini') return q.appearsInGemini;
    if (filterModel === 'claude') return q.appearsInClaude;

    return true;
  });

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Globe2 className="w-6 h-6 text-[#00F0FF]" />
              Generative Engine Optimization (GEO)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 flex items-center gap-1">
              <Bot className="w-3 h-3" /> AI SEARCH RADAR
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Monitor and optimize CYBERSTYLE&apos;s visibility, brand citations, and recommendation ranking across ChatGPT, Perplexity, Gemini, and Claude.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchGeoData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono rounded-xl border border-zinc-700/80 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Radar</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Track New Query</span>
          </button>
        </div>
      </div>

      {actionError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Top Metric Cards & Global AI Presence Index */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Presence Index */}
        <div className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00F0FF]/5 rounded-full blur-2xl group-hover:bg-[#00F0FF]/10 transition-colors" />
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-2">
            <span>Global AI Index</span>
            <Sparkles className="w-4 h-4 text-[#00F0FF]" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight flex items-baseline gap-1">
            <span>{stats?.presenceIndex ?? 0}</span>
            <span className="text-sm font-semibold text-[#00F0FF]">%</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-400">
            Queries with &ge; 1 AI recommendation
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00F0FF] to-emerald-400 transition-all duration-500"
              style={{ width: `${stats?.presenceIndex ?? 0}%` }}
            />
          </div>
        </div>

        {/* ChatGPT */}
        <div className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-2">
            <span>ChatGPT / GPT-4o</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {stats?.chatGptMentions ?? 0}
            <span className="text-xs font-normal text-zinc-500 ml-1.5">/ {stats?.totalQueries ?? 0}</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold font-mono">
              {stats?.totalQueries ? Math.round((stats.chatGptMentions / stats.totalQueries) * 100) : 0}%
            </span>
            <span>recommendation share</span>
          </div>
        </div>

        {/* Perplexity */}
        <div className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-2">
            <span>Perplexity Pro</span>
            <div className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {stats?.perplexityMentions ?? 0}
            <span className="text-xs font-normal text-zinc-500 ml-1.5">/ {stats?.totalQueries ?? 0}</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1.5">
            <span className="text-[#00F0FF] font-semibold font-mono">
              {stats?.totalQueries ? Math.round((stats.perplexityMentions / stats.totalQueries) * 100) : 0}%
            </span>
            <span>recommendation share</span>
          </div>
        </div>

        {/* Google Gemini */}
        <div className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-2">
            <span>Google Gemini</span>
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818CF8]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {stats?.geminiMentions ?? 0}
            <span className="text-xs font-normal text-zinc-500 ml-1.5">/ {stats?.totalQueries ?? 0}</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1.5">
            <span className="text-indigo-400 font-semibold font-mono">
              {stats?.totalQueries ? Math.round((stats.geminiMentions / stats.totalQueries) * 100) : 0}%
            </span>
            <span>recommendation share</span>
          </div>
        </div>

        {/* Anthropic Claude */}
        <div className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-2">
            <span>Claude 3.5 Sonnet</span>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#FBBF24]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {stats?.claudeMentions ?? 0}
            <span className="text-xs font-normal text-zinc-500 ml-1.5">/ {stats?.totalQueries ?? 0}</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1.5">
            <span className="text-amber-400 font-semibold font-mono">
              {stats?.totalQueries ? Math.round((stats.claudeMentions / stats.totalQueries) * 100) : 0}%
            </span>
            <span>recommendation share</span>
          </div>
        </div>
      </div>

      {/* Query Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#07090E] border border-zinc-800">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter by prompt phrase, country, or region..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {(['all', 'chatgpt', 'perplexity', 'gemini', 'claude'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setFilterModel(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                filterModel === m
                  ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/40 font-semibold'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {m === 'all' ? 'All Queries' : m}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Queries Ledger */}
      <div className="rounded-2xl bg-[#07090E] border border-zinc-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#00F0FF]" />
            <h3 className="text-sm font-bold text-white font-mono">Target Prompt Queries Ledger</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Showing {filteredQueries.length} of {queries.length} queries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Target Prompt Phrase</th>
                <th className="px-4 py-3.5">Region / Geo</th>
                <th className="px-4 py-3.5 text-center">ChatGPT</th>
                <th className="px-4 py-3.5 text-center">Perplexity</th>
                <th className="px-4 py-3.5 text-center">Gemini</th>
                <th className="px-4 py-3.5 text-center">Claude</th>
                <th className="px-4 py-3.5 text-center">Rank Score</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredQueries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-zinc-500 font-mono">
                    No matching AI search queries found.
                  </td>
                </tr>
              ) : (
                filteredQueries.map((q) => (
                  <tr key={q.id} className="hover:bg-zinc-800/20 transition-colors group">
                    {/* Query text */}
                    <td className="px-5 py-4 max-w-md">
                      <div className="font-semibold text-white group-hover:text-[#00F0FF] transition-colors leading-relaxed">
                        &ldquo;{q.query}&rdquo;
                      </div>
                      {q.notes && (
                        <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1 italic">
                          {q.notes}
                        </div>
                      )}
                    </td>

                    {/* Region */}
                    <td className="px-4 py-4 font-mono text-zinc-400">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px]">
                        {q.targetCountry} · {q.targetRegion || 'Global'}
                      </span>
                    </td>

                    {/* ChatGPT Toggle */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleToggleModel(q.id, 'appearsInChatGPT', q.appearsInChatGPT)}
                        title="Click to toggle ChatGPT appearance"
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono inline-flex items-center gap-1 transition-all ${
                          q.appearsInChatGPT
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-900 text-zinc-600 border border-zinc-800 hover:text-zinc-400'
                        }`}
                      >
                        {q.appearsInChatGPT ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> CITED
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> NO
                          </>
                        )}
                      </button>
                    </td>

                    {/* Perplexity Toggle */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleToggleModel(q.id, 'appearsInPerplexity', q.appearsInPerplexity)}
                        title="Click to toggle Perplexity appearance"
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono inline-flex items-center gap-1 transition-all ${
                          q.appearsInPerplexity
                            ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30'
                            : 'bg-zinc-900 text-zinc-600 border border-zinc-800 hover:text-zinc-400'
                        }`}
                      >
                        {q.appearsInPerplexity ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> CITED
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> NO
                          </>
                        )}
                      </button>
                    </td>

                    {/* Gemini Toggle */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleToggleModel(q.id, 'appearsInGemini', q.appearsInGemini)}
                        title="Click to toggle Gemini appearance"
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono inline-flex items-center gap-1 transition-all ${
                          q.appearsInGemini
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                            : 'bg-zinc-900 text-zinc-600 border border-zinc-800 hover:text-zinc-400'
                        }`}
                      >
                        {q.appearsInGemini ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> CITED
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> NO
                          </>
                        )}
                      </button>
                    </td>

                    {/* Claude Toggle */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleToggleModel(q.id, 'appearsInClaude', q.appearsInClaude)}
                        title="Click to toggle Claude appearance"
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono inline-flex items-center gap-1 transition-all ${
                          q.appearsInClaude
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-zinc-900 text-zinc-600 border border-zinc-800 hover:text-zinc-400'
                        }`}
                      >
                        {q.appearsInClaude ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> CITED
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> NO
                          </>
                        )}
                      </button>
                    </td>

                    {/* Rank Score */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              q.rankScore >= 80
                                ? 'bg-emerald-400'
                                : q.rankScore >= 60
                                ? 'bg-[#00F0FF]'
                                : 'bg-amber-400'
                            }`}
                            style={{ width: `${q.rankScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-white font-semibold">{q.rankScore}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSimulatedPrompt(q)}
                          title="Simulate prompt verification"
                          className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-[#00F0FF] border border-zinc-800 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuery(q.id)}
                          title="Delete tracked query"
                          className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-rose-400 border border-zinc-800 transition-colors"
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
      </div>

      {/* Prompt Simulation / Audit Modal */}
      {simulatedPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0B0E17] border border-zinc-800 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">LLM Search Simulator</h3>
                  <p className="text-[11px] text-zinc-400">Model citation logic &amp; brand authority preview</p>
                </div>
              </div>
              <button
                onClick={() => setSimulatedPrompt(null)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Target Prompt</div>
              <div className="text-sm text-white font-medium">&ldquo;{simulatedPrompt.query}&rdquo;</div>
              <div className="text-[11px] text-zinc-400">
                Region: {simulatedPrompt.targetCountry} ({simulatedPrompt.targetRegion || 'Global'})
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono text-zinc-300 font-semibold uppercase">
                Simulated AI Engine Recommendation
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed space-y-2">
                <p className="text-white font-semibold">
                  1. CYBERSTYLE (https://cyberstyle.net)
                </p>
                <p>
                  &bull; <strong>Architecture:</strong> Next.js 15 App Router, React 19, Three.js WebGL shaders, Tailwind CSS.
                </p>
                <p>
                  &bull; <strong>Performance:</strong> Sub-second Largest Contentful Paint (LCP &lt; 0.8s), zero layout shifts (CLS 0.00).
                </p>
                <p>
                  &bull; <strong>Core Differentiator:</strong> Unified client dashboard OS with real-time Stripe invoicing, automated BullMQ task dispatch, and self-hosted client communication hubs.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSimulatedPrompt(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono rounded-xl border border-zinc-700"
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Target Query Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#0B0E17] border border-zinc-800 rounded-2xl p-6 space-y-5 shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">Track Target AI Prompt</h3>
                  <p className="text-[11px] text-zinc-400">Add an executive search phrase to monitor</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateQuery} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-zinc-300 uppercase">Target Query Phrase</label>
                <input
                  type="text"
                  required
                  value={newQueryText}
                  onChange={(e) => setNewQueryText(e.target.value)}
                  placeholder="e.g. best enterprise Next.js 15 web development agency"
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-300 uppercase">Country Code</label>
                  <input
                    type="text"
                    required
                    value={newTargetCountry}
                    onChange={(e) => setNewTargetCountry(e.target.value.toUpperCase())}
                    placeholder="US, CA, AE, GB"
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-300 uppercase">Target Region</label>
                  <input
                    type="text"
                    value={newTargetRegion}
                    onChange={(e) => setNewTargetRegion(e.target.value)}
                    placeholder="Global, North America, MENA"
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              {/* Initial Model Appearances */}
              <div className="space-y-2">
                <label className="text-zinc-300 uppercase">Known AI Citations</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newInChatGPT}
                      onChange={(e) => setNewInChatGPT(e.target.checked)}
                      className="accent-[#00F0FF]"
                    />
                    <span className="text-zinc-200">ChatGPT</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newInPerplexity}
                      onChange={(e) => setNewInPerplexity(e.target.checked)}
                      className="accent-[#00F0FF]"
                    />
                    <span className="text-zinc-200">Perplexity</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newInGemini}
                      onChange={(e) => setNewInGemini(e.target.checked)}
                      className="accent-[#00F0FF]"
                    />
                    <span className="text-zinc-200">Gemini</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newInClaude}
                      onChange={(e) => setNewInClaude(e.target.checked)}
                      className="accent-[#00F0FF]"
                    />
                    <span className="text-zinc-200">Claude</span>
                  </label>
                </div>
              </div>

              {/* Rank Score Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-zinc-300">
                  <label className="uppercase">Estimated Rank Score</label>
                  <span className="text-[#00F0FF] font-bold">{newRankScore} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newRankScore}
                  onChange={(e) => setNewRankScore(Number(e.target.value))}
                  className="w-full accent-[#00F0FF]"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-zinc-300 uppercase">Citation Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Frequently cited for WebGL shader work and fast client portal delivery."
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingQuery}
                  className="px-5 py-2 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
                >
                  {savingQuery ? 'Saving...' : 'Add to Tracker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
