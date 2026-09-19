'use client';

import React, { useState, useEffect } from 'react';

export function PublicLoader() {
  const [loading, setLoading] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Only show on the very first visit in a session to avoid blocking internal navigations
    try {
      if (sessionStorage.getItem('cyberstyle_brand_seen')) {
        return;
      }
    } catch {}

    // First visit in session: show brief branded entry animation
    setLoading(true);

    let removeTimer: NodeJS.Timeout | null = null;
    const fadeTimer = setTimeout(() => {
      setFading(true);
      removeTimer = setTimeout(() => {
        setLoading(false);
        try {
          sessionStorage.setItem('cyberstyle_brand_seen', 'true');
        } catch {}
      }, 350);
    }, 200);

    return () => {
      clearTimeout(fadeTimer);
      if (removeTimer) clearTimeout(removeTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-350 select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      {/* Lightweight Ambient Brand Glow (Pure CSS - zero WebGL GPU overhead) */}
      <div className="absolute inset-0 bg-radial-at-c from-[#00F0FF]/15 via-[#05070A]/85 to-[#000000] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Animated Electric Progress Ring */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#00F0FF] border-r-transparent border-b-transparent border-l-transparent animate-spin shadow-[0_0_15px_rgba(0,240,255,0.4)]" />
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
        </div>

        {/* Wordmark */}
        <div className="text-center space-y-1">
          <span className="font-display font-extrabold text-xl tracking-widest text-white uppercase block">
            CYBERSTYLE
          </span>
          <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
            Engineering Systems
          </span>
        </div>
      </div>
    </div>
  );
}
