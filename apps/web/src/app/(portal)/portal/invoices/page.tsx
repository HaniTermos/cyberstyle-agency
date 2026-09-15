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
  HelpCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';
import {
  DEMO_WORKSPACE_DATA,
  InvoiceState,
  INVOICE_STATE_CONFIG,
} from '@/lib/constants/portal';

export default function PortalInvoicesPage() {
  const [invoices] = useState(DEMO_WORKSPACE_DATA.sampleInvoices);

  // Billing order calculation
  const actionRequiredInvoices = invoices.filter((i) => i.status === 'Due' || i.status === 'Overdue');
  const settledInvoices = invoices.filter((i) => i.status === 'Paid');

  const getStatusBadge = (status: InvoiceState) => {
    const config = INVOICE_STATE_CONFIG[status] || {
      label: status,
      color: 'text-zinc-400',
      bg: 'bg-zinc-500/10',
      border: 'border-zinc-500/30',
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${config.bg} ${config.color} ${config.border}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-8 font-sans text-zinc-100 max-w-7xl mx-auto">
      {/* Header with Plain Client Copy */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-400" />
            Invoices and payments
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            View project invoices, download copies for your records, and securely pay any outstanding balance.
          </p>
        </div>

        <Link
          href="/portal/messages?category=Billing%20question"
          className="px-4 py-2 rounded-xl border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <HelpCircle className="w-4 h-4 text-zinc-400" />
          <span>Ask a billing question</span>
        </Link>
      </div>

      {/* 1. Action Required: Any invoice currently due */}
      {actionRequiredInvoices.length > 0 && (
        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Action Required: Outstanding Invoices
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actionRequiredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 block">
                      {inv.number}
                    </span>
                    <h3 className="text-sm font-semibold text-white mt-0.5">
                      {inv.description}
                    </h3>
                  </div>
                  {getStatusBadge(inv.status)}
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-zinc-900">
                  <div>
                    <span className="text-xs text-zinc-400">Total balance:</span>
                    <span className="text-lg font-bold text-white block">
                      ${inv.amount.toLocaleString()} {inv.currency}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-amber-400">
                    Due by {inv.dueDate}
                  </span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <a
                    href="https://checkout.stripe.com/c/pay/cs_test_sample"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs text-center transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  >
                    Pay securely with Stripe
                  </a>
                  <button
                    onClick={() => alert('Sample invoice receipt download')}
                    className="p-2 rounded-xl border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    title="Download invoice copy"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Billing Overview & Registered Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Registered Billing Entity
          </span>
          <h3 className="text-sm font-bold text-white">
            {DEMO_WORKSPACE_DATA.organization.businessName}
          </h3>
          <p className="text-xs text-zinc-400">
            Billing contact: {DEMO_WORKSPACE_DATA.organization.billingEmail}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Payment Terms
          </span>
          <h3 className="text-sm font-bold text-white">Net 14 Calendar Days</h3>
          <p className="text-xs text-zinc-400">
            Settlement method: Stripe Invoice or Wire Transfer
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Support Plan
          </span>
          <h3 className="text-sm font-bold text-white">
            {DEMO_WORKSPACE_DATA.organization.supportArrangement}
          </h3>
          <p className="text-xs text-zinc-400">
            Included hours and terms defined in project agreement
          </p>
        </div>
      </div>

      {/* 3. Invoice History Table */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-4">
        <h3 className="text-sm font-semibold text-white">Invoice records</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-800/80 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Issued Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-4 px-4 font-mono font-medium text-white">{inv.number}</td>
                  <td className="py-4 px-4 text-zinc-300">{inv.description}</td>
                  <td className="py-4 px-4 font-mono text-zinc-200">
                    ${inv.amount.toLocaleString()} {inv.currency}
                  </td>
                  <td className="py-4 px-4 font-mono text-zinc-400">{inv.issueDate}</td>
                  <td className="py-4 px-4">{getStatusBadge(inv.status)}</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => alert(`Downloading ${inv.number} PDF copy...`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors text-[11px]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
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
