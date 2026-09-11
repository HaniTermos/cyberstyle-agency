'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Check } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cyberstyle_cookie_consent');
    if (!consent) {
      // Delay showing banner slightly for optimal UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cyberstyle_cookie_consent', 'granted');
    setIsVisible(false);

    // Update Google Consent Mode
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cyberstyle_cookie_consent', 'denied');
    setIsVisible(false);

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="p-6 rounded-2xl bg-[#0D1017]/95 backdrop-blur-xl border border-white/15 shadow-2xl space-y-4 text-xs font-sans text-neutral-300">
        <div className="flex items-center gap-2 text-white font-display font-bold text-sm">
          <Shield className="w-4 h-4 text-[#00F0FF]" /> Privacy & Analytics Consent
        </div>
        <p className="leading-relaxed text-neutral-400">
          We use strictly necessary cookies for session security, and optional analytical cookies to measure platform performance. Read our{' '}
          <Link href="/privacy" className="text-[#00F0FF] underline hover:text-white">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/cookies" className="text-[#00F0FF] underline hover:text-white">
            Cookie Policy
          </Link>.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleAccept}
            className="flex-1 py-2 px-4 rounded-xl bg-[#00F0FF] text-black font-bold font-mono text-xs hover:bg-[#33F3FF] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
          >
            <Check className="w-3.5 h-3.5" /> Accept All
          </button>
          <button
            onClick={handleDecline}
            className="py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-neutral-400 font-mono text-xs hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
}
