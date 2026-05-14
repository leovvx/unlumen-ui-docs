"use client";

import { type HTMLAttributes } from "react";
import { motion } from "motion/react";
import { cn } from "@workspace/ui/lib/utils";

type GlowingBadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

interface GlowingBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: GlowingBadgeVariant;
  pulse?: boolean;
  dot?: boolean;
}

const variantStyles: Record<
  GlowingBadgeVariant,
  { badge: string; glow: string; dot: string }
> = {
  default: {
    badge: "bg-foreground text-background",
    glow: "bg-foreground/30",
    dot: "bg-background",
  },
  neutral: {
    badge: "bg-muted text-foreground border-muted",
    glow: "bg-foreground/30",
    dot: "bg-foreground",
  },
  success: {
    badge: "bg-emerald-500 text-emerald-100",
    glow: "bg-emerald-500",
    dot: "bg-emerald-200",
  },
  warning: {
    badge: "bg-amber-500 text-amber-100",
    glow: "bg-amber-500",
    dot: "bg-amber-200",
  },
  error: {
    badge: "bg-red-500 text-red-100",
    glow: "bg-red-500",
    dot: "bg-red-200",
  },
  info: {
    badge: "bg-blue-500 text-blue-100",
    glow: "bg-blue-500",
    dot: "bg-blue-200",
  },
};

function GlowingBadge({
  variant = "default",
  pulse = true,
  dot = true,
  children,
  className,
  ...props
}: GlowingBadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span className="relative inline-flex">
      <span
        className={cn(
          "absolute inset-0 rounded-full blur-md opacity-60",
          styles.glow,
        )}
      />
      <span
        className={cn(
          "relative inline-flex items-center gap-1.5 rounded-full  px-3 py-1 text-xs font-medium",
          styles.badge,
          className,
        )}
        {...props}
      >
        {dot && (
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            {pulse && (
              <motion.span
                className={cn(
                  "absolute inline-flex h-full w-full rounded-full opacity-75",
                  styles.dot,
                )}
                animate={{ scale: [1, 2.5, 1], opacity: [0.75, 0, 0.75] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
            <span
              className={cn(
                "relative inline-flex h-1.5 w-1.5 rounded-full",
                styles.dot,
              )}
            />
          </span>
        )}
        {children}
      </span>
    </span>
  );
}

export { GlowingBadge };
export type { GlowingBadgeProps, GlowingBadgeVariant };
