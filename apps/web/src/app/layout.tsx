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
    default: 'CYBERSTYLE LLC | Premium Web Experiences, AI Systems & Custom SaaS',
    template: '%s | CYBERSTYLE LLC',
  },
  description:
    'Elevate business websites into premium, 3D-driven experiences that increase leads and revenue. High-converting web architecture, AI workflow automation, and custom SaaS platforms.',
  metadataBase: new URL('https://cyberstyle.net'),
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
  openGraph: {
    title: 'CYBERSTYLE LLC | Premium Web Experiences & AI Systems',
    description: 'Elevate business websites into premium, 3D-driven experiences that increase leads and revenue.',
    url: 'https://cyberstyle.net',
    siteName: 'CYBERSTYLE',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
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
      <body className="min-h-screen bg-black text-white font-sans antialiased selection:bg-[#00F0FF] selection:text-black">
        {children}
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
