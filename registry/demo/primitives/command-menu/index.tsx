"use client";

import {
  BookOpen,
  Github,
  Home,
  MousePointer,
  Paintbrush,
  Puzzle as Component,
  Rocket,
  Wand2,
} from "lucide-react";

import {
  CommandMenu,
  type CommandMenuGroupDef,
} from "@/registry/primitives/command-menu";

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
        href: "/installation",
        keywords: ["docs", "documentation", "guide", "getting started"],
      },
      {
        label: "Components",
        icon: Component,
        href: "/ui",
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
        href: "/ui/animate",
        keywords: ["animated", "motion", "framer"],
      },
      {
        label: "Buttons",
        icon: MousePointer,
        href: "/ui/buttons",
        keywords: ["buttons", "cta", "click"],
      },
      {
        label: "Backgrounds",
        icon: Paintbrush,
        href: "/ui/backgrounds",
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
          window.open("https://github.com/leovvx/unlumen-ui-docs", "_blank"),
        keywords: ["github", "source", "code", "repo"],
      },
      {
        label: "Get Started",
        icon: Rocket,
        href: "/installation",
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
