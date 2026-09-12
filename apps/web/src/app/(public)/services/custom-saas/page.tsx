import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Zap, Server, ShieldCheck, Database } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionGradient } from '@/components/ui/SectionGradient';

export const metadata: Metadata = {
  title: 'Custom Business Software & Client Portals // CYBERSTYLE',
  description:
    'Custom software, client portals, and automated business tools tailored to your exact workflows. You own 100% of the code with zero monthly software rent. Starting from $3,000.',
};

export default function CustomSaaSServicePage() {
  const deliverables = [
    'Private Client Portals: Give clients their own login to view project progress, approve milestones, and download deliverables.',
    'Automatic Credit Card Invoicing: Integrated Stripe payments, subscriptions, and instant digital receipts sent to customers.',
    'Everything in One Simple Dashboard: Replace 5 messy software subscriptions with one clean tool tailored to your exact team.',
    'Zero Monthly Per-User Fees: Stop paying $30/month per employee to SaaS companies. Your platform is yours forever.',
    'Bank-Grade Data Security: Encrypted user logins, phone verification codes, and total privacy for all company records.',
    'Automatic Nightly Backups: Your customer data is backed up safely every night so you never have to worry about data loss.',
    '100% Code & Asset Ownership: Once finished, all software files and code belong entirely to you with zero vendor lock-in.',
    'Flawless Phone & Computer Access: Fast, responsive access for your team on iPhones, Androids, iPads, and office desktops.',
  ];

  const faqs = [
    {
      q: 'What is included in a $3,000 Custom Software build?',
      a: 'You get a complete, working software platform tailored to your business: secure client logins, automatic credit card invoicing with Stripe, custom dashboards, customer management, and deployment ready for real customers.',
    },
    {
      q: 'Why should I build custom software instead of paying for existing tools?',
      a: 'Most software tools charge expensive monthly fees per user and force you to change how your business operates to fit their templates. Custom software fits your exact workflow, saves your team 20+ hours a week, and saves you tens of thousands in recurring software rent over time.',
    },
    {
      q: 'Do you help us maintain and update the software after launch?',
      a: 'Yes! We offer an optional $30/month peace-of-mind care plan that covers 24/7 uptime monitoring, server security patches, nightly encrypted backups, and rapid technical support whenever you need it.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Service // 03"
        title="Custom Business Software & Client Portals"
        description="Stop paying monthly rent for software that doesn't fit your business. We build custom client portals, billing dashboards, and automated tools that you own 100% forever. Starting from $3,000."
      />

      <section className="py-24 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">Custom Business Tools</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                Off-the-shelf software rarely fits how you work. We build tools you actually own.
              </h2>
            </div>
            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
              When standard tools slow down your team or force you into expensive monthly fees, custom software creates an unfair competitive advantage. We build clean, fast, secure software tailored to your exact business.
            </p>

            {/* Plain-English Non-Technical Collaboration Workflow */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">How We Work Together</span>
              <h3 className="font-display font-bold text-2xl text-white">
                Step-by-Step Delivery Without the Technical Confusion
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="w-6 h-6 rounded-md bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-mono flex items-center justify-center font-bold">1</div>
                  <h4 className="text-sm font-semibold text-white">Discovery &amp; Blueprint</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    We map out what your team and clients need, define simple screens, and create a clear milestone schedule before writing code.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="w-6 h-6 rounded-md bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-mono flex items-center justify-center font-bold">2</div>
                  <h4 className="text-sm font-semibold text-white">Interactive Prototype</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    You click through a live preview of your software in a private sandbox. You test features as they are finished and give direct feedback.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="w-6 h-6 rounded-md bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-mono flex items-center justify-center font-bold">3</div>
                  <h4 className="text-sm font-semibold text-white">Security &amp; Payment Setup</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    We connect your credit card billing with Stripe, set up bank-level security, and configure automated nightly database backups.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="w-6 h-6 rounded-md bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-mono flex items-center justify-center font-bold">4</div>
                  <h4 className="text-sm font-semibold text-white">Launch &amp; 100% Handover</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Your platform goes live on your dedicated server. You receive 100% intellectual property ownership, source files, and a simple video guide.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <h3 className="font-display font-bold text-xl text-white">What’s Included in Your Build</h3>
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

          <div className="lg:col-span-5 space-y-6">
            <Card variant="highlight" className="p-8 space-y-6 sticky top-28 bg-[#0C0F17]">
              <div>
                <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-wider">Investment Framework</span>
                <div className="font-display font-bold text-4xl text-white mt-1">From $3,000</div>
                <p className="text-xs text-neutral-400 mt-2">
                  Complete custom software build covering user logins, customer management, Stripe billing, and server deployment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs font-mono text-neutral-300">
                <div className="flex justify-between"><span>Delivery Timeline:</span><span className="text-white">3–6 Weeks</span></div>
                <div className="flex justify-between"><span>Code Ownership:</span><span className="text-[#00F0FF] font-bold">100% Yours Forever</span></div>
                <div className="flex justify-between"><span>Monthly User Rent:</span><span className="text-emerald-400 font-bold">$0 / Month</span></div>
              </div>

              <Link href="/start-project">
                <Button variant="electric" size="lg" className="w-full justify-center" icon={<ArrowUpRight className="w-5 h-5" />}>
                  Start Your Custom Software Build
                </Button>
              </Link>
            </Card>

            {/* $30/month Essential Maintenance & Support Plan */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-[#00F0FF]/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-wider">Peace-of-Mind Care</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20">
                  Optional Add-on
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-2xl text-white">$30</span>
                <span className="text-xs text-neutral-400 font-mono">/ month</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Keep your SaaS secure, updated, and fast. Includes security patching, automated encrypted database backups, uptime monitoring, and priority technical assistance.
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                  <span>Nightly encrypted database backups</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                  <span>Software security patches & dependency updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                  <span>24/7 uptime monitoring & rapid recovery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                  <span>Priority email support for questions and fixes</span>
                </li>
              </ul>
              <Link href="/start-project?plan=saas-maintenance">
                <Button variant="outline" size="sm" className="w-full justify-center text-xs mt-2">
                  Add Maintenance to Project
                </Button>
              </Link>
            </div>
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
              Questions About Custom SaaS
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
