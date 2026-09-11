'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ListTodo,
  Sparkles,
  CheckCircle2,
  Clock,
  Plus,
  Shield,
  Zap,
  Server,
  Workflow,
  Cpu,
  Flame,
  ArrowRight,
  Filter
} from 'lucide-react';

interface RoadmapItem {
  id: string;
  quarter: 'Q3 2026' | 'Q4 2026' | 'Q1 2027';
  pillar: 'CORE_ENGINE' | 'AI_SYSTEMS' | 'FINANCE' | 'SECURITY' | 'CLIENT_PORTAL';
  title: string;
  summary: string;
  status: 'COMPLETED' | 'IN_DEVELOPMENT' | 'PLANNED';
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  progress: number;
}

const SAMPLE_ROADMAP: RoadmapItem[] = [
  {
    id: 'rd_01',
    quarter: 'Q3 2026',
    pillar: 'SECURITY',
    title: 'Phase 1: Zero-Trust Admin & Portal Isolation',
    summary: 'Argon2id hashing, RFC 6238 TOTP 2FA, session revocation, and route group guardrails.',
    status: 'COMPLETED',
    priority: 'CRITICAL',
    progress: 100,
  },
  {
    id: 'rd_02',
    quarter: 'Q3 2026',
    pillar: 'FINANCE',
    title: 'Phase 2: Stripe Billing Engine & PDF Invoicing',
    summary: 'Direct Stripe Checkout, verified idempotent webhooks, and automatic receipt generation.',
    status: 'COMPLETED',
    priority: 'CRITICAL',
    progress: 100,
  },
  {
    id: 'rd_03',
    quarter: 'Q3 2026',
    pillar: 'AI_SYSTEMS',
    title: 'Phase 3: AI Lead Intelligence & Proposal Workspace',
    summary: 'Gemini 3.7 Flash scoring heuristics, 2-minute Loom scripts, and human approval gates.',
    status: 'COMPLETED',
    priority: 'HIGH',
    progress: 100,
  },
  {
    id: 'rd_04',
    quarter: 'Q3 2026',
    pillar: 'CLIENT_PORTAL',
    title: 'Phase 4: Real-time Threaded Comms & Audit Vault',
    summary: 'Organization-scoped messaging, direct admin triage, asset vault, and client review loop.',
    status: 'COMPLETED',
    priority: 'HIGH',
    progress: 100,
  },
  {
    id: 'rd_05',
    quarter: 'Q4 2026',
    pillar: 'CORE_ENGINE',
    title: 'Multi-Region High-Availability & Edge CDN',
    summary: 'Cloudflare Workers edge caching, dynamic image transforms, and global database read replicas.',
    status: 'IN_DEVELOPMENT',
    priority: 'HIGH',
    progress: 40,
  },
  {
    id: 'rd_06',
    quarter: 'Q4 2026',
    pillar: 'AI_SYSTEMS',
    title: 'Automated Codebase Health & Pentest Scanner',
    summary: 'Continuous AST security scanner and dependency vulnerability autofix workflows.',
    status: 'PLANNED',
    priority: 'NORMAL',
    progress: 10,
  },
  {
    id: 'rd_07',
    quarter: 'Q1 2027',
    pillar: 'CLIENT_PORTAL',
    title: 'Native Mobile Client App (iOS & Android)',
    summary: 'React Native companion app for client stakeholders to approve milestones on the go.',
    status: 'PLANNED',
    priority: 'NORMAL',
    progress: 0,
  },
];

export default function AdminRoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>(SAMPLE_ROADMAP);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('ALL');
  const [selectedPillar, setSelectedPillar] = useState<string>('ALL');

  const filtered = roadmap.filter((item) => {
    const matchesQ = selectedQuarter === 'ALL' || item.quarter === selectedQuarter;
    const matchesP = selectedPillar === 'ALL' || item.pillar === selectedPillar;
    return matchesQ && matchesP;
  });

  const getPillarBadge = (pillar: RoadmapItem['pillar']) => {
    switch (pillar) {
      case 'SECURITY':
        return <span className="text-rose-400 border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 rounded text-[10px] font-mono">SECURITY</span>;
      case 'FINANCE':
        return <span className="text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-mono">FINANCE</span>;
      case 'AI_SYSTEMS':
        return <span className="text-[#00F0FF] border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-2 py-0.5 rounded text-[10px] font-mono">AI INTELLIGENCE</span>;
      case 'CLIENT_PORTAL':
        return <span className="text-purple-400 border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 rounded text-[10px] font-mono">CLIENT PORTAL</span>;
      case 'CORE_ENGINE':
        return <span className="text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded text-[10px] font-mono">CORE INFRA</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <ListTodo className="w-6 h-6 text-[#00F0FF]" />
              Engineering Roadmap & Architecture Sprints
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Q3 2026 ACTIVE
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            CYBERSTYLE agency operating system milestones, infrastructure upgrades, and product release timeline.
          </p>
        </div>

        <button
          onClick={() => alert('New roadmap sprint item modal')}
          className="flex items-center gap-2 px-4 py-2 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sprint Goal</span>
        </button>
      </div>

      {/* Quarter Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {['ALL', 'Q3 2026', 'Q4 2026', 'Q1 2027'].map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuarter(q)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                selectedQuarter === q
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 font-semibold'
                  : 'bg-zinc-900/40 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'SECURITY', 'FINANCE', 'AI_SYSTEMS', 'CLIENT_PORTAL', 'CORE_ENGINE'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPillar(p)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                selectedPillar === p
                  ? 'bg-zinc-800 text-white border border-zinc-600 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Sprints Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['COMPLETED', 'IN_DEVELOPMENT', 'PLANNED'].map((statusKey) => {
          const items = filtered.filter((f) => f.status === statusKey);
          return (
            <div key={statusKey} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      statusKey === 'COMPLETED'
                        ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]'
                        : statusKey === 'IN_DEVELOPMENT'
                        ? 'bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]'
                        : 'bg-zinc-600'
                    }`}
                  />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold">
                    {statusKey.replace('_', ' ')}
                  </h3>
                </div>
                <span className="font-mono text-xs text-zinc-500">({items.length})</span>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#07090E] border border-zinc-800 hover:border-zinc-700 transition-all space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      {getPillarBadge(item.pillar)}
                      <span className="text-[10px] font-mono text-zinc-500">{item.quarter}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-zinc-400 leading-relaxed">{item.summary}</p>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span>Progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            item.status === 'COMPLETED'
                              ? 'bg-emerald-400'
                              : item.status === 'IN_DEVELOPMENT'
                              ? 'bg-[#00F0FF]'
                              : 'bg-zinc-700'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
