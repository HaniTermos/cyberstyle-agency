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
    'why-fast-websites-turn-visitors-into-paying-clients': {
      title: 'Why Fast Websites Turn 3x More Visitors Into Paying Clients',
      slug: 'why-fast-websites-turn-visitors-into-paying-clients',
      excerpt: 'Most business websites lose over half their mobile visitors before the page even loads. Here is how instant phone speed directly drives more calls and sales.',
      content: `If your website takes more than 2 or 3 seconds to open on a phone, you are losing money every single day. Most business owners spend thousands on advertising, social media, or business cards—only for prospective clients to click the link, wait 4 seconds, get frustrated, and tap the back button to call a competitor instead.\n\n## 1. People Have Zero Patience on Mobile Phones\nOver 70% of your prospective customers are looking at your website on a mobile phone, often on cellular data while walking or in between meetings. If your website does not pop open instantly, they will not wait around. Google's own research proves that every single second of loading delay cuts customer inquiries by 20%.\n\n## 2. Instant Speed Creates Instant Trust\nWhen a customer clicks your website and it opens in under 1 second, it instantly signals professionalism, authority, and reliability. They subconsciously trust you before they have even finished reading your headline. A fast website makes your business look like the industry leader.\n\n## 3. How We Guarantee Under 1-Second Loading\nAt CYBERSTYLE, we don't use heavy, bloated templates or slow WordPress plugins that drag your website down. Every website we build is custom-crafted to load instantly on any device, anywhere in the world. You get gorgeous visuals, stunning design, and lightning-fast speed that turns curious visitors into paying clients.`,
      category: 'Website Growth',
      authorName: 'Growth Strategy Team',
      readingTimeMinutes: 4,
      publishedAt: '2026-08-19T00:00:00.000Z',
      tags: ['Website Speed', 'Mobile Sales', 'Customer Conversion', 'Business Growth'],
      geoCity: 'San Francisco, CA',
      geoCountry: 'US',
    },
    'how-24-7-ai-assistants-stop-lost-leads': {
      title: 'How a 24/7 AI Receptionist Stops Leads From Going to Competitors',
      slug: 'how-24-7-ai-assistants-stop-lost-leads',
      excerpt: 'When an interested customer contacts your business, every minute of delay cuts your closing rate in half. Here is how replying in 30 seconds doubles your bookings.',
      content: `In business, speed to lead is everything. When an interested customer fills out a form or messages your business, they are actively looking to buy right now. If you take 4 hours—or until tomorrow morning—to reply, they have already messaged three of your competitors and hired the first one who answered.\n\n## 1. The 30-Second Rule That Wins Deals\nStudies show that replying to a new customer inquiry within 5 minutes makes you 21 times more likely to win the deal compared to waiting just 30 minutes. Customers love fast, respectful service, and they buy from whoever gives them clear answers first.\n\n## 2. Never Miss an Inquiry at Night or on Weekends\nMost high-ticket buyers browse at night after work or over the weekend. While you and your staff are sleeping, our 24/7 AI Lead Assistant greets every visitor warmly, answers their questions accurately, qualifies their budget, and schedules an appointment directly onto your calendar.\n\n## 3. Easy Setup With Zero Technical Headache\nOur team trains your AI assistant on your exact business, services, pricing guidelines, and booking links. You don't have to learn any complex software—you just wake up to qualified appointments already booked on your calendar.`,
      category: '24/7 AI Automation',
      authorName: 'AI Systems Team',
      readingTimeMinutes: 5,
      publishedAt: '2026-07-15T00:00:00.000Z',
      tags: ['AI Assistant', 'Lead Generation', 'Automated Booking', 'Sales Growth'],
      geoCity: 'Austin, TX',
      geoCountry: 'US',
    },
    'why-owning-your-custom-tools-saves-thousands': {
      title: 'Stop Paying Software Rent: Why Owning Your Custom Tools Saves Thousands',
      slug: 'why-owning-your-custom-tools-saves-thousands',
      excerpt: 'Tired of monthly per-user software fees eating away your profits? Here is why smart businesses build once and own 100% of their private client tools forever.',
      content: `Almost every growing business falls into the same trap: you start paying $30/month for one tool, $50/month for another, and soon you are paying thousands of dollars every year in recurring software subscriptions that you will never own.\n\n## 1. The Hidden Cost of Software Subscriptions\nSubscription platforms charge you per user, per month. As your team grows and you add more clients, your software bills balloon. If you ever stop paying, you lose access to your client history, your workflows, and your data.\n\n## 2. Build Once, Own It 100% Forever\nWhen CYBERSTYLE builds your custom client portal or internal dashboard, you own 100% of the files, code, and database forever. There are zero per-user monthly license fees. You can add 10 clients or 1,000 clients without paying a penny more.\n\n## 3. Tailored Specifically to How You Work\nInstead of forcing your business into rigid off-the-shelf software, your custom portal does exactly what you need: clients log in securely, check project milestones, upload documents, and pay invoices via credit card in seconds.`,
      category: 'Business Efficiency',
      authorName: 'Client Systems Team',
      readingTimeMinutes: 6,
      publishedAt: '2026-06-20T00:00:00.000Z',
      tags: ['Zero Software Rent', 'Client Portal', '100% Ownership', 'Cost Savings'],
      geoCity: 'Toronto, ON',
      geoCountry: 'CA',
    },
    // Backwards compatibility aliases
    'engineering-sub-second-3d-web-experiences': {
      title: 'Why Fast Websites Turn 3x More Visitors Into Paying Clients',
      slug: 'why-fast-websites-turn-visitors-into-paying-clients',
      excerpt: 'Most business websites lose over half their mobile visitors before the page even loads. Here is how instant phone speed directly drives more calls and sales.',
      content: `If your website takes more than 2 or 3 seconds to open on a phone, you are losing money every single day. Most business owners spend thousands on advertising, social media, or business cards—only for prospective clients to click the link, wait 4 seconds, get frustrated, and tap the back button to call a competitor instead.\n\n## 1. People Have Zero Patience on Mobile Phones\nOver 70% of your prospective customers are looking at your website on a mobile phone, often on cellular data while walking or in between meetings. If your website does not pop open instantly, they will not wait around. Google's own research proves that every single second of loading delay cuts customer inquiries by 20%.\n\n## 2. Instant Speed Creates Instant Trust\nWhen a customer clicks your website and it opens in under 1 second, it instantly signals professionalism, authority, and reliability. They subconsciously trust you before they have even finished reading your headline. A fast website makes your business look like the industry leader.\n\n## 3. How We Guarantee Under 1-Second Loading\nAt CYBERSTYLE, we don't use heavy, bloated templates or slow WordPress plugins that drag your website down. Every website we build is custom-crafted to load instantly on any device, anywhere in the world. You get gorgeous visuals, stunning design, and lightning-fast speed that turns curious visitors into paying clients.`,
      category: 'Website Growth',
      authorName: 'Growth Strategy Team',
      readingTimeMinutes: 4,
      publishedAt: '2026-08-19T00:00:00.000Z',
      tags: ['Website Speed', 'Mobile Sales', 'Customer Conversion', 'Business Growth'],
      geoCity: 'San Francisco, CA',
      geoCountry: 'US',
    },
    'ai-lead-qualification-architecture': {
      title: 'How a 24/7 AI Receptionist Stops Leads From Going to Competitors',
      slug: 'how-24-7-ai-assistants-stop-lost-leads',
      excerpt: 'When an interested customer contacts your business, every minute of delay cuts your closing rate in half. Here is how replying in 30 seconds doubles your bookings.',
      content: `In business, speed to lead is everything. When an interested customer fills out a form or messages your business, they are actively looking to buy right now. If you take 4 hours—or until tomorrow morning—to reply, they have already messaged three of your competitors and hired the first one who answered.\n\n## 1. The 30-Second Rule That Wins Deals\nStudies show that replying to a new customer inquiry within 5 minutes makes you 21 times more likely to win the deal compared to waiting just 30 minutes. Customers love fast, respectful service, and they buy from whoever gives them clear answers first.\n\n## 2. Never Miss an Inquiry at Night or on Weekends\nMost high-ticket buyers browse at night after work or over the weekend. While you and your staff are sleeping, our 24/7 AI Lead Assistant greets every visitor warmly, answers their questions accurately, qualifies their budget, and schedules an appointment directly onto your calendar.\n\n## 3. Easy Setup With Zero Technical Headache\nOur team trains your AI assistant on your exact business, services, pricing guidelines, and booking links. You don't have to learn any complex software—you just wake up to qualified appointments already booked on your calendar.`,
      category: '24/7 AI Automation',
      authorName: 'AI Systems Team',
      readingTimeMinutes: 5,
      publishedAt: '2026-07-15T00:00:00.000Z',
      tags: ['AI Assistant', 'Lead Generation', 'Automated Booking', 'Sales Growth'],
      geoCity: 'Austin, TX',
      geoCountry: 'US',
    },
    'self-hosted-auth-vs-third-party-saas': {
      title: 'Stop Paying Software Rent: Why Owning Your Custom Tools Saves Thousands',
      slug: 'why-owning-your-custom-tools-saves-thousands',
      excerpt: 'Tired of monthly per-user software fees eating away your profits? Here is why smart businesses build once and own 100% of their private client tools forever.',
      content: `Almost every growing business falls into the same trap: you start paying $30/month for one tool, $50/month for another, and soon you are paying thousands of dollars every year in recurring software subscriptions that you will never own.\n\n## 1. The Hidden Cost of Software Subscriptions\nSubscription platforms charge you per user, per month. As your team grows and you add more clients, your software bills balloon. If you ever stop paying, you lose access to your client history, your workflows, and your data.\n\n## 2. Build Once, Own It 100% Forever\nWhen CYBERSTYLE builds your custom client portal or internal dashboard, you own 100% of the files, code, and database forever. There are zero per-user monthly license fees. You can add 10 clients or 1,000 clients without paying a penny more.\n\n## 3. Tailored Specifically to How You Work\nInstead of forcing your business into rigid off-the-shelf software, your custom portal does exactly what you need: clients log in securely, check project milestones, upload documents, and pay invoices via credit card in seconds.`,
      category: 'Business Efficiency',
      authorName: 'Client Systems Team',
      readingTimeMinutes: 6,
      publishedAt: '2026-06-20T00:00:00.000Z',
      tags: ['Zero Software Rent', 'Client Portal', '100% Ownership', 'Cost Savings'],
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
              Ready to get more customers and automate your business?
            </h3>
            <p className="text-sm text-neutral-300 max-w-md mx-auto">
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
      </article>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />
    </div>
  );
}
