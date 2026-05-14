"use client";

import { Tag, TagGroup } from "@/registry/components/unlumen/tag";

export function TagDemo() {
  return (
    <div className="flex min-h-[34rem] w-full items-center justify-center px-6 py-10 sm:px-10">
      <TagGroup size="md" />
    </div>
  );
}

export function TagSingleDemo() {
  return <Tag variant="fast" label="Fast" size="md" />;
}
