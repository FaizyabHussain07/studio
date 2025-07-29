import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'placehold.co',
        },
        {
            protocol: 'https',
            hostname: 'images.unsplash.com',
        },
        {
            protocol: 'https',
            hostname: 'i.ibb.co',
        }
      ],
  },
};

export default nextConfig;
