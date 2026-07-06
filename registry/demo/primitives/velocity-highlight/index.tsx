"use client";

import {
  Highlight,
  HighlightItem,
} from "@/registry/primitives/velocity-highlight";

const LINKS = Array.from({ length: 16 }, (_, index) => ({
  id: `link-${index + 1}`,
  label: `Link ${String(index + 1).padStart(2, "0")}`,
}));

export const HighlightDemo = ({ hover = true }: { hover?: boolean }) => {
  return (
    <div className="flex min-h-[420px] w-full items-center justify-center p-8">
      <Highlight
        mode="parent"
        hover={hover}
        defaultValue={hover ? undefined : "link-1"}
        containerClassName="grid w-full max-w-2xl grid-cols-4 gap-6 p-6"
        className="rounded-lg bg-accent"
      >
        {LINKS.map((item) => (
          <HighlightItem key={item.id} value={item.id} asChild>
            <button
              type="button"
              className="relative z-10 cursor-pointer rounded-lg px-4 py-3 text-center text-sm font-medium"
            >
              {item.label}
            </button>
          </HighlightItem>
        ))}
      </Highlight>
    </div>
  );
};
