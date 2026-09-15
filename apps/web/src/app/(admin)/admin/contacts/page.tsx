'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Search,
  CheckCircle2,
  MessageSquare,
  Clock,
  Plus,
  Trash2,
  Edit2,
  ArrowUpRight,
  UserPlus,
  ShieldCheck
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status?: string;
  createdAt: string;
}

export default function AdminContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeContact, setActiveContact] = useState<ContactSubmission | null>(null);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<ContactSubmission[]>('/admin/contacts');
      if (res.success && Array.isArray(res.data)) {
        setContacts(res.data);
      } else {
        setContacts([]);
      }
    } catch {
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiRequest<ContactSubmission>('/admin/contacts', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const newInquiry: ContactSubmission = (res.success && res.data) ? res.data : {
        ...formData,
        id: `cont_${Date.now()}`,
        status: 'NEW',
        createdAt: new Date().toISOString(),
      };

      setContacts((prev) => [newInquiry, ...prev]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteContact = async () => {
    if (!activeContact) return;

    try {
      await apiRequest(`/admin/contacts/${activeContact.id}`, { method: 'DELETE' });
      setContacts((prev) => prev.filter((c) => c.id !== activeContact.id));
      setShowDeleteModal(false);
      setActiveContact(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConvertToLead = async (contact: ContactSubmission) => {
    try {
      const res = await apiRequest<{ id: string }>('/admin/leads', {
        method: 'POST',
        body: JSON.stringify({
          clientName: contact.name,
          clientEmail: contact.email,
          company: contact.subject || 'Direct Inquiry Lead',
          estimatedBudget: 25000,
          status: 'NEW',
          aiScore: 82,
        }),
      });

      router.push('/admin/leads');
    } catch {
      router.push('/admin/leads');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const filtered = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.message?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20">
              INBOX
            </span>
            <span className="text-[11px] font-mono text-zinc-500">PUBLIC CONTACT SUBMISSIONS</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Contact Submissions & Inquiries</h1>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-3.5 py-2 rounded-lg bg-[#00F0FF] hover:bg-[#00D8E6] text-black text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Manual Inquiry</span>
        </button>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contact messages..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]"
        />
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[11px]">
            <tr>
              <th className="p-4">Sender</th>
              <th className="p-4">Subject & Message</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-sans">
            {filtered.length > 0 ? (
              filtered.map((contact) => (
                <tr key={contact.id} className="hover:bg-zinc-800/20">
                  <td className="p-4">
                    <div className="font-semibold text-zinc-100">{contact.name}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{contact.email}</div>
                  </td>
                  <td className="p-4 max-w-md">
                    <div className="font-medium text-zinc-200">{contact.subject || 'General Inquiry'}</div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">{contact.message}</p>
                  </td>
                  <td className="p-4 text-zinc-500 font-mono text-[11px]">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {contact.status || 'RECEIVED'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleConvertToLead(contact)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono flex items-center gap-1 transition-colors"
                        title="Convert to Lead"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Lead</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveContact(contact);
                          setShowDetailModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                        title="View Full Message"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveContact(contact);
                          setShowDeleteModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete Submission"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500 text-xs">
                  {loading ? 'Fetching submissions...' : 'No contact submissions found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#00F0FF]" />
              Log Manual Contact Submission
            </h2>
            <form onSubmit={handleCreateContact} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Mercer"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. alex@apexcorp.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Cloud Security Architecture Engagement"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Inquiry Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Details of client requirements..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
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
                  Log Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail / View Drawer */}
      {showDetailModal && activeContact && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#00F0FF]" />
              Submission Details
            </h2>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <div className="text-zinc-500 uppercase text-[10px]">Sender</div>
                <div className="text-white font-semibold text-sm mt-0.5">{activeContact.name} ({activeContact.email})</div>
                <div className="text-zinc-400 text-[11px] mt-1">{new Date(activeContact.createdAt).toLocaleString()}</div>
              </div>

              <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <div className="text-zinc-500 uppercase text-[10px]">Subject</div>
                <div className="text-[#00F0FF] font-semibold mt-0.5">{activeContact.subject || 'General Inquiry'}</div>
              </div>

              <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <div className="text-zinc-500 uppercase text-[10px]">Message Content</div>
                <p className="text-zinc-200 whitespace-pre-wrap font-sans mt-1 text-xs leading-relaxed">
                  {activeContact.message}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${activeContact.email}?subject=${encodeURIComponent('Re: ' + (activeContact.subject || 'CYBERSTYLE Agency Inquiry'))}`}
                  className="px-3.5 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>

                <button
                  onClick={() => handleConvertToLead(activeContact)}
                  className="px-3.5 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Convert to Lead</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white text-xs font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && activeContact && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              Delete Contact Submission
            </h2>
            <p className="text-xs text-zinc-400">
              Are you sure you want to permanently delete the inquiry from <strong className="text-white">{activeContact.name}</strong>?
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
                onClick={handleDeleteContact}
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
