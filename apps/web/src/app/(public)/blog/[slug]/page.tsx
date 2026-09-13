import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, User, ArrowUpRight, BookOpen, AlertCircle } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { SectionGradient } from '@/components/ui/SectionGradient';
import { CTA_LABELS } from '@/lib/constants/brand';

interface Props {
  params: Promise<{ slug: string }>;
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingLevel: string;
  readingTimeMinutes: number;
  publishedDate: string;
  authorName: string;
  plainLanguageSummary: string;
  whoItIsFor: string;
  contentSections: { title: string; paragraphs: string[] }[];
  tradeoffsAndCosts: string[];
}

const postsData: Record<string, BlogPost> = {
  'why-fast-websites-turn-visitors-into-paying-clients': {
    slug: 'why-fast-websites-turn-visitors-into-paying-clients',
    title: 'Why Website Performance & Mobile Usability Directly Affect Customer Enquiries',
    excerpt:
      'Most business websites lose prospective customers before pages even finish rendering. Here is how mobile asset optimization and clean layout directly impact enquiry completion rates.',
    category: 'Web Engineering',
    readingLevel: 'Practical Guide',
    readingTimeMinutes: 5,
    publishedDate: 'August 2026',
    authorName: 'CYBERSTYLE Engineering',
    plainLanguageSummary:
      'When prospective clients visit a website on their phone, slow page loading and cluttered navigation cause immediate frustration. Optimizing web assets, reducing blocking scripts, and presenting clear contact options help visitors find what they need and take action.',
    whoItIsFor:
      'Service business owners, consultants, and companies whose primary marketing channel is driving prospective clients to a digital contact form.',
    contentSections: [
      {
        title: 'Mobile Realities: High Friction on Small Screens',
        paragraphs: [
          'Over 65% of commercial website traffic now originates from smartphones. When potential clients browse on cellular connections while commuting or in between tasks, network conditions can vary widely.',
          'Traditional agency websites frequently rely on heavy stock video backgrounds, uncompressed image galleries, and dozens of tracking scripts. On slower 4G connections, these pages often take 4 to 6 seconds to become interactive. By that time, many visitors abandon the page and return to search results.',
        ],
      },
      {
        title: 'Engineering for Responsiveness: Modern Architecture',
        paragraphs: [
          'Modern frameworks such as Next.js and TypeScript allow us to server-render pages so that clean HTML arrives almost immediately on the client device. Assets are automatically converted to next-generation formats (like WebP and AVIF) and loaded only when they enter the viewport.',
          'Beyond speed metrics, visual clarity is paramount. Clear typography, ample touch targets, and straightforward consultation buttons remove ambiguity, allowing prospective buyers to quickly evaluate your capabilities and reach out.',
        ],
      },
    ],
    tradeoffsAndCosts: [
      'High-performance static and server-rendered sites require modern hosting platforms (e.g., Vercel, Hostinger VPS, AWS) rather than legacy $3 shared hosting cPanels.',
      'Custom web builds require upfront content planning and structured copy rather than drop-in drag-and-drop template builders.',
      'Ongoing domain renewal and server hosting are required to keep the website active online.',
    ],
  },
  'how-24-7-ai-assistants-stop-lost-leads': {
    slug: 'how-24-7-ai-assistants-stop-lost-leads',
    title: 'Designing Practical AI Enquiry Workflows With Defined Operational Guardrails',
    excerpt:
      'How to structure automated enquiry intake systems that answer common visitor questions, qualify criteria, and route sensitive requests directly to human team members.',
    category: 'Automation & AI',
    readingLevel: 'Strategy & Implementation',
    readingTimeMinutes: 6,
    publishedDate: 'July 2026',
    authorName: 'CYBERSTYLE AI Systems',
    plainLanguageSummary:
      'Automated enquiry triage allows businesses to capture customer requirements, answer routine questions about services, and schedule consultations without making visitors wait hours for an initial email reply.',
    whoItIsFor:
      'Agencies, clinics, and professional firms that handle steady volumes of incoming inquiries where rapid first-touch qualification prevents leads from looking elsewhere.',
    contentSections: [
      {
        title: 'The Triage Dilemma: Timely Qualification vs. Manual Burden',
        paragraphs: [
          'Small and mid-sized business teams cannot realistically maintain 24/7 inbox coverage without burning out staff or hiring costly round-the-clock call centers. Yet potential clients frequently submit inquiries outside of standard operating hours.',
          'An automated enquiry assistant acts as a 24/7 digital intake receptionist. When configured with strict documentation and prompt guardrails, it can answer common logistical questions (service scope, meeting process, standard turnaround) and collect key project details.',
        ],
      },
      {
        title: 'Prompt Architecture & Escalation Triggers',
        paragraphs: [
          'A reliable AI workflow is defined by what it refuses to answer as much as what it handles. We implement explicit boundaries: the model does not provide binding legal quotes, fabricate custom discounts, or attempt to advise on complex edge cases.',
          'When an inquiry requires nuanced human evaluation, the workflow captures the client’s contact details and immediately dispatches a structured alert to your team with the conversation summary.',
        ],
      },
    ],
    tradeoffsAndCosts: [
      'AI models consume tokens billed by third-party providers (e.g. OpenAI, Anthropic, Google). Businesses must maintain an active API billing account with their chosen provider.',
      'Automated systems require initial prompt testing and periodic reviews to ensure instructions reflect changes in your services or pricing.',
      'AI is not a substitute for professional legal or high-stakes advisory services; human escalation paths must always be maintained.',
    ],
  },
  'why-owning-your-custom-tools-saves-thousands': {
    slug: 'why-owning-your-custom-tools-saves-thousands',
    title: 'Custom Portals vs. Subscription Software: Evaluating Total Cost of Ownership',
    excerpt:
      'Comparing upfront build fees and self-hosted infrastructure against recurring per-seat SaaS licensing for client portals and operational dashboards.',
    category: 'Business Systems',
    readingLevel: 'Architecture & TCO Analysis',
    readingTimeMinutes: 7,
    publishedDate: 'June 2026',
    authorName: 'CYBERSTYLE Systems Architecture',
    plainLanguageSummary:
      'While commercial SaaS tools offer quick setups, their compounding per-user fees and rigid features often push growing businesses toward tailored web applications that they own outright.',
    whoItIsFor:
      'Companies spending significant recurring fees on fragmented software subscriptions or struggling with manual coordination between disconnected tools.',
    contentSections: [
      {
        title: 'The Compounding Cost of Per-Seat Licensing',
        paragraphs: [
          'Modern subscription software often looks inexpensive at $25 to $50 per user per month. However, as an organization scales to 20 team members and hundreds of client accounts, annual subscription expenses frequently exceed tens of thousands of dollars.',
          'Furthermore, third-party software vendors control your feature roadmap and can raise prices or change terms at will. If you discontinue your subscription, access to your specialized views and historical workflows is often lost.',
        ],
      },
      {
        title: 'The Custom Alternative: Upfront Build with Self-Hosted Control',
        paragraphs: [
          'Building a custom client portal or operational dashboard requires an upfront capital investment, but it delivers software tailored to your specific workflows. Features like role-based authentication, milestone reviews, and automated Stripe billing run on your own infrastructure.',
          'Once delivered, you own the application code. You can onboard additional clients or staff members without incurring additional per-user licensing fees from an agency.',
        ],
      },
    ],
    tradeoffsAndCosts: [
      'Custom software involves a higher upfront build fee compared to signing up for a monthly SaaS trial.',
      'You are responsible for paying underlying cloud server hosting, database storage, and domain costs directly to infrastructure providers.',
      'Software requires periodic maintenance, dependency updates, and security patch monitoring, either managed by your internal team or through an ongoing support plan.',
    ],
  },
};

// Aliases for backward compatibility
const aliasMap: Record<string, string> = {
  'engineering-sub-second-3d-web-experiences': 'why-fast-websites-turn-visitors-into-paying-clients',
  'ai-lead-qualification-architecture': 'how-24-7-ai-assistants-stop-lost-leads',
  'self-hosted-auth-vs-third-party-saas': 'why-owning-your-custom-tools-saves-thousands',
};

async function getPost(slug: string): Promise<BlogPost | null> {
  const targetSlug = aliasMap[slug] || slug;
  return postsData[targetSlug] || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Article Not Found // CYBERSTYLE Insights',
      description: 'The requested guide could not be found.',
    };
  }

  return {
    title: `${post.title} // CYBERSTYLE Insights`,
    description: post.excerpt,
    alternates: {
      canonical: `https://cyberstyle.net/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Organization',
      name: post.authorName,
      url: 'https://cyberstyle.net',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CYBERSTYLE',
      url: 'https://cyberstyle.net',
    },
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
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
        badgeText={post.category}
        title={post.title}
        description={post.excerpt}
      />

      {/* Meta Bar */}
      <section className="bg-[#08090C] py-6 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#00F0FF]" />
              {post.authorName}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {post.publishedDate}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10 text-[11px]">
              {post.readingLevel}
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            {post.readingTimeMinutes} Min Read
          </span>
        </div>
      </section>

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      {/* Article Content */}
      <article className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-3xl mx-auto space-y-12 text-neutral-800 font-sans">
          {/* Structured Section 1: Plain-Language Summary */}
          <div className="p-6 rounded-2xl bg-[#F4F6F9] border border-black/10 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block">
              Plain-Language Summary
            </span>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              {post.plainLanguageSummary}
            </p>
          </div>

          {/* Structured Section 2: Who It Is For */}
          <div className="p-6 rounded-2xl bg-[#F4F6F9] border border-black/10 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block">
              Who This Guide Is For
            </span>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              {post.whoItIsFor}
            </p>
          </div>

          {/* Structured Section 3: In-Depth Breakdown */}
          {post.contentSections.map((sec, idx) => (
            <div key={idx} className="space-y-4 pt-6 border-t border-black/10">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-black">
                {sec.title}
              </h2>
              {sec.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-base sm:text-lg text-neutral-700 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          ))}

          {/* Structured Section 4: Trade-Offs & Ongoing Costs */}
          <div className="p-6 rounded-2xl bg-[#FFFBF0] border border-amber-500/20 space-y-3 pt-6">
            <div className="flex items-center gap-2 text-amber-800 font-mono text-xs font-bold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Operational Trade-Offs &amp; Ongoing Costs</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-700">
              {post.tradeoffsAndCosts.map((cost, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{cost}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Call to action */}
          <div className="p-8 rounded-3xl bg-[#08090C] text-white my-12 space-y-6 text-center">
            <h3 className="font-display font-bold text-2xl text-white">
              Need assistance designing your digital systems?
            </h3>
            <p className="text-sm text-neutral-300 max-w-md mx-auto">
              Schedule an introductory call to review your current website, automation opportunities, or custom software requirements.
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
      </article>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />
    </div>
  );
}
