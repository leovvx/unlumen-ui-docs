"use client";

import { HoverFeatureCard } from "@/registry/components/unlumen/hover-feature-cards";

const ITEM = {
  name: "Components",
  description:
    "Real components, not just primitives. Ready to use and customize in your projects.",
  img: "/blocks.png",
  imgLight: "/blocks-light.png",
  imgClassName: "absolute -bottom-10 left-1/2 -translate-x-1/2",
  imgWidth: 320,
  containerClassName: "h-full rounded-3xl",
  fadeBottom: true,
  soon: false,
};

export default function HoverFeatureCardsDemo() {
  return (
    <div className="w-full max-w-md mx-auto px-5 py-10">
      <HoverFeatureCard item={ITEM} />
    </div>
  );
}
