import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
      // {
      //   protocol: "http",
      //   hostname: "192.168.1.69",
      //   port: "8080",
      //   pathname: "/uploads/**",
      // },
    ],
    // Disable image optimization in development to avoid network issues
    // This prevents Next.js from trying to fetch images server-side
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
