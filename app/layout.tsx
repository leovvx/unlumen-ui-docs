import { RootProvider } from "fumadocs-ui/provider";
import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { Instrument_Sans, Instrument_Serif, Nunito } from "next/font/google";
import XIcon from "@workspace/ui/components/icons/x-icon";
import { cn } from "@workspace/ui/lib/utils";

import { ThemeSwitcher } from "@/components/animate/theme-switcher";
import { DocsSidebar } from "@/components/docs/sidebar";
import { Nav } from "@/components/docs/nav";
import { TopShadow } from "@/components/docs/top-shadow";
import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";

import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: "400",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
});

const docsLayoutProps: DocsLayoutProps = {
  tree: source.pageTree,
  sidebar: {},
  githubUrl: "https://github.com/wicki-leonard-emf/unlumen-ui-docs",
  themeSwitch: {
    component: <ThemeSwitcher />,
  },
  ...baseOptions,
  links: [
    ...(baseOptions.links || []),
    {
      icon: <XIcon />,
      url: "https://x.com/animate_ui",
      text: "X",
      type: "icon",
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ui.unlumen.com"),
  title: {
    template: "%s - unlumen UI Docs",
    default: "unlumen UI Docs",
  },
  description:
    "Documentation for unlumen UI, a curated registry of animated React components built with TypeScript, Tailwind CSS, Motion, and the shadcn CLI.",
  alternates: {
    canonical: "/docs",
  },
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "96x96",
      url: "/docs/favicon-96x96.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/docs/apple-touch-icon.png",
    },
  ],
  openGraph: {
    title: "unlumen UI Docs",
    description:
      "Documentation for animated React components built with TypeScript, Tailwind CSS, Motion, and the shadcn CLI.",
    url: "https://ui.unlumen.com/docs",
    siteName: "unlumen UI",
    images: [
      {
        url: "https://ui.unlumen.com/docs/og-image.png",
        width: 1200,
        height: 630,
        alt: "unlumen UI Docs",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@unlumenui",
    title: "unlumen UI Docs",
    description:
      "Documentation for animated React components built with TypeScript, Tailwind CSS, Motion, and the shadcn CLI.",
    images: ["https://ui.unlumen.com/docs/og-image.png"],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        GeistSans.variable,
        instrumentSerif.variable,
        instrumentSans.variable,
        nunito.variable,
        "font-sans",
      )}
    >
      <body className="flex min-h-screen flex-col">
        <TopShadow />
        <RootProvider search={{ enabled: false }}>
          <DocsLayout
            {...docsLayoutProps}
            sidebar={{
              component: <DocsSidebar {...docsLayoutProps} />,
            }}
            nav={{
              component: <Nav />,
            }}
          >
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
