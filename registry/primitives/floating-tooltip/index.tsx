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
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

const floatingTooltipVariants = cva("ml-4 mt-4 font-medium", {
  variants: {
    variant: {
      default: "bg-primary text-background dark:bg-white",
      outline: "border border-border bg-background text-foreground shadow-none",
    },
    size: {
      md: "rounded-md px-3.5 py-2.5 text-sm",
      lg: "rounded-lg px-5 py-4 text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

interface TooltipContextType {
  setContent: (
    content: string,
    description?: string,
    contentClassName?: string,
    descriptionClassName?: string,
  ) => void;
  setIsActive: (active: boolean) => void;
}

const TooltipContext = createContext<TooltipContextType | null>(null);

export function FloatingTooltipProvider({
  children,
  className,
  variant,
  size,
}: {
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof floatingTooltipVariants>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 45, stiffness: 750 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const velocityX = useVelocity(smoothX);
  const velocityY = useVelocity(smoothY);

  const scaleX = useTransform(velocityX, [-1000, 0, 1000], [0.9, 1, 1.15]);
  const scaleY = useTransform(velocityY, [-1000, 0, 1000], [1.15, 1, 0.9]);

  const skewX = useTransform(velocityX, [-1000, 0, 1000], [-3, 0, 3]);
  const skewY = useTransform(velocityY, [-1000, 0, 1000], [-3, 0, 3]);

  const [isActive, setIsActive] = useState(false);
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [contentClassName, setContentClassName] = useState("");
  const [descriptionClassName, setDescriptionClassName] = useState("");
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

  const handleSetContent = (
    newContent: string,
    newDescription?: string,
    newContentClassName?: string,
    newDescriptionClassName?: string,
  ) => {
    setContent(newContent);
    setDescription(newDescription || "");
    setContentClassName(newContentClassName || "");
    setDescriptionClassName(newDescriptionClassName || "");
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
                    floatingTooltipVariants({ variant, size }),
                    className,
                  )}
                  style={{
                    scaleX,
                    scaleY,
                    skewX,
                    skewY,
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
                    <span
                      className={cn(
                        "whitespace-nowrap font-semibold",
                        contentClassName,
                      )}
                    >
                      {content}
                    </span>
                    {description && (
                      <span
                        className={cn(
                          "max-w-[28ch] whitespace-normal text-sm leading-snug font-normal opacity-70",
                          descriptionClassName,
                        )}
                      >
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
  contentClassName,
  descriptionClassName,
}: {
  children: React.ReactNode;
  content: string;
  description?: string;
  contentClassName?: string;
  descriptionClassName?: string;
}) {
  const context = useContext(TooltipContext);

  if (!context) {
    throw new Error(
      "FloatingTooltipTrigger must be used within FloatingTooltipProvider",
    );
  }

  const { setContent, setIsActive } = context;

  const handleMouseEnter = () => {
    setContent(content, description, contentClassName, descriptionClassName);
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
