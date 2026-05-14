"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
} from "motion/react";

import { cn } from "@workspace/ui/lib/utils";

export type SideBySideSlideProps = {
  /** Source URL for the "before" image (left / top). */
  beforeImage: string;
  /** Source URL for the "after" image (right / bottom). */
  afterImage: string;
  /** Alt text for the before image. */
  beforeAlt?: string;
  /** Alt text for the after image. */
  afterAlt?: string;
  /** Divider direction. */
  orientation?: "horizontal" | "vertical";
  /** Initial divider position as a percentage (0–100). */
  initialPosition?: number;
  /** CSS color of the divider line. */
  dividerColor?: string;
  /** Width (or height for vertical) of the divider in px. */
  dividerWidth?: number;
  /** Box-shadow applied to the divider. */
  dividerShadow?: string;
  /** Whether to show the circular handle on the divider. */
  showHandle?: boolean;
  /** Diameter of the handle circle in px. */
  handleSize?: number;
  /** Background color of the handle. */
  handleColor?: string;
  /** Cursor style when hovering over the component. */
  cursor?: "none" | "col-resize" | "row-resize" | "pointer";
  /** Spring configuration for the divider animation. */
  springOptions?: SpringOptions;
  /** Extra CSS classes on the root container. */
  className?: string;
};

export function SideBySideSlide({
  beforeImage,
  afterImage,
  beforeAlt = "Before",
  afterAlt = "After",
  orientation = "horizontal",
  initialPosition = 50,
  dividerColor = "white",
  dividerWidth = 2,
  dividerShadow = "0 0 8px rgba(0,0,0,0.3)",
  showHandle = true,
  handleSize = 40,
  handleColor = "white",
  cursor = "none",
  springOptions = { stiffness: 300, damping: 30 },
  className,
}: SideBySideSlideProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isHorizontal = orientation === "horizontal";

  const raw = useMotionValue(initialPosition);
  const position = useSpring(raw, springOptions);

  const clipPath = useTransform(position, (v) =>
    isHorizontal ? `inset(0 ${100 - v}% 0 0)` : `inset(0 0 ${100 - v}% 0)`,
  );

  const dividerPos = useTransform(position, (v) => `${v}%`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const pct = isHorizontal
      ? ((e.clientX - rect.left) / rect.width) * 100
      : ((e.clientY - rect.top) / rect.height) * 100;
    raw.set(Math.max(0, Math.min(100, pct)));
  };

  const handleMouseLeave = () => {
    raw.set(initialPosition);
  };

  return (
    <div
      ref={ref}
      className={cn("relative select-none overflow-hidden", className)}
      style={{ cursor }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* After image (bottom layer — in flow to give the container intrinsic height) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterImage}
        alt={afterAlt}
        draggable={false}
        className="block h-full w-full object-cover"
      />

      {/* Before image (clipped top layer) */}
      <motion.div className="absolute inset-0" style={{ clipPath }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeImage}
          alt={beforeAlt}
          draggable={false}
          className="block h-full w-full object-cover"
        />
      </motion.div>

      {/* Divider line */}
      <motion.div
        className="absolute"
        style={
          isHorizontal
            ? {
                left: dividerPos,
                top: 0,
                bottom: 0,
                width: dividerWidth,
                x: "-50%",
                backgroundColor: dividerColor,
                boxShadow: dividerShadow,
              }
            : {
                top: dividerPos,
                left: 0,
                right: 0,
                height: dividerWidth,
                y: "-50%",
                backgroundColor: dividerColor,
                boxShadow: dividerShadow,
              }
        }
      >
        {/* Handle */}
        {showHandle && (
          <div
            className="absolute rounded-full flex items-center justify-center"
            style={
              isHorizontal
                ? {
                    width: handleSize,
                    height: handleSize,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: handleColor,
                    boxShadow: dividerShadow,
                  }
                : {
                    width: handleSize,
                    height: handleSize,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: handleColor,
                    boxShadow: dividerShadow,
                  }
            }
          ></div>
        )}
      </motion.div>
    </div>
  );
}
