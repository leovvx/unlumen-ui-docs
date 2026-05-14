"use client";

import {
  NextjsShip,
  type NextjsShipProps,
} from "@/registry/primitives/unlumen/nextjs-ship";

type NextjsShipDemoProps = Pick<
  NextjsShipProps,
  "duration" | "stagger" | "traceOpacity" | "traceWidth" | "traceColor"
>;

const NextjsShipDemo = ({
  duration = 2,
  stagger = 0.2,
  traceOpacity = 0.2,
  traceWidth = 2,
  traceColor = "#2EB9DF",
}: NextjsShipDemoProps) => {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center">
      <NextjsShip
        duration={duration}
        stagger={stagger}
        traceOpacity={traceOpacity}
        traceWidth={traceWidth}
        traceColor={traceColor}
      />
    </div>
  );
};

export default NextjsShipDemo;
export { NextjsShipDemo };
