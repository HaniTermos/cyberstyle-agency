import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@cyberstyle/ui', '@cyberstyle/config', '@cyberstyle/email', 'three'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  devIndicators: false,
  experimental: {
    // Optimizations for WebGL & Silk component rendering
  },
};

export default nextConfig;
