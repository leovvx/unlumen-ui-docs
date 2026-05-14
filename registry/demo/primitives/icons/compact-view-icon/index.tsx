"use client";

import { useState } from "react";
import { CompactViewIcon } from "@/registry/primitives/icons/compact-view-icon";

export function CompactViewIconDemo() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <button
        onClick={() => setIsActive((prev) => !prev)}
        className="flex items-center justify-center rounded-4xl hover:bg-accent hover:cursor-pointer p-3 text-foreground transition-colors"
        aria-label={
          isActive ? "Deactivate compact view" : "Activate compact view"
        }
      >
        <CompactViewIcon isActive={isActive} className="size-16" />
      </button>
      <p className="text-sm text-foreground/50 select-none">
        {isActive ? "Active" : "Inactive"} — click to toggle
      </p>
    </div>
  );
}

export default CompactViewIconDemo;
