"use client";

import { motion } from "motion/react";

const LINE_DELAY_STEP = 0.02;
const LINE_STEP = 5; // 2px line + 3px gap

const LINE_TRAVEL: Record<number, number> = {
  0: LINE_STEP,
  1: LINE_STEP,
  2: -LINE_STEP * 2,
};

export interface ListViewIconProps {
  /** Whether the icon is in its active (animated) state. */
  isActive: boolean;
  /** Extra classes applied to the root element. */
  className?: string;
}

export function ListViewIcon({ isActive, className }: ListViewIconProps) {
  return (
    <motion.span
      className={`inline-flex h-4 w-4 flex-col items-center justify-center gap-[3px] ${className ?? ""}`}
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-[2px] w-3 rounded-full bg-current"
          animate={
            isActive
              ? { y: LINE_TRAVEL[i], opacity: [0.55, 1, 1] }
              : { y: 0, opacity: 0.9 }
          }
          transition={{
            duration: 0.36,
            delay: i === 0 ? 0 : i * LINE_DELAY_STEP,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.span>
  );
}
