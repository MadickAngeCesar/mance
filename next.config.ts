import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mance.dev",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "www.mance.dev",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
        pathname: "/api/uploads/**",
      },
    ],
  },
};

export default nextConfig;
