'use client';

import { useReportWebVitals } from 'next/web-vitals';

/**
 * WebVitals client component
 * Measures and logs Core Web Vitals (LCP, INP, CLS, FCP, TTFB)
 * for accessibility and performance observability.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === 'development') {
      if (['LCP', 'INP', 'CLS', 'FCP', 'TTFB'].includes(metric.name)) {
        const rating = metric.rating || (metric.value < 2500 ? 'good' : 'needs-improvement');
        console.info(`[CWV Telemetry] ${metric.name}: ${Math.round(metric.value)} (${rating})`);
      }
    }
  });

  return null;
}
