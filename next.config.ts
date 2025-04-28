import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "brojqgdjcljbprhn.public.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Thêm cấu hình này để tăng giới hạn kích thước body
    },
  },
};

export default nextConfig;
