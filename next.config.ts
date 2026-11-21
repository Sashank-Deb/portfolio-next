import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Every source image is already a hand-tuned WebP; let Vercel serve resized copies per device.
    formats: ['image/webp'],
    qualities: [75, 85],
  },
};

export default nextConfig;
