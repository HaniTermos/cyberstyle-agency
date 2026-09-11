'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Download,
  CreditCard,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
  Lock
} from 'lucide-react';

interface PortalInvoice {
  id: string;
  invoiceNumber: string;
  projectName: string;
  amount: number;
  currency: string;
  status: 'PAID' | 'DUE' | 'PROCESSING';
  issuedDate: string;
  dueDate: string;
  stripePaymentUrl?: string;
  pdfUrl?: string;
}

const SAMPLE_PORTAL_INVOICES: PortalInvoice[] = [
  {
    id: 'inv_101',
    invoiceNumber: 'INV-2026-001',
    projectName: 'Acme SaaS Modernization (Milestone 1-3)',
    amount: 17500,
    currency: 'USD',
    status: 'PAID',
    issuedDate: 'Aug 15, 2026',
    dueDate: 'Aug 22, 2026',
  },
  {
    id: 'inv_102',
    invoiceNumber: 'INV-2026-002',
    projectName: 'Monthly Dedicated Dev Retainer (September)',
    amount: 7500,
    currency: 'USD',
    status: 'PAID',
    issuedDate: 'Sep 01, 2026',
    dueDate: 'Sep 07, 2026',
  },
  {
    id: 'inv_104',
    invoiceNumber: 'INV-2026-004',
    projectName: 'Milestone 4: Security Audit & Staging Sign-Off',
    amount: 8750,
    currency: 'USD',
    status: 'DUE',
    issuedDate: 'Sep 08, 2026',
    dueDate: 'Sep 15, 2026',
    stripePaymentUrl: 'https://checkout.stripe.com/test_mode_portal_pay',
  },
];

export default function PortalInvoicesPage() {
  const [invoices] = useState<PortalInvoice[]>(SAMPLE_PORTAL_INVOICES);

  const getStatusBadge = (status: PortalInvoice['status']) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            SETTLED
          </span>
        );
      case 'DUE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            PAYMENT DUE
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
            PROCESSING
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans text-zinc-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Receipt className="w-6 h-6 text-emerald-400" />
              Invoices & Billing Statement
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              STRIPE SECURE CHECKOUT (TEST MODE)
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            View engineering milestone billings, download automated PDF invoices, and settle outstanding balances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/portal/retainers"
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono rounded-xl border border-zinc-700/80 transition-colors"
          >
            <span>Retainer Plan</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Total Settled (YTD)
          </span>
          <div className="text-2xl font-bold text-white font-mono">$25,000.00</div>
          <p className="text-[11px] text-emerald-400 font-mono">2 Paid Invoices</p>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Outstanding Due
          </span>
          <div className="text-2xl font-bold text-amber-400 font-mono">$8,750.00</div>
          <p className="text-[11px] text-zinc-400 font-mono">Milestone 4 Delivery</p>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Active Retainer
          </span>
          <div className="text-2xl font-bold text-[#00F0FF] font-mono">$7,500.00 / mo</div>
          <p className="text-[11px] text-zinc-400 font-mono">Next cycle: Oct 01, 2026</p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-emerald-400 font-semibold">{inv.invoiceNumber}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs text-zinc-400 font-mono">Issued: {inv.issuedDate}</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">{inv.projectName}</h3>
              <p className="text-xs text-zinc-500 font-mono">Due date: {inv.dueDate}</p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="text-base font-bold font-mono text-white">
                  ${inv.amount.toLocaleString()}.00 <span className="text-xs font-normal text-zinc-500">{inv.currency}</span>
                </div>
                <div className="mt-1">{getStatusBadge(inv.status)}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Downloading PDF Invoice for ${inv.invoiceNumber}`)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
                  title="Download PDF Invoice"
                >
                  <Download className="w-4 h-4" />
                </button>

                {inv.status === 'DUE' && (
                  <button
                    onClick={() => alert(`Opening Stripe Checkout in Test Mode for $${inv.amount}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Invoice</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
