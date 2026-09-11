'use client';

import React, { useState, useEffect } from 'react';
import { Star, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function PortalFeedbackPage() {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientTitle, setClientTitle] = useState('Managing Director');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionStr = sessionStorage.getItem('cyberstyle_portal_session');
      if (sessionStr) {
        try {
          const parsed = JSON.parse(sessionStr);
          if (parsed.user) {
            setClientName(parsed.user.name || parsed.user.email || '');
            setCompanyName(parsed.user.organizationName || 'Client Partner');
          }
        } catch {}
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiRequest('/content/reviews', {
        method: 'POST',
        body: JSON.stringify({
          clientName: clientName.trim() || 'Verified Client',
          clientTitle: clientTitle.trim() || 'Client Stakeholder',
          companyName: companyName.trim() || 'Enterprise Client',
          rating,
          quote: feedback.trim(),
        }),
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.error || 'Failed to submit review to backend. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error while submitting review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-2xl">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">Feedback & Review</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Submit your testimonial and engineering review directly to the CYBERSTYLE database for public verification.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h2 className="text-base font-bold text-white">Review Submitted to Database</h2>
          <p className="text-xs text-zinc-300">
            Thank you for your feedback! Your review has been saved in the CYBERSTYLE database. You can now verify and manage it in the Admin Dashboard at /admin/reviews.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFeedback('');
            }}
            className="mt-4 px-4 py-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 rounded-xl transition-all"
          >
            Submit Another Review
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Franklin Vance"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Company / Organization
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Capital Advisory"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Role / Title
            </label>
            <input
              type="text"
              value={clientTitle}
              onChange={(e) => setClientTitle(e.target.value)}
              placeholder="e.g. Managing Director / CTO"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Overall Rating (1 - 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  className={`p-2 rounded-lg border transition-all ${
                    rating >= s
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                      : 'bg-zinc-800/40 border-zinc-800 text-zinc-600'
                  }`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Your Review / Case Note
            </label>
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe the speed, code quality, and engineering impact of CYBERSTYLE's delivery..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{loading ? 'Submitting to Database...' : 'Submit Verified Testimonial'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
