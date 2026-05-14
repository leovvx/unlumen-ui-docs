"use client";

import { SideBySideSlide } from "@/registry/primitives/unlumen/side-by-side-slide";

interface SideBySideSlideDemoProps {
  orientation: "horizontal" | "vertical";
  initialPosition: number;
  dividerColor: string;
  dividerWidth: number;
  showHandle: boolean;
  handleSize: number;
  handleColor: string;
  cursor: "none" | "col-resize" | "row-resize" | "pointer";
  stiffness: number;
  damping: number;
}

export default function SideBySideSlideDemo({
  orientation = "horizontal",
  initialPosition = 50,
  dividerColor = "white",
  dividerWidth = 2,
  showHandle = true,
  handleSize = 16,
  handleColor = "white",
  cursor = "none",
  stiffness = 300,
  damping = 30,
}: SideBySideSlideDemoProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl">
        <SideBySideSlide
          beforeImage="https://urjypba3n2iozf8u.public.blob.vercel-storage.com/villa.png"
          afterImage="https://urjypba3n2iozf8u.public.blob.vercel-storage.com/villa-sketch.png"
          beforeAlt="Modern house exterior"
          afterAlt="Modern house interior"
          orientation={orientation}
          initialPosition={initialPosition}
          dividerColor={dividerColor}
          dividerWidth={dividerWidth}
          showHandle={showHandle}
          handleSize={handleSize}
          handleColor={handleColor}
          cursor={cursor}
          springOptions={{ stiffness, damping }}
          className="aspect-video"
        />
      </div>
    </div>
  );
}
