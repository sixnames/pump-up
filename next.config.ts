import { withPayload } from '@payloadcms/next/withPayload';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // output: 'standalone',
  images: {
    localPatterns: [
      {
        pathname: '/assets/**',
        search: '',
      },
    ],
  },
  // turbopack: {},
  experimental: {
    // allowDevelopmentBuild: true,
    // typedRoutes: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
});
