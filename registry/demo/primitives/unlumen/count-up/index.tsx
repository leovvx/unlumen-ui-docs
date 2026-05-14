"use client";

import {
  CountUp,
  type DigitEffect,
} from "@/registry/primitives/unlumen/count-up";

interface CountUpDemoProps {
  duration: number;
  separator: string;
  digitEffect: DigitEffect;
}

export default function CountUpDemo({
  duration = 2,
  separator = ",",
  digitEffect = "none",
}: CountUpDemoProps) {
  return (
    <div className="flex flex-wrap gap-12 items-end justify-center p-8">
      <div className="flex flex-col items-center gap-1">
        <CountUp
          to={1000000}
          duration={duration}
          separator={separator}
          digitEffect={digitEffect}
          className="text-5xl font-bold tabular-nums tracking-tight"
        />
        <span className="text-xs text-muted-foreground">users</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <CountUp
          to={99.9}
          duration={duration}
          digitEffect={digitEffect}
          className="text-5xl font-bold tabular-nums tracking-tight"
        />
        <span className="text-xs text-muted-foreground">uptime %</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <CountUp
          to={0}
          from={5}
          direction="down"
          duration={duration}
          separator={separator}
          digitEffect={digitEffect}
          className="text-5xl font-bold tabular-nums tracking-tight"
        />
        <span className="text-xs text-muted-foreground">issues</span>
      </div>
    </div>
  );
}
