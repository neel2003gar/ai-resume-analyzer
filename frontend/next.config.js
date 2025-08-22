/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ai-resume-analyzer' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/ai-resume-analyzer' : '',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://ai-resume-analyzer-backend.onrender.com' 
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
};

module.exports = nextConfig;
