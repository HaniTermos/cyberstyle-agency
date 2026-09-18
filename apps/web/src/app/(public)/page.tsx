'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Layers,
  Zap,
  Clock,
  Code2,
  Star,
  Gauge,
  Sparkles,
  MessageSquare,
  Building2,
  FolderKanban,
} from 'lucide-react';
import Silk from '@/components/backgrounds/Silk';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionGradient } from '@/components/ui/SectionGradient';
import { PartnerLogos } from '@/components/ui/PartnerLogos';
import { DynamicFaqAccordion } from '@/components/faq/DynamicFaqAccordion';
import { Reveal, StaggerContainer, StaggerItem, STUDIO_EASE } from '@/components/motion/Motion';
import { apiRequest } from '@/lib/api';
import {
  PRIMARY_MESSAGE,
  SERVICES,
  CTA_LABELS,
  OWNERSHIP_DISCLOSURE,
  ONGOING_COSTS_DISCLOSURE,
  INCLUDED_SCOPE_DISCLOSURE,
  VALUE_EXTRAS,
  PROJECT_PROCESS_STEPS,
} from '@/lib/constants/brand';

interface CaseStudyItem {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  clientIndustry: string;
  serviceCategory: string;
  summary: string;
  challenge?: string;
  solution?: string;
  results?: string;
  metrics?: Array<{ value: string; label: string }> | any;
  techStack?: string[];
  liveUrl?: string;
}

interface ReviewItem {
  id: string;
  clientName: string;
  clientTitle?: string;
  companyName?: string;
  rating: number;
  quote: string;
  isFeatured?: boolean;
}

const DEFAULT_CASE_STUDIES: CaseStudyItem[] = [
  {
    id: 'nexus-logistics',
    slug: 'nexus-logistics-ai-routing',
    title: 'Nexus Enterprise Telemetry & AI Routing OS',
    clientName: 'Nexus Global Logistics',
    clientIndustry: 'Logistics & Supply Chain',
    serviceCategory: 'AI Systems & Automation',
    summary:
      'Engineered an enterprise telemetry hub and automated AI dispatch workflow handling 14,000+ daily freight route calculations with sub-120ms execution times.',
    metrics: [
      { value: '14,000+', label: 'Daily Routes' },
      { value: '118ms', label: 'Average TTFB' },
      { value: '99.98%', label: 'Uptime SLA' },
    ],
    techStack: ['Next.js 15', 'TypeScript', 'BullMQ', 'PostgreSQL', 'Redis'],
    liveUrl: 'https://nexus-demo.cyberstyle.net',
  },
  {
    id: 'apex-capital',
    slug: 'apex-capital-web-experience',
    title: 'Apex Capital High-Impact Editorial Web Platform',
    clientName: 'Apex Capital Advisory',
    clientIndustry: 'Private Equity & Advisory',
    serviceCategory: 'Premium Web Architecture',
    summary:
      'Architected a bespoke digital presence featuring custom 3D Silk shaders, zero-layout-shift typography, and institutional deal-flow intake pipelines.',
    metrics: [
      { value: '100', label: 'Lighthouse Score' },
      { value: '0.8s', label: 'First Contentful Paint' },
      { value: '3.4x', label: 'Qualified Inbound' },
    ],
    techStack: ['Next.js App Router', 'Tailwind CSS', 'Three.js / WebGL', 'Framer Motion'],
    liveUrl: 'https://apex-demo.cyberstyle.net',
  },
  {
    id: 'lumina-saas',
    slug: 'lumina-saas-client-portal',
    title: 'Lumina Multi-Tenant Client Operations Portal',
    clientName: 'Lumina Global Services',
    clientIndustry: 'B2B Enterprise Services',
    serviceCategory: 'Custom SaaS & Cloud Architecture',
    summary:
      'Built a full-stack client operations hub with role-based access control, cryptographic audit logging, automated Stripe invoicing, and real-time sprint boards.',
    metrics: [
      { value: '6,200', label: 'Active Seats' },
      { value: 'Argon2id', label: 'Cryptographic Auth' },
      { value: '$0/mo', label: 'License Lock-in' },
    ],
    techStack: ['React 19', 'Node.js', 'Prisma ORM', 'Stripe Connect', 'Docker'],
    liveUrl: 'https://lumina-demo.cyberstyle.net',
  },
];

const FALLBACK_REVIEWS: ReviewItem[] = [
  {
    id: 'rev_1',
    clientName: 'Franklin Vance',
    clientTitle: 'Managing Director',
    companyName: 'Apex Capital Advisory',
    rating: 5,
    quote:
      'CYBERSTYLE transformed our visual presence completely. Our inbound high-ticket inquiries increased significantly in the first 30 days. Sub-second speed and stunning design.',
  },
  {
    id: 'rev_2',
    clientName: 'Elena Rostova',
    clientTitle: 'Chief Product Officer',
    companyName: 'OmniFlow Logistics',
    rating: 5,
    quote:
      'The custom 3D Silk shader background and automated AI intake workflow tripled our qualified prospect velocity. Exceptional technical rigor and direct builder access.',
  },
  {
    id: 'rev_3',
    clientName: 'David Chen',
    clientTitle: 'VP of Technology',
    companyName: 'Stratum Ventures',
    rating: 5,
    quote:
      'Zero agency bloat or junior account manager telephone games. We worked directly with senior engineers who delivered a 99+ Core Web Vitals build on schedule.',
  },
];

export default function HomePage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [hasLoadedCaseStudies, setHasLoadedCaseStudies] = useState(false);
  const [hasLoadedReviews, setHasLoadedReviews] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Load Live Case Studies from Database
    apiRequest<{ caseStudies: any[] }>('/content/case-studies')
      .then((res) => {
        if (!isMounted) return;
        if (res.success && Array.isArray(res.data?.caseStudies) && res.data.caseStudies.length > 0) {
          const parsed = res.data.caseStudies.map((item: any) => ({
            ...item,
            metrics: Array.isArray(item.metrics)
              ? item.metrics
              : typeof item.metrics === 'string'
              ? JSON.parse(item.metrics || '[]')
              : [],
            techStack: Array.isArray(item.techStack) ? item.techStack : [],
          }));
          setCaseStudies(parsed.slice(0, 6));
        } else {
          setCaseStudies([]);
        }
      })
      .catch(() => {
        if (isMounted) setCaseStudies([]);
      })
      .finally(() => {
        if (isMounted) setHasLoadedCaseStudies(true);
      });

    // Load Live Reviews from Database
    apiRequest<{ reviews: ReviewItem[] }>('/reviews')
      .then((res) => {
        if (!isMounted) return;
        if (res.success && Array.isArray(res.data?.reviews) && res.data.reviews.length > 0) {
          setReviews(res.data.reviews);
        } else {
          setReviews([]);
        }
      })
      .catch(() => {
        if (isMounted) setReviews([]);
      })
      .finally(() => {
        if (isMounted) setHasLoadedReviews(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#00F0FF] selection:text-black">
      {/* =====================================================================
          1. HERO SECTION (Black Canvas + Fluid Silk Dynamics + Sequential Motion)
          ===================================================================== */}
      <section className="relative min-h-[92vh] flex items-center pt-32 pb-20 overflow-hidden bg-black">
        {/* Silk Ambient Wave Shader */}
        <Silk className="opacity-60" speed={0.7} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Column: Headline & Sequential Hero Animation */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider sm:tracking-widest text-[#00F0FF] flex flex-wrap items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse shrink-0" />
                  High-Performance Web Engineering &amp; AI Studio
                </span>
              </div>

              {/* Main Headline (Instant First Paint for Sub-Second LCP) */}
              <h1 className="font-display font-extrabold text-2xl sm:text-4xl md:text-6xl xl:text-7xl leading-[1.15] sm:leading-[1.05] tracking-tight text-white break-words [overflow-wrap:anywhere]">
                Fast-loading websites and digital systems built around real business needs.
              </h1>

              {/* Paragraph */}
              <p className="text-xs sm:text-base md:text-lg text-neutral-300 max-w-2xl leading-relaxed font-normal">
                {PRIMARY_MESSAGE}
              </p>

              {/* Action CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.44, ease: STUDIO_EASE }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto"
              >
                <Link href="/start-project" className="w-full sm:w-auto">
                  <Button variant="electric" size="lg" className="w-full sm:w-auto justify-center" icon={<ArrowUpRight className="w-5 h-5" />}>
                    {CTA_LABELS.primary}
                  </Button>
                </Link>
                <Link href="/services" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto justify-center">
                    {CTA_LABELS.secondary}
                  </Button>
                </Link>
              </motion.div>

              {/* Micro Outcome Signals */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.56, ease: STUDIO_EASE }}
                className="pt-5 sm:pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-lg text-xs font-mono text-neutral-400"
              >
                <div className="flex sm:block items-center justify-between sm:justify-start gap-2">
                  <span className="text-white font-semibold block text-xs sm:text-sm">&lt; 1s Load Speed</span>
                  <span className="text-[11px] sm:text-xs">Core Web Vitals 99+</span>
                </div>
                <div className="flex sm:block items-center justify-between sm:justify-start gap-2">
                  <span className="text-[#00F0FF] font-semibold block text-xs sm:text-sm">Bespoke 3D Design</span>
                  <span className="text-[11px] sm:text-xs">Unique brand authority</span>
                </div>
                <div className="flex sm:block items-center justify-between sm:justify-start gap-2">
                  <span className="text-white font-semibold block text-xs sm:text-sm">Direct Builders</span>
                  <span className="text-[11px] sm:text-xs">No agency telephone games</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Core Competitive Powers Panel */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.38, ease: STUDIO_EASE }}
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-lg relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00F0FF]/30 to-white/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-500" />
                <Card variant="highlight" className="p-5 sm:p-8 backdrop-blur-2xl relative bg-[#07090E]/95 border border-white/15">
                  {/* Header */}
                  <div className="pb-4 sm:pb-5 border-b border-white/10 space-y-1 sm:space-y-1.5">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#00F0FF] block">
                      CORE ENGINEERING POWERS
                    </span>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                      Sub-second speed. High performance. Unique design.
                    </h3>
                  </div>

                  {/* 4 Outcome Items spotlighting owner strengths */}
                  <div className="py-6 space-y-3.5">
                    {/* Item 1: Speed */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1 hover:border-[#00F0FF]/30 transition-colors">
                      <div className="flex items-center gap-2 text-white text-sm font-semibold">
                        <Gauge className="w-4 h-4 text-[#00F0FF] shrink-0" />
                        <span>Sub-Second Speed &amp; Instant Loads</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed pl-6 font-sans">
                        Zero-bloat Next.js engineering with automatic WebP/AVIF compression ensuring your site loads in under 1 second so prospects never bounce.
                      </p>
                    </div>

                    {/* Item 2: High Performance Architecture */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1 hover:border-[#00F0FF]/30 transition-colors">
                      <div className="flex items-center gap-2 text-white text-sm font-semibold">
                        <Zap className="w-4 h-4 text-[#00F0FF] shrink-0" />
                        <span>High-Performance Architecture</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed pl-6 font-sans">
                        Resilient server-side rendering, edge caching, and PostgreSQL/Redis databases built to process traffic surges reliably without crashing.
                      </p>
                    </div>

                    {/* Item 3: Unique Bespoke Aesthetics */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1 hover:border-[#00F0FF]/30 transition-colors">
                      <div className="flex items-center gap-2 text-white text-sm font-semibold">
                        <Sparkles className="w-4 h-4 text-[#00F0FF] shrink-0" />
                        <span>Unique &amp; Bespoke Digital Aesthetics</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed pl-6 font-sans">
                        Custom 3D Silk shaders, sleek dark interfaces, and curated typography that stand out from cookie-cutter WordPress templates.
                      </p>
                    </div>

                    {/* Item 4: Direct Senior Support */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1 hover:border-[#00F0FF]/30 transition-colors">
                      <div className="flex items-center gap-2 text-white text-sm font-semibold">
                        <ShieldCheck className="w-4 h-4 text-[#00F0FF] shrink-0" />
                        <span>Direct Senior Engineer Support</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed pl-6 font-sans">
                        Direct communication with the senior engineers building your platform. Includes 30 days of post-launch hypercare and 100% code ownership.
                      </p>
                    </div>
                  </div>

                  {/* Note below the cards */}
                  <div className="pt-4 border-t border-white/10 text-xs font-mono text-neutral-400 leading-normal">
                    Every project is architected with fixed milestones, clear written scopes, and transparent deliverables from day one.
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tools and Integrations We Work With */}
      <PartnerLogos />

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-48 sm:h-64 lg:h-72" />

      {/* =====================================================================
          2. EDITORIAL STATEMENT / PHILOSOPHY (Pure White Canvas)
          ===================================================================== */}
      <section id="about" className="bg-white text-black pt-4 pb-16 sm:pb-28 px-4 sm:px-6 transition-colors duration-500">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-20">
          <Reveal>
            <div className="space-y-4 sm:space-y-6 max-w-5xl">
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-neutral-500 block">
                Core Philosophy
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-black leading-[1.15] sm:leading-[1.1] tracking-tight break-words">
                A business website should make your capabilities crystal clear and make it effortless for high-ticket clients to contact you.
              </h2>
            </div>
          </Reveal>

          {/* Multi-Column Supporting Editorial Text */}
          <Reveal delay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 pt-6 sm:pt-8 border-t border-black/10 text-neutral-700 text-sm sm:text-base md:text-lg leading-relaxed">
              <p>
                If your website is confusing on mobile screens, takes more than two seconds to load, or looks like every generic template on the internet, prospective clients bounce immediately. First impressions in B2B transactions are forged in milliseconds.
              </p>
              <p>
                We build high-performance websites, 24/7 AI enquiry automations, and custom client portals. By focusing on sub-second rendering, bespoke visual authority, and seamless booking funnels, we turn passive visitors into qualified leads.
              </p>
            </div>
          </Reveal>

          {/* Engineering Benchmarks */}
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 pt-8 sm:pt-12 border-t border-black/10">
            <StaggerItem>
              <div className="space-y-1 border-l-2 border-black pl-3 sm:pl-4">
                <div className="font-display font-bold text-2xl sm:text-4xl text-black">&lt; 800ms</div>
                <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-neutral-500">Sub-Second Page Loads</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="space-y-1 border-l-2 border-black pl-3 sm:pl-4">
                <div className="font-display font-bold text-2xl sm:text-4xl text-black">99+ CWV</div>
                <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-neutral-500">Lighthouse Performance</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="space-y-1 border-l-2 border-black pl-3 sm:pl-4">
                <div className="font-display font-bold text-2xl sm:text-4xl text-black">24/7 AI</div>
                <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-neutral-500">Automated Lead Triage</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="space-y-1 border-l-2 border-black pl-3 sm:pl-4">
                <div className="font-display font-bold text-2xl sm:text-4xl text-black">100% Handoff</div>
                <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-neutral-500">Code &amp; Database Owned</div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Atmospheric White-to-Light Gradient */}
      <SectionGradient direction="white-to-light" heightClass="h-20 sm:h-28" />

      {/* =====================================================================
          3. WORK SHOWCASE (Connected to Database & Dynamic Case Studies)
          ===================================================================== */}
      <section id="work" className="bg-[#F8F9FB] text-black pt-6 sm:pt-8 pb-16 sm:pb-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 sm:pb-8 border-b border-black/10">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#0080FF] animate-pulse" />
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-neutral-500 block">
                    Work Showcase // Live Database
                  </span>
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl text-black tracking-tight break-words">
                  Featured Client Work &amp; System Deliverables.
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start md:items-center gap-3 sm:gap-4">
                <p className="text-neutral-600 text-xs sm:text-sm max-w-md font-sans">
                  Real production architectures, automated AI pipelines, and bespoke client platforms engineered to drive measurable conversion and operational leverage.
                </p>
                <Link href="/work" className="shrink-0">
                  <Button variant="secondary" size="sm" icon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                    View All Work
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Dynamic Work Cards with CLS Prevention */}
          {!hasLoadedCaseStudies ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-h-[380px] sm:min-h-[420px] rounded-2xl bg-black/[0.03] border border-black/10 animate-pulse p-6" />
              ))}
            </div>
          ) : caseStudies.length === 0 ? (
            <div className="py-12 sm:py-16 text-center border border-dashed border-black/10 rounded-2xl p-6 sm:p-8 bg-black/[0.02]">
              <FolderKanban className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-neutral-500 text-xs sm:text-sm font-mono">
                No case studies published yet.
              </p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {caseStudies.map((project, index) => {
                const metricsList = Array.isArray(project.metrics) ? project.metrics.slice(0, 3) : [];
                const techList = Array.isArray(project.techStack) ? project.techStack.slice(0, 4) : [];

                return (
                  <StaggerItem key={project.id || project.slug || index}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.015 }}
                      transition={{ duration: 0.22, ease: STUDIO_EASE }}
                      className="h-full"
                    >
                      <Card
                        variant="light"
                        className="p-5 sm:p-8 flex flex-col justify-between h-full bg-white border border-black/10 hover:border-black/30 hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="space-y-6">
                          {/* Header badge */}
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-[#0080FF] font-semibold uppercase tracking-wider truncate max-w-[60%]">
                              {project.clientIndustry || 'Enterprise System'}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-black/5 text-neutral-600 font-mono border border-black/5 shrink-0">
                              0{index + 1} // {project.serviceCategory || 'Architecture'}
                            </span>
                          </div>

                          {/* Title & Summary */}
                          <div className="space-y-2 sm:space-y-3">
                            <h3 className="font-display font-bold text-lg sm:text-xl md:text-2xl text-black group-hover:text-[#0080FF] transition-colors leading-snug break-words">
                              {project.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed line-clamp-3">
                              {project.summary}
                            </p>
                          </div>

                          {/* Metrics Grid */}
                          {metricsList.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-black/5">
                              {metricsList.map((m: any, mIdx: number) => (
                                <div key={mIdx} className="bg-black/[0.03] rounded-lg p-2.5 text-center">
                                  <div className="font-display font-bold text-base text-black">
                                    {typeof m === 'string' ? m : m.value || m.label}
                                  </div>
                                  <div className="text-[10px] font-mono text-neutral-500 truncate uppercase mt-0.5">
                                    {typeof m === 'string' ? 'Metric' : m.label || 'Value'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Tech Stack Chips */}
                          {techList.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {techList.map((tech: string, tIdx: number) => (
                                <span
                                  key={tIdx}
                                  className="px-2 py-0.5 rounded bg-black/5 text-neutral-700 text-[11px] font-mono"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Card Footer */}
                        <div className="pt-6 mt-6 border-t border-black/10 flex items-center justify-between">
                          <Link
                            href={`/work/${project.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-black hover:text-[#0080FF] transition-colors"
                          >
                            <span>Explore Case Study</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </Link>

                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-neutral-400 hover:text-black transition-colors"
                              title="View Live Demo"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-black/10 text-xs font-mono text-neutral-500">
            <span>Verified production deliverables and architecture blueprints.</span>
            <Link href="/work" className="text-black font-semibold hover:text-[#0080FF] transition-colors inline-flex items-center gap-1">
              <span>View all engineering demonstrations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Atmospheric Light-to-White Gradient */}
      <SectionGradient direction="light-to-white" heightClass="h-20 sm:h-28" />

      {/* =====================================================================
          4. SERVICES & PRICING PACKAGES (Website + Smart Enquiry System Upgraded)
          ===================================================================== */}
      <section id="pricing" className="bg-white text-black pt-6 sm:pt-8 pb-16 sm:pb-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
          <Reveal>
            <div className="max-w-3xl space-y-3 sm:space-y-4">
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#0080FF] block">
                Project Investments
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl text-black tracking-tight break-words">
                Clear Scopes. Fixed Build Fees. No Surprises.
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                Choose the scope that best aligns with your business goals. All proposals detail deliverables, milestones, and timelines in writing before building begins.
              </p>
            </div>
          </Reveal>

          {/* Pricing Grid */}
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {/* Tier 1: Business Website Launch */}
            <StaggerItem>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="h-full">
                <Card variant="light" className="p-5 sm:p-8 flex flex-col justify-between h-full border border-black/15 bg-white shadow-sm hover:shadow-md transition-all">
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-black">{SERVICES.web.name}</h3>
                      <p className="text-xs text-neutral-500 mt-1">{SERVICES.web.description}</p>
                    </div>
                    <div className="pt-3 sm:pt-4 border-t border-black/10">
                      <div className="font-display font-bold text-2xl sm:text-3xl text-black">{SERVICES.web.startingPrice}</div>
                      <span className="text-xs text-neutral-500 font-mono">One-time build fee baseline</span>
                    </div>
                    <ul className="space-y-2.5 sm:space-y-3 text-xs text-neutral-700 pt-3 sm:pt-4 border-t border-black/10">
                      {SERVICES.web.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#0080FF] flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-3 sm:pt-4 border-t border-black/10 text-xs font-sans text-neutral-600">
                      <span className="font-semibold text-black block mb-1">Best for:</span>
                      {SERVICES.web.bestFor}
                    </div>
                  </div>
                  <Link href="/start-project" className="mt-8">
                    <Button variant="secondary" className="w-full justify-center">
                      {SERVICES.web.ctaText}
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            </StaggerItem>

            {/* Tier 2: Website + Smart Enquiry System (HIGHLIGHTED WITH SILK & AI INTEGRATION) */}
            <StaggerItem>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="relative rounded-2xl p-[1px] bg-gradient-to-b from-[#00F0FF]/50 to-white/10 shadow-[0_0_40px_rgba(0,240,255,0.18)] h-full"
              >
                <Card variant="dark" className="p-5 sm:p-8 h-full flex flex-col justify-between relative overflow-hidden bg-[#06080D]">
                  <Silk className="opacity-30" speed={0.5} />

                  <div className="relative z-10 space-y-4 sm:space-y-6">
                    <div className="space-y-2.5 sm:space-y-3 text-center">
                      <div className="flex justify-center">
                        <Badge variant="electric" className="px-3 py-1 text-xs shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                          Popular Scope
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-xl sm:text-2xl text-white">{SERVICES.ai.name}</h3>
                        <p className="text-xs text-neutral-400 mt-1">{SERVICES.ai.description}</p>
                      </div>
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-white/10">
                      <div className="font-display font-bold text-2xl sm:text-3xl text-white">{SERVICES.ai.startingPrice}</div>
                      <span className="text-xs text-[#00F0FF] font-mono">One-time build fee baseline</span>
                    </div>

                    <ul className="space-y-2.5 sm:space-y-3 text-xs text-neutral-200 pt-3 sm:pt-4 border-t border-white/10">
                      {SERVICES.ai.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#00F0FF] flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-3 sm:pt-4 border-t border-white/10 text-xs font-sans text-neutral-300">
                      <span className="font-semibold text-white block mb-1">Best for:</span>
                      {SERVICES.ai.bestFor}
                    </div>
                  </div>

                  <Link href="/start-project" className="relative z-10 mt-6 sm:mt-8">
                    <Button variant="electric" className="w-full justify-center">
                      {SERVICES.ai.ctaText}
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            </StaggerItem>

            {/* Tier 3: Custom Business Growth System */}
            <StaggerItem>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="h-full">
                <Card variant="light" className="p-5 sm:p-8 flex flex-col justify-between h-full border border-black/15 bg-white shadow-sm hover:shadow-md transition-all">
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-black">{SERVICES.saas.name}</h3>
                      <p className="text-xs text-neutral-500 mt-1">{SERVICES.saas.description}</p>
                    </div>
                    <div className="pt-3 sm:pt-4 border-t border-black/10">
                      <div className="font-display font-bold text-2xl sm:text-3xl text-black">{SERVICES.saas.startingPrice}</div>
                      <span className="text-xs text-neutral-500 font-mono">One-time build fee baseline</span>
                    </div>
                    <ul className="space-y-2.5 sm:space-y-3 text-xs text-neutral-700 pt-3 sm:pt-4 border-t border-black/10">
                      {SERVICES.saas.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-3 sm:pt-4 border-t border-black/10 text-xs font-sans text-neutral-600">
                      <span className="font-semibold text-black block mb-1">Best for:</span>
                      {SERVICES.saas.bestFor}
                    </div>
                  </div>
                  <Link href="/start-project" className="mt-8">
                    <Button variant="secondary" className="w-full justify-center">
                      {SERVICES.saas.ctaText}
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>

          {/* Transparent Process Steps */}
          <div className="pt-10 sm:pt-16 border-t border-black/10 space-y-6 sm:space-y-8">
            <Reveal>
              <div className="text-center max-w-xl mx-auto space-y-1.5 sm:space-y-2">
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#0080FF]">
                  Transparent Process
                </span>
                <h3 className="font-display font-bold text-xl sm:text-3xl text-black">
                  Starting a project is simple
                </h3>
                <p className="text-xs text-neutral-500 font-sans">
                  Clear milestones from day one with no technical jargon or surprise scope changes.
                </p>
              </div>
            </Reveal>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {PROJECT_PROCESS_STEPS.map((step) => (
                <StaggerItem key={step.step}>
                  <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-black/10 space-y-2 sm:space-y-3 relative hover:border-[#0080FF]/40 transition-colors">
                    <span className="text-xs font-mono text-[#0080FF] font-bold">
                      STEP {step.step}
                    </span>
                    <h4 className="font-display font-bold text-base text-black">
                      {step.title}
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                      {step.desc}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Atmospheric Light-to-White Gradient */}
      <SectionGradient direction="light-to-white" heightClass="h-20 sm:h-28" />

      {/* =====================================================================
          5. VERIFIED CLIENT REVIEWS SECTION (New Dedicated Homepage Section)
          ===================================================================== */}
      <section id="reviews" className="bg-[#08090C] text-white pt-10 sm:pt-12 pb-16 sm:pb-28 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 sm:pb-8 border-b border-white/10">
              <div>
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#00F0FF] block mb-2">
                  Client Verification // Verified Results
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl text-white tracking-tight break-words">
                  What Clients Say About Working With Us.
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[11px] sm:text-xs font-mono text-neutral-400">
                  {reviews.length} Verified Engagements
                </span>
                <Link href="/reviews">
                  <Button variant="outline" size="sm" icon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                    View Reviews &amp; Standards
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Reviews Grid with CLS Prevention */}
          {!hasLoadedReviews ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-h-[180px] sm:min-h-[220px] rounded-2xl bg-white/5 border border-white/10 animate-pulse p-6" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-12 sm:py-16 text-center border border-dashed border-white/10 rounded-2xl p-6 sm:p-8 bg-white/[0.02]">
              <MessageSquare className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
              <p className="text-neutral-400 text-xs sm:text-sm font-mono">
                No client reviews published yet.
              </p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {reviews.map((rev) => (
                <StaggerItem key={rev.id}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <Card
                      variant="dark"
                      className="p-4 sm:p-6 lg:p-8 flex flex-col justify-between h-full bg-[#0E1118] border border-white/10 hover:border-[#00F0FF]/40 transition-all space-y-3 sm:space-y-5"
                    >
                      <div className="space-y-3">
                        {/* 5 Stars */}
                        <div className="flex items-center gap-1 text-[#00F0FF]">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                          ))}
                        </div>

                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic font-sans">
                          "{rev.quote}"
                        </p>
                      </div>

                      <div className="pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-display font-semibold text-xs sm:text-sm text-white truncate">
                            {rev.clientName}
                          </div>
                          <div className="text-[11px] sm:text-xs text-neutral-400 font-mono truncate">
                            {rev.clientTitle && `${rev.clientTitle}, `}
                            {rev.companyName}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> VERIFIED
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Commitments Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-white/10">
            <div className="p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10 space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2 text-[#00F0FF]">
                <Clock className="w-4 h-4" />
                <h4 className="font-display font-bold text-sm text-white">Fixed Written Scopes</h4>
              </div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Clear milestones and acceptance criteria documented before a single line of code is written.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#00F0FF]">
                <Code2 className="w-4 h-4" />
                <h4 className="font-display font-bold text-sm text-white">Private Staging Access</h4>
              </div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Test interactive layouts and review features on your own devices prior to production launch.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#00F0FF]">
                <ShieldCheck className="w-4 h-4" />
                <h4 className="font-display font-bold text-sm text-white">Full Code Handoff</h4>
              </div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                {OWNERSHIP_DISCLOSURE} You own your repositories and files with zero vendor lock-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric Dark-to-White Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-28 sm:h-36" />

      {/* =====================================================================
          6. DYNAMIC FAQ ACCORDION (Connected to Postgres & Multi-Page Sync)
          ===================================================================== */}
      <section id="faq" className="bg-white text-black pt-6 sm:pt-8 pb-16 sm:pb-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
          <Reveal>
            <div className="text-center space-y-3 sm:space-y-4">
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-neutral-500 block">
                Common Inquiries
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-black tracking-tight break-words">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                Direct, honest answers about project timelines, code handoff, AI workflows, and pricing.
              </p>
            </div>
          </Reveal>

          {/* Dynamic Component Loaded from Database */}
          <DynamicFaqAccordion
            page="home"
            variant="light"
          />

          <div className="text-center pt-8 border-t border-black/10">
            <Link
              href="/faq"
              className="text-xs font-mono text-neutral-500 hover:text-black transition-colors inline-flex items-center gap-1.5 underline underline-offset-4"
            >
              <span>Have additional technical or billing questions? View full FAQ knowledge base</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Black Gradient before final CTA */}
      <SectionGradient direction="white-to-black" heightClass="h-32 sm:h-44" />
    </div>
  );
}
