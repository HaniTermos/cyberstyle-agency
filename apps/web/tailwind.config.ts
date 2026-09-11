import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#000000',
          charcoal: '#08090C',
          slate: '#101218',
          card: '#12151D',
          white: '#FFFFFF',
          snow: '#F8F9FB',
          borderDark: 'rgba(255, 255, 255, 0.10)',
          borderDarkStrong: 'rgba(255, 255, 255, 0.20)',
          borderLight: 'rgba(0, 0, 0, 0.08)',
          borderLightStrong: 'rgba(0, 0, 0, 0.16)',
          accent: '#00F0FF',
          accentHover: '#00D2E0',
          accentSubtle: 'rgba(0, 240, 255, 0.12)',
          mutedDark: '#8E95A5',
          mutedLight: '#5A6275',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Bank Gothic', 'Eurostile', 'sans-serif'],
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        widest: '0.15em',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
