"use client";

import { useEffect, useState } from "react";
import { AnimateCount } from "@/registry/components/unlumen/animate-count";

function AutoCountUp() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= 100) return;
    const id = setTimeout(() => setCount((c) => c + 1), 1000);
    return () => clearTimeout(id);
  }, [count]);

  return (
    <div className="flex flex-col items-center gap-1">
      <AnimateCount className="text-4xl font-bold">{count}</AnimateCount>
      <span className="text-xs text-muted-foreground">auto count-up</span>
    </div>
  );
}

export default function AnimateCountDemo() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "i") setCount((c) => c + 1);
      if (e.key === "o") setCount((c) => Math.max(0, c - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-10 p-8">
      <div className="flex flex-col items-center gap-4">
        <AnimateCount className="text-6xl font-bold">{count}</AnimateCount>
        <div className="flex gap-3">
          <button
            onClick={() => setCount((c) => Math.max(0, c - 1))}
            className="rounded-md border border-border bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            − <kbd className="ml-1 text-xs text-muted-foreground">O</kbd>
          </button>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="rounded-md border border-border bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            + <kbd className="ml-1 text-xs text-muted-foreground">I</kbd>
          </button>
        </div>
      </div>

      <div className="w-px h-8 bg-border" />

      <AutoCountUp />
    </div>
  );
}
