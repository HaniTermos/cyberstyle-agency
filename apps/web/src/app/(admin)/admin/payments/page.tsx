'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Receipt,
  Building2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface PaymentTransaction {
  id: string;
  stripePaymentIntentId: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  currency: string;
  paymentMethod: 'CARD_STRIPE' | 'ACH_TRANSFER' | 'WIRE';
  status: 'SUCCEEDED' | 'PROCESSING' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  receiptUrl?: string;
}

const SAMPLE_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay_01',
    stripePaymentIntentId: 'pi_3Ptest_acme_001',
    invoiceNumber: 'INV-2026-001',
    clientName: 'Acme Global Corp',
    amount: 17500,
    currency: 'USD',
    paymentMethod: 'CARD_STRIPE',
    status: 'SUCCEEDED',
    createdAt: 'Aug 15, 2026, 14:32 UTC',
  },
  {
    id: 'pay_02',
    stripePaymentIntentId: 'pi_3Ptest_vortex_002',
    invoiceNumber: 'INV-2026-002',
    clientName: 'Vortex AI Trading',
    amount: 14000,
    currency: 'USD',
    paymentMethod: 'ACH_TRANSFER',
    status: 'SUCCEEDED',
    createdAt: 'Aug 28, 2026, 11:15 UTC',
  },
  {
    id: 'pay_03',
    stripePaymentIntentId: 'pi_3Ptest_nexus_003',
    invoiceNumber: 'INV-2026-003',
    clientName: 'Nexus Health Systems',
    amount: 11000,
    currency: 'USD',
    paymentMethod: 'WIRE',
    status: 'SUCCEEDED',
    createdAt: 'Sep 02, 2026, 09:40 UTC',
  },
  {
    id: 'pay_04',
    stripePaymentIntentId: 'pi_3Ptest_synth_004',
    invoiceNumber: 'INV-2026-004',
    clientName: 'SynthWave Audio',
    amount: 6000,
    currency: 'USD',
    paymentMethod: 'CARD_STRIPE',
    status: 'PROCESSING',
    createdAt: 'Sep 08, 2026, 18:22 UTC',
  },
];

export default function AdminPaymentsPage() {
  const [payments] = useState<PaymentTransaction[]>(SAMPLE_PAYMENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.stripePaymentIntentId.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PaymentTransaction['status']) => {
    switch (status) {
      case 'SUCCEEDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            SETTLED
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
            <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
            PROCESSING
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3 h-3" />
            FAILED
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            REFUNDED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-[#00F0FF]" />
              Payments & Settlement Ledger
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              PAYMENT SYSTEM: TEST MODE
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Stripe charge events, ACH settlements, webhook reconciliation, and automated receipts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/invoices"
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono rounded-xl border border-zinc-700/80 transition-colors"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Invoices</span>
          </Link>
          <Link
            href="/admin/retainers"
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono rounded-xl border border-zinc-700/80 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retainers</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="text-[11px] font-mono text-zinc-500 uppercase">Gross Volume Recorded</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">$48,500.00</div>
          <p className="text-[11px] text-zinc-400 mt-1">Stripe Test Mode (USD)</p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="text-[11px] font-mono text-zinc-500 uppercase">Settled Transactions</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">
            {payments.filter((p) => p.status === 'SUCCEEDED').length}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">100% success rate</p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="text-[11px] font-mono text-zinc-500 uppercase">In Processing</div>
          <div className="text-2xl font-bold text-[#00F0FF] mt-1 font-mono">$6,000.00</div>
          <p className="text-[11px] text-zinc-400 mt-1">1 ACH transfer pending</p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="text-[11px] font-mono text-zinc-500 uppercase">Webhook Health</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">99.9%</div>
          <p className="text-[11px] text-zinc-400 mt-1">Idempotent signature verified</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search payment ID, invoice, or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          {['ALL', 'SUCCEEDED', 'PROCESSING', 'REFUNDED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                statusFilter === st
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 font-semibold'
                  : 'bg-zinc-900/40 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-[#07090E] border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 uppercase">
              <tr>
                <th className="px-5 py-3">Transaction ID / Stripe Intent</th>
                <th className="px-5 py-3">Invoice & Client</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-5 py-4 font-mono text-zinc-300">
                    <div className="text-white font-medium">{tx.id}</div>
                    <div className="text-[10px] text-zinc-500 truncate max-w-[180px]">{tx.stripePaymentIntentId}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{tx.clientName}</div>
                    <div className="text-[11px] font-mono text-[#00F0FF]">{tx.invoiceNumber}</div>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-white text-sm">
                    ${tx.amount.toLocaleString()}.00 <span className="text-[10px] text-zinc-500 font-normal">{tx.currency}</span>
                  </td>
                  <td className="px-5 py-4 font-mono text-zinc-400 text-[11px]">
                    {tx.paymentMethod.replace('_', ' ')}
                  </td>
                  <td className="px-5 py-4">{getStatusBadge(tx.status)}</td>
                  <td className="px-5 py-4 text-zinc-400 font-mono text-[11px]">{tx.createdAt}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => alert(`Downloading Stripe receipt for ${tx.id} (Test Mode)`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-[11px] border border-zinc-700/60 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
