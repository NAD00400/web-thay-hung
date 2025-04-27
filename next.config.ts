import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  /* config options here */
  api: {
    bodyParser: {
      sizeLimit: '10mb', // nếu ảnh lớn hơn 1MB
    },
  },
  
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

