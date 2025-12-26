import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Static export for CyberPanel
  trailingSlash: true, // Better URL handling
  images: {
    unoptimized: true, // Required for static export
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://biodaat.local/api',
  },
};

export default nextConfig;

