"use client";

import { Puzzle as Component } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { index } from "@/__registry__";
import { Dancing_Script } from "next/font/google";

const dancing = Dancing_Script({ subsets: ["latin"] });

const TabsDescription = ({
  title,
  count,
}: {
  title: string;
  count: number;
}) => {
  return (
    <span className="flex items-center flex-row gap-2">
      <span>{title}</span>
      <span className="pt-0.5 pb-px px-1.5 font-semibold rounded-full bg-foreground/10 text-[10px] text-foreground/50">
        {count}
      </span>
    </span>
  );
};

export const SIDEBAR_TABS = [
  {
    title: "UI",
    description: (
      <TabsDescription
        title="Animated UI"
        count={
          Object.values(index).filter(
            (item) =>
              !item.name.startsWith("demo-") &&
              ["registry:ui", "registry:block"].includes(item.type),
          ).length
        }
      />
    ),
    icon: (
      <div className="[&_svg]:size-full rounded-lg size-full text-muted-foreground max-md:bg-(--tab-color)/10 max-md:border max-md:p-1.5">
        <Component />
      </div>
    ),
    url: "/ui",
  },
];
