import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  /* config options here */
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "brojqgdjcljbprhn.public.blob.vercel-storage.com",
      },
      
    ],
  },
};

export default nextConfig;
