"use client";

import type { ReactNode } from "react";

import {
  FirstBracketIcon as Braces,
  Database01Icon as Database,
  FigmaIcon as Figma,
  Github01Icon as Github,
  Globe02Icon as Globe,
  Layers01Icon as Layers,
  ColorsIcon as Palette,
  FastWindIcon as Wind,
} from "hugeicons-react";

import {
  OrbitingSkills,
  type OrbitSkillItem,
  type OrbitingSkillsProps,
} from "@/registry/primitives/orbiting-skills";

const ICON_SKILLS: OrbitSkillItem[] = [
  { label: "React", icon: <Globe className="size-4" /> },
  { label: "TypeScript", icon: <Braces className="size-4" /> },
  { label: "Tailwind", icon: <Wind className="size-4" /> },
  { label: "Figma", icon: <Figma className="size-4" /> },
  { label: "GitHub", icon: <Github className="size-4" /> },
  { label: "Database", icon: <Database className="size-4" /> },
];

const TEXT_SKILLS: OrbitSkillItem[] = [
  { label: "Design" },
  { label: "Motion" },
  { label: "UX" },
  { label: "CSS" },
  { label: "a11y" },
  { label: "Perf" },
];

type OrbitingSkillsDemoProps = Pick<
  OrbitingSkillsProps,
  "radius" | "duration" | "showPath" | "followCursor"
>;

function Avatar({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-20 items-center justify-center rounded-full border border-border bg-background shadow-md">
      {children}
    </div>
  );
}

export const OrbitingSkillsDemo = ({
  radius = 96,
  duration = 18,
  showPath = true,
  followCursor = true,
}: OrbitingSkillsDemoProps) => {
  return (
    <div className="flex min-h-[400px] flex-wrap items-center justify-center gap-24 p-16">
      {/* ── With Lucide icons ── */}
      <div className="flex flex-col items-center gap-4">
        <OrbitingSkills
          items={ICON_SKILLS}
          radius={radius}
          duration={duration}
          showPath={showPath}
          followCursor={followCursor}
        >
          <Avatar>
            <Layers className="size-8 text-foreground/70" />
          </Avatar>
        </OrbitingSkills>
        <p className="text-xs text-muted-foreground">With icons</p>
      </div>

      {/* ── Text only ── */}
      <div className="flex flex-col items-center gap-4">
        <OrbitingSkills
          items={TEXT_SKILLS}
          radius={radius}
          duration={duration}
          showPath={showPath}
          followCursor={followCursor}
        >
          <Avatar>
            <Palette className="size-8 text-foreground/70" />
          </Avatar>
        </OrbitingSkills>
        <p className="text-xs text-muted-foreground">Text only</p>
      </div>
    </div>
  );
};
