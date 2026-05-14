"use client";

import { useRef, useEffect, type CSSProperties, type RefObject } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export interface PerspectiveFlowImage {
  src: string;
  alt?: string;
}

export interface PerspectiveFlowProps {
  /** Array of image sources to display in the grid. */
  images: PerspectiveFlowImage[];
  /** Animation engine — `"gsap"` uses GSAP ScrollTrigger, `"motion"` uses Framer Motion useScroll. */
  engine?: "gsap" | "motion";
  /** Perspective depth in pixels applied to each card. @default 1000 */
  perspective?: number;
  /** Max grid width. @default "900px" */
  maxWidth?: string;
  /** Gap between grid items. Accepts px number or CSS string. @default "1.5rem" */
  gap?: number | string;
  /** Vertical gap between grid rows. Defaults to `gap` when not provided. */
  verticalGap?: number | string;
  /** Minimum card width used by auto-fit responsive columns. @default 240 */
  minItemWidth?: number;
  /** Optional scrollable container element used as the animation scroller. */
  scrollContainerRef?: RefObject<HTMLElement | null>;
  /** Additional class name on the root element. */
  className?: string;
}

const DEFAULT_PERSPECTIVE = 1000;
const DEFAULT_MIN_ITEM_WIDTH = 240;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toCssLength(value: number | string | undefined, fallback: string) {
  if (typeof value === "number") return `${value}px`;
  return value ?? fallback;
}

function useFilterTransform(
  blur: MotionValue<number>,
  brightness: MotionValue<number>,
  contrast: MotionValue<number>,
) {
  return useTransform(
    [blur, brightness, contrast],
    ([b, br, c]: number[]) => `blur(${b}px) brightness(${br}%) contrast(${c}%)`,
  );
}

function MotionCard({
  src,
  alt,
  isLeft,
  perspective,
  dynamicsScale,
  scrollContainerRef,
}: {
  src: string;
  alt: string;
  isLeft: boolean;
  perspective: number;
  dynamicsScale: number;
  scrollContainerRef?: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainerRef,
    offset: ["start end", "end start"],
  });

  const tiltScale = 0.6 + dynamicsScale * 0.4;
  const pct = (value: number) => `${value * dynamicsScale}%`;

  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [70 * tiltScale, 0, -50 * tiltScale],
  );
  const rotateZ = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    isLeft
      ? [5 * tiltScale, 0, -1 * tiltScale]
      : [-5 * tiltScale, 0, 1 * tiltScale],
  );
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 0.7, 1],
    isLeft ? [pct(-60), "0%", "0%", pct(-10)] : [pct(40), "0%", "0%", pct(10)],
  );
  const skewX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    isLeft
      ? [-5 * tiltScale, 0, 5 * tiltScale]
      : [5 * tiltScale, 0, -5 * tiltScale],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [pct(40), "0%", pct(-10)],
  );

  const blur = useTransform(scrollYProgress, [0, 0.5, 1], [7, 0, 4]);
  const brightness = useTransform(scrollYProgress, [0, 0.5, 1], [0, 100, 0]);
  const contrast = useTransform(scrollYProgress, [0, 0.5, 1], [180, 110, 180]);
  const scaleY = useTransform(scrollYProgress, [0, 0.5, 1], [1.8, 1, 1.1]);

  const filter = useFilterTransform(blur, brightness, contrast);

  return (
    <motion.figure
      ref={ref}
      className="relative z-10 m-0"
      style={
        {
          perspective: `${perspective}px`,
          willChange: "transform",
        } as CSSProperties
      }
    >
      <motion.div
        className="relative aspect-[1/1.2] w-full overflow-hidden rounded-xs"
        style={{ y, x, rotateX, rotateZ, skewX, filter, scaleY }}
      >
        <motion.div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${src})` }}
          role="img"
          aria-label={alt}
        />
      </motion.div>
    </motion.figure>
  );
}

function MotionGrid({
  images,
  perspective = DEFAULT_PERSPECTIVE,
  maxWidth = "900px",
  gap = "1.5rem",
  verticalGap,
  minItemWidth = DEFAULT_MIN_ITEM_WIDTH,
  scrollContainerRef,
  className,
}: Omit<PerspectiveFlowProps, "engine">) {
  const dynamicsScale = clamp(perspective / DEFAULT_PERSPECTIVE, 0.35, 1.2);
  const spacingScale = clamp(1 / dynamicsScale, 0.85, 1.8);
  const maxWidthCss = toCssLength(maxWidth, "900px");
  const columnGap = toCssLength(gap, "1.5rem");
  const rowGap = toCssLength(verticalGap, columnGap);
  const effectiveColumnGap = `calc(${columnGap} * ${spacingScale})`;
  const effectiveRowGap = `calc(${rowGap} * ${spacingScale})`;
  const constrainedMaxWidth = `min(${maxWidthCss}, calc(${minItemWidth * 2}px + ${effectiveColumnGap}))`;

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="relative w-full overflow-hidden">
        <section className="relative grid w-full place-items-center">
          <div
            className="relative mb-[10vh] grid w-full py-[20vh]"
            style={{
              maxWidth: constrainedMaxWidth,
              columnGap: effectiveColumnGap,
              rowGap: effectiveRowGap,
              gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`,
            }}
          >
            {images.map((img, i) => {
              const isLeft = i % 2 === 0;
              return (
                <MotionCard
                  key={i}
                  src={img.src}
                  alt={img.alt ?? `Image ${i + 1}`}
                  isLeft={isLeft}
                  perspective={perspective}
                  dynamicsScale={dynamicsScale}
                  scrollContainerRef={scrollContainerRef}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function GsapGrid({
  images,
  perspective = DEFAULT_PERSPECTIVE,
  maxWidth = "900px",
  gap = "1.5rem",
  verticalGap,
  minItemWidth = DEFAULT_MIN_ITEM_WIDTH,
  scrollContainerRef,
  className,
}: Omit<PerspectiveFlowProps, "engine">) {
  const gridRef = useRef<HTMLDivElement>(null);
  const dynamicsScale = clamp(perspective / DEFAULT_PERSPECTIVE, 0.35, 1.2);
  const spacingScale = clamp(1 / dynamicsScale, 0.85, 1.8);
  const tiltScale = 0.6 + dynamicsScale * 0.4;
  const maxWidthCss = toCssLength(maxWidth, "900px");
  const columnGap = toCssLength(gap, "1.5rem");
  const rowGap = toCssLength(verticalGap, columnGap);
  const effectiveColumnGap = `calc(${columnGap} * ${spacingScale})`;
  const effectiveRowGap = `calc(${rowGap} * ${spacingScale})`;
  const constrainedMaxWidth = `min(${maxWidthCss}, calc(${minItemWidth * 2}px + ${effectiveColumnGap}))`;

  useEffect(() => {
    let context: gsap.Context | null = null;

    const timeout = setTimeout(() => {
      context = gsap.context(() => {
        const wraps = gridRef.current?.querySelectorAll(".ps-imgwrap");
        if (!wraps) return;

        wraps.forEach((wrap) => {
          const inner = wrap.querySelector(".ps-img");
          const rect = wrap.getBoundingClientRect();
          const scrollerRect =
            scrollContainerRef?.current?.getBoundingClientRect();
          const referenceCenterX =
            scrollerRect?.left !== undefined &&
            scrollerRect?.width !== undefined
              ? scrollerRect.left + scrollerRect.width / 2
              : window.innerWidth / 2;
          const isLeft = rect.left + rect.width / 2 < referenceCenterX;

          gsap
            .timeline({
              scrollTrigger: {
                trigger: wrap,
                scroller: scrollContainerRef?.current ?? undefined,
                start: "top bottom+=10%",
                end: "bottom top-=25%",
                scrub: true,
              },
            })
            .from(wrap, {
              startAt: {
                filter: "blur(0px) brightness(100%) contrast(100%)",
              },
              z: 300 * dynamicsScale,
              rotateX: 70 * tiltScale,
              rotateZ: isLeft ? 5 * tiltScale : -5 * tiltScale,
              xPercent: (isLeft ? -40 : 40) * dynamicsScale,
              skewX: (isLeft ? -20 : 20) * tiltScale,
              yPercent: 100 * dynamicsScale,
              filter: "blur(7px) brightness(0%) contrast(400%)",
              ease: "sine",
            })
            .to(wrap, {
              z: 300 * dynamicsScale,
              rotateX: -50 * tiltScale,
              rotateZ: isLeft ? -1 * tiltScale : 1 * tiltScale,
              xPercent: (isLeft ? -20 : 20) * dynamicsScale,
              skewX: (isLeft ? 10 : -10) * tiltScale,
              filter: "blur(4px) brightness(0%) contrast(500%)",
              ease: "sine.in",
            })
            .from(inner, { scaleY: 1.8, ease: "sine" }, 0)
            .to(inner, { scaleY: 1.8, ease: "sine.in" }, ">");
        });
      }, gridRef);

      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeout);
      context?.revert();
    };
  }, [
    scrollContainerRef,
    images,
    perspective,
    dynamicsScale,
    tiltScale,
    minItemWidth,
    maxWidthCss,
    effectiveColumnGap,
    effectiveRowGap,
  ]);

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="relative w-full overflow-hidden">
        <section className="relative grid w-full place-items-center">
          <div
            ref={gridRef}
            className="relative mb-[10vh] grid w-full py-[20vh]"
            style={{
              maxWidth: constrainedMaxWidth,
              columnGap: effectiveColumnGap,
              rowGap: effectiveRowGap,
              gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`,
            }}
          >
            {images.map((img, i) => (
              <figure
                key={i}
                className="relative z-10 m-0"
                style={
                  {
                    perspective: `${perspective}px`,
                    willChange: "transform",
                  } as CSSProperties
                }
              >
                <div className="ps-imgwrap relative aspect-[1/1.2] w-full overflow-hidden rounded-xs will-change-[filter]">
                  <div
                    className="ps-img absolute inset-0 h-full w-full bg-cover bg-center will-change-transform"
                    style={{
                      backgroundImage: `url(${img.src})`,
                      backfaceVisibility: "hidden",
                    }}
                    role="img"
                    aria-label={img.alt ?? `Image ${i + 1}`}
                  />
                </div>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function PerspectiveFlow({
  engine = "motion",
  ...props
}: PerspectiveFlowProps) {
  if (engine === "gsap") return <GsapGrid {...props} />;
  return <MotionGrid {...props} />;
}

export default PerspectiveFlow;
