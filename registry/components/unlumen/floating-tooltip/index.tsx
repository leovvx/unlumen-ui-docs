"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
} from "motion/react";

import { cn } from "@workspace/ui/lib/utils";

interface TooltipContextType {
  setContent: (content: string, description?: string) => void;
  setIsActive: (active: boolean) => void;
}

const TooltipContext = createContext<TooltipContextType | null>(null);

export function FloatingTooltipProvider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const velocityX = useVelocity(smoothX);
  const velocityY = useVelocity(smoothY);

  const scaleX = useTransform(velocityX, [-1000, 0, 1000], [0.9, 1, 1.15]);
  const scaleY = useTransform(velocityY, [-1000, 0, 1000], [1.15, 1, 0.9]);

  const skewX = useTransform(velocityX, [-1000, 0, 1000], [-3, 0, 3]);
  const skewY = useTransform(velocityY, [-1000, 0, 1000], [-3, 0, 3]);

  const borderRadius = useTransform([velocityX, velocityY], ([vx, vy]) => {
    const velocity = Math.sqrt((vx as number) ** 2 + (vy as number) ** 2);
    const radius = 8 + Math.min(velocity / 80, 16);
    return `${radius}px`;
  });

  const [isActive, setIsActive] = useState(false);
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    if (typeof window === "undefined") return;

    const getZoom = () => {
      const htmlElement = document.documentElement;
      const computedZoom = window.getComputedStyle(htmlElement).zoom;
      return computedZoom ? parseFloat(computedZoom) : 1;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const zoom = getZoom();
      x.set(e.clientX / zoom);
      y.set(e.clientY / zoom);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [x, y]);

  const handleSetContent = (newContent: string, newDescription?: string) => {
    setContent(newContent);
    setDescription(newDescription || "");
  };

  return (
    <TooltipContext.Provider
      value={{ setContent: handleSetContent, setIsActive }}
    >
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isActive && content && (
              <motion.div
                className="pointer-events-none fixed z-50"
                style={{
                  top: smoothY,
                  left: smoothX,
                }}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                }}
                transition={{
                  duration: 0.15,
                  ease: "easeOut",
                }}
              >
                <motion.div
                  layout
                  className={cn(
                    "ml-4 mt-4 bg-primary dark:bg-white px-4 py-3 text-sm font-medium text-background shadow-lg",
                    className,
                  )}
                  style={{
                    scaleX,
                    scaleY,
                    skewX,
                    skewY,
                    borderRadius,
                  }}
                  transition={{
                    layout: {
                      type: "spring",
                      damping: 25,
                      stiffness: 400,
                    },
                  }}
                >
                  <motion.div
                    key={content}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-1"
                  >
                    <span className="whitespace-nowrap font-semibold">
                      {content}
                    </span>
                    {description && (
                      <span className="max-w-[28ch] whitespace-normal text-sm leading-snug opacity-70 font-normal">
                        {description}
                      </span>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </TooltipContext.Provider>
  );
}

export function FloatingTooltipTrigger({
  children,
  content,
  description,
}: {
  children: React.ReactNode;
  content: string;
  description?: string;
}) {
  const context = useContext(TooltipContext);

  if (!context) {
    throw new Error(
      "FloatingTooltipTrigger must be used within FloatingTooltipProvider",
    );
  }

  const { setContent, setIsActive } = context;

  const handleMouseEnter = () => {
    setContent(content, description);
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );
}

export const FloatingTooltip = {
  Provider: FloatingTooltipProvider,
  Trigger: FloatingTooltipTrigger,
};
