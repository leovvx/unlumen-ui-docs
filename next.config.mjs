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
