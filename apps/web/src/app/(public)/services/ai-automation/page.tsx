import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Zap,
  Bot,
  Clock,
  Sparkles,
  ShieldCheck,
  Check,
  Wrench,
  MessageSquare,
  BarChart3,
  MailCheck
} from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionGradient } from '@/components/ui/SectionGradient';

export const metadata: Metadata = {
  title: 'AI & Business Automation Systems // CYBERSTYLE',
  description:
    'Custom AI systems that respond to client inquiries in seconds, qualify leads 24/7, and eliminate repetitive work. From $1,200 with $30/mo maintenance.',
};

export default function AIAutomationServicePage() {
  const plainEnglishDeliverables = [
    {
      title: '24/7 Instant Lead Responses',
      desc: 'When an inquiry arrives, AI immediately reads it, scores the customer’s budget, and prepares an intelligent reply in under 30 seconds.',
      icon: Zap,
    },
    {
      title: 'Automated CRM & Customer Logging',
      desc: 'Customer contact details, requests, and conversation history are automatically saved into your database without any manual copy-pasting.',
      icon: BarChart3,
    },
    {
      title: 'Smart Email & Follow-Up Drafter',
      desc: 'Drafts personalized email follow-ups for your sales team so you can close deals faster with zero writer’s block.',
      icon: MailCheck,
    },
    {
      title: 'Instant Team Notifications',
      desc: 'Sends instant alerts directly to your phone, Slack, or email as soon as a high-value customer reaches out.',
      icon: MessageSquare,
    },
    {
      title: 'Secure & Private Customer Data',
      desc: 'Your business secrets and customer contacts are completely private and encrypted. Your data is never used to train public models.',
      icon: ShieldCheck,
    },
    {
      title: 'Zero High Monthly Software Subscriptions',
      desc: 'Runs on your own system. You avoid paying hundreds of dollars in recurring software fees every month.',
      icon: Bot,
    },
  ];

  const workflows = [
    {
      step: '01',
      title: 'Inquiry & Bottleneck Discovery',
      desc: 'We talk about the repetitive tasks slowing your business down—answering common questions, sorting emails, or entering data.',
    },
    {
      step: '02',
      title: 'Custom Automation Architecture',
      desc: 'We design the exact workflow steps and AI rules to handle customer interactions accurately in your business voice.',
    },
    {
      step: '03',
      title: 'Building & Test Runs',
      desc: 'We build the automation pipeline and test with mock inquiries to guarantee that responses are accurate, polite, and fast.',
    },
    {
      step: '04',
      title: 'Go-Live & Team Training',
      desc: 'We activate the system live, connect your email/CRM, and give your team a simple video showing how everything operates effortlessly.',
    },
  ];

  const faqs = [
    {
      q: 'Will the AI sound robotic or make mistakes?',
      a: 'No. We train your custom AI prompt with your exact company guidelines, FAQs, pricing rules, and preferred tone of voice. If a customer question is too sensitive or complex, it instantly flags the lead for human review.',
    },
    {
      q: 'What is the $30/month Maintenance & Support package for AI?',
      a: 'For only $30/month, we monitor your AI queues 24/7, maintain background servers, update prompt instructions as your services change, and handle bug fixes with priority response.',
    },
    {
      q: 'Do I need technical skills to manage this?',
      a: 'Not at all. You interact with leads normally through your email inbox, customer portal, or phone. The AI does the heavy lifting in the background.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black font-sans">
      <PageBanner
        badgeText="SERVICE // 02"
        title="AI & Business Automation Systems"
        description="Eliminate manual bottlenecks. We engineer custom 24/7 AI systems that qualify incoming prospects, update your database, and draft responses in seconds."
      />

      <section className="py-20 px-6 bg-[#080A10]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                WHY IT MATTERS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Responding in 5 minutes versus 5 hours makes the difference between winning and losing a client.
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                When prospective buyers reach out, they want answers immediately. Our custom AI automation workflows qualify prospects, categorize their budget, and prepare your response within seconds—keeping your sales pipeline moving 24 hours a day.
              </p>
            </div>

            {/* Plain English Deliverables */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>What’s Included (In Plain English)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plainEnglishDeliverables.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#0C0E17] border border-zinc-800/80 hover:border-cyan-500/30 transition-colors space-y-2"
                    >
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="font-bold text-xs text-white">{item.title}</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Workflow */}
            <div className="space-y-4 pt-6 border-t border-zinc-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>How We Work Together (Step-by-Step)</span>
              </h3>
              <p className="text-xs text-zinc-400">
                A simple, stress-free process where we configure and test everything for you.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {workflows.map((wf, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#0C0E17] border border-zinc-800 space-y-2 relative overflow-hidden"
                  >
                    <span className="font-mono text-2xl font-black text-cyan-400/20 absolute top-2 right-3">
                      {wf.step}
                    </span>
                    <h4 className="text-xs font-bold text-white pr-6">{wf.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{wf.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Maintenance */}
          <div className="lg:col-span-5 space-y-6">
            <Card variant="highlight" className="p-8 space-y-6 bg-[#0C0E17] border-cyan-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">PROJECT INVESTMENT</span>
                <div className="text-4xl font-bold text-white mt-1">From $1,200</div>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Includes AI prompt engineering, database hooks, email trigger setup, and end-to-end testing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs font-mono text-zinc-300">
                <div className="flex justify-between"><span>Setup Time:</span><span className="text-cyan-400 font-bold">1–2 Weeks</span></div>
                <div className="flex justify-between"><span>Engine:</span><span className="text-emerald-400 font-bold">Self-Hosted</span></div>
                <div className="flex justify-between"><span>Recurring SaaS:</span><span className="text-white font-bold">$0 Third-Party</span></div>
              </div>

              <Link href="/start-project" className="block">
                <Button variant="electric" size="lg" className="w-full justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold">
                  <span>Start AI Automation Build</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </Card>

            {/* $30/Mo Maintenance Card */}
            <div className="p-6 rounded-2xl bg-[#0C0E17] border border-cyan-500/20 space-y-4 shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    MAINTENANCE & SUPPORT
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  CANCEL ANYTIME
                </span>
              </div>

              <div>
                <div className="text-2xl font-bold text-white">$30 <span className="text-xs text-zinc-400 font-normal">/ month only</span></div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Peace of mind support for your AI workers, queue health, and continuous prompt refinements.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>24/7 Queue & Worker Uptime Monitoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Monthly Prompt Tuning & Model Accuracy Updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Database Health & Automated Error Retries</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Priority Email & Emergency Patch Support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SectionGradient direction="black-to-white" heightClass="h-32 sm:h-44" />

      {/* FAQs */}
      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">PLAIN QUESTIONS & ANSWERS</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-black/10 bg-[#F8F9FB] space-y-2">
                <h4 className="font-bold text-base text-black">{faq.q}</h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionGradient direction="white-to-black" heightClass="h-32 sm:h-44" />
    </div>
  );
}
