"use client";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationFrame,
} from "motion/react";

/* ─────────────────────────────────────────────────────────────
   FluidBlobs — self-contained, cursor-reactive fluid gradient

   Usage (free mode — blobs follow cursor freely):
     <div className="relative overflow-hidden h-56">
       <FluidBlobs
         lightColors={["#ffb3c6", "#e8b4f0", "#ffd6a5", "#ffc8dd"]}
         darkColors={["#ff6b8a", "#c084f5", "#d44d8a", "#ff96a9"]}
       />
     </div>

   Usage (pinned mode — blobs live at fixed spots, pulled toward cursor):
     <FluidBlobs
       lightColors={["#ffb3c6", "#e8b4f0", "#ffd6a5", "#ffc8dd"]}
       darkColors={["#ff6b8a", "#c084f5", "#d44d8a", "#ff96a9"]}
       origins={[
         { x: 20, y: 35 },  // blob 0 sits top-left (% of container)
         { x: 75, y: 20 },  // blob 1 sits top-right
         { x: 40, y: 65 },  // blob 2 sits center-bottom
         { x: 82, y: 68 },  // blob 3 sits bottom-right
       ]}
       margin={60}  // px — how far outside the container the cursor still attracts
     />

   Props:
     colors        — static color array (overrides light/darkColors)
     lightColors   — colors in light mode
     darkColors    — colors in dark mode
     sizes         — blob size(s) in px: single number or per-blob array
     blur          — blur radius in px (default 55)
     origins       — pinned positions in % (0-100) per blob; enables pinned mode
     margin        — px margin beyond container bounds where cursor still attracts;
                     number (all sides) or { top, right, bottom, left }
     className     — extra classes on the wrapper
   ────────────────────────────────────────────────────────── */

export type BlobOrigin = { x: number; y: number };

export type BlobMargin =
  | number
  | { top?: number; right?: number; bottom?: number; left?: number };

export type FluidBlobsProps = {
  colors?: string[];
  lightColors?: string[];
  darkColors?: string[];
  sizes?: number | number[];
  blur?: number;
  origins?: BlobOrigin[];
  margin?: BlobMargin;
  className?: string;
};

/* ── Theme detection ── */
function useIsDark() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

/* ── Per-blob physics config (deterministic from index) ── */
type BlobConfig = {
  size: number;
  spring: { stiffness: number; damping: number };
  driftX: { freq: number; amp: number; phase: number };
  driftY: { freq: number; amp: number; phase: number };
  pulse: { duration: number; delay: number };
};

function blobConfig(i: number, overrideSize?: number): BlobConfig {
  const stiffnesses = [75, 38, 20, 55, 45, 30, 60];
  const dampings = [22, 16, 11, 19, 14, 12, 20];
  const defaultSiz = [240, 200, 220, 170, 210, 190, 230];
  const driftFreqs = [800, 1000, 1600, 520, 1100, 700, 1300];
  const driftAmps = [28, 32, 22, 36, 25, 30, 20];
  const driftPhases = [0, 2.1, 4.5, 1.8, 3.3, 5.2, 0.9];
  const pulseDurs = [3.2, 4.1, 3.7, 4.8, 3.5, 4.4, 3.9];
  const pulseDelay = [0, 0.6, 1.1, 1.8, 0.3, 1.4, 0.9];
  const j = i % 7;
  return {
    size: overrideSize ?? defaultSiz[j],
    spring: { stiffness: stiffnesses[j], damping: dampings[j] },
    driftX: { freq: driftFreqs[j], amp: driftAmps[j], phase: driftPhases[j] },
    driftY: {
      freq: driftFreqs[(j + 3) % 7],
      amp: driftAmps[(j + 2) % 7],
      phase: driftPhases[(j + 4) % 7],
    },
    pulse: { duration: pulseDurs[j], delay: pulseDelay[j] },
  };
}

const DEFAULT_LIGHT = ["#ffb3c6", "#e8b4f0", "#ffd6a5", "#ffc8dd"];
const DEFAULT_DARK = ["#ff6b8a", "#c084f5", "#d44d8a", "#ff96a9"];

/* ── Main component ── */
export function FluidBlobs({
  colors,
  lightColors,
  darkColors,
  sizes,
  blur = 55,
  origins,
  margin = 0,
  className,
}: FluidBlobsProps) {
  const isDark = useIsDark();
  const resolvedColors =
    colors ??
    (isDark ? (darkColors ?? DEFAULT_DARK) : (lightColors ?? DEFAULT_LIGHT));

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 384, h: 224 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setContainerSize({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Cursor position relative to the container (only updated when inside)
  const mouseX = useMotionValue(containerSize.w / 2);
  const mouseY = useMotionValue(containerSize.h / 2);
  // Whether the cursor is currently inside the container
  const isInsideRef = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();

      // Resolve margin sides
      const mt = typeof margin === "number" ? margin : (margin.top ?? 0);
      const mr = typeof margin === "number" ? margin : (margin.right ?? 0);
      const mb = typeof margin === "number" ? margin : (margin.bottom ?? 0);
      const ml = typeof margin === "number" ? margin : (margin.left ?? 0);

      const inside =
        e.clientX >= rect.left - ml &&
        e.clientX <= rect.right + mr &&
        e.clientY >= rect.top - mt &&
        e.clientY <= rect.bottom + mb;

      isInsideRef.current = inside;

      if (inside) {
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY, margin]);

  const t = useMotionValue(0);
  useAnimationFrame((time) => t.set(time));

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${
        className ?? ""
      }`}
    >
      {resolvedColors.map((color, i) => {
        const overrideSize = Array.isArray(sizes)
          ? sizes[i]
          : typeof sizes === "number"
            ? sizes
            : undefined;
        return (
          <BlobLayer
            key={i}
            color={color}
            config={blobConfig(i, overrideSize)}
            mouseX={mouseX}
            mouseY={mouseY}
            isInsideRef={isInsideRef}
            t={t}
            blur={blur}
            origin={origins?.[i]}
            containerW={containerSize.w}
            containerH={containerSize.h}
          />
        );
      })}
    </div>
  );
}

/* ── Internal per-blob layer ── */
type BlobLayerProps = {
  color: string;
  config: BlobConfig;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  isInsideRef: React.RefObject<boolean>;
  t: ReturnType<typeof useMotionValue<number>>;
  blur: number;
  origin?: BlobOrigin;
  containerW: number;
  containerH: number;
};

function BlobLayer({
  color,
  config,
  mouseX,
  mouseY,
  isInsideRef,
  t,
  blur,
  origin,
  containerW,
  containerH,
}: BlobLayerProps) {
  const { size, spring, driftX, driftY, pulse } = config;

  // Resting position: provided origin (%) → px, or center of container
  const ox = origin ? (origin.x / 100) * containerW : containerW / 2;
  const oy = origin ? (origin.y / 100) * containerH : containerH / 2;

  const targetX = useMotionValue(ox);
  const targetY = useMotionValue(oy);

  useAnimationFrame(() => {
    if (isInsideRef.current) {
      // Cursor is inside the container — follow it
      targetX.set(mouseX.get());
      targetY.set(mouseY.get());
    } else {
      // Cursor is outside — return to resting origin
      targetX.set(ox);
      targetY.set(oy);
    }
  });

  const spx = useSpring(targetX, spring);
  const spy = useSpring(targetY, spring);

  const x = useTransform([spx, t] as const, ([cx, time]) => {
    return (
      (cx as number) +
      Math.sin((time as number) / driftX.freq + driftX.phase) * driftX.amp -
      size / 2
    );
  });

  const y = useTransform([spy, t] as const, ([cy, time]) => {
    return (
      (cy as number) +
      Math.cos((time as number) / driftY.freq + driftY.phase) * driftY.amp -
      size / 2
    );
  });

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: color,
        filter: `blur(${blur}px)`,
        willChange: "transform",
      }}
      animate={{
        scale: [1, 1.18, 0.88, 1.12, 0.95, 1],
        opacity: [0.72, 0.92, 0.68, 0.88, 0.78, 0.72],
      }}
      transition={{
        duration: pulse.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: pulse.delay,
      }}
    />
  );
}

export default FluidBlobs;
