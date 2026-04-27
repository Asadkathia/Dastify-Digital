import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/contact-2',
        destination: '/contact',
        permanent: true,
      },
    ];
  },
};

export default withPayload(nextConfig);
