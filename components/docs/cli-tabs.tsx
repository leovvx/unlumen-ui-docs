"use client";

import { cn } from "@workspace/ui/lib/utils";
import { CodeTabs } from "@/components/docs/code-tabs";

interface CliTabsProps {
  command: string;
  className?: string;
}

export function CliTabs({ command, className }: CliTabsProps) {
  const codes = {
    npm: `npx shadcn@latest add ${command}`,
    pnpm: `pnpm dlx shadcn@latest add ${command}`,
    yarn: `npx shadcn@latest add ${command}`,
    bun: `bun x --bun shadcn@latest add ${command}`,
  };

  return (
    <CodeTabs codes={codes} lang="bash" className={cn("mt-2", className)} />
  );
}
