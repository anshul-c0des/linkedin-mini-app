import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {  // eslint deploy errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
