import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Temporarily disable for demo
  eslint: {
    ignoreDuringBuilds: true, // Temporarily skip ESLint
  },
};

export default nextConfig;