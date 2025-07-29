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
<<<<<<< HEAD
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
=======
        {
            protocol: 'https',
            hostname: 'placehold.co',
        },
        {
            protocol: 'https',
            hostname: 'images.unsplash.com',
        }
>>>>>>> 3925b1322764152e6fd0f06340ae22ab5b465b09
    ],
  },
};

export default nextConfig;
