'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  CheckCircle2,
  Sparkles,
  Send,
  MessageSquare
} from 'lucide-react';

export default function PortalReviewsPage() {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 font-sans text-zinc-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              Client Feedback & Engineering Reviews
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              VERIFIED CLIENT REVIEW
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Share your experience with the CYBERSTYLE engineering squad to help us continuously elevate our delivery standards.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 max-w-2xl space-y-6">
        {submitted ? (
          <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-5 h-5" />
              Thank you! Your feedback has been recorded.
            </div>
            <p className="text-xs text-zinc-300">
              Your feedback is shared directly with the lead engineers and executive squad to maintain delivery excellence.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-zinc-400">Overall Engineering Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-zinc-400">Your Review / Testimonial</label>
              <textarea
                rows={4}
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience with architecture, sprint communication, and final delivery quality..."
                className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 transition-colors font-sans"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Feedback</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
