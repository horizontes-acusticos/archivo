import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',         // ✅ Enables static export (replaces deprecated 'next export')
  distDir: 'output',        // ✅ Matches DigitalOcean's expected directory
  trailingSlash: true,      // ✅ Good for static hosting
  images: {
    unoptimized: true       // ✅ Required for static export
  }
};

export default nextConfig;
