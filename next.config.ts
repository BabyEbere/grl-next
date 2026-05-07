import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/assets/images/:path*',
        destination: 'https://api.zucglobalresourcesltd.com/assets/images/:path*'
      }
    ];
  }
};

export default nextConfig;
