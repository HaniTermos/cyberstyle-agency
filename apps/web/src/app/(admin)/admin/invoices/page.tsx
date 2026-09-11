'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import {
  Receipt,
  Download,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  ShieldCheck,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  projectName: string;
  amount: number;
  currency: string;
  status: 'PAID' | 'SENT' | 'DRAFT' | 'OVERDUE';
  issuedDate: string;
  dueDate: string;
  notes?: string;
}

const SAMPLE_INVOICES: InvoiceItem[] = [
  {
    id: 'inv_101',
    invoiceNumber: 'INV-2026-001',
    clientName: 'Acme Global Corp',
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
    clientName: 'Vortex AI Trading',
    projectName: 'Vortex AI Platform (Deposit 50%)',
    amount: 14000,
    currency: 'USD',
    status: 'PAID',
    issuedDate: 'Aug 28, 2026',
    dueDate: 'Sep 04, 2026',
  },
  {
    id: 'inv_103',
    invoiceNumber: 'INV-2026-003',
    clientName: 'Nexus Health Systems',
    projectName: 'Nexus Health Portal (Architecture Phase)',
    amount: 11000,
    currency: 'USD',
    status: 'PAID',
    issuedDate: 'Sep 02, 2026',
    dueDate: 'Sep 09, 2026',
  },
  {
    id: 'inv_104',
    invoiceNumber: 'INV-2026-004',
    clientName: 'SynthWave Audio',
    projectName: 'Audio Synthesizer Engine (Milestone 1)',
    amount: 6000,
    currency: 'USD',
    status: 'SENT',
    issuedDate: 'Sep 08, 2026',
    dueDate: 'Sep 15, 2026',
  },
];

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(SAMPLE_INVOICES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceItem | null>(null);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${new Date().getFullYear()}-00${invoices.length + 1}`,
    clientName: '',
    projectName: '',
    amount: 8750,
    currency: 'USD',
    status: 'DRAFT' as InvoiceItem['status'],
    issuedDate: 'Sep 09, 2026',
    dueDate: 'Sep 23, 2026',
    notes: '',
  });

  // Load real invoices on mount
  useEffect(() => {
    async function loadInvoices() {
      try {
        setLoading(true);
        const res = await apiRequest<{ invoices: any[] }>('/invoices');
        if (res && res.data && Array.isArray(res.data.invoices) && res.data.invoices.length > 0) {
          const mapped: InvoiceItem[] = res.data.invoices.map((i: any) => ({
            id: i.id,
            invoiceNumber: i.invoiceNumber,
            clientName: i.organization?.name || 'Client Org',
            projectName: i.project?.name || 'Architecture & Delivery',
            amount: Number(i.totalAmount || i.amountDue || 0),
            currency: i.currency || 'USD',
            status: (i.status as any) || 'DRAFT',
            issuedDate: i.issueDate ? new Date(i.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
            dueDate: i.dueDate ? new Date(i.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'In 30 Days',
            notes: i.notes || '',
          }));
          setInvoices(mapped);
        }
      } catch (e) {
        console.warn('Using cached invoice ledger fallback:', e);
      } finally {
        setLoading(false);
      }
    }
    loadInvoices();
  }, []);

  const handleDownloadPdf = async (inv: InvoiceItem) => {
    try {
      setDownloadingId(inv.id);
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const url = `${apiBase}/invoices/${inv.id}/pdf`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('cyberstyle_admin_token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('PDF generation server responded with error');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${inv.invoiceNumber || 'CYBERSTYLE-INVOICE'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      console.error('Invoice download failed:', err);
      alert(`Download Error: Could not generate PDF. Please ensure API is running.`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const newInv: InvoiceItem = {
      id: `inv_${Date.now()}`,
      ...formData,
    };
    setInvoices([newInv, ...invoices]);
    setShowCreateModal(false);

    // Call API in background
    apiRequest('/invoices', {
      method: 'POST',
      body: JSON.stringify({
        organizationId: 'org_default',
        currency: formData.currency,
        lineItems: [{ description: formData.projectName || 'Digital Services', unitPrice: formData.amount, quantity: 1 }],
        paymentTerms: 'NET30',
        notes: formData.notes,
      }),
    }).catch(console.warn);
  };

  const handleUpdateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;
    setInvoices((prev) =>
      prev.map((i) => (i.id === editingInvoice.id ? { ...i, ...formData } : i))
    );
    setEditingInvoice(null);

    apiRequest(`/invoices/${editingInvoice.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: formData.status,
        notes: formData.notes,
      }),
    }).catch(console.warn);
  };

  const handleDeleteInvoice = async (id: string) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    setDeletingInvoiceId(null);
    apiRequest(`/invoices/${id}`, { method: 'DELETE' }).catch(console.warn);
  };

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.projectName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: InvoiceItem['status']) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            PAID / SETTLED
          </span>
        );
      case 'SENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
            <Clock className="w-3 h-3" />
            SENT / OUTSTANDING
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-zinc-700/30 text-zinc-400 border border-zinc-700">
            DRAFT
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            OVERDUE
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
              <Receipt className="w-6 h-6 text-[#00F0FF]" />
              Invoices & Billing Ledger
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              PAYMENT SYSTEM: TEST MODE
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Stripe automated billing, PDF receipts, and milestone-linked payment schedules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/payments"
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono rounded-xl border border-zinc-700/80 transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payments Ledger</span>
          </Link>
          <button
            onClick={() => {
              setFormData({
                invoiceNumber: `INV-${new Date().getFullYear()}-00${invoices.length + 1}`,
                clientName: '',
                projectName: '',
                amount: 8750,
                currency: 'USD',
                status: 'DRAFT',
                issuedDate: 'Sep 09, 2026',
                dueDate: 'Sep 23, 2026',
                notes: '',
              });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search invoice number, client, or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          {['ALL', 'PAID', 'SENT', 'DRAFT', 'OVERDUE'].map((st) => (
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

      {/* Invoices Table */}
      <div className="rounded-2xl bg-[#07090E] border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 uppercase">
              <tr>
                <th className="px-5 py-3">Invoice Number</th>
                <th className="px-5 py-3">Client & Project</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-5 py-4 font-mono font-bold text-[#00F0FF]">{inv.invoiceNumber}</td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{inv.clientName}</div>
                    <div className="text-[11px] text-zinc-400 font-mono truncate max-w-xs">{inv.projectName}</div>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-white text-sm">
                    ${inv.amount.toLocaleString()}.00 <span className="text-[10px] text-zinc-500 font-normal">{inv.currency}</span>
                  </td>
                  <td className="px-5 py-4">{getStatusBadge(inv.status)}</td>
                  <td className="px-5 py-4 text-zinc-400 font-mono text-[11px]">{inv.dueDate}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href="/admin/messages"
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-[#00F0FF] border border-zinc-800"
                        title="Discuss Invoice in Messages"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDownloadPdf(inv)}
                        disabled={downloadingId === inv.id}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                        title="Download PDF"
                      >
                        <Download className={`w-3.5 h-3.5 ${downloadingId === inv.id ? 'animate-bounce text-[#00F0FF]' : ''}`} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingInvoice(inv);
                          setFormData({
                            invoiceNumber: inv.invoiceNumber,
                            clientName: inv.clientName,
                            projectName: inv.projectName,
                            amount: inv.amount,
                            currency: inv.currency,
                            status: inv.status,
                            issuedDate: inv.issuedDate,
                            dueDate: inv.dueDate,
                            notes: inv.notes || '',
                          });
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
                        title="Edit Invoice"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingInvoiceId(inv.id)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-800"
                        title="Void / Delete Invoice"
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
      </div>

      {/* CREATE / EDIT MODAL */}
      {(showCreateModal || editingInvoice) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#07090E] border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#00F0FF]" />
                {editingInvoice ? 'Edit Invoice' : 'Generate New Invoice'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingInvoice(null);
                }}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={editingInvoice ? handleUpdateInvoice : handleCreateInvoice} className="p-6 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Invoice Number</label>
                  <input
                    type="text"
                    required
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Client Name</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Acme Global Corp"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 uppercase">Project / Deliverable Name</label>
                <input
                  type="text"
                  required
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="e.g. Acme SaaS Modernization (Milestone 4)"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Total Amount ($ USD)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="SENT">SENT</option>
                    <option value="PAID">PAID</option>
                    <option value="OVERDUE">OVERDUE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Issue Date</label>
                  <input
                    type="text"
                    value={formData.issuedDate}
                    onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Due Date</label>
                  <input
                    type="text"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingInvoice(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  {editingInvoice ? 'Save Invoice' : 'Issue Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deletingInvoiceId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#07090E] border border-rose-500/30 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white font-mono">Void / Delete Invoice?</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Are you sure you want to void or delete this invoice? This will be logged in the audit ledger.
            </p>
            <div className="pt-2 flex items-center justify-end gap-3 font-mono text-xs">
              <button
                onClick={() => setDeletingInvoiceId(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteInvoice(deletingInvoiceId)}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold"
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
