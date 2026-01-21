import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },
      {
        protocol: "https",
        hostname:  "eokdffuwilmjinbwnseh.supabase.co",
      },
      {
        protocol: "https",
        hostname:  "khsnoxdzkbftjmdkfpho.supabase.co",
      },
    ],
  },
};

export default nextConfig;
