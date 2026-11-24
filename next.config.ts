import type { NextConfig } from "next";

const ADMIN_URL = "https://nekodojo.app/apps/animequote/admin";

const nextConfig: NextConfig = {
  images: {
    // Default imageSizes jumps from 384 to 640 (deviceSizes' first entry),
    // which over-fetches the small (150-320px) screenshot/card images used
    // across Hero and AppShowcase. These extra steps close that gap.
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 320, 384, 480, 576],
  },
  // The admin panel moved to Nekodojo.
  async redirects() {
    return [
      { source: "/admin", destination: ADMIN_URL, permanent: true },
      { source: "/admin/:path*", destination: ADMIN_URL, permanent: true },
    ];
  },
};

export default nextConfig;
