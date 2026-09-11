/**
 * CYBERSTYLE LLC - Core Design System Tokens
 * Extracted from reference visual direction
 */

export const colors = {
  black: '#000000',
  charcoal: '#0A0A0A',
  slateDark: '#12141A',
  surfaceBorderDark: 'rgba(255, 255, 255, 0.12)',
  white: '#FFFFFF',
  snow: '#F9FAFB',
  surfaceBorderLight: 'rgba(0, 0, 0, 0.08)',
  accent: '#00F0FF', // Electric Blue
  accentHover: '#00D1E0',
  accentSubtle: 'rgba(0, 240, 255, 0.12)',
  textMutedDark: '#8E95A5',
  textMutedLight: '#6B7280',
} as const;

export const typography = {
  display: 'var(--font-display), "Bank Gothic", "Eurostile", "Helvetica Neue", sans-serif',
  body: 'var(--font-sans), "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
} as const;

export const brand = {
  name: 'CYBERSTYLE LLC',
  domain: 'https://cyberstyle.net',
  tagline: 'Elevate business websites into premium, 3D-driven experiences that increase leads and revenue.',
  startingPrices: {
    web: 800,
    ai: 1200,
    saas: 3000,
  },
} as const;
