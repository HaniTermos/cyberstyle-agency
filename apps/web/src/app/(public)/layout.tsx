import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { PublicLoader } from '@/components/ui/PublicLoader';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicLoader />
      <Header />
      <main>{children}</main>
      <Footer />
      <CookieConsent />
    </>
  );
}
