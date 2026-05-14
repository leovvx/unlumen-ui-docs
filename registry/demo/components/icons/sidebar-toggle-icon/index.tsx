"use client";

import { useState } from "react";
import { SidebarToggleIcon } from "@/registry/components/icons/sidebar-toggle-icon";

interface SidebarToggleIconDemoProps {
  strokeWidth?: number;
}

export function SidebarToggleIconDemo({
  strokeWidth,
}: SidebarToggleIconDemoProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center rounded-4xl hover:bg-accent hover:cursor-pointer p-3 text-foreground transition-colors"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        <SidebarToggleIcon
          isOpen={isOpen}
          strokeWidth={strokeWidth}
          className="size-32"
        />
      </button>
    </div>
  );
}

export default SidebarToggleIconDemo;
