"use client";

import {
  Highlight,
  HighlightItem,
} from "@/registry/primitives/effects/velocity-highlight";

const ITEMS = [
  { id: "react", label: "React" },
  { id: "vue", label: "Vue" },
  { id: "svelte", label: "Svelte" },
  { id: "next", label: "Next.js" },
  { id: "angular", label: "Angular" },
];

export const HighlightDemo = ({ hover = true }: { hover?: boolean }) => {
  return (
    <div className="flex items-center justify-center min-h-[300px] w-full p-8">
      <Highlight
        mode="parent"
        hover={hover}
        defaultValue={hover ? undefined : "react"}
        containerClassName="flex gap-4 p-4 flex-wrap justify-center"
        className="bg-accent "
      >
        {ITEMS.map((item) => (
          <HighlightItem
            key={item.id}
            value={item.id}
            className="px-5 py-1 rounded-md font-medium cursor-pointer"
          >
            <div>{item.label}</div>
          </HighlightItem>
        ))}
      </Highlight>
    </div>
  );
};
