import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { SectionGradient } from '@/components/ui/SectionGradient';
import { CTA_LABELS } from '@/lib/constants/brand';

interface Props {
  params: Promise<{ slug: string }>;
}

interface ConceptDetail {
  slug: string;
  title: string;
  conceptType: string;
  industry: string;
  serviceCategory: string;
  summary: string;
  challenge: string;
  solution: string;
  architectureHighlights: { title: string; desc: string }[];
  deliverables: string[];
  coverImage?: string;
}

const conceptsData: Record<string, ConceptDetail> = {
  'logistics-lead-routing-concept': {
    slug: 'logistics-lead-routing-concept',
    title: 'Automated Enquiry Intake & Dispatch Architecture',
    conceptType: 'Interactive Automation Prototype',
    industry: 'Logistics & Supply Chain',
    serviceCategory: 'AI & Enquiry Automation Workflows',
    summary:
      'A prototype intake system designed to process complex freight requests, categorize volume specifications, and route qualified enquiries directly to dispatcher calendars.',
    challenge:
      'High-volume service businesses often experience significant delays when manually reviewing unstructured emails and web forms. When prospects must wait hours for an initial response, they frequently look to other providers.',
    solution:
      'We designed an automated workflow prototype featuring structured form validation, AI-assisted enquiry categorization based on explicit criteria, and automated calendar scheduling links for qualified requests.',
    architectureHighlights: [
      { title: 'Intake Pipeline', desc: 'Pre-validates shipment weight, destination, and timeline constraints.' },
      { title: 'Guardrail Filtering', desc: 'Rules-based filters ensure unusual or out-of-scope inquiries are flagged for immediate human review.' },
      { title: 'Calendar Sync', desc: 'Automates calendar invitations and syncs meeting reminders to email.' },
    ],
    deliverables: [
      'Next.js responsive enquiry intake form',
      'Webhook integration with calendar scheduling',
      'Defined fallback triggers for human review',
      'Standardized structured lead notification email',
    ],
  },
  'professional-services-web-concept': {
    slug: 'professional-services-web-concept',
    title: 'Responsive Multi-Page Advisory Web Platform',
    conceptType: 'Web Architecture Demonstration',
    industry: 'B2B Professional Services',
    serviceCategory: 'High-Performing Websites',
    summary:
      'A modern web architecture demonstration featuring semantic SEO hierarchies, optimized responsive layouts, and friction-free consultation booking paths.',
    challenge:
      'Many consulting and advisory firms maintain legacy websites with unoptimized imagery, complex navigation menus, and slow loading times on mobile devices, discouraging prospective clients from reaching out.',
    solution:
      'We architected a streamlined, content-first web experience using Next.js App Router, compressed assets, clean semantic typography, and structured Schema.org metadata to maximize clarity and readability.',
    architectureHighlights: [
      { title: 'Semantic SEO', desc: 'Clean heading hierarchy and schema tags for clear search engine indexing.' },
      { title: 'Mobile Optimization', desc: 'Tested across diverse viewport sizes for smooth touch navigation.' },
      { title: 'Conversion Paths', desc: 'Prominent consultation request buttons positioned across all primary views.' },
    ],
    deliverables: [
      'Multi-page Next.js & TypeScript architecture',
      'Accessible WCAG-compliant color contrast',
      'Technical SEO & OpenGraph meta configuration',
      'Direct form submission with honeypot security',
    ],
  },
  'operations-portal-concept': {
    slug: 'operations-portal-concept',
    title: 'Operations Dashboard & Client Milestone Portal',
    conceptType: 'Software Architecture Prototype',
    industry: 'Business Operations',
    serviceCategory: 'Custom Digital Systems & MVPs',
    summary:
      'A centralized dashboard prototype showcasing role-based user authentication, mock Stripe payment integration, and real-time deliverable tracking.',
    challenge:
      'Growing service agencies frequently juggle project files across fragmented email threads, spreadsheet trackers, and separate invoicing tools, creating administrative friction.',
    solution:
      'We prototyped a unified web application that centralizes milestone progress tracking, document distribution, and card billing in one dashboard without monthly per-user licensing fees.',
    architectureHighlights: [
      { title: 'Role-Based Access', desc: 'Distinct interface views for client reviewers and internal administrators.' },
      { title: 'Payment Integration', desc: 'Pre-configured webhook listeners for Stripe payment confirmations.' },
      { title: 'Relational Schema', desc: 'PostgreSQL database modeling for projects, milestones, and audit trails.' },
    ],
    deliverables: [
      'Secure session authentication architecture',
      'Interactive client project progress view',
      'Administrative milestone creation interface',
      'Stripe mock checkout and invoice display',
    ],
  },
};

// Aliases for backward compatibility
const aliasMap: Record<string, string> = {
  'nexus-logistics-ai-routing': 'logistics-lead-routing-concept',
  'apex-capital-web-experience': 'professional-services-web-concept',
  'lumina-saas-client-portal': 'operations-portal-concept',
};

async function getConcept(slug: string): Promise<ConceptDetail | null> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

  try {
    const res = await fetch(`${API_BASE}/content/case-studies/${encodeURIComponent(slug)}`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const json = await res.json();
      const db = json?.data?.caseStudy;
      if (db) {
        const parsedMetrics = Array.isArray(db.metrics)
          ? db.metrics
          : typeof db.metrics === 'string'
          ? JSON.parse(db.metrics || '[]')
          : [];

        const highlights = parsedMetrics.length > 0
          ? parsedMetrics.map((m: any) => ({
              title: m.label || 'Key Milestone',
              desc: m.value || m.description || 'Verified deliverable',
            }))
          : [
              {
                title: 'Engineering Stack',
                desc: Array.isArray(db.techStack) && db.techStack.length > 0 ? db.techStack.join(', ') : 'Next.js, TypeScript & PostgreSQL',
              },
              {
                title: 'Client Context',
                desc: db.clientName ? `Engineered for ${db.clientName} (${db.clientIndustry || 'Industry'})` : 'Production-grade system architecture',
              },
              {
                title: 'Technical Scope',
                desc: db.serviceCategory || 'Bespoke Digital Systems',
              },
            ];

        return {
          slug: db.slug,
          title: db.title,
          conceptType: db.serviceCategory || 'Verified Production Deliverable',
          industry: db.clientIndustry || 'Enterprise Software',
          serviceCategory: db.serviceCategory || 'Web & Automation Architecture',
          summary: db.summary,
          challenge: db.challenge || db.summary,
          solution: db.solution || 'Engineered custom full-stack software and automation architecture aligned with verified business requirements.',
          architectureHighlights: highlights,
          deliverables: Array.isArray(db.techStack) && db.techStack.length > 0
            ? db.techStack.map((t: string) => `${t} architectural module`)
            : [
                'Full custom source code repository handoff',
                'Comprehensive technical documentation & deployment runbook',
                'Private staging environment & automated QA test suite',
              ],
          coverImage: db.coverImage || undefined,
        };
      }
    }
  } catch (err) {
    // Graceful fallback to static dictionary
  }

  const targetSlug = aliasMap[slug] || slug;
  return conceptsData[targetSlug] || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const concept = await getConcept(slug);

  if (!concept) {
    return {
      title: 'Project Case Study // CYBERSTYLE',
      description: 'Production system deliverable and architecture blueprint.',
    };
  }

  return {
    title: `${concept.title} // Case Study`,
    description: concept.summary,
    alternates: {
      canonical: `https://cyberstyle.net/work/${concept.slug}`,
    },
  };
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const concept = await getConcept(slug);

  if (!concept) {
    notFound();
  }

  // Truthful JSON-LD Schema: TechArticle explaining an engineering deliverable
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: concept.title,
    description: concept.summary,
    author: {
      '@type': 'Organization',
      name: 'CYBERSTYLE',
      url: 'https://cyberstyle.net',
    },
    about: {
      '@type': 'Thing',
      name: concept.industry,
    },
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Link */}
      <div className="pt-28 pb-4 px-6 max-w-7xl mx-auto">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-[#00F0FF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Selected Work
        </Link>
      </div>

      <PageBanner
        badgeText={concept.conceptType}
        title={concept.title}
        description={concept.summary}
      />

      {/* Visual Cover Image Hero Showcase */}
      {concept.coverImage && (
        <section className="px-6 py-6 bg-[#08090C] border-b border-white/10">
          <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={concept.coverImage}
              alt={concept.title}
              className="w-full max-h-[550px] object-cover object-center"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </section>
      )}

      {/* Overview Metadata Strip */}
      <section className="bg-[#08090C] py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-mono">
          <div>
            <span className="text-neutral-500 block mb-1">SPECIMEN TYPE</span>
            <span className="text-white font-semibold text-sm">System Concept</span>
          </div>
          <div>
            <span className="text-neutral-500 block mb-1">INDUSTRY FOCUS</span>
            <span className="text-white font-semibold text-sm">{concept.industry}</span>
          </div>
          <div>
            <span className="text-neutral-500 block mb-1">CAPABILITY</span>
            <span className="text-[#00F0FF] font-semibold text-sm">{concept.serviceCategory}</span>
          </div>
          <div>
            <span className="text-neutral-500 block mb-1">STATUS</span>
            <span className="text-emerald-400 font-semibold text-sm">Interactive Prototype</span>
          </div>
        </div>
      </section>

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      {/* Concept Narrative */}
      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* 1. The Challenge */}
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              01 // The Problem Solved
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-black">
              The Operational Bottleneck
            </h2>
            <p className="text-neutral-700 text-base sm:text-lg leading-relaxed font-sans">
              {concept.challenge}
            </p>
          </div>

          {/* 2. The Solution */}
          <div className="space-y-4 pt-12 border-t border-black/10">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              02 // System Architecture
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-black">
              Engineering Approach &amp; Design
            </h2>
            <p className="text-neutral-700 text-base sm:text-lg leading-relaxed font-sans">
              {concept.solution}
            </p>
          </div>

          {/* 3. Architecture Highlights */}
          <div className="p-8 md:p-12 rounded-3xl bg-[#08090C] text-white space-y-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">
                03 // Technical Features
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-2">
                Core Architectural Highlights
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/10">
              {concept.architectureHighlights.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="font-display font-bold text-lg text-[#00F0FF]">
                    {item.title}
                  </div>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div className="pt-12 border-t border-black/10 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              04 // Prototype Deliverables
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {concept.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-neutral-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Box */}
          <div className="pt-12 border-t border-black/10 text-center space-y-6">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-black">
              Interested in a Similar System for Your Company?
            </h3>
            <p className="text-neutral-600 text-sm max-w-md mx-auto">
              We design custom websites, enquiry automation workflows, and tailored digital tools with defined written scope and transparent pricing.
            </p>
            <div>
              <Link href="/start-project">
                <Button variant="electric" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
                  {CTA_LABELS.primary}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />
    </div>
  );
}
