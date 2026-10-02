import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/resume/:path*",
        headers: [
          {
            key: "Content-Disposition",
            value: 'attachment; filename="Matthew-Gallardo-Resume-2026.pdf"',
          },
        ],
      },
    ];
  },
};

export default config;
