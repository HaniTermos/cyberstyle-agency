'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Check, X, SlidersHorizontal, Lock } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cyberstyle_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else if (consent === 'granted') {
      setAnalyticsConsent(true);
    }
    return undefined;
  }, []);

  // Listen for custom event from footer "Cookie Settings" button
  useEffect(() => {
    const handleOpenSettings = () => {
      const currentConsent = localStorage.getItem('cyberstyle_cookie_consent');
      setAnalyticsConsent(currentConsent === 'granted');
      setShowPreferences(true);
      setIsVisible(true);
    };

    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => window.removeEventListener('open-cookie-settings', handleOpenSettings);
  }, []);

  const applyGtagConsent = (granted: boolean) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
        ad_storage: 'denied',
      });
    }
  };

  const handleAcceptAll = () => {
    localStorage.setItem('cyberstyle_cookie_consent', 'granted');
    setAnalyticsConsent(true);
    applyGtagConsent(true);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('cyberstyle_cookie_consent', 'denied');
    setAnalyticsConsent(false);
    applyGtagConsent(false);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleSaveCustom = () => {
    const consentValue = analyticsConsent ? 'granted' : 'denied';
    localStorage.setItem('cyberstyle_cookie_consent', consentValue);
    applyGtagConsent(analyticsConsent);
    setIsVisible(false);
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie and Privacy Consent Preferences"
      className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 font-sans text-neutral-300"
    >
      <div className="p-6 rounded-2xl bg-[#0D1017]/95 backdrop-blur-xl border border-white/15 shadow-2xl space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-display font-bold text-sm">
            <Shield className="w-4 h-4 text-[#00F0FF]" /> Privacy & Cookie Preferences
          </div>
          {showPreferences && (
            <button
              onClick={() => setShowPreferences(false)}
              className="text-neutral-400 hover:text-white p-1 rounded-lg"
              aria-label="Close preferences view"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {!showPreferences ? (
          <>
            <p className="leading-relaxed text-neutral-400">
              We use strictly necessary cookies for security and session integrity, and optional analytical cookies to measure aggregated site performance. Read our{' '}
              <Link href="/privacy" className="text-[#00F0FF] underline hover:text-white">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/cookies" className="text-[#00F0FF] underline hover:text-white">
                Cookie Policy
              </Link>.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-2 px-4 rounded-xl bg-[#00F0FF] text-black font-bold font-mono text-xs hover:bg-[#33F3FF] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              >
                <Check className="w-3.5 h-3.5" /> Accept All
              </button>
              <button
                onClick={handleEssentialOnly}
                className="flex-1 py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-neutral-300 font-mono text-xs hover:text-white hover:bg-white/10 transition-all cursor-pointer text-center"
              >
                Essential Only
              </button>
              <button
                onClick={() => setShowPreferences(true)}
                className="w-full py-2 px-4 rounded-xl bg-transparent border border-white/10 text-neutral-400 font-mono text-[11px] hover:text-[#00F0FF] hover:border-[#00F0FF]/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal className="w-3 h-3" /> Manage Preferences
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4 pt-1">
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {/* Essential Cookies (Locked) */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-semibold text-white text-xs flex items-center gap-1.5">
                    Strictly Necessary Cookies
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Always Active</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    Required for core site security, rate-limiting, session handling, and form protection. Cannot be disabled.
                  </p>
                </div>
                <Lock className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              </div>

              {/* Analytics Cookies (Toggleable) */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-semibold text-white text-xs">
                    Performance & Analytics Cookies
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    Help us measure aggregate visitor journeys and technical load times to improve user experience.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={analyticsConsent}
                    onChange={(e) => setAnalyticsConsent(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00F0FF]"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2 border-t border-white/10">
              <button
                onClick={handleSaveCustom}
                className="flex-1 py-2 px-4 rounded-xl bg-[#00F0FF] text-black font-bold font-mono text-xs hover:bg-[#33F3FF] transition-all text-center cursor-pointer"
              >
                Save Preferences
              </button>
              <button
                onClick={handleEssentialOnly}
                className="py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-neutral-400 font-mono text-xs hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                Reject Optional
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
