"use client";

import { ClippedCircle } from "@/registry/primitives/clipped-circle";
import { Button } from "@workspace/ui/components/ui/button";

interface ClippedCircleDemoProps {
  circleSize: number;
}

export default function ClippedCircleDemo({
  circleSize = 400,
}: ClippedCircleDemoProps) {
  const actions = [
    { label: "Docs", variant: "default" },
    { label: "Install", variant: "outline" },
    { label: "Components", variant: "ghost" },
  ] as const;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5 p-6">
      <div className="grid grid-cols-3 gap-3">
        {actions.map(({ label, variant }) => (
          <Button
            key={label}
            variant={variant}
            size="sm"
            className="relative overflow-hidden"
          >
            {label}
            <ClippedCircle circleSize={260} circleClassName="bg-white" />
          </Button>
        ))}
      </div>

      <div className="relative min-h-75 overflow-hidden rounded-2xl border border-border/70 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_38%),linear-gradient(135deg,hsl(var(--muted)),hsl(var(--background)))] p-8 shadow-sm">
        <div className="flex h-full min-h-59 items-center justify-center rounded-xl border border-border/60 bg-white p-10 shadow-inner">
          <img
            src="/docs/unlumen-ui.svg"
            alt="Unlumen UI"
            className="h-auto w-full max-w-52 object-contain"
          />
        </div>
        <ClippedCircle circleSize={circleSize} circleClassName="bg-white" />
      </div>
    </div>
  );
}
