"use client";

import { motion } from "motion/react";

const COMPACT_DELAY_STEP = 0.018;

// Active permutation: B C F / A D E (indices in a 3×2 grid 0-5)
const ACTIVE_ORDER = [1, 2, 5, 0, 3, 4];
const DEFAULT_ORDER = [0, 1, 2, 3, 4, 5];

export interface CompactViewIconProps {
  /** Whether the icon is in its active (animated) state. */
  isActive: boolean;
  /** Extra classes applied to the root element. */
  className?: string;
}

export function CompactViewIcon({ isActive, className }: CompactViewIconProps) {
  const order = isActive ? ACTIVE_ORDER : DEFAULT_ORDER;

  return (
    <motion.span
      className={`inline-grid h-4 w-4 place-content-center grid-cols-3 gap-[2px] ${className ?? ""}`}
      aria-hidden="true"
    >
      {order.map((id, i) => (
        <motion.span
          key={id}
          layout
          className="size-[3px] rounded-[1px] bg-current"
          animate={isActive ? { opacity: [0.65, 1, 1] } : { opacity: 1 }}
          transition={{
            duration: 0.42,
            delay: i === 0 ? 0 : i * COMPACT_DELAY_STEP,
            ease: "easeOut",
            layout: {
              duration: 0.45,
              delay: i === 0 ? 0 : i * COMPACT_DELAY_STEP,
              ease: "easeInOut",
            },
          }}
        />
      ))}
    </motion.span>
  );
}
