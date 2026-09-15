'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileCheck,
  HelpCircle,
} from 'lucide-react';
import { DEMO_WORKSPACE_DATA } from '@/lib/constants/portal';

export default function PortalFeedbackPage() {
  const [projectItem, setProjectItem] = useState('Sample staging preview (v1.0)');
  const [feedbackType, setFeedbackType] = useState('Design');
  const [feedbackDetail, setFeedbackDetail] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackDetail.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFeedbackDetail('');
    }, 600);
  };

  return (
    <div className="space-y-8 font-sans text-zinc-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-cyan-400" />
          Project Feedback
        </h1>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-3xl">
          Share feedback on a design, preview, file, milestone, or delivery item. Your comments are private to the project team unless you separately approve public use.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h2 className="text-base font-bold text-white">Feedback Received</h2>
          <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
            Thank you! Your feedback has been assigned to the project team. We will review it and post an update to your project messages.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 rounded-xl transition-all"
          >
            Submit additional feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Related Project
              </label>
              <input
                type="text"
                readOnly
                value={DEMO_WORKSPACE_DATA.activeProject.name}
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Related Item / Deliverable *
              </label>
              <select
                value={projectItem}
                onChange={(e) => setProjectItem(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Sample staging preview (v1.0)">Sample staging preview (v1.0)</option>
                <option value="Sample design preview (v1.2)">Sample design preview (v1.2)</option>
                <option value="Sample project brief">Sample project brief</option>
                <option value="Handover checklist">Handover checklist</option>
                <option value="Other deliverable">Other deliverable</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Feedback Type *
              </label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Design">Design</option>
                <option value="Content">Content</option>
                <option value="Functionality">Functionality</option>
                <option value="Access">Access</option>
                <option value="Launch">Launch</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Normal">Normal</option>
                <option value="High">High (Blocks testing)</option>
                <option value="Low">Low (Nice to have)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Feedback Detail *
            </label>
            <textarea
              required
              rows={5}
              value={feedbackDetail}
              onChange={(e) => setFeedbackDetail(e.target.value)}
              placeholder="Describe what looks good, what requires changes, or any questions for the team..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
            <p className="text-[11px] text-zinc-500">
              Submitted feedback is private to your organization and assigned team members.
            </p>
            <button
              type="submit"
              disabled={loading || !feedbackDetail.trim()}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Sending...' : 'Send feedback'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
