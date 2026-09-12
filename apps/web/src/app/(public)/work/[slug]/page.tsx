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
  MapPin,
  ExternalLink,
  Quote,
} from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SectionGradient } from '@/components/ui/SectionGradient';

interface Props {
  params: Promise<{ slug: string }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function getCaseStudy(slug: string) {
  try {
    // Try api/v1 or api directly
    const res = await fetch(`http://localhost:4000/api/case-studies/${slug}`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const json = await res.json();
      return json?.data?.caseStudy || null;
    }
  } catch (err) {
    console.warn(`[getCaseStudy] Server fetch notice for ${slug}:`, err);
  }

  // Fallback map for local dev if API offline
  const fallbacks: Record<string, any> = {
    'nexus-logistics-ai-routing': {
      title: '24/7 AI Lead Assistant That Turns Inquiries Into Booked Calls',
      slug: 'nexus-logistics-ai-routing',
      clientName: 'Nexus Global Logistics',
      clientIndustry: 'Logistics & Shipping',
      serviceCategory: '24/7 AI Lead & Booking Assistant',
      summary: 'Replaced slow manual email replies with an instant 30-second AI receptionist that qualifies leads and automatically books appointments on the team calendar.',
      challenge: 'High-value customer inquiries were waiting up to 18 hours for a reply. In the meantime, prospective clients were contacting competitors, resulting in lost deals and frustrated customers.',
      solution: 'We built a modern, lightning-fast website and hooked up an intelligent 24/7 AI Lead Assistant that greets every prospect in under 30 seconds, answers their questions accurately, and schedules a call on the team calendar immediately.',
      results: 'Cut response time from 18 hours down to under 30 seconds. Inquiries converted into qualified sales calls increased by 340% within the first 90 days.',
      metrics: [
        { value: '+340%', label: 'More Booked Leads' },
        { value: '< 30s', label: 'AI Reply Time' },
        { value: '$1.8M', label: 'New Revenue Pipeline' },
      ],
      techStack: ['Fast Website Build', '24/7 AI Receptionist', 'Instant Calendar Booking', 'Mobile Phone Speed'],
      liveUrl: 'https://nexuslogistics.example.com',
      geoCountry: 'US',
      geoRegion: 'North America',
      geoCity: 'Chicago, IL',
      geoLatitude: 41.8781,
      geoLongitude: -87.6298,
    },
    'apex-capital-web-experience': {
      title: 'High-Converting Website That Loads in Under 1 Second',
      slug: 'apex-capital-web-experience',
      clientName: 'Apex Capital Advisory',
      clientIndustry: 'Financial Advisory',
      serviceCategory: 'High-Converting Website',
      summary: 'Redesigned an outdated website into an ultra-fast, premium sales engine that doubled customer inquiries and looks stunning on every mobile phone.',
      challenge: 'Apex had an old, clunky website that took over 5 seconds to open on phones. Prospective clients were bouncing before reading a single paragraph.',
      solution: 'We built an ultra-clean, high-end website that opens in 0.6 seconds on any phone. Every page guides the visitor naturally toward booking a private consultation.',
      results: 'Mobile phone conversions surged by 2.4x, bounce rates dropped to near zero, and the firm immediately established itself as the standout authority in its space.',
      metrics: [
        { value: '< 1.0s', label: 'Instant Phone Speed' },
        { value: '2.4x', label: 'More Booked Clients' },
        { value: '100%', label: 'Ownership (Zero Rent)' },
      ],
      techStack: ['Ultra-Fast Next.js', 'Mobile-First Design', 'SEO & Local Google Ranking', 'Conversion Copywriting'],
      liveUrl: 'https://apexcapital.example.com',
      geoCountry: 'US',
      geoRegion: 'East Coast',
      geoCity: 'New York, NY',
    },
    'lumina-saas-client-portal': {
      title: 'Private Client Portal That Saves 20+ Hours Every Week',
      slug: 'lumina-saas-client-portal',
      clientName: 'Lumina Digital Systems',
      clientIndustry: 'Business Services',
      serviceCategory: 'Custom Client Portal & Tools',
      summary: 'Built a centralized customer dashboard with automated credit card payments, project milestones, and zero monthly software subscription fees.',
      challenge: 'The company was wasting 20+ hours every week sending manual email updates, chasing unpaid invoices, and paying thousands in monthly software subscription fees.',
      solution: 'We created a private, custom client portal where customers log in, view their project progress in real-time, and pay securely via credit card. The client owns the system completely with zero monthly per-user fees.',
      results: 'Invoices are now paid 4.2x faster, client management time was cut by 75%, and the company permanently cancelled 4 expensive monthly software tools.',
      metrics: [
        { value: '4.2x', label: 'Faster Invoice Payments' },
        { value: '20 hrs/wk', label: 'Saved in Manual Admin' },
        { value: '$0', label: 'Monthly Per-User Fees' },
      ],
      techStack: ['Private Client Portal', 'Instant Stripe Card Billing', 'Live Milestone Tracking', '100% Asset Ownership'],
      liveUrl: 'https://luminasystems.example.com',
      geoCountry: 'AE',
      geoRegion: 'MENA',
      geoCity: 'Dubai',
    },
  };

  return fallbacks[slug] || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);

  if (!cs) {
    const formatted = slug.replace(/-/g, ' ').toUpperCase();
    return {
      title: `${formatted} | Case Study | CYBERSTYLE`,
      description: `Case study specimen for ${slug}.`,
    };
  }

  const title = cs.seoTitle || `${cs.title} | Case Study | CYBERSTYLE`;
  const description = cs.seoDescription || cs.summary;
  const canonical = cs.canonicalUrl || `https://cyberstyle.agency/work/${cs.slug}`;

  return {
    title,
    description,
    keywords: cs.keywords || [cs.clientIndustry, cs.serviceCategory, 'Agency Case Study'],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'CYBERSTYLE Agency',
      type: 'article',
      images: cs.ogImage ? [{ url: cs.ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);

  if (!cs) {
    notFound();
  }

  const metricsList = Array.isArray(cs.metrics) ? cs.metrics : [];

  // JSON-LD Schema for SEO and Geo targeting
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    headline: cs.title,
    description: cs.summary,
    provider: {
      '@type': 'Organization',
      name: 'CYBERSTYLE Agency',
      url: 'https://cyberstyle.agency',
    },
    about: {
      '@type': 'Organization',
      name: cs.clientName,
    },
    spatialCoverage: cs.geoCountry || cs.geoCity ? {
      '@type': 'Place',
      name: cs.geoCity || cs.geoRegion || cs.geoCountry,
      address: {
        '@type': 'PostalAddress',
        addressLocality: cs.geoCity,
        addressCountry: cs.geoCountry,
      },
      geo: cs.geoLatitude && cs.geoLongitude ? {
        '@type': 'GeoCoordinates',
        latitude: cs.geoLatitude,
        longitude: cs.geoLongitude,
      } : undefined,
    } : undefined,
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* JSON-LD Script */}
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
          <ArrowLeft className="w-4 h-4" /> Back to Case Studies
        </Link>
      </div>

      <PageBanner
        badgeText="Case Study Specimen"
        title={cs.title}
        description={cs.summary}
      />

      {/* Overview Metadata Strip */}
      <section className="bg-[#08090C] py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-mono">
          <div>
            <span className="text-neutral-500 block mb-1">CLIENT</span>
            <span className="text-white font-semibold text-sm">{cs.clientName}</span>
          </div>
          <div>
            <span className="text-neutral-500 block mb-1">INDUSTRY</span>
            <span className="text-white font-semibold text-sm">{cs.clientIndustry || 'Enterprise'}</span>
          </div>
          <div>
            <span className="text-neutral-500 block mb-1">SERVICES</span>
            <span className="text-[#00F0FF] font-semibold text-sm">{cs.serviceCategory}</span>
          </div>
          <div>
            <span className="text-neutral-500 block mb-1">TARGET MARKET</span>
            <span className="text-emerald-400 font-semibold text-sm flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {cs.geoCity || cs.geoRegion || cs.geoCountry || 'Global'}
            </span>
          </div>
        </div>
      </section>

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      {/* Case Study Narrative */}
      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* 1. The Challenge */}
          {cs.challenge && (
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                01 // The Problem
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-black">
                The Bottleneck & Lost Revenue
              </h2>
              <p className="text-neutral-700 text-base sm:text-lg leading-relaxed font-sans whitespace-pre-line">
                {cs.challenge}
              </p>
            </div>
          )}

          {/* 2. The Solution */}
          {cs.solution && (
            <div className="space-y-4 pt-12 border-t border-black/10">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                02 // The Solution We Built
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-black">
                Simple, Fast & Built to Win More Clients
              </h2>
              <p className="text-neutral-700 text-base sm:text-lg leading-relaxed font-sans whitespace-pre-line">
                {cs.solution}
              </p>
            </div>
          )}

          {/* 3. The Results */}
          <div className="p-8 md:p-12 rounded-3xl bg-[#08090C] text-white space-y-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">
                03 // Real Business Results
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-2">
                Revenue Growth & Hours Saved
              </h2>
              {cs.results && (
                <p className="text-neutral-300 text-sm sm:text-base mt-4 font-sans leading-relaxed whitespace-pre-line">
                  {cs.results}
                </p>
              )}
            </div>

            {/* Standout Impact Metric Grid */}
            {metricsList.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10">
                {metricsList.map((m: any, idx: number) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="font-display font-bold text-3xl sm:text-4xl text-[#00F0FF]">
                      {m.value}
                    </div>
                    <div className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Testimonial Quote */}
            {cs.testimonialQuote && (
              <div className="p-6 rounded-2xl bg-[#00F0FF]/5 border border-[#00F0FF]/20 space-y-3">
                <Quote className="w-6 h-6 text-[#00F0FF]" />
                <p className="text-sm italic text-neutral-200 font-sans leading-relaxed">
                  "{cs.testimonialQuote}"
                </p>
                {(cs.testimonialAuthor || cs.testimonialRole) && (
                  <div className="text-xs font-mono text-[#00F0FF]">
                    — {cs.testimonialAuthor} {cs.testimonialRole && `(${cs.testimonialRole})`}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Deliverables & Live Links */}
          <div className="pt-12 border-t border-black/10 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              04 // What We Delivered
            </span>

            <div className="flex flex-wrap gap-2">
              {(cs.techStack || []).map((tech: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-neutral-100 text-neutral-800 border border-neutral-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            {cs.liveUrl && (
              <div className="pt-4">
                <a
                  href={cs.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white font-mono text-xs hover:bg-neutral-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-[#00F0FF]" />
                  Visit Live Client Platform
                </a>
              </div>
            )}
          </div>

          {/* CTA Box */}
          <div className="pt-12 border-t border-black/10 text-center space-y-6">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-black">
              Ready to get results like this for your business?
            </h3>
            <p className="text-neutral-600 text-sm max-w-md mx-auto">
              We design websites that sell, 24/7 AI assistants that book leads in 30 seconds, and custom portals that eliminate monthly software bills.
            </p>
            <div>
              <Link href="/start-project">
                <Button variant="electric" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
                  Get Your Free 15-Min Gameplan
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
