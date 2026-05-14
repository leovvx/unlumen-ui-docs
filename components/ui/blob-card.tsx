"use client";

import * as React from "react";
import { FluidBlobs } from "@/components/ui/FluidBlobs";
import { GlowEffect } from "@/components/ui/glow-effect";
import { cn } from "@workspace/ui/lib/utils";

export interface BlobCardProps {
  /** Content rendered inside the blob header area */
  header?: React.ReactNode;
  /** Content rendered below the blob header */
  children?: React.ReactNode;
  /** Height of the blob header section (default: 224px) */
  headerHeight?: number;
  /** Colors for the fluid blobs in light mode */
  lightColors?: string[];
  /** Colors for the fluid blobs in dark mode */
  darkColors?: string[];
  /** Colors for the animated glow border */
  glowColors?: string[];
  /** Extra className on the outer wrapper */
  className?: string;
}

const DEFAULT_LIGHT = ["#ff0020", "#fc0f60", "#e8227a", "#ff85b3"];
const DEFAULT_DARK = ["#8c0f60", "#e8227a", "#e8227a", "#ff85b3"];
const DEFAULT_GLOW = ["#ffffff", "#e8b4f0", "#ffb3c6", "#d44d8a", "#ff96a9"];

export function BlobCard({
  header,
  children,
  headerHeight = 224,
  lightColors = DEFAULT_LIGHT,
  darkColors = DEFAULT_DARK,
  glowColors = DEFAULT_GLOW,
  className,
}: BlobCardProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="absolute -inset-[1.5px] overflow-hidden rounded-[21.5px] z-0">
        <GlowEffect
          colors={glowColors}
          mode="rotate"
          blur="strongest"
          duration={5}
          scale={1}
        />
      </div>

      <div className="relative z-10 overflow-hidden rounded-[20px] bg-surface">
        <div
          className="relative overflow-hidden rounded-t-[20px]"
          style={{ height: headerHeight }}
        >
          <FluidBlobs
            lightColors={lightColors}
            darkColors={darkColors}
            origins={[
              { x: 50, y: -55 },
              { x: 50, y: -25 },
              { x: 50, y: -25 },
              { x: 50, y: -25 },
            ]}
            margin={60}
            blur={50}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface" />

          {header && <div className="relative z-10 p-8 pb-0">{header}</div>}
        </div>

        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
