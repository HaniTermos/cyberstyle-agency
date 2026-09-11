import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, User, ArrowUpRight, MapPin, Tag } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SectionGradient } from '@/components/ui/SectionGradient';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  try {
    const res = await fetch(`http://localhost:4000/api/posts/${slug}`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const json = await res.json();
      return json?.data?.post || null;
    }
  } catch (err) {
    console.warn(`[getPost] Fetch notice for ${slug}:`, err);
  }

  const fallbacks: Record<string, any> = {
    'engineering-sub-second-3d-web-experiences': {
      title: 'Engineering Sub-Second 3D Web Experiences with Next.js and Three.js',
      slug: 'engineering-sub-second-3d-web-experiences',
      excerpt: 'How we achieve 90+ Lighthouse Core Web Vitals while running complex WebGL shader canvases on high-conversion agency websites.',
      content: `Traditional agency websites often force a false trade-off: either build a flat, static layout to satisfy Google Lighthouse, or load heavy 3D assets that cause mobile devices to stutter and bounce high-intent buyers.\n\n## 1. The Problem with Unconstrained WebGL\nWhen a standard Three.js canvas initializes without device-pixel-ratio (DPR) limits or dynamic geometry subdivision, high-resolution retina screens can easily attempt to render 4K buffers at 60 FPS. This exhausts mobile GPU memory and delays the Largest Contentful Paint (LCP).\n\n## 2. Our Architecture: The Three-Tier Rendering Strategy\nAt CYBERSTYLE, we employ a three-tier rendering pipeline:\n- Instant CSS Fallback: Server-rendered gradient geometry displays in 0ms without waiting for WebGL shaders to compile.\n- Device-Aware DPR Clamping: We limit canvas DPR strictly to [1.0, 1.5], preserving 95% visual sharpness while reducing pixel fill rate by over 60%.\n- Reduced-Motion Gate: For users with vestibular sensitivity or battery saver mode active, the Three.js loop automatically pauses without layout shifts.\n\n## 3. Measurable Performance Results\nBy treating 3D elements as non-blocking ambient layers, you achieve unforgettable visual prestige while maintaining 90+ Core Web Vitals across every global jurisdiction.`,
      category: 'Web Architecture',
      authorName: 'CYBERSTYLE Core',
      readingTimeMinutes: 4,
      publishedAt: '2026-08-19T00:00:00.000Z',
      tags: ['Next.js 15', 'Three.js', 'Core Web Vitals', 'Performance'],
      geoCity: 'San Francisco, CA',
      geoCountry: 'US',
    },
    'ai-lead-qualification-architecture': {
      title: 'Building 24/7 AI Lead Qualification Pipelines with Node.js and BullMQ',
      slug: 'ai-lead-qualification-architecture',
      excerpt: 'A practical breakdown of how automated scoring and prompt routing turns cold website visitors into booked client calls in under 30 seconds.',
      content: `Speed to lead is the single highest predictor of conversion in B2B service sales. If a prospect waits longer than 5 minutes for a response, lead qualification drops by over 80%.\n\n## 1. Event-Driven Architecture with BullMQ\nWhen a prospect submits an inquiry via the public CYBERSTYLE website, an asynchronous BullMQ worker intercepts the payload immediately.\n\n## 2. Multi-Model AI Qualification & Scoring\nThe ingestion worker runs structured LLM inference to parse budget, timeline, technical scope, and domain authority. Leads scoring above 70 receive instant personalized calendar invites with dynamic pricing previews.\n\n## 3. Resilience and Failover\nIf the AI provider encounters latency spikes, Redis retry queues safeguard every lead with exponential backoff and instant fallback notification channels.`,
      category: 'AI & Automation',
      authorName: 'AI Systems Team',
      readingTimeMinutes: 5,
      publishedAt: '2026-07-15T00:00:00.000Z',
      tags: ['AI Pipelines', 'Node.js', 'BullMQ', 'Lead Gen'],
      geoCity: 'Austin, TX',
      geoCountry: 'US',
    },
    'self-hosted-auth-vs-third-party-saas': {
      title: 'Why We Build Custom SaaS Platforms with Self-Hosted Argon2id Auth',
      slug: 'self-hosted-auth-vs-third-party-saas',
      excerpt: 'Eliminating expensive per-user pricing jumps, securing tenant boundaries, and ensuring 100% data sovereignty on Linux VPS deployments.',
      content: `Many modern startups blindly integrate third-party authentication services, only to face staggering monthly API costs as their active user base scales.\n\n## 1. Total Data Sovereignty\nBy implementing RFC 9106 Argon2id password hashing paired with cryptographic refresh token rotation in PostgreSQL, your business retains full ownership of user identity assets without vendor lock-in.\n\n## 2. Hardened Tenant Isolation\nUsing PostgreSQL Row-Level Security (RLS) combined with cryptographically signed session tokens, multi-tenant data leaks are mathematically prevented at the database kernel level.\n\n## 3. Cost Predictability\nSelf-hosted authentication runs on your existing VPS infrastructure with zero marginal cost per active user, protecting agency margins as client applications scale.`,
      category: 'Product Engineering',
      authorName: 'SecOps Team',
      readingTimeMinutes: 6,
      publishedAt: '2026-06-20T00:00:00.000Z',
      tags: ['Security', 'Argon2id', 'Authentication', 'PostgreSQL'],
      geoCity: 'Toronto, ON',
      geoCountry: 'CA',
    },
  };

  return fallbacks[slug] || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    const formatted = slug.replace(/-/g, ' ').toUpperCase();
    return {
      title: `${formatted} | CYBERSTYLE Insights`,
      description: `Engineering essay on ${slug}.`,
    };
  }

  const title = post.seoTitle || `${post.title} | CYBERSTYLE Insights`;
  const description = post.seoDescription || post.excerpt;
  const canonical = post.canonicalUrl || `https://cyberstyle.agency/blog/${post.slug}`;

  return {
    title,
    description,
    keywords: post.keywords || post.tags || ['Engineering', 'Architecture', 'CYBERSTYLE'],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'CYBERSTYLE Agency',
      type: 'article',
      images: post.ogImage ? [{ url: post.ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Organization',
      name: post.authorName || 'CYBERSTYLE Core',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CYBERSTYLE Agency',
      url: 'https://cyberstyle.agency',
    },
    datePublished: post.publishedAt,
    keywords: (post.keywords || post.tags || []).join(', '),
  };

  // Simple Markdown renderer
  const paragraphs = (post.content || '').split('\n\n');

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-28 pb-4 px-6 max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-[#00F0FF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Insights
        </Link>
      </div>

      <PageBanner
        badgeText={post.category || 'Technical Essay'}
        title={post.title}
        description={post.excerpt}
      />

      {/* Meta Bar */}
      <section className="bg-[#08090C] py-6 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#00F0FF]" />
              {post.authorName || post.author?.name || 'CYBERSTYLE Core'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            {post.geoCity && (
              <span className="flex items-center gap-1.5 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {post.geoCity}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            {post.readingTimeMinutes || 5} Min Read
          </span>
        </div>
      </section>

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      {/* Article Content */}
      <article className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-3xl mx-auto space-y-8 text-neutral-800 text-base sm:text-lg leading-relaxed font-sans">
          {paragraphs.map((para: string, idx: number) => {
            const trimmed = para.trim();
            if (trimmed.startsWith('## ')) {
              return (
                <h2
                  key={idx}
                  className="font-display font-bold text-2xl sm:text-3xl text-black pt-8 border-t border-black/10"
                >
                  {trimmed.replace('## ', '')}
                </h2>
              );
            }
            if (trimmed.startsWith('# ')) {
              return (
                <h1
                  key={idx}
                  className="font-display font-bold text-3xl sm:text-4xl text-black pt-8"
                >
                  {trimmed.replace('# ', '')}
                </h1>
              );
            }
            if (trimmed.startsWith('- ')) {
              const items = trimmed.split('\n');
              return (
                <ul key={idx} className="list-disc pl-6 space-y-2 text-neutral-700">
                  {items.map((it, i) => (
                    <li key={i}>{it.replace(/^- /, '')}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={idx} className="leading-relaxed whitespace-pre-line">
                {trimmed}
              </p>
            );
          })}

          {/* Tags */}
          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="pt-12 border-t border-black/10 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
                Related Topics
              </span>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-neutral-100 text-neutral-800 border border-neutral-200"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Call to action */}
          <div className="p-8 rounded-3xl bg-[#08090C] text-white my-12 space-y-6 text-center">
            <h3 className="font-display font-bold text-2xl text-white">
              Want us to build your next web platform?
            </h3>
            <p className="text-sm text-neutral-300 max-w-md mx-auto">
              Our engineering team crafts bespoke Next.js 15 platforms, automated AI pipelines, and custom SaaS architectures.
            </p>
            <div>
              <Link href="/start-project">
                <Button variant="electric" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
                  Start a Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />
    </div>
  );
}
