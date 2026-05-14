"use client";

import {
  AuroraBars,
  type AuroraBarsProps,
} from "@/registry/primitives/unlumen/aurora-bars";

type AuroraBarsDemo = Pick<
  AuroraBarsProps,
  "barCount" | "speed" | "gap" | "blur" | "maxHeightRatio" | "minHeightRatio"
>;

export const AuroraBarsDemo = ({
  barCount = 24,
  speed = 0.5,
  gap = 3,
  blur = 18,
  maxHeightRatio = 0.92,
  minHeightRatio = 0.18,
}: AuroraBarsDemo) => {
  return (
    <AuroraBars
      barCount={barCount}
      speed={speed}
      gap={gap}
      blur={blur}
      maxHeightRatio={maxHeightRatio}
      minHeightRatio={minHeightRatio}
      className="w-full h-full"
    />
  );
};
