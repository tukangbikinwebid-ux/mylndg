import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.berkahcapitalcredit.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/kode-otp",
        destination: "/my/kode-otp",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
