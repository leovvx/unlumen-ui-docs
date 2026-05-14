"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@workspace/ui/lib/utils";

export interface CursorImageTrailProps {
  items: React.ReactNode[];
  /** Size of each trail item in px. @default 120 */
  itemSize?: number;
  /** Max simultaneous items in the trail. @default 8 */
  trailLength?: number;
  /** Minimum cursor travel (px) before spawning a new item. @default 80 */
  spawnDistance?: number;
  /** Max random rotation applied to each item in degrees. @default 20 */
  rotationRange?: number;
  /** Render target — defaults to the whole window. */
  containerRef?: React.RefObject<HTMLElement>;
  className?: string;
  children?: React.ReactNode;
}

interface TrailItem {
  id: number;
  x: number;
  y: number;
  rotation: number;
  itemIndex: number;
}

let _id = 0;
const nextId = () => ++_id;

export function CursorImageTrail({
  items,
  itemSize = 120,
  trailLength = 8,
  spawnDistance = 80,
  rotationRange = 20,
  containerRef,
  className,
  children,
}: CursorImageTrailProps) {
  const [trail, setTrail] = React.useState<TrailItem[]>([]);
  const lastPos = React.useRef<{ x: number; y: number } | null>(null);
  const itemCounter = React.useRef(0);
  const containerElRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = containerRef?.current ?? containerElRef.current ?? window;

    const onLeave = () => setTrail([]);

    const onMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect =
        containerRef?.current?.getBoundingClientRect() ??
        containerElRef.current?.getBoundingClientRect();

      const x = rect ? mouseEvent.clientX - rect.left : mouseEvent.clientX;
      const y = rect ? mouseEvent.clientY - rect.top : mouseEvent.clientY;

      if (lastPos.current) {
        const dx = x - lastPos.current.x;
        const dy = y - lastPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < spawnDistance) return;
      }

      lastPos.current = { x, y };

      const rotation = (Math.random() * 2 - 1) * rotationRange;
      const itemIndex = itemCounter.current % items.length;
      itemCounter.current += 1;

      setTrail((prev) => {
        const next = [...prev, { id: nextId(), x, y, rotation, itemIndex }];
        return next.slice(-trailLength);
      });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [items, spawnDistance, rotationRange, trailLength, containerRef]);

  const total = trail.length;

  return (
    <div
      ref={containerElRef}
      className={cn("relative overflow-hidden", className)}
    >
      {children}

      <AnimatePresence>
        {trail.map((item, i) => {
          const age = total - 1 - i;
          const scale = 0.6 + 0.4 * (1 - age / trailLength);

          return (
            <motion.div
              key={item.id}
              className="pointer-events-none absolute select-none"
              style={{
                left: item.x,
                top: item.y,
                width: itemSize,
                x: "-50%",
                y: "-50%",
                zIndex: i,
              }}
              initial={{
                opacity: 0,
                scale: 0.5,
                rotate: item.rotation * 1.5,
              }}
              animate={{
                opacity: 1,
                scale,
                rotate: item.rotation,
              }}
              exit={{
                opacity: 0,
                scale: 0.3,
                rotate: item.rotation * 0.5,
                filter: "blur(4px)",
              }}
              transition={{
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <div className="w-full [&>svg]:h-auto [&>svg]:w-full [&>img]:h-auto [&>img]:w-full">
                {items[item.itemIndex]}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
