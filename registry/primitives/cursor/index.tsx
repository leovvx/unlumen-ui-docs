import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
} from "motion/react";

import {
  CursorProvider as CursorProviderPrimitive,
  Cursor as CursorPrimitive,
  CursorFollow as CursorFollowPrimitive,
  CursorContainer as CursorContainerPrimitive,
  useCursor,
  type CursorProviderProps as CursorProviderPropsPrimitive,
  type CursorContainerProps as CursorContainerPropsPrimitive,
  type CursorProps as CursorPropsPrimitive,
  type CursorFollowProps as CursorFollowPropsPrimitive,
} from "@/registry/primitives/cursor-primitive";
import { cn } from "@workspace/ui/lib/utils";

type CursorProviderProps = Omit<CursorProviderPropsPrimitive, "children"> &
  CursorContainerPropsPrimitive;

function CursorProvider({ global, ...props }: CursorProviderProps) {
  return (
    <CursorProviderPrimitive global={global}>
      <CursorContainerPrimitive {...props} />
    </CursorProviderPrimitive>
  );
}

type CursorProps = Omit<CursorPropsPrimitive, "children" | "asChild">;

function Cursor({ className, ...props }: CursorProps) {
  const { cursorPos } = useCursor();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  React.useEffect(() => {
    x.set(cursorPos.x);
    y.set(cursorPos.y);
  }, [cursorPos, x, y]);

  const springConfig = { damping: 25, stiffness: 300 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const velocityX = useVelocity(smoothX);
  const velocityY = useVelocity(smoothY);

  // tilt the cursor based on velocity for a gravity feel
  const rotateVelocity = useTransform([velocityX, velocityY], ([vx, vy]) => {
    const rx = ((vx as number) / 1000) * 30;
    const ry = ((vy as number) / 1000) * 30;
    return Math.max(-45, Math.min(45, rx + ry));
  });
  const rotate = useSpring(rotateVelocity, { damping: 15, stiffness: 200 });

  const scale = useTransform([velocityX, velocityY], ([vx, vy]) => {
    const velocity = Math.sqrt((vx as number) ** 2 + (vy as number) ** 2);
    return 1 - Math.min(velocity / 2000, 0.1);
  });

  return (
    <CursorPrimitive
      style={{
        top: smoothY,
        left: smoothX,
        transform: "translate(-4.5%, -11%)", // Override default centering to align tip
      }}
      {...props}
    >
      <motion.svg
        className={cn("size-6 text-foreground", className)}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        style={{
          rotate,
          scale,
          transformOrigin: "4.5% 11%", // Tip of the SVG path
        }}
      >
        <path
          fill="currentColor"
          d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
        />
      </motion.svg>
    </CursorPrimitive>
  );
}

type CursorFollowProps = Omit<CursorFollowPropsPrimitive, "asChild">;

function CursorFollow({
  className,
  children,
  sideOffset = 15,
  alignOffset = 5,
  ...props
}: CursorFollowProps) {
  const { cursorPos } = useCursor();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  React.useEffect(() => {
    x.set(cursorPos.x);
    y.set(cursorPos.y);
  }, [cursorPos, x, y]);

  const springConfig = { damping: 25, stiffness: 300 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const velocityX = useVelocity(smoothX);
  const velocityY = useVelocity(smoothY);

  const scaleX = useTransform(velocityX, [-1000, 0, 1000], [0.9, 1, 1.15]);
  const scaleY = useTransform(velocityY, [-1000, 0, 1000], [1.15, 1, 0.9]);

  const skewX = useTransform(velocityX, [-1000, 0, 1000], [-3, 0, 3]);
  const skewY = useTransform(velocityY, [-1000, 0, 1000], [-3, 0, 3]);

  return (
    <CursorFollowPrimitive
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      {...props}
    >
      <motion.div
        className={cn(
          "bg-foreground rounded-md text-background px-2 py-1 text-sm",
          className,
        )}
        style={{
          scaleX,
          scaleY,
          skewX,
          skewY,
        }}
      >
        {children}
      </motion.div>
    </CursorFollowPrimitive>
  );
}

export {
  CursorProvider,
  Cursor,
  CursorFollow,
  type CursorProviderProps,
  type CursorProps,
  type CursorFollowProps,
};
