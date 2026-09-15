import type { Metadata } from 'next';
import { Inter, Syne, JetBrains_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { WebVitals } from '@/components/WebVitals';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'CYBERSTYLE | High-Quality Websites, AI Workflows & Business Tools',
    template: '%s | CYBERSTYLE',
  },
  description:
    'CYBERSTYLE designs high-quality websites, AI-assisted enquiry workflows, e-commerce systems, and custom business tools that help visitors understand your offer and take the next step.',
  metadataBase: new URL('https://cyberstyle.net'),
  alternates: {
    canonical: 'https://cyberstyle.net',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
    },
  },
  openGraph: {
    title: 'CYBERSTYLE | Websites, AI Workflows & Custom Business Tools',
    description:
      'Help visitors understand your offer, respond to enquiries more consistently, and reduce repetitive work with practical digital systems.',
    url: 'https://cyberstyle.net',
    siteName: 'CYBERSTYLE',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const rootStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://cyberstyle.net/#organization',
      name: 'CYBERSTYLE LLC',
      legalName: 'CYBERSTYLE LLC',
      url: 'https://cyberstyle.net',
      logo: 'https://cyberstyle.net/images/logo.png',
      email: 'hello@cyberstyle.net',
      sameAs: [
        'https://github.com/HaniTermos/cyberstyle-agency',
        'https://twitter.com/cyberstyle_net',
        'https://linkedin.com/company/cyberstyle-agency',
      ],
      description:
        'CYBERSTYLE designs high-quality websites, AI-assisted enquiry workflows, e-commerce systems, and custom business tools around real business needs.',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://cyberstyle.net/#website',
      url: 'https://cyberstyle.net',
      name: 'CYBERSTYLE',
      publisher: {
        '@id': 'https://cyberstyle.net/#organization',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootStructuredData) }}
        />
      </head>
      <body className="min-h-screen bg-black text-white font-sans antialiased selection:bg-[#00F0FF] selection:text-black">
        <WebVitals />
        {children}
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
