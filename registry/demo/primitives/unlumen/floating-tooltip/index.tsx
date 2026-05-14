"use client";

import { FloatingTooltip } from "@/registry/primitives/unlumen/floating-tooltip";
import {
  Share02Icon as Share2,
  PencilEdit01Icon as Pencil,
  Copy01Icon as Copy,
  Archive01Icon as Archive,
  Delete01Icon as Trash2,
  Move01Icon as MoveHorizontal,
} from "hugeicons-react";
const MoveVertical = MoveHorizontal;

const ACTIONS = [
  {
    label: "Share",
    Icon: Share2,
    content: "Share link",
    description: "Copy a shareable link to clipboard.",
  },
  {
    label: "Edit",
    Icon: Pencil,
    content: "Edit",
    description: "Open in the inline editor.",
  },
  {
    label: "Duplicate",
    Icon: Copy,
    content: "Duplicate",
    description: "Creates an exact copy in this folder.",
  },
  {
    label: "Archive",
    Icon: Archive,
    content: "Archive",
    description: "Move to archive — reversible at any time.",
  },
  {
    label: "Delete",
    Icon: Trash2,
    content: "Delete permanently",
    description: "This action cannot be undone.",
  },
];

export function FloatingTooltipDemo() {
  return (
    <FloatingTooltip.Provider>
      <div className="flex flex-col gap-10 p-10 max-w-lg mx-auto w-full select-none">
        {/* Section 1 — title only */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-muted-foreground">
            Title only
          </p>
          <div className="flex flex-wrap gap-2">
            {ACTIONS.map(({ label, Icon, content }) => (
              <FloatingTooltip.Trigger key={label} content={content}>
                <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
                  <Icon className="size-4" />
                  <span>{label}</span>
                </button>
              </FloatingTooltip.Trigger>
            ))}
          </div>
        </div>

        {/* Section 3 — velocity squish */}
        <div className="flex flex-col  justify-center gap-3">
          <FloatingTooltip.Trigger
            content="Velocity-driven shape"
            description="Squish, skew & border-radius all react to cursor speed in real time."
          >
            <div className="flex flex-col h-72 w-full items-center text-center justify-center gap-3 rounded-xl border border-dashed border-border bg-accent/30 text-sm text-muted-foreground transition-colors hover:bg-accent/50">
              <MoveVertical className="size-4" />
              <span>Sweep your cursor quickly</span>
              <MoveVertical className="size-4" />
            </div>
          </FloatingTooltip.Trigger>
        </div>
      </div>
    </FloatingTooltip.Provider>
  );
}
