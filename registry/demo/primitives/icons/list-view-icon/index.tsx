"use client";

import { useState } from "react";
import { ListViewIcon } from "@/registry/primitives/icons/list-view-icon";

export function ListViewIconDemo() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <button
        onClick={() => setIsActive((prev) => !prev)}
        className="flex items-center justify-center rounded-4xl hover:bg-accent hover:cursor-pointer p-3 text-foreground transition-colors"
        aria-label={isActive ? "Deactivate list view" : "Activate list view"}
      >
        <ListViewIcon isActive={isActive} className="size-16" />
      </button>
      <p className="text-sm text-foreground/50 select-none">
        {isActive ? "Active" : "Inactive"} — click to toggle
      </p>
    </div>
  );
}

export default ListViewIconDemo;
