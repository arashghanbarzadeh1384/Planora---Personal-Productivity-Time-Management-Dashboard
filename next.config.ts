import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: process.env.NODE_ENV === "production" ? ".next-production" : ".next-development",
  experimental: { optimizePackageImports: ["lucide-react", "recharts"] },
};

export default nextConfig;
