import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // We will turn this back on when publishing to the app store
  images: {
    unoptimized: true,
  },
};

export default nextConfig;