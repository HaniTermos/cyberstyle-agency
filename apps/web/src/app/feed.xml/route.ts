import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://cyberstyle.net';

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>CYBERSTYLE LLC — Engineering Insights</title>
  <link>${baseUrl}</link>
  <description>Technical essays on high-conversion web architecture, Three.js shaders, and AI automation.</description>
  <language>en-us</language>
  <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
  <item>
    <title>Engineering Sub-Second 3D Web Experiences with Next.js and Three.js</title>
    <link>${baseUrl}/blog/engineering-sub-second-3d-web-experiences</link>
    <guid>${baseUrl}/blog/engineering-sub-second-3d-web-experiences</guid>
    <pubDate>${new Date('2026-08-15').toUTCString()}</pubDate>
    <description>How we achieve 90+ Lighthouse Core Web Vitals while running complex WebGL shader canvases on agency websites.</description>
  </item>
  <item>
    <title>Building 24/7 AI Lead Qualification Pipelines with Node.js and BullMQ</title>
    <link>${baseUrl}/blog/ai-lead-qualification-architecture</link>
    <guid>${baseUrl}/blog/ai-lead-qualification-architecture</guid>
    <pubDate>${new Date('2026-07-20').toUTCString()}</pubDate>
    <description>A practical breakdown of how automated scoring and prompt routing turns website visitors into booked client calls.</description>
  </item>
</channel>
</rss>`.trim();

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
