/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack optimization untuk mengurangi cache warnings
  webpack: (config, { isServer }) => {
    const path = require('path');
    
    // Optimasi cache strategy dengan absolute path
    config.cache = {
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, '.next/cache'),
      buildDependencies: {
        config: [__filename],
      },
      // Optimasi untuk mengurangi serialization warnings
      maxMemoryGenerations: 1,
    };

    // Optimasi chunk splitting untuk mengurangi bundle size
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxSize: 244000, // Limit chunk size ke 244KB
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            maxSize: 244000,
          },
        },
      };
    }

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'images.duitku.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
