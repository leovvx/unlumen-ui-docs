"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@workspace/ui/lib/utils";

export const ANIMATE_COUNT_DURATION_MS = 450;

const EASING = [0.23, 0.88, 0.26, 0.92] as const;

interface AnimateCountProps {
  children: number;
  animate?: boolean;
  className?: string;
}

function AnimateCount({
  children: count,
  animate = true,
  className,
}: AnimateCountProps) {
  const [prev, setPrev] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(count);

  useEffect(() => {
    if (animate) setPrev(displayCount);
    setDisplayCount(count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, animate]);

  return (
    <div
      className={cn(
        "grid place-items-center tabular-nums tracking-tight",
        "[&>*]:col-start-1 [&>*]:row-start-1",
        className,
      )}
    >
      <AnimatePresence initial={false}>
        {animate && prev !== null && prev !== displayCount && (
          <motion.div
            key={`exit-${prev}-${displayCount}`}
            aria-hidden
            initial={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            animate={{ opacity: 0, filter: "blur(2px)", y: -12 }}
            transition={{
              duration: ANIMATE_COUNT_DURATION_MS / 1000,
              ease: EASING,
            }}
            onAnimationComplete={() => setPrev(null)}
          >
            {prev}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        key={`enter-${displayCount}`}
        initial={animate ? { opacity: 0, filter: "blur(2px)", y: 8 } : false}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{
          duration: ANIMATE_COUNT_DURATION_MS / 1000,
          ease: EASING,
        }}
      >
        {displayCount}
      </motion.div>
    </div>
  );
}

export { AnimateCount, type AnimateCountProps };
