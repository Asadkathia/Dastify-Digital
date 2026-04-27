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
      // Demo route retired in v2 redesign — any external links land on
      // contact (closest substitute action: book a session / talk to us).
      {
        source: '/demo',
        destination: '/contact',
        permanent: true,
      },
      // The Pages collection seeds a row with slug=home that powers the
      // converted-page registry for /. Visiting /home would render the
      // same content via the [...slug] catchall — collapse it to / so
      // there's exactly one canonical homepage URL.
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default withPayload(nextConfig);
