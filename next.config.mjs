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
        source: "/components/avatar-group",
        destination: "/components/animate/avatar-group",
        permanent: true,
      },
      {
        source: "/components/code-editor",
        destination: "/components/animate/code",
        permanent: true,
      },
      {
        source: "/components/code-tabs",
        destination: "/components/animate/code-tabs",
        permanent: true,
      },
      {
        source: "/components/cursor",
        destination: "/components/animate/cursor",
        permanent: true,
      },
      {
        source: "/components/motion-grid",
        destination: "/primitives/animate/motion-grid",
        permanent: true,
      },
      {
        source: "/components/pinned-list",
        destination: "/primitives/animate/pinned-list",
        permanent: true,
      },
      {
        source: "/components/scroll-progress",
        destination: "/primitives/animate/scroll-progress",
        permanent: true,
      },
      {
        source: "/components/spring-element",
        destination: "/primitives/animate/spring",
        permanent: true,
      },
      {
        source: "/components/stars-scrolling-wheel",
        destination: "/components/animate/github-stars-wheel",
        permanent: true,
      },
      {
        source: "/components/tabs",
        destination: "/components/animate/tabs",
        permanent: true,
      },
      {
        source: "/components/tooltip",
        destination: "/components/animate/tooltip",
        permanent: true,
      },
      {
        source: "/buttons/:path*",
        destination: "/primitives/buttons/:path*",
        permanent: true,
      },
      {
        source: "/backgrounds/:path*",
        destination: "/components/backgrounds/:path*",
        permanent: true,
      },
      {
        source: "/effects/motion-effect",
        destination: "/primitives/effects/effect",
        permanent: true,
      },
      {
        source: "/effects/motion-highlight",
        destination: "/primitives/effects/highlight",
        permanent: true,
      },
      {
        source: "/effects/:path*",
        destination: "/primitives/effects/:path*",
        permanent: true,
      },
      {
        source: "/ui-elements/:path*",
        destination: "/components/community/:path*",
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
