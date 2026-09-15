'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export interface FaqItemProp {
  q: string;
  a: string;
  category?: string;
}

interface Props {
  page?: string;
  category?: string;
  fallbackFaqs?: FaqItemProp[];
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'light' | 'dark';
}

export function DynamicFaqAccordion({
  page = 'home',
  category,
  fallbackFaqs = [],
  title,
  subtitle,
  className = '',
  variant = 'light',
}: Props) {
  const [faqs, setFaqs] = useState<FaqItemProp[]>(fallbackFaqs);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const url = `/faqs?page=${encodeURIComponent(page)}${category ? `&category=${encodeURIComponent(category)}` : ''}`;

    apiRequest<{ faqs: Array<{ question: string; answer: string; category?: string }> }>(url)
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data?.faqs && res.data.faqs.length > 0) {
          setFaqs(
            res.data.faqs.map((f) => ({
              q: f.question,
              a: f.answer,
              category: f.category,
            }))
          );
        }
      })
      .catch(() => {
        // Retain fallback FAQs
      });

    return () => {
      isMounted = false;
    };
  }, [page, category]);

  const toggle = (idx: number) => {
    setActiveIdx(activeIdx === idx ? null : idx);
  };

  const isDark = variant === 'dark';

  return (
    <div className={`space-y-4 ${className}`}>
      {(title || subtitle) && (
        <div className="space-y-2 mb-6">
          {subtitle && (
            <span className="text-xs font-mono uppercase tracking-widest text-[#0080FF] block">
              {subtitle}
            </span>
          )}
          {title && (
            <h3 className={`font-display font-bold text-2xl sm:text-3xl ${isDark ? 'text-white' : 'text-black'}`}>
              {title}
            </h3>
          )}
        </div>
      )}

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = activeIdx === idx;
          const id = `faq-${page}-${idx}`;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isDark
                  ? 'bg-[#0E1118] border-white/10 hover:border-white/20'
                  : 'bg-[#F8F9FB] border-black/10 hover:border-black/20'
              }`}
            >
              <button
                type="button"
                id={`btn-${id}`}
                aria-expanded={isOpen}
                aria-controls={`panel-${id}`}
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between text-left p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF] rounded-2xl transition-colors cursor-pointer"
              >
                <div className="space-y-1 pr-4">
                  {faq.category && (
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                      {faq.category}
                    </span>
                  )}
                  <h4 className={`font-display font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-black'}`}>
                    {faq.q}
                  </h4>
                </div>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-[#0080FF]/15 text-[#0080FF]' : isDark ? 'bg-white/5 text-neutral-400' : 'bg-black/5 text-neutral-500'
                  }`}
                >
                  <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                </div>
              </button>

              {/* CSS Grid Smooth Height Transition */}
              <div
                id={`panel-${id}`}
                role="region"
                aria-labelledby={`btn-${id}`}
                className={`grid transition-all duration-200 ease-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`px-5 sm:px-6 pb-6 pt-1 text-sm leading-relaxed font-sans border-t ${
                      isDark ? 'text-neutral-300 border-white/5' : 'text-neutral-600 border-black/5'
                    }`}
                  >
                    {faq.a}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
