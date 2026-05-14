"use client";

import { useState } from "react";
import { Slider } from "@/registry/primitives/unlumen/slider";

export const SliderStepsDemo = ({
  showValue = true,
}: {
  showValue?: boolean;
}) => {
  const [rating, setRating] = useState(3);
  const [quality, setQuality] = useState(2);
  const [zoom, setZoom] = useState(100);

  return (
    <div className="flex flex-col gap-8 w-full max-w-sm px-4 py-8">
      <Slider
        value={rating}
        onChange={(v) => setRating(v as number)}
        min={1}
        max={5}
        step={1}
        showSteps
        label="Rating"
        showValue={showValue}
        formatValue={(v) => `${v} / 5`}
      />
      <Slider
        value={quality}
        onChange={(v) => setQuality(v as number)}
        min={0}
        max={4}
        step={1}
        showSteps
        label="Quality"
        showValue={showValue}
        formatValue={(v) =>
          ["Draft", "Low", "Medium", "High", "Ultra"][v] ?? String(v)
        }
      />
      <Slider
        value={zoom}
        onChange={(v) => setZoom(v as number)}
        min={25}
        max={200}
        step={25}
        showSteps
        label="Zoom"
        showValue={showValue}
        formatValue={(v) => `${v}%`}
      />
    </div>
  );
};
