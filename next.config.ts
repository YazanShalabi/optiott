import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.cms.optimizely.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.cmp.optimizely.com', pathname: '/**' },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        '*.webproofing.cmp.optimizely.com',
        'www.optimizelyedit.com',
      ],
    },
  },
};

export default nextConfig;
