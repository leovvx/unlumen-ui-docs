import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { CodeSimpleIcon } from "hugeicons-react";

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
      icon: <CodeSimpleIcon strokeWidth={1.5} />,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    {
      text: "Introduction",
      url: "/",
      secondary: false,
    },
    {
      text: "Installation",
      url: "/installation",
      secondary: false,
    },
    {
      text: "Accessibility",
      url: "/accessibility",
      secondary: false,
    },
    {
      text: "MCP Server",
      url: "/mcp",
      secondary: false,
    },
    {
      text: "Changelog",
      url: "/changelog",
      secondary: false,
      new: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    {
      text: "Roadmap",
      url: "/roadmap",
      secondary: false,
    },
    {
      text: "My recommendations",
      url: "/other-animated-distributions",
      secondary: false,
    },
    {
      text: "Credits",
      url: "/credits",
      secondary: false,
    },
    {
      text: "License",
      url: "/license",
      secondary: false,
    },
    {
      text: "Made with Unlumen UI",
      url: "/showcase",
      secondary: false,
    },
    {
      text: "Stay Tuned",
      url: "/newsletter",
      secondary: false,
    },
  ],
};
