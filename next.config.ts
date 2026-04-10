import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.cms.optimizely.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.cmp.optimizely.com', pathname: '/**' },
    ],
  },
  async rewrites() {
    return [
      // Serve the template HTML files for pretty URLs
      { source: '/', destination: '/index.html' },
      { source: '/home', destination: '/index.html' },
      { source: '/home-2', destination: '/index-2.html' },
      { source: '/home-3', destination: '/index-3.html' },
      { source: '/movies', destination: '/movie.html' },
      { source: '/movie-details', destination: '/movie-details.html' },
      { source: '/tv-shows', destination: '/tv-shows.html' },
      { source: '/tv-shows-details', destination: '/tv-shows-details.html' },
      { source: '/web-series', destination: '/web-series.html' },
      { source: '/web-series-details', destination: '/web-series-details.html' },
      { source: '/about', destination: '/about.html' },
      { source: '/contact', destination: '/contact.html' },
      { source: '/pricing', destination: '/pricing.html' },
      { source: '/team', destination: '/team.html' },
      { source: '/blog', destination: '/news.html' },
      { source: '/blog-details', destination: '/news-details.html' },
      { source: '/coming-soon', destination: '/cooming-soon.html' },
      { source: '/login', destination: '/login.html' },
      { source: '/404', destination: '/404.html' },
    ];
  },
};

export default nextConfig;
