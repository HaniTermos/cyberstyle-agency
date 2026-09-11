import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Cpu, Zap, Bot, ArrowRight } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionGradient } from '@/components/ui/SectionGradient';

export const metadata: Metadata = {
  title: 'AI & Business Workflow Automation',
  description:
    'Automate lead qualification, CRM synchronization, customer follow-ups, and operational intelligence with custom AI pipelines. Starting from $1,200.',
};

export default function AIAutomationServicePage() {
  const deliverables = [
    '24/7 AI Prospect Qualification & Scoring (OpenAI / Gemini integrations)',
    'Automated Multi-Channel CRM Syncing (PostgreSQL, HubSpot, Airtable)',
    'Intelligent Email Draft Generation & Follow-Up Triggers via Nodemailer + BullMQ',
    'Custom Internal Operations Telemetry & Lead Pipeline Dashboard',
    'Webhook Integrations for Slack, Discord, and Email alerts',
    'Data privacy compliance & encrypted credential storage',
    'Failover error handling & retry queue architecture',
    'Staff training documentation & workflow handoff',
  ];

  const faqs = [
    {
      q: 'How does AI lead qualification work in practice?',
      a: 'When a prospect submits an inquiry, our background worker processes the input through custom prompt pipelines, scores the budget and urgency, creates a normalized lead record, and immediately alerts your team via email/Slack with a generated follow-up draft.',
    },
    {
      q: 'Do we have to pay recurring third-party SaaS fees for this automation?',
      a: 'No large SaaS subscriptions are needed. All logic runs directly on your self-hosted Linux VPS via Node.js/Redis/Postgres. You only pay standard low-cost API tokens (e.g. Gemini / OpenAI pennies per thousand leads).',
    },
    {
      q: 'Can this integrate with our existing database or software?',
      a: 'Yes. We build custom API bridges and webhooks to connect with your existing tools, databases, or third-party CRMs.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Service // 02"
        title="AI & Business Automation Systems"
        description="Eliminate manual bottlenecks with custom 24/7 AI lead qualification, CRM pipelines, and operational automation. Starting from $1,200."
      />

      <section className="py-24 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">Operational Efficiency</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                Speed to lead determines conversion. AI automation gives your team instant responsiveness.
              </h2>
            </div>
            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
              When high-value prospects reach out, waiting hours for a response kills conversion. We build intelligent automation systems that qualify, categorize, and draft personalized responses in seconds, keeping your sales pipeline moving 24/7 without growing overhead.
            </p>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <h3 className="font-display font-bold text-xl text-white">Included Systems & Capabilities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card variant="highlight" className="p-8 space-y-6 sticky top-28 bg-[#0C0F17]">
              <div>
                <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-wider">Investment Framework</span>
                <div className="font-display font-bold text-4xl text-white mt-1">From $1,200</div>
                <p className="text-xs text-neutral-400 mt-2">
                  Covers custom AI prompt engineering, Redis queue setup, database schema integration, and end-to-end testing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs font-mono text-neutral-300">
                <div className="flex justify-between"><span>Timeline:</span><span className="text-white">1–2 Weeks</span></div>
                <div className="flex justify-between"><span>Queue Engine:</span><span className="text-white">Redis + BullMQ</span></div>
                <div className="flex justify-between"><span>AI Providers:</span><span className="text-white">Gemini / OpenAI API</span></div>
              </div>

              <Link href="/start-project">
                <Button variant="electric" size="lg" className="w-full justify-center" icon={<ArrowUpRight className="w-5 h-5" />}>
                  Start AI Automation Build
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Frequently Asked</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-black">
              Questions About AI & Automation
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-black/10 bg-[#F8F9FB] space-y-2">
                <h4 className="font-display font-bold text-lg text-black">{faq.q}</h4>
                <p className="text-sm text-neutral-600 leading-relaxed font-sans">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />
    </div>
  );
}
