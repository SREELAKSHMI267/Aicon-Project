/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' }
    ]
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'pdf-parse', 'pdfjs-dist'];
      
      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          'pdfjs-dist/legacy/build/pdf.worker.js': 'pdfjs-dist/legacy/build/pdf.worker.js'
        }
      };
    }
    
    // Handle URLSearchParams polyfill
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'url': false,
      'util': false
    };
    
    return config;
  }
};

export default nextConfig;
