import React from 'react';
import Silk from '../backgrounds/Silk';

export interface PageBannerProps {
  badgeText?: string;
  title: string;
  description: string;
}

export function PageBanner({
  title,
  description,
}: PageBannerProps) {
  return (
    <section className="relative pt-36 pb-20 overflow-hidden bg-black border-b border-white/10">
      {/* Silk Top Banner Shader */}
      <Silk className="opacity-50" speed={0.5} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-3xl space-y-6">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
            {title}
          </h1>
          <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed font-normal">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
