"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { forwardRef, useEffect, useId, useRef, useState } from "react";
import { cn } from "@workspace/ui/lib/utils";

const switchSizes = {
  sm: {
    trackX: 46,
    trackY: 24,
    thumbX: 22,
    thumbY: 18,
    padding: 3,
  },
  md: {
    trackX: 62,
    trackY: 30,
    thumbX: 32,
    thumbY: 24,
    padding: 4,
  },
  lg: {
    trackX: 74,
    trackY: 36,
    thumbX: 34,
    thumbY: 28,
    padding: 5,
  },
} as const;

const switchTones = {
  neutral: {
    off: "color-mix(in srgb, var(--muted) 82%, transparent)",
    on: "#34c759",
    thumb: "#ffffff",
    glow: "color-mix(in srgb, #34c759 32%, transparent)",
  },
  accent: {
    off: "color-mix(in srgb, var(--muted) 82%, transparent)",
    on: "var(--foreground)",
    thumb: "#ffffff",
    glow: "color-mix(in srgb, var(--accent) 42%, transparent)",
  },
} as const;

const thumbSpring = {
  stiffness: 700,
  damping: 48,
  mass: 0.55,
};

const grabSpring = {
  stiffness: 500,
  damping: 25,
};

interface AppleSwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "role"
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** @default "md" */
  size?: keyof typeof switchSizes;
  /** @default "neutral" */
  tone?: keyof typeof switchTones;
  /** @default "right" */
  labelSide?: "left" | "right";
}

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const AppleSwitch = forwardRef<HTMLButtonElement, AppleSwitchProps>(
  (
    {
      checked,
      onCheckedChange,
      label,
      description,
      size = "md",
      tone = "neutral",
      labelSide = "right",
      className,
      style,
      disabled,
      defaultChecked,
      id,
      type = "button",
      onClick,
      onPointerCancel,
      onPointerDown,
      onPointerLeave,
      onPointerMove,
      onPointerUp,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const switchId = id ?? generatedId;
    const [uncontrolledChecked, setUncontrolledChecked] = useState(
      Boolean(defaultChecked),
    );
    const currentChecked = checked ?? uncontrolledChecked;
    const metrics = switchSizes[size];
    const colors = switchTones[tone];
    const thumbTravel = metrics.trackX - metrics.thumbX - metrics.padding * 2;
    const targetX = useMotionValue(currentChecked ? thumbTravel : 0);
    const thumbX = useSpring(targetX, thumbSpring);
    const grabTarget = useMotionValue(0);
    const grabProgress = useSpring(grabTarget, grabSpring);
    const thumbWidth = useTransform(
      grabProgress,
      [0, 1],
      [metrics.thumbX, metrics.thumbX + metrics.padding * 4.5],
    );
    const thumbHeight = useTransform(
      grabProgress,
      [0, 1],
      [metrics.thumbY, metrics.thumbY + metrics.padding * 2.3],
    );
    const thumbOffsetX = useTransform(
      () => thumbX.get() - (thumbWidth.get() - metrics.thumbX) / 2,
    );
    const liquidOpacity = useTransform(grabProgress, [0, 1], [0, 0.76]);
    const liquidScale = useTransform(grabProgress, [0, 1], [0.82, 1.08]);
    const thumbOpacity = useTransform(grabProgress, [0, 1], [1, 0.2]);
    const dragStartX = useRef(0);
    const dragStartThumbX = useRef(0);
    const isDragging = useRef(false);
    const activePointerId = useRef<number | null>(null);
    const suppressNextClick = useRef(false);
    const activeProgress = useTransform(thumbX, [0, thumbTravel], [0, 1]);
    const fillOpacity = useTransform(activeProgress, [0, 1], [0, 1]);
    const glowOpacity = useTransform(
      activeProgress,
      [0, 0.7, 1],
      [0, 0.18, 0.2],
    );
    const glowScale = useTransform(activeProgress, [0, 1], [0.82, 1]);

    useEffect(() => {
      if (activePointerId.current !== null) return;
      targetX.set(currentChecked ? thumbTravel : 0);
    }, [currentChecked, thumbTravel, targetX]);

    const setChecked = (next: boolean) => {
      if (next === currentChecked) {
        targetX.set(next ? thumbTravel : 0);
        return;
      }

      if (checked === undefined) {
        setUncontrolledChecked(next);
      }

      targetX.set(next ? thumbTravel : 0);
      onCheckedChange?.(next);
    };

    const handlePointerDown = (
      event: React.PointerEvent<HTMLButtonElement>,
    ) => {
      onPointerDown?.(event);
      if (event.defaultPrevented || disabled) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      activePointerId.current = event.pointerId;
      grabTarget.set(1);
      dragStartX.current = event.clientX;
      dragStartThumbX.current = thumbX.get();
      targetX.set(dragStartThumbX.current);
      isDragging.current = false;
    };

    const handlePointerMove = (
      event: React.PointerEvent<HTMLButtonElement>,
    ) => {
      onPointerMove?.(event);
      if (event.defaultPrevented || disabled) return;
      if (
        activePointerId.current !== null &&
        event.pointerId !== activePointerId.current
      ) {
        return;
      }
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

      const deltaX = event.clientX - dragStartX.current;

      if (Math.abs(deltaX) > 3) {
        isDragging.current = true;
      }

      if (!isDragging.current) return;
      event.preventDefault();

      const nextX = dragStartThumbX.current + deltaX;
      targetX.set(clamp(nextX, 0, thumbTravel));
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerUp?.(event);
      if (
        activePointerId.current !== null &&
        event.pointerId !== activePointerId.current
      ) {
        return;
      }
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      activePointerId.current = null;
      grabTarget.set(0);

      if (!isDragging.current) return;

      isDragging.current = false;
      suppressNextClick.current = true;
      setChecked(targetX.get() >= thumbTravel / 2);
    };

    const handlePointerCancel = (
      event: React.PointerEvent<HTMLButtonElement>,
    ) => {
      onPointerCancel?.(event);
      activePointerId.current = null;
      isDragging.current = false;
      grabTarget.set(0);
      targetX.set(currentChecked ? thumbTravel : 0);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || disabled) return;

      if (suppressNextClick.current) {
        suppressNextClick.current = false;
        event.preventDefault();
        return;
      }

      setChecked(!currentChecked);
    };

    useEffect(() => {
      const stopFromWindow = () => {
        if (!isDragging.current && activePointerId.current === null) return;
        const wasDragging = isDragging.current;
        isDragging.current = false;
        activePointerId.current = null;
        grabTarget.set(0);
        if (!wasDragging) return;
        suppressNextClick.current = true;
        setChecked(targetX.get() >= thumbTravel / 2);
      };

      window.addEventListener("pointerup", stopFromWindow);
      window.addEventListener("pointercancel", stopFromWindow);
      window.addEventListener("blur", stopFromWindow);

      return () => {
        window.removeEventListener("pointerup", stopFromWindow);
        window.removeEventListener("pointercancel", stopFromWindow);
        window.removeEventListener("blur", stopFromWindow);
      };
    });

    const switchEl = (
      <button
        id={switchId}
        ref={ref}
        type={type}
        role="switch"
        aria-checked={currentChecked}
        disabled={disabled}
        onClick={handleClick}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
        }}
        aria-label={typeof label === "string" ? label : props["aria-label"]}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer items-center rounded-full active:cursor-grabbing",
          "border border-white/35 bg-white/10 shadow-inner backdrop-blur-md",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-45",
          className,
        )}
        style={{
          width: metrics.trackX,
          height: metrics.trackY,
          touchAction: "pan-y",
          ...style,
        }}
        {...props}
      >
        <motion.span
          className="pointer-events-none absolute -inset-1 rounded-full blur-md"
          style={{
            backgroundColor: colors.glow,
            opacity: glowOpacity,
            scale: glowScale,
          }}
        />

        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: colors.off,
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.34), inset 0 -1px 2px rgba(0,0,0,0.08)",
            }}
          />

          <motion.span
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: colors.on,
              opacity: fillOpacity,
            }}
          />
        </span>

        <motion.span
          className="pointer-events-none absolute left-0 z-[9] block rounded-full"
          style={{
            width: thumbWidth,
            height: thumbHeight,
            x: thumbOffsetX,
            top: "50%",
            y: "-50%",
            marginLeft: metrics.padding,
            background:
              "color-mix(in srgb, var(--background) 82%, transparent)",
            opacity: liquidOpacity,
            scale: liquidScale,
            filter: "blur(9px)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        />

        <motion.span
          className="pointer-events-none z-10 block rounded-full"
          style={{
            width: thumbWidth,
            height: thumbHeight,
            x: thumbOffsetX,
            marginLeft: metrics.padding,
            backgroundColor: colors.thumb,
            opacity: thumbOpacity,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow:
              "0 3px 11px rgba(0,0,0,0.24), 0 1px 1px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.78), inset 0 -1px 1px rgba(0,0,0,0.05)",
          }}
        />
      </button>
    );

    if (!label) return switchEl;

    return (
      <label
        htmlFor={switchId}
        className={cn(
          "inline-flex cursor-pointer select-none items-center gap-3",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {labelSide === "left" && (
          <span className="flex flex-col gap-0.5 text-right">
            <span className="text-sm font-medium text-foreground">{label}</span>
            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </span>
        )}
        {switchEl}
        {labelSide === "right" && (
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">{label}</span>
            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );
  },
);

AppleSwitch.displayName = "AppleSwitch";

export { AppleSwitch, type AppleSwitchProps };
