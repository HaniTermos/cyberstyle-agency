import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cyberstyle.net';

  const staticRoutes = [
    '',
    '/services',
    '/services/premium-web',
    '/services/ai-automation',
    '/services/custom-saas',
    '/work',
    '/pricing',
    '/about',
    '/faq',
    '/reviews',
    '/blog',
    '/contact',
    '/start-project',
    '/privacy',
    '/terms',
    '/cookies',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route.startsWith('/services') || route === '/start-project' ? 0.9 : 0.7,
  }));

  return staticRoutes;
}
