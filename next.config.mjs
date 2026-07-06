import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  basePath: "/docs",
  images: {
    remotePatterns: [
      {
        hostname: "ui.aceternity.com",
      },
      {
        hostname: "ui.paceui.com",
      },
      {
        hostname: "images.pexels.com",
      },
      {
        hostname: "ph-files.imgix.net",
      },
      {
        hostname: "headlessui.com",
      },
      {
        hostname: "30tools.com",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "plus.unsplash.com",
      },
      {
        hostname: "urjypba3n2iozf8u.public.blob.vercel-storage.com",
      },
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://ui.aceternity.com https://ui.paceui.com https://images.pexels.com https://ph-files.imgix.net https://headlessui.com https://30tools.com https://images.unsplash.com https://plus.unsplash.com https://urjypba3n2iozf8u.public.blob.vercel-storage.com https://res.cloudinary.com https://www.google.com; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; upgrade-insecure-requests",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/buttons/:path*",
        destination: "/ui/buttons/:path*",
        permanent: true,
      },
      {
        source: "/effects/count-up",
        destination: "/ui/effects/count-up",
        permanent: true,
      },
      {
        source: "/effects/clipped-circle",
        destination: "/ui/effects/clipped-circle",
        permanent: true,
      },
      {
        source: "/effects/math-graph",
        destination: "/ui/effects/math-graph",
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
