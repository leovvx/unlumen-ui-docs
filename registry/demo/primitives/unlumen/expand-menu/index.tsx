"use client";

import {
  PencilEdit01Icon as Pencil,
  Copy01Icon as Copy,
  Share01Icon as Share,
  Archive01Icon as Archive,
} from "hugeicons-react";
import { ExpandMenu } from "@/registry/primitives/unlumen/expand-menu";

const DEMO_ITEMS = [
  { icon: <Pencil size={16} />, label: "Edit", onClick: () => {} },
  { icon: <Copy size={16} />, label: "Copy", onClick: () => {} },
  { icon: <Share size={16} />, label: "Share", onClick: () => {} },
  { icon: <Archive size={16} />, label: "Archive", onClick: () => {} },
];

type Props = {
  direction?: "up" | "down" | "left" | "right";
  showLabels?: boolean;
};

export default function ExpandMenuDemo({
  direction = "down",
  showLabels = false,
}: Props) {
  return (
    <div className="flex items-center justify-center w-full min-h-[260px] p-16">
      <ExpandMenu
        items={DEMO_ITEMS}
        direction={direction}
        showLabels={showLabels}
      />
    </div>
  );
}
