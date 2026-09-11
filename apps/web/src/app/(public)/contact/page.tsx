'use client';

import React, { useState } from 'react';
import { Mail, Clock, Globe, ArrowUpRight, Send, CheckCircle2 } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Direct Inquiries"
        title="Get in Touch with CYBERSTYLE"
        description="Whether you have an immediate project, need an architecture review, or want to discuss AI automation, we respond promptly."
      />

      <section className="py-24 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Info & Operational Presence */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">Direct Contact</span>
              <h2 className="font-display font-bold text-3xl text-white">Let’s connect directly.</h2>
              <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                For rapid inquiries, client communications, or RFP proposals, reach our leadership team at our primary inbox.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0E1118] border border-white/10 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-[#00F0FF]" />
                <a href="mailto:hello@cyberstyle.net" className="font-display font-bold text-lg text-white hover:text-[#00F0FF] transition-colors">
                  hello@cyberstyle.net
                </a>
              </div>
              <div className="flex items-start gap-3 text-xs font-mono text-neutral-400">
                <Globe className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <span>Markets: USA (EST) • Canada (EST) • Middle East (AST)</span>
              </div>
              <div className="flex items-start gap-3 text-xs font-mono text-neutral-400">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Response SLA: Within 24 Business Hours</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Submission Form */}
          <div className="lg:col-span-7">
            <Card variant="dark" className="p-8 md:p-10 bg-[#0E1118] border border-white/10">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-[#00F0FF] mx-auto" />
                  <h3 className="font-display font-bold text-2xl text-white">Message Dispatched</h3>
                  <p className="text-sm text-neutral-400 max-w-md mx-auto">
                    Thank you for reaching out. We have logged your submission and will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="font-display font-bold text-xl text-white">Send a Message</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#00F0FF] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">Your Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="sarah@brand.com"
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#00F0FF] text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Project Inquiry / General Question"
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#00F0FF] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can CYBERSTYLE help your organization?"
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#00F0FF] text-sm"
                    />
                  </div>
                  <Button type="submit" variant="electric" size="lg" icon={<Send className="w-4 h-4" />}>
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
