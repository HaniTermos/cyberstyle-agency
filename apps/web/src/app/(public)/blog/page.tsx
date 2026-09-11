import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Clock, MapPin, Tag } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Engineering Insights & Architectural Essays | CYBERSTYLE',
  description:
    'Technical essays on high-conversion web architecture, Three.js shaders, AI workflow automation, and custom SaaS engineering.',
  alternates: {
    canonical: 'https://cyberstyle.agency/blog',
  },
};

interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  readingTimeMinutes?: number;
  publishedDate?: string;
  authorName?: string;
  geoCity?: string;
}

const fallbackPosts: BlogPostSummary[] = [
  {
    id: 'post-1',
    slug: 'engineering-sub-second-3d-web-experiences',
    title: 'Engineering Sub-Second 3D Web Experiences with Next.js and Three.js',
    excerpt: 'How we achieve 90+ Lighthouse Core Web Vitals while running complex WebGL shader canvases on high-conversion agency websites.',
    category: 'Web Architecture',
    readingTimeMinutes: 4,
    publishedDate: 'Aug 2026',
    authorName: 'CYBERSTYLE Core',
    geoCity: 'San Francisco, CA',
  },
  {
    id: 'post-2',
    slug: 'ai-lead-qualification-architecture',
    title: 'Building 24/7 AI Lead Qualification Pipelines with Node.js and BullMQ',
    excerpt: 'A practical breakdown of how automated scoring and prompt routing turns cold website visitors into booked client calls in under 30 seconds.',
    category: 'AI & Automation',
    readingTimeMinutes: 5,
    publishedDate: 'Jul 2026',
    authorName: 'AI Systems Team',
    geoCity: 'Austin, TX',
  },
  {
    id: 'post-3',
    slug: 'self-hosted-auth-vs-third-party-saas',
    title: 'Why We Build Custom SaaS Platforms with Self-Hosted Argon2id Auth',
    excerpt: 'Eliminating expensive per-user pricing jumps, securing tenant boundaries, and ensuring 100% data sovereignty on Linux VPS deployments.',
    category: 'Product Engineering',
    readingTimeMinutes: 6,
    publishedDate: 'Jun 2026',
    authorName: 'SecOps Team',
    geoCity: 'Toronto, ON',
  },
];

async function getLivePosts(): Promise<BlogPostSummary[]> {
  try {
    const res = await fetch('http://localhost:4000/api/posts', {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const json = await res.json();
      const list = json?.data?.posts;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          category: p.category || 'Engineering',
          readingTimeMinutes: p.readingTimeMinutes || 5,
          publishedDate: p.publishedAt
            ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            : 'Recent',
          authorName: p.authorName || p.author?.name || 'CYBERSTYLE Core',
          geoCity: p.geoCity,
        }));
      }
    }
  } catch (err) {
    console.warn('[getLivePosts] Fetch notice:', err);
  }
  return fallbackPosts;
}

export default async function BlogIndexPage() {
  const posts = await getLivePosts();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageBanner
        badgeText="Technical Insights"
        title="Architecture, AI & Conversion Systems"
        description="Essays and technical teardowns from the CYBERSTYLE engineering team on high-performance web systems and AI workflows."
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
                  <div className="flex items-center gap-2">
                    <span>{post.publishedDate}</span>
                    {post.geoCity && (
                      <span className="flex items-center gap-1 text-zinc-400">
                        • <MapPin className="w-3 h-3 text-cyan-400" /> {post.geoCity}
                      </span>
                    )}
                  </div>
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
