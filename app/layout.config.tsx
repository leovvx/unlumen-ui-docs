import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  links: [
    {
      type: "separator",
      name: "Guide",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    {
      text: "Introduction",
      url: "/docs",
      secondary: false,
    },
    {
      text: "Installation",
      url: "/docs/installation",
      secondary: false,
    },
    {
      text: "Accessibility",
      url: "/docs/accessibility",
      secondary: false,
    },
    {
      text: "MCP Server",
      url: "/docs/mcp",
      secondary: false,
    },
    {
      text: "Changelog",
      url: "/docs/changelog",
      secondary: false,
      new: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    {
      text: "Roadmap",
      url: "/docs/roadmap",
      secondary: false,
    },
    {
      text: "My recommendations",
      url: "/docs/other-animated-distributions",
      secondary: false,
    },
    {
      text: "Credits",
      url: "/docs/credits",
      secondary: false,
    },
    {
      text: "License",
      url: "/docs/license",
      secondary: false,
    },
    {
      text: "Made with Unlumen UI",
      url: "/docs/showcase",
      secondary: false,
    },
    {
      text: "Stay Tuned",
      url: "/docs/newsletter",
      secondary: false,
    },
  ],
};
