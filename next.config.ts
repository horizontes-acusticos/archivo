import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',        // ✅ Enables static export
  trailingSlash: true,     // ✅ Good for static hosting
  images: {
    unoptimized: true      // ✅ Required for static export
  }
};

export default nextConfig;
