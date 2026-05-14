"use client";

import * as React from "react";
import { motion, type Transition } from "motion/react";

import { type VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@workspace/ui/components/ui/button";
import { cn } from "@workspace/ui/lib/utils";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

type GlowMode =
  | "rotate"
  | "pulse"
  | "breathe"
  | "colorShift"
  | "flowHorizontal"
  | "static";

type GlowBlur =
  | number
  | "softest"
  | "soft"
  | "medium"
  | "strong"
  | "stronger"
  | "strongest"
  | "none";

const BLUR_PRESETS: Record<string, string> = {
  softest: "blur-xs",
  soft: "blur-sm",
  medium: "blur-md",
  strong: "blur-lg",
  stronger: "blur-xl",
  strongest: "blur-2xl",
  none: "blur-none",
};

function blurClass(blur: GlowBlur) {
  if (typeof blur === "number") return `blur-[${blur}px]`;
  return BLUR_PRESETS[blur] ?? "blur-md";
}

interface GlowEffectInnerProps {
  colors?: string[];
  mode?: GlowMode;
  blur?: GlowBlur;
  scale?: number;
  duration?: number;
  transition?: Transition;
  className?: string;
}

function GlowEffectLayer({
  colors = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F"],
  mode = "rotate",
  blur = "strong",
  scale = 1,
  duration = 5,
  transition,
  className,
}: GlowEffectInnerProps) {
  const base: Transition = { repeat: Infinity, duration, ease: "linear" };

  const animations: Record<GlowMode, object> = {
    rotate: {
      background: [
        `conic-gradient(from 0deg at 50% 50%, ${colors.join(", ")})`,
        `conic-gradient(from 360deg at 50% 50%, ${colors.join(", ")})`,
      ],
      transition: transition ?? base,
    },
    pulse: {
      background: colors.map(
        (c) => `radial-gradient(circle at 50% 50%, ${c} 0%, transparent 100%)`,
      ),
      scale: [scale, scale * 1.1, scale],
      opacity: [0.5, 0.8, 0.5],
      transition: transition ?? { ...base, repeatType: "mirror" },
    },
    breathe: {
      background: colors.map(
        (c) => `radial-gradient(circle at 50% 50%, ${c} 0%, transparent 100%)`,
      ),
      scale: [scale, scale * 1.05, scale],
      transition: transition ?? { ...base, repeatType: "mirror" },
    },
    colorShift: {
      background: colors.map((c, i) => {
        const next = colors[(i + 1) % colors.length];
        return `conic-gradient(from 0deg at 50% 50%, ${c} 0%, ${next} 50%, ${c} 100%)`;
      }),
      transition: transition ?? { ...base, repeatType: "mirror" },
    },
    flowHorizontal: {
      background: colors.map((c, i) => {
        const next = colors[(i + 1) % colors.length];
        return `linear-gradient(to right, ${c}, ${next})`;
      }),
      transition: transition ?? { ...base, repeatType: "mirror" },
    },
    static: {
      background: `linear-gradient(to right, ${colors.join(", ")})`,
    },
  };

  return (
    <motion.div
      animate={animations[mode] as any}
      style={
        { "--scale": scale, willChange: "transform" } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        "scale-[var(--scale)] transform-gpu",
        blurClass(blur),
        className,
      )}
    />
  );
}

export interface GlowButtonProps extends ButtonProps {
  /**
   * Glow animation mode.
   * @default "rotate"
   */
  mode?: GlowMode;
  /**
   * Glow colours (at least 2 for interesting effects).
   * @default ["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]
   */
  colors?: string[];
  /**
   * Blur strength of the glow layer.
   * @default "strong"
   */
  blur?: GlowBlur;
  /**
   * Duration of one animation cycle in seconds.
   * @default 5
   */
  duration?: number;
  /**
   * Scale of the glow layer relative to the button.
   * Values > 1 spread the glow beyond the button edges.
   * @default 1
   */
  glowScale?: number;
  /** Extra classes applied to the outer wrapper. */
  wrapperClassName?: string;
}

export function GlowButton({
  mode = "rotate",
  colors = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F"],
  blur = "strong",
  duration = 5,
  glowScale = 1,
  children,
  className,
  wrapperClassName,
  disabled,
  variant,
  size,
  asChild,
  ...props
}: GlowButtonProps) {
  return (
    <motion.div
      className={cn(
        "relative inline-flex",
        disabled && "pointer-events-none opacity-50",
        wrapperClassName,
      )}
      whileHover="hovered"
      initial="idle"
    >
      <motion.div
        className="absolute inset-0"
        variants={{
          idle: { scale: glowScale },
          hovered: { scale: glowScale * 1.05 },
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      >
        <GlowEffectLayer
          colors={colors}
          mode={mode}
          blur={blur}
          duration={duration}
          scale={1}
        />
      </motion.div>
      <Button
        variant={variant}
        size={size}
        asChild={asChild}
        disabled={disabled}
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
