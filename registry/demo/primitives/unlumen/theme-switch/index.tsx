"use client";

import { ThemeSwitch } from "@/registry/primitives/unlumen/theme-switch";

export const ThemeSwitchDemo = ({ iconSize = 16 }: { iconSize?: number }) => {
  return (
    <div className="flex items-center justify-center gap-4 p-8">
      <ThemeSwitch iconSize={iconSize} />
    </div>
  );
};
