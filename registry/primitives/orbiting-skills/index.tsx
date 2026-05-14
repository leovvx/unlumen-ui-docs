"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "motion/react";

import { cn } from "@workspace/ui/lib/utils";

export type OrbitSkillItem = {
  /** Short label displayed under the icon */
  label: string;
  /** Icon element (e.g. an <svg> or <img>) */
  icon?: React.ReactNode;
};

export interface OrbitingSkillsProps {
  /** Skill items to orbit around the center element */
  items: OrbitSkillItem[];
  /**
   * Orbit radius in pixels.
   * @default 88
   */
  radius?: number;
  /**
   * Duration of one full orbit rotation, in seconds.
   * @default 18
   */
  duration?: number;
  /** Whether to render the circular orbit path */
  showPath?: boolean;
  /**
   * On desktop the orbit appears only on hover and follows the cursor.
   * Set to `false` to keep it centered at all times.
   * @default true
   */
  followCursor?: boolean;
  /** Center content (avatar, logo, …) */
  children?: React.ReactNode;
  className?: string;
}

function useIsMobile() {
  const [mobile, setMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

type BadgeProps = {
  item: OrbitSkillItem;
  index: number;
  total: number;
  radius: number;
  duration: number;
  size?: "sm" | "md";
};

function OrbitBadge({
  item,
  index,
  total,
  radius,
  duration,
  size = "md",
}: BadgeProps) {
  const startAngle = (360 / total) * index;
  const isSm = size === "sm";

  return (
    <motion.div
      className="absolute"
      style={{ width: 0, height: 0 }}
      initial={{ rotate: startAngle }}
      animate={{ rotate: startAngle + 360 }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    >
      <motion.div
        className="absolute"
        style={{ y: -radius }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: index * 0.1,
          duration: 0.5,
          type: "spring",
          bounce: 0.45,
        }}
      >
        {/* counter-rotate so the badge stays upright */}
        <motion.div
          className={cn(
            "flex flex-col items-center gap-0.5 whitespace-nowrap rounded-xl border border-border bg-background shadow-sm",
            isSm ? "px-2 py-1" : "px-3 py-2",
          )}
          style={{ x: "-50%", y: "-50%" }}
          initial={{ rotate: -startAngle }}
          animate={{ rotate: -startAngle - 360 }}
          transition={{ duration, ease: "linear", repeat: Infinity }}
        >
          {item.icon && (
            <span
              className={cn("leading-none", isSm ? "text-sm" : "text-base")}
            >
              {item.icon}
            </span>
          )}
          <span
            className={cn(
              "font-medium leading-none",
              isSm ? "text-[8px]" : "text-[10px]",
            )}
          >
            {item.label}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

type RingProps = { radius: number; cx?: number; cy?: number };

function OrbitRing({ radius, cx, cy }: RingProps) {
  return (
    <svg
      className="pointer-events-none absolute"
      style={{
        width: radius * 2,
        height: radius * 2,
        left: cx !== undefined ? cx - radius : 0,
        top: cy !== undefined ? cy - radius : 0,
      }}
    >
      <circle
        className="stroke-foreground/8 stroke-1"
        cx={radius}
        cy={radius}
        r={radius - 0.5}
        fill="none"
      />
    </svg>
  );
}

export function OrbitingSkills({
  items,
  radius = 88,
  duration = 18,
  showPath = true,
  followCursor = true,
  children,
  className,
}: OrbitingSkillsProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const centerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapperRef, {
    once: true,
    margin: "0px 0px -60px 0px",
  });
  const isMobile = useIsMobile();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 200, damping: 18 });
  const y = useSpring(rawY, { stiffness: 200, damping: 18 });

  const [hovered, setHovered] = React.useState(false);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      rawX.set(e.clientX - rect.left);
      rawY.set(e.clientY - rect.top);
    },
    [rawX, rawY],
  );

  // Default cursor position to center of wrapper on mount (prevents flash)
  React.useEffect(() => {
    if (!wrapperRef.current) return;
    const { width, height } = wrapperRef.current.getBoundingClientRect();
    rawX.set(width / 2);
    rawY.set(height / 2);
  }, [rawX, rawY]);

  const showDesktopOrbit =
    !isMobile && followCursor ? hovered : !isMobile && !followCursor;
  const mobileRadius = Math.round(radius * 0.78);

  return (
    <div
      ref={wrapperRef}
      className={cn("relative", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div ref={centerRef}>{children}</div>

      {isMobile && children && (
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <MobileCenterOrbit
            items={items}
            radius={mobileRadius}
            duration={duration}
            showPath={showPath}
            isInView={isInView}
            centerRef={centerRef}
          />
        </div>
      )}

      <AnimatePresence>
        {showDesktopOrbit && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 overflow-visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            aria-hidden="true"
          >
            <motion.div className="absolute" style={{ left: x, top: y }}>
              {showPath && <OrbitRing radius={radius} cx={0} cy={0} />}
              {items.map((item, i) => (
                <OrbitBadge
                  key={item.label}
                  item={item}
                  index={i}
                  total={items.length}
                  radius={radius}
                  duration={duration}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isMobile && !followCursor && (
        <div
          className="pointer-events-none absolute inset-0 overflow-visible"
          aria-hidden="true"
        >
          <DesktopCenteredOrbit
            items={items}
            radius={radius}
            duration={duration}
            showPath={showPath}
            centerRef={centerRef}
          />
        </div>
      )}
    </div>
  );
}

type SubOrbitProps = {
  items: OrbitSkillItem[];
  radius: number;
  duration: number;
  showPath: boolean;
  centerRef: React.RefObject<HTMLDivElement | null>;
};

function DesktopCenteredOrbit({
  items,
  radius,
  duration,
  showPath,
  centerRef,
}: SubOrbitProps) {
  const [center, setCenter] = React.useState<{ x: number; y: number } | null>(
    null,
  );

  React.useLayoutEffect(() => {
    if (!centerRef.current) return;
    const el = centerRef.current;
    const parent = el.closest("[data-orbit-root]") ?? el.parentElement;
    if (!parent) return;
    const pr = parent.getBoundingClientRect();
    const cr = el.getBoundingClientRect();
    setCenter({
      x: cr.left - pr.left + cr.width / 2,
      y: cr.top - pr.top + cr.height / 2,
    });
  }, [centerRef]);

  if (!center) return null;

  return (
    <div className="absolute" style={{ left: center.x, top: center.y }}>
      {showPath && <OrbitRing radius={radius} cx={0} cy={0} />}
      {items.map((item, i) => (
        <OrbitBadge
          key={item.label}
          item={item}
          index={i}
          total={items.length}
          radius={radius}
          duration={duration}
        />
      ))}
    </div>
  );
}

type MobileSubOrbitProps = SubOrbitProps & { isInView: boolean };

function MobileCenterOrbit({
  items,
  radius,
  duration,
  showPath,
  isInView,
  centerRef,
}: MobileSubOrbitProps) {
  const [center, setCenter] = React.useState<{ x: number; y: number } | null>(
    null,
  );

  React.useLayoutEffect(() => {
    if (!centerRef.current) return;
    const el = centerRef.current;
    const parent = el.closest("[data-orbit-root]") ?? el.parentElement;
    if (!parent) return;
    const pr = parent.getBoundingClientRect();
    const cr = el.getBoundingClientRect();
    setCenter({
      x: cr.left - pr.left + cr.width / 2,
      y: cr.top - pr.top + cr.height / 2,
    });
  }, [centerRef]);

  if (!center) return null;

  return (
    <div className="absolute" style={{ left: center.x, top: center.y }}>
      {showPath && (
        <motion.svg
          className="pointer-events-none absolute"
          style={{
            width: radius * 2,
            height: radius * 2,
            left: -radius,
            top: -radius,
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={
            isInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }
          }
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <circle
            className="stroke-foreground/5 stroke-1"
            cx={radius}
            cy={radius}
            r={radius - 0.5}
            fill="none"
          />
        </motion.svg>
      )}
      {isInView &&
        items.map((item, i) => (
          <OrbitBadge
            key={item.label}
            item={item}
            index={i}
            total={items.length}
            radius={radius}
            duration={duration}
            size="sm"
          />
        ))}
    </div>
  );
}
