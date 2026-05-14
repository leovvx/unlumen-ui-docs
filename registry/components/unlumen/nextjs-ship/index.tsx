"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@workspace/ui/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface TraceConfig {
  /** SVG path `d` attribute */
  path: string;
  /** Direction the gradient pulse travels along the path */
  direction: "left" | "right" | "up" | "down";
  /**
   * Bounding box [x0, y0, x1, y1] of the path in SVG user-space coords.
   * Used to place the gradient start/end entirely outside the path so
   * the infinite-repeat reset jump is invisible.
   */
  bbox: [number, number, number, number];
}

export interface NextjsShipProps {
  /** Text displayed inside the central chip.
   * @default "Powered By"
   */
  text?: string;
  /** Primary gradient pulse colour.
   * @default "#2EB9DF"
   */
  traceColor?: string;
  /** Secondary gradient pulse colour.
   * @default "#9E00FF"
   */
  traceSecondaryColor?: string;
  /** Opacity of the static (background) traces.
   * @default 0.2
   */
  traceOpacity?: number;
  /** Stroke width of the animated pulse.
   * @default 2
   */
  traceWidth?: number;
  /** Duration of one pulse cycle in seconds.
   * @default 2
   */
  duration?: number;
  /** Stagger delay between each trace animation in seconds.
   * @default 0.2
   */
  stagger?: number;
  /** Override the built-in trace paths. */
  traces?: TraceConfig[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Default trace paths — 7 non-overlapping PCB-style routes          */
/*  SVG: 600×400   Chip: x=[238,362], y=[158,242]                    */
/* ------------------------------------------------------------------ */

const DEFAULT_TRACES: TraceConfig[] = [
  // 1 — top-center (up)
  {
    path: "M 300 158 V 40 Q 300 25 315 25 H 355",
    direction: "up",
    bbox: [298, 25, 355, 158],
  },
  // 2 — left-top (left)
  {
    path: "M 238 182 H 130 Q 110 182 110 162 V 70 Q 110 50 90 50 H 20",
    direction: "left",
    bbox: [20, 50, 238, 182],
  },
  // 3 — left-bottom (left)
  {
    path: "M 238 218 H 100 Q 80 218 80 238 V 340 Q 80 360 60 360 H 20",
    direction: "left",
    bbox: [20, 218, 238, 360],
  },
  // 4 — right-top (right)
  {
    path: "M 362 182 H 470 Q 490 182 490 162 V 80 Q 490 60 510 60 H 580",
    direction: "right",
    bbox: [362, 60, 580, 182],
  },
  // 5 — right-bottom (right)
  {
    path: "M 362 218 H 500 Q 520 218 520 238 V 320 Q 520 340 540 340 H 580",
    direction: "right",
    bbox: [362, 218, 580, 340],
  },
  // 6 — bottom-left (down)
  {
    path: "M 275 242 V 340 Q 275 360 255 360 H 70 Q 50 360 50 380 V 395",
    direction: "down",
    bbox: [50, 242, 275, 395],
  },
  // 7 — bottom-right (down)
  {
    path: "M 325 242 V 300 Q 325 320 345 320 H 530 Q 550 320 550 340 V 395",
    direction: "down",
    bbox: [325, 242, 550, 395],
  },
];

/* ------------------------------------------------------------------ */
/*  Pin positions on chip edges (must match trace start points)       */
/* ------------------------------------------------------------------ */

const PINS = {
  top: [300],
  bottom: [275, 325],
  left: [182, 202],
  right: [182, 218],
};

/* ------------------------------------------------------------------ */
/*  Gradient coordinate helpers                                       */
/*                                                                    */
/*  Both `from` and `to` positions are entirely outside the path     */
/*  bounding box, so the infinite-repeat reset jump is invisible.    */
/* ------------------------------------------------------------------ */

type GradientCoords = { x1: number; y1: number; x2: number; y2: number };

function getGradientCoords(
  direction: TraceConfig["direction"],
  bbox: TraceConfig["bbox"],
): { from: GradientCoords; to: GradientCoords } {
  const [x0, y0, x1, y1] = bbox;
  const bw = x1 - x0;
  const bh = y1 - y0;

  switch (direction) {
    case "up":
      return {
        from: { x1: x1, y1: y1 + bh, x2: x0, y2: y1 },
        to: { x1: x1, y1: y0, x2: x0, y2: y0 - bh },
      };
    case "down":
      return {
        from: { x1: x0, y1: y0 - bh, x2: x1, y2: y0 },
        to: { x1: x0, y1: y1, x2: x1, y2: y1 + bh },
      };
    case "left":
      return {
        from: { x1: x1 + bw, y1: y0, x2: x1, y2: y1 },
        to: { x1: x0, y1: y0, x2: x0 - bw, y2: y1 },
      };
    case "right":
      return {
        from: { x1: x0 - bw, y1: y0, x2: x0, y2: y1 },
        to: { x1: x1, y1: y0, x2: x1 + bw, y2: y1 },
      };
  }
}

/* ------------------------------------------------------------------ */
/*  Single animated trace                                             */
/* ------------------------------------------------------------------ */

function AnimatedTrace({
  trace,
  index,
  traceColor,
  traceSecondaryColor,
  traceOpacity,
  traceWidth,
  duration,
  stagger,
  gradientId,
}: {
  trace: TraceConfig;
  index: number;
  traceColor: string;
  traceSecondaryColor: string;
  traceOpacity: number;
  traceWidth: number;
  duration: number;
  stagger: number;
  gradientId: string;
}) {
  const { from, to } = getGradientCoords(trace.direction, trace.bbox);

  return (
    <g>
      <defs>
        <motion.linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          initial={from}
          animate={to}
          transition={{
            duration,
            delay: index * stagger,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <stop stopColor={traceColor} stopOpacity="0" offset="0%" />
          <stop stopColor={traceColor} offset="30%" />
          <stop stopColor={traceSecondaryColor} offset="70%" />
          <stop stopColor={traceSecondaryColor} stopOpacity="0" offset="100%" />
        </motion.linearGradient>
      </defs>

      {/* Static background trace */}
      <path
        d={trace.path}
        stroke="currentColor"
        strokeOpacity={traceOpacity}
        strokeWidth={1}
        fill="none"
      />

      {/* Animated gradient trace */}
      <path
        d={trace.path}
        stroke={`url(#${gradientId})`}
        strokeWidth={traceWidth}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function NextjsShip({
  text = "Powered By",
  traceColor = "#2EB9DF",
  traceSecondaryColor = "#9E00FF",
  traceOpacity = 0.2,
  traceWidth = 2,
  duration = 2,
  stagger = 0.2,
  traces = DEFAULT_TRACES,
  className,
}: NextjsShipProps) {
  const id = React.useId().replace(/:/g, "");

  return (
    <div className={cn("relative w-full max-w-[600px]", className)}>
      <svg
        viewBox="0 0 600 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
      >
        {/* Animated traces */}
        {traces.map((trace, i) => (
          <AnimatedTrace
            key={i}
            trace={trace}
            index={i}
            traceColor={traceColor}
            traceSecondaryColor={traceSecondaryColor}
            traceOpacity={traceOpacity}
            traceWidth={traceWidth}
            duration={duration}
            stagger={stagger}
            gradientId={`pulse-${id}-${i}`}
          />
        ))}

        {/* Pin circles — top */}
        {PINS.top.map((x) => (
          <circle
            key={`t-${x}`}
            cx={x}
            cy={158}
            r={3}
            fill="currentColor"
            fillOpacity={0.25}
          />
        ))}
        {/* Pin circles — bottom */}
        {PINS.bottom.map((x) => (
          <circle
            key={`b-${x}`}
            cx={x}
            cy={212}
            r={3}
            fill="currentColor"
            fillOpacity={0.25}
          />
        ))}
        {/* Pin circles — left */}
        {PINS.left.map((y) => (
          <circle
            key={`l-${y}`}
            cx={238}
            cy={y}
            r={3}
            fill="currentColor"
            fillOpacity={0.25}
          />
        ))}
        {/* Pin circles — right */}
        {PINS.right.map((y) => (
          <circle
            key={`r-${y}`}
            cx={362}
            cy={y}
            r={3}
            fill="currentColor"
            fillOpacity={0.25}
          />
        ))}

        {/* Central chip body — foreignObject for HTML button */}
        <foreignObject x="238" y="158" width="124" height="54">
          <div
            className="flex h-full w-full items-center justify-center rounded-xl"
            style={{
              background:
                "linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span
              className="select-none text-base font-medium tracking-wide"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {text}
            </span>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
