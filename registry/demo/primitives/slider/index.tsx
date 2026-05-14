"use client";

import { useState } from "react";
import { Slider } from "@/registry/primitives/slider";

export const SliderDemo = ({
  showValue = true,
  showSteps = false,
  valuePosition = "bottom",
}: {
  showValue?: boolean;
  showSteps?: boolean;
  valuePosition?: "top" | "bottom" | "left" | "right" | "tooltip";
}) => {
  const [volume, setVolume] = useState(40);
  const [brightness, setBrightness] = useState(70);
  const [opacity, setOpacity] = useState(55);

  return (
    <div className="flex flex-col gap-8 w-full max-w-sm px-4 py-8">
      <Slider
        value={volume}
        onChange={(v) => setVolume(v as number)}
        min={0}
        max={100}
        step={1}
        label="Volume"
        showValue={showValue}
        showSteps={showSteps}
        valuePosition={valuePosition}
        formatValue={(v) => `${v}%`}
      />
      <Slider
        value={brightness}
        onChange={(v) => setBrightness(v as number)}
        min={0}
        max={100}
        step={1}
        label="Brightness"
        showValue={showValue}
        showSteps={showSteps}
        valuePosition={valuePosition}
        formatValue={(v) => `${v}%`}
      />
      <Slider
        value={opacity}
        onChange={(v) => setOpacity(v as number)}
        min={0}
        max={100}
        step={5}
        label="Opacity"
        showValue={showValue}
        showSteps={showSteps}
        valuePosition={valuePosition}
        formatValue={(v) => `${v}%`}
      />
    </div>
  );
};
