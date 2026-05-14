"use client";

import {
  BookOpen01Icon as BookOpen,
  PuzzleIcon as Component,
  Home01Icon as Home,
  RocketIcon as Rocket,
  Mouse01Icon as MousePointer,
  MagicWand01Icon as Wand2,
  PaintBrush01Icon as Paintbrush,
  Github01Icon as Github,
} from "hugeicons-react";

import {
  CommandMenu,
  type CommandMenuGroupDef,
} from "@/registry/components/unlumen/command-menu";

const GROUPS: CommandMenuGroupDef[] = [
  {
    heading: "Navigation",
    items: [
      {
        label: "Home",
        icon: Home,
        href: "/",
        keywords: ["home", "main", "accueil"],
      },
      {
        label: "Documentation",
        icon: BookOpen,
        href: "/docs/installation",
        keywords: ["docs", "documentation", "guide", "getting started"],
      },
      {
        label: "Components",
        icon: Component,
        href: "/docs/ui",
        keywords: ["components", "ui", "library", "browse"],
      },
    ],
  },
  {
    heading: "Components",
    items: [
      {
        label: "Animated Components",
        icon: Wand2,
        href: "/docs/ui/animate",
        keywords: ["animated", "motion", "framer"],
      },
      {
        label: "Buttons",
        icon: MousePointer,
        href: "/docs/ui/buttons",
        keywords: ["buttons", "cta", "click"],
      },
      {
        label: "Backgrounds",
        icon: Paintbrush,
        href: "/docs/ui/backgrounds",
        keywords: ["backgrounds", "bg", "gradient", "pattern"],
      },
    ],
  },
  {
    heading: "Links",
    items: [
      {
        label: "GitHub",
        icon: Github,
        action: () =>
          window.open(
            "https://github.com/wicki-leonard-emf/unlumen-ui-pv",
            "_blank",
          ),
        keywords: ["github", "source", "code", "repo"],
      },
      {
        label: "Get Started",
        icon: Rocket,
        href: "/docs/installation",
        keywords: ["get started", "start", "begin", "install"],
      },
    ],
  },
];

export const CommandMenuDemo = () => {
  return (
    <div className="flex items-center justify-center p-8 w-full">
      <CommandMenu
        groups={GROUPS}
        showThemeGroup
        placeholder="Search components, pages, actions…"
        triggerProps={{ label: "Search components…" }}
      />
    </div>
  );
};
