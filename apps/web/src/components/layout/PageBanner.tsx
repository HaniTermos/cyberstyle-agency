'use client';

import React from 'react';
import Silk from '../backgrounds/Silk';

export interface PageBannerProps {
  badgeText?: string;
  title: string;
  description: string;
}

export function PageBanner({
  badgeText,
  title,
  description,
}: PageBannerProps) {
  return (
    <section className="relative pt-28 sm:pt-36 pb-12 sm:pb-20 overflow-hidden bg-black border-b border-white/10">
      {/* Silk Top Banner Shader */}
      <Silk className="opacity-50" speed={0.5} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl space-y-4 sm:space-y-6">
          {badgeText && (
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#00F0FF] block">
              {badgeText}
            </span>
          )}
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] sm:leading-[1.1] break-words">
            {title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed font-normal">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
