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
  MailCheck,
} from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionGradient } from '@/components/ui/SectionGradient';
import {
  SERVICES,
  AI_LIMITATIONS_DISCLOSURE,
  ONGOING_COSTS_DISCLOSURE,
  OWNERSHIP_DISCLOSURE,
  CTA_LABELS,
} from '@/lib/constants/brand';

export const metadata: Metadata = {
  title: 'AI & Enquiry Automation Workflows // CYBERSTYLE',
  description:
    'Custom AI automation pipelines for lead pre-qualification, customer inquiry triage, and calendar scheduling with defined guardrails.',
};

export default function AIAutomationServicePage() {
  const plainEnglishDeliverables = [
    {
      title: 'Automated Enquiry Triage',
      desc: 'When an inquiry arrives, the workflow categorizes the request, checks project criteria, and routes details to your team.',
      icon: Zap,
    },
    {
      title: 'CRM & Customer Logging',
      desc: 'Contact details, requested services, and submission timestamps are structured and synchronized into your CRM or database.',
      icon: BarChart3,
    },
    {
      title: 'Calendar & Meeting Scheduling',
      desc: 'Direct calendar integration allows qualified prospects to schedule consultation calls without repetitive back-and-forth emails.',
      icon: MailCheck,
    },
    {
      title: 'Team Alerts & Notifications',
      desc: 'Receive immediate alerts via email, Slack, or webhook notifications whenever a qualified inquiry is submitted.',
      icon: MessageSquare,
    },
    {
      title: 'Data Privacy & Configuration Guardrails',
      desc: 'We configure strict system prompts and instructions so the assistant stays on topic and escalates sensitive questions to humans.',
      icon: ShieldCheck,
    },
    {
      title: 'Modular API Architecture',
      desc: 'Connected to your preferred model provider (OpenAI, Anthropic, or Google) using your own API credentials without proprietary lock-in.',
      icon: Bot,
    },
  ];

  const workflows = [
    {
      step: '01',
      title: 'Requirements & Workflow Discovery',
      desc: 'We identify your primary inquiry channels, common customer questions, and define where automation provides genuine efficiency.',
    },
    {
      step: '02',
      title: 'Prompt Design & Guardrail Setup',
      desc: 'We draft the system prompt using your actual FAQs, pricing guidelines, and tone-of-voice rules, specifying escalation criteria.',
    },
    {
      step: '03',
      title: 'Integration & Staging Test Runs',
      desc: 'We build the pipeline, integrate calendar or email tools, and run test inquiries to verify accurate responses.',
    },
    {
      step: '04',
      title: 'Live Activation & Team Walkthrough',
      desc: 'We activate the workflow in your live environment, test live alerts, and provide simple operational documentation.',
    },
  ];

  const faqs = [
    {
      q: 'Will the AI make mistakes or give incorrect advice?',
      a: `${AI_LIMITATIONS_DISCLOSURE} We configure fallback mechanisms so when the assistant detects ambiguous, out-of-scope, or sensitive requests, it directs the visitor to human staff.`,
    },
    {
      q: 'Are ongoing AI model fees included in the build price?',
      a: 'The build fee covers engineering, prompt configuration, testing, and integration. Third-party model providers (e.g. OpenAI, Anthropic, or Google) charge modest usage fees based on token consumption (typically a few cents per conversation), which you pay directly to the provider via your own API account.',
    },
    {
      q: 'Do I need programming knowledge to manage this?',
      a: 'No. You manage appointments and customer requests through your standard email inbox, CRM, or calendar app. We provide clear documentation showing how to adjust prompt instructions as your offerings change.',
    },
    {
      q: 'Do I own the custom automation code and prompts?',
      a: `${OWNERSHIP_DISCLOSURE} All workflow scripts, system prompts, and configuration files are transferred to your team.`,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black font-sans">
      <PageBanner
        badgeText="SERVICE // 02"
        title={SERVICES.ai.name}
        description={SERVICES.ai.description}
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
                Fast, clear replies keep prospective clients engaged when they are ready to buy.
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                When prospective clients reach out with questions, long response delays often mean they move on to another provider. Our automated enquiry workflows help answer initial questions, gather key project details, and book consultations directly into your calendar.
              </p>
            </div>

            {/* Plain English Deliverables */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>What’s Included in the Build</span>
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
                <span>How We Build Your System</span>
              </h3>
              <p className="text-xs text-zinc-400">
                A structured process with thorough testing before any workflow touches real visitors.
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
                <div className="text-4xl font-bold text-white mt-1">{SERVICES.ai.startingPrice}</div>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  One-time build fee including prompt engineering, system guardrails, calendar webhook integration, and test suite.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs font-mono text-zinc-300">
                <div className="flex justify-between"><span>Setup Timeline:</span><span className="text-cyan-400 font-bold">1–3 Weeks</span></div>
                <div className="flex justify-between"><span>Architecture:</span><span className="text-emerald-400 font-bold">Direct API Integration</span></div>
                <div className="flex justify-between"><span>Prompt Ownership:</span><span className="text-white font-bold">Full Handoff</span></div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-[11px] text-zinc-400 space-y-1">
                <p><strong>Note on Usage Fees:</strong> Model token costs and third-party calendar or SMS tools are billed directly by respective providers based on your actual volume.</p>
              </div>

              <Link href="/start-project" className="block">
                <Button variant="electric" size="lg" className="w-full justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold">
                  <span>{CTA_LABELS.primary}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </Card>

            {/* Maintenance Card */}
            <div className="p-6 rounded-2xl bg-[#0C0E17] border border-cyan-500/20 space-y-4 shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    OPTIONAL ONGOING SUPPORT
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  CANCEL ANYTIME
                </span>
              </div>

              <div>
                <div className="text-2xl font-bold text-white">$30 <span className="text-xs text-zinc-400 font-normal">/ month</span></div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Support for prompt refinement, error log reviews, and webhook connection checks.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Webhook &amp; queue connectivity checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Prompt refinements as your offerings evolve</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Error log audits and integration troubleshooting</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Email support for configuration questions</span>
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
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">PLAIN QUESTIONS &amp; ANSWERS</span>
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
