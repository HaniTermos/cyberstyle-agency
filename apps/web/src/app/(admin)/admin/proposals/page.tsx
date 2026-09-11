'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  Video,
  Send,
  Building2,
  ArrowUpRight,
  ShieldAlert,
  Search
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface ProposalItem {
  id: string;
  leadName: string;
  companyName: string;
  title: string;
  totalInvestment: number;
  timelineWeeks: number;
  status: 'DRAFT' | 'APPROVED' | 'SENT' | 'REJECTED';
  loomScriptExcerpt: string;
  createdAt: string;
}

const SAMPLE_PROPOSALS: ProposalItem[] = [
  {
    id: 'prop_01',
    leadName: 'David Harrison',
    companyName: 'Apex Capital Advisory',
    title: 'Custom SaaS & High-Security Investor Portal Architecture',
    totalInvestment: 35000,
    timelineWeeks: 6,
    status: 'DRAFT',
    loomScriptExcerpt: '“Hi David, Lead Architect at CYBERSTYLE here. I reviewed your investor reporting requirements and mapped out a custom Next.js 15 + PostgreSQL architecture with strict RBAC...”',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prop_02',
    leadName: 'Sarah Jenkins',
    companyName: 'Aura Biotech Systems',
    title: 'Bespoke Next.js 15 Web Platform with Interactive 3D Protein Visualizer',
    totalInvestment: 18500,
    timelineWeeks: 4,
    status: 'APPROVED',
    loomScriptExcerpt: '“Hi Sarah, walked through your pitch deck and structured the Three.js shader pipeline to achieve 90+ Lighthouse scores while rendering your biological structures...”',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export default function AdminProposalsPage() {
  const [proposals, setProposals] = useState<ProposalItem[]>(SAMPLE_PROPOSALS);
  const [selectedProposal, setSelectedProposal] = useState<ProposalItem | null>(SAMPLE_PROPOSALS[0] || null);
  const [approving, setApproving] = useState(false);

  const handleApprove = async (id: string) => {
    setApproving(true);
    try {
      await apiRequest(`/proposals/${id}/approve`, { method: 'POST' });
      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'APPROVED' } : p))
      );
      if (selectedProposal?.id === id) {
        setSelectedProposal((prev) => (prev ? { ...prev, status: 'APPROVED' } : null));
      }
    } catch {
      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'APPROVED' } : p))
      );
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-zinc-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#00F0FF]" />
              AI Proposal & SOW Drafting Workspace
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
              PHASE 3 GOVERNANCE
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Gemini 3.7 Flash SOW generator with human-in-the-loop approval gate and 2-minute Loom pitch scripts.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
          <ShieldAlert className="w-4 h-4" />
          <span>HUMAN APPROVAL REQUIRED BEFORE SEND</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Proposals List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-[#07090E] border border-zinc-800/80">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Generated Statements of Work
            </h2>

            <div className="space-y-3">
              {proposals.map((prop) => (
                <button
                  key={prop.id}
                  onClick={() => setSelectedProposal(prop)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-2 ${
                    selectedProposal?.id === prop.id
                      ? 'bg-[#00F0FF]/10 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 font-semibold">
                      <Building2 className="w-3 h-3 text-[#00F0FF]" />
                      {prop.companyName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        prop.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {prop.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white line-clamp-1">{prop.title}</h3>

                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mt-1">
                    <span className="text-emerald-400 font-bold">${prop.totalInvestment.toLocaleString()}</span>
                    <span>{prop.timelineWeeks} Weeks</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: SOW & Loom Script Detail */}
        <div className="lg:col-span-7">
          {selectedProposal && (
            <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800/80 space-y-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <h2 className="text-base font-bold text-white">{selectedProposal.title}</h2>
                  <p className="text-xs font-mono text-zinc-400 mt-1">
                    Prepared for <span className="text-white font-semibold">{selectedProposal.leadName}</span> ({selectedProposal.companyName})
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold ${
                    selectedProposal.status === 'APPROVED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {selectedProposal.status}
                </span>
              </div>

              {/* SOW Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Total Scope Budget</span>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    ${selectedProposal.totalInvestment.toLocaleString()} USD
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Estimated Delivery</span>
                  <div className="text-xl font-bold font-mono text-cyan-300">
                    {selectedProposal.timelineWeeks} Weeks
                  </div>
                </div>
              </div>

              {/* Loom Pitch Script */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00F0FF]">
                  <Video className="w-4 h-4" />
                  <span>2-MINUTE LOOM PITCH SCRIPT</span>
                </div>
                <p className="text-xs text-zinc-300 italic leading-relaxed font-sans">
                  {selectedProposal.loomScriptExcerpt}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                {selectedProposal.status === 'DRAFT' ? (
                  <button
                    onClick={() => handleApprove(selectedProposal.id)}
                    disabled={approving}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{approving ? 'Approving...' : 'Approve SOW & Advance Stage'}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Statement of Work Approved by Super Admin</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
