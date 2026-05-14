"use client";

import {
  HoverExpand,
  type HoverExpandProps,
} from "@/registry/components/unlumen/hover-expand";

const ITEMS: HoverExpandProps["items"] = [
  {
    label: "Kyoto",
    sublabel: "Japan",
    description: "Ancient temples hidden among bamboo groves",
    image:
      "https://images.unsplash.com/vector-1749746338337-b3c0a35a5975?q=80&w=2242&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Kyoto, Japan",
  },
  {
    label: "Lisbon",
    sublabel: "Portugal",
    description: "Sunlit hills and crumbling azulejo facades",
    image:
      "https://images.unsplash.com/vector-1766815276251-fa4fa3d81ce9?q=80&w=2242&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Lisbon, Portugal",
  },
  {
    label: "Marrakech",
    sublabel: "Morocco",
    description: "A labyrinth of souks washed in saffron light",
    image:
      "https://images.unsplash.com/vector-1769292737537-e37dc3c08514?q=80&w=2282&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Marrakech, Morocco",
  },
  {
    label: "Reykjavik",
    sublabel: "Iceland",
    description: "Aurora skies above volcanic black sand shores",
    image:
      "https://images.unsplash.com/vector-1738163099330-5c9841c97c39?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Reykjavik, Iceland",
  },
  {
    label: "Oaxaca",
    sublabel: "Mexico",
    description: "Mezcal smoke and murals on colonial walls",
    image:
      "https://images.unsplash.com/vector-1743446716355-85d9578a73d9?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Oaxaca, Mexico",
  },
];

type HoverExpandDemoProps = Pick<
  HoverExpandProps,
  "collapsedHeight" | "expandedHeight"
>;

export const HoverExpandDemo = ({
  collapsedHeight = 68,
  expandedHeight = 320,
}: HoverExpandDemoProps) => {
  return (
    <div className="flex items-center justify-center min-h-[520px] w-full p-8">
      <div className="w-full max-w-2xl">
        <HoverExpand
          items={ITEMS}
          collapsedHeight={collapsedHeight}
          expandedHeight={expandedHeight}
        />
      </div>
    </div>
  );
};
