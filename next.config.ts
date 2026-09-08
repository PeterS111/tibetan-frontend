import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // <-- Turned this back on!
  images: {
    unoptimized: true,
  },
};

export default nextConfig;