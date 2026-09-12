import type { Metadata } from 'next';
import { Inter, Syne, JetBrains_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
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
    default: 'CYBERSTYLE | High-Converting Websites, 24/7 AI Assistants & Custom Software',
    template: '%s | CYBERSTYLE',
  },
  description:
    'Stop losing customers to outdated websites and slow replies. We build premium websites that turn visitors into paying clients, 24/7 AI assistants that book appointments while you sleep, and custom business software you own 100%.',
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
    title: 'CYBERSTYLE | High-Converting Websites & 24/7 AI Sales Assistants',
    description: 'Stop losing customers to outdated websites and slow replies. Turn more visitors into paying clients and automate your business growth.',
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
      url: 'https://cyberstyle.net',
      logo: 'https://cyberstyle.net/images/logo.png',
      email: 'contact@cyberstyle.net',
      telephone: '+1-800-CYBERSTYLE',
      sameAs: [
        'https://github.com/HaniTermos/cyberstyle-agency',
        'https://twitter.com/cyberstyle_net',
        'https://linkedin.com/company/cyberstyle-agency',
      ],
      description:
        'CYBERSTYLE helps businesses make more money, capture more leads, and automate daily tasks with custom websites, AI sales assistants, and software platforms you own 100% forever.',
    },
    {
      '@type': ['ProfessionalService', 'LocalBusiness'],
      '@id': 'https://cyberstyle.net/#localbusiness',
      name: 'CYBERSTYLE LLC',
      url: 'https://cyberstyle.net',
      logo: 'https://cyberstyle.net/images/logo.png',
      image: 'https://cyberstyle.net/images/og-cyberstyle.jpg',
      telephone: '+1-800-CYBERSTYLE',
      email: 'contact@cyberstyle.net',
      priceRange: '$$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '100 Cyberstyle Blvd, Suite 500',
        addressLocality: 'San Francisco',
        addressRegion: 'CA',
        postalCode: '94105',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 37.7897,
        longitude: -122.3995,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      ],
      areaServed: ['US', 'EU', 'AE', 'Global'],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.95',
        reviewCount: '48',
        bestRating: '5',
        worstRating: '1',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://cyberstyle.net/#website',
      url: 'https://cyberstyle.net',
      name: 'CYBERSTYLE LLC',
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
        {children}
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
