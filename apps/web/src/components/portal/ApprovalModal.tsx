'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  X,
  CheckCircle2,
  Clock,
  MessageSquare,
} from 'lucide-react';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliverableName: string;
  version: string;
  acceptanceCriteria: string[];
  onConfirmApproval: (notes?: string) => Promise<void>;
  onRequestChanges: (changesNote: string) => Promise<void>;
}

export function ApprovalModal({
  isOpen,
  onClose,
  deliverableName,
  version,
  acceptanceCriteria,
  onConfirmApproval,
  onRequestChanges,
}: ApprovalModalProps) {
  const [step, setStep] = useState<'review' | 'confirm_approve' | 'request_changes'>('review');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasConfirmedCheckbox, setHasConfirmedCheckbox] = useState(false);

  if (!isOpen) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onConfirmApproval(notes);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChanges = async () => {
    if (!notes.trim()) return;
    setIsSubmitting(true);
    try {
      await onRequestChanges(notes);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="approval-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 id="approval-modal-title" className="text-base font-bold text-white">
                Review deliverable: {deliverableName}
              </h2>
              <p className="text-xs text-zinc-400 font-mono">Version: {version}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Initial Review */}
        {step === 'review' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                Agreed Acceptance Criteria
              </h3>
              <ul className="mt-2 space-y-2">
                {acceptanceCriteria.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
              Approving this deliverable signals that the current scope meets your expectations and authorizes the team to advance to the next project phase.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('request_changes')}
                className="px-4 py-2 rounded-xl border border-zinc-700 hover:border-amber-500/40 text-xs font-medium text-zinc-300 hover:text-amber-400 transition-colors"
              >
                Request changes
              </button>
              <button
                type="button"
                onClick={() => setStep('confirm_approve')}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Approve deliverable
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Confirmation Before Approval */}
        {step === 'confirm_approve' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-emerald-300">
                  Confirmation of approval
                </h4>
                <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                  Your decision, timestamp, and user identity will be recorded in the project audit history.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="approval-notes" className="text-xs text-zinc-300 font-medium">
                Optional approval note
              </label>
              <textarea
                id="approval-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any comments or sign-off notes for the project team..."
                className="w-full h-24 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <label className="flex items-start gap-2.5 text-xs text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasConfirmedCheckbox}
                onChange={(e) => setHasConfirmedCheckbox(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-400"
              />
              <span>
                I confirm that I have reviewed {deliverableName} ({version}) and approve it on behalf of my organization.
              </span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('review')}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl border border-zinc-800 text-xs text-zinc-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={!hasConfirmedCheckbox || isSubmitting}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                {isSubmitting ? 'Recording approval...' : 'Confirm & Sign Off'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Request Changes */}
        {step === 'request_changes' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-amber-300">
                  Request adjustments
                </h4>
                <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                  Provide specific details so the team can address your comments accurately.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="change-notes" className="text-xs text-zinc-300 font-medium">
                What changes are needed? <span className="text-amber-400">*</span>
              </label>
              <textarea
                id="change-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe what needs modification or clarification..."
                className="w-full h-28 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('review')}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl border border-zinc-800 text-xs text-zinc-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleChanges}
                disabled={!notes.trim() || isSubmitting}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              >
                {isSubmitting ? 'Submitting...' : 'Submit change request'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
