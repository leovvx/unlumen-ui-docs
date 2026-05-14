"use client";

import { useState } from "react";
import { Slider } from "@/registry/components/unlumen/slider";

export const SliderRangeDemo = ({
  showValue = true,
}: {
  showValue?: boolean;
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 800]);
  const [tempRange, setTempRange] = useState<[number, number]>([18, 26]);
  const [yearRange, setYearRange] = useState<[number, number]>([2018, 2024]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-sm px-4 py-8">
      <Slider
        value={priceRange}
        onChange={(v) => setPriceRange(v as [number, number])}
        min={0}
        max={1000}
        step={10}
        label="Price"
        showValue={showValue}
        formatValue={(v) => `$${v}`}
      />
      <Slider
        value={tempRange}
        onChange={(v) => setTempRange(v as [number, number])}
        min={-10}
        max={40}
        step={1}
        label="Temperature"
        showValue={showValue}
        formatValue={(v) => `${v}°C`}
      />
      <Slider
        value={yearRange}
        onChange={(v) => setYearRange(v as [number, number])}
        min={2010}
        max={2025}
        step={1}
        label="Year"
        showValue={showValue}
        formatValue={(v) => String(v)}
      />
    </div>
  );
};
