import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Clock, BookOpen, Layers } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Insights & Technical Guides // CYBERSTYLE',
  description:
    'Practical, plain-English guides on modern web engineering, enquiry automation workflows, and custom business systems.',
  alternates: {
    canonical: 'https://cyberstyle.net/blog',
  },
};

interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingLevel: string;
  readingTimeMinutes: number;
  publishedDate: string;
}

const posts: BlogPostSummary[] = [
  {
    id: 'post-1',
    slug: 'why-fast-websites-turn-visitors-into-paying-clients',
    title: 'Why Website Performance & Mobile Usability Directly Affect Customer Enquiries',
    excerpt:
      'Most business websites lose prospective customers before pages even finish rendering. Here is how mobile asset optimization and clean layout directly impact enquiry completion rates.',
    category: 'Web Engineering',
    readingLevel: 'Practical Guide',
    readingTimeMinutes: 5,
    publishedDate: 'Aug 2026',
  },
  {
    id: 'post-2',
    slug: 'how-24-7-ai-assistants-stop-lost-leads',
    title: 'Designing Practical AI Enquiry Workflows With Defined Operational Guardrails',
    excerpt:
      'How to structure automated enquiry intake systems that answer common visitor questions, qualify criteria, and route sensitive requests directly to human team members.',
    category: 'Automation & AI',
    readingLevel: 'Strategy & Implementation',
    readingTimeMinutes: 6,
    publishedDate: 'Jul 2026',
  },
  {
    id: 'post-3',
    slug: 'why-owning-your-custom-tools-saves-thousands',
    title: 'Custom Portals vs. Subscription Software: Evaluating Total Cost of Ownership',
    excerpt:
      'Comparing upfront build fees and self-hosted infrastructure against recurring per-seat SaaS licensing for client portals and operational dashboards.',
    category: 'Business Systems',
    readingLevel: 'Architecture & TCO Analysis',
    readingTimeMinutes: 7,
    publishedDate: 'Jun 2026',
  },
];

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageBanner
        badgeText="CYBERSTYLE Insights"
        title="Practical Guides on Web Engineering &amp; Systems."
        description="Clear, non-technical analyses and architectural breakdowns exploring how modern web standards, automation pipelines, and custom software solve everyday business friction."
      />

      <section className="py-24 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block focus:outline-none">
              <Card
                variant="dark"
                hoverEffect
                className="h-full flex flex-col justify-between p-8 bg-[#0E1118] border border-white/10 group-hover:border-[#00F0FF]/50 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                    <span className="text-[#00F0FF] uppercase tracking-wider font-semibold">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {post.readingTimeMinutes} min read
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-white group-hover:text-[#00F0FF] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-sm text-neutral-400 leading-relaxed font-sans line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span className="px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10 text-[11px]">
                    {post.readingLevel}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-[#00F0FF] group-hover:text-black transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
