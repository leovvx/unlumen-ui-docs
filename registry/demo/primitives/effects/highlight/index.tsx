"use client";

import {
  Highlight,
  HighlightItem,
} from "@/registry/primitives/effects/highlight";

const ITEMS = [
  { id: "react", label: "React" },
  { id: "vue", label: "Vue" },
  { id: "svelte", label: "Svelte" },
  { id: "next", label: "Next.js" },
];

export const HighlightDemo = ({ hover = true }: { hover?: boolean }) => {
  return (
    <div className="flex items-center justify-center min-h-[300px] w-full p-8">
      <Highlight
        mode="parent"
        hover={hover}
        defaultValue={hover ? undefined : "react"}
        className="rounded-lg bg-muted"
        containerClassName="flex gap-3 p-4 flex-wrap justify-center"
      >
        {ITEMS.map((item) => (
          <HighlightItem
            key={item.id}
            value={item.id}
            className="px-4 py-2 rounded-md font-medium cursor-pointer"
          >
            <div>{item.label}</div>
          </HighlightItem>
        ))}
      </Highlight>
    </div>
  );
};
