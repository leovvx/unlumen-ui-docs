import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { motion, Transition, Easing } from "motion/react";

type MotionStyle = Record<string, string | number>;
type SegmentBy = "chars" | "words" | "lines";
type StaggerDirection = "forward" | "reverse" | "center";

export interface StaggeredTextHandle {
  replay: () => void;
  exit: () => void;
}

export interface StaggeredTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

  /** How to split the text visually and for staggering */
  segmentBy?: SegmentBy;

  /**
   * Row separator, applied before segmenting.
   * Examples:
   *  - separator="|" and text="Line 1|Line 2|Line 3"
   *  - separator="///" and text="One///Two"
   * If not provided, rows are split by newlines.
   */
  separator?: string;

  /** Delay between each segment in ms */
  delay?: number;

  /** Total duration of a segment animation in seconds */
  duration?: number;

  /** Motion easing (single or per-keyframe) */
  easing?: Easing | Easing[];

  /** Intersection observer options (for scroll trigger) */
  threshold?: number;
  rootMargin?: string;

  /** Direction of movement */
  direction?: "top" | "bottom" | "left" | "right";

  /** Enable blur in default animation */
  blur?: boolean;

  /** Override default keyframes */
  from?: MotionStyle;
  to?: MotionStyle | MotionStyle[];

  /** Stagger direction: forward (start to end), reverse (end to start), or center (middle out) */
  staggerDirection?: StaggerDirection;

  /** Respect user's reduced motion preference */
  respectReducedMotion?: boolean;

  /** Auto-exit animation when scrolled out of view */
  exitOnScrollOut?: boolean;

  /** Called when the last segment finishes animating */
  onAnimationComplete?: () => void;

  /** Called when exit animation completes */
  onExitComplete?: () => void;
}

/**
 * Build keyframes object for motion from a "from" snapshot and one or more "to" snapshots.
 */
const buildKeyframes = (
  from: MotionStyle,
  steps: MotionStyle[],
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((step) => Object.keys(step)),
  ]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach((key) => {
    keyframes[key] = [from[key], ...steps.map((step) => step[key])];
  });

  return keyframes;
};

const StaggeredText = forwardRef<StaggeredTextHandle, StaggeredTextProps>(
  (
    {
      text,
      className = "",
      as = "p",
      segmentBy = "words",
      separator,
      delay = 80,
      duration = 0.6,
      easing = (t: number) => t,
      threshold = 0.1,
      rootMargin = "0px",
      direction = "top",
      blur = true,
      from,
      to,
      staggerDirection = "forward",
      respectReducedMotion = true,
      exitOnScrollOut = false,
      onAnimationComplete,
      onExitComplete,
    },
    ref,
  ) => {
    const rootRef = useRef<HTMLElement | null>(null);

    const [hasEnteredView, setHasEnteredView] = useState<boolean>(false);
    const [isExiting, setIsExiting] = useState<boolean>(false);
    const [prefersReducedMotion, setPrefersReducedMotion] =
      useState<boolean>(false);

    useEffect(() => {
      if (!respectReducedMotion) return;

      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }, [respectReducedMotion]);

    useImperativeHandle(ref, () => ({
      replay: () => {
        setIsExiting(false);
        setHasEnteredView(false);
        requestAnimationFrame(() => {
          setHasEnteredView(true);
        });
      },
      exit: () => {
        setIsExiting(true);
      },
    }));

    useEffect(() => {
      if (!rootRef.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHasEnteredView(true);
            setIsExiting(false);
            if (!exitOnScrollOut && rootRef.current) {
              observer.unobserve(rootRef.current);
            }
          } else if (exitOnScrollOut && hasEnteredView) {
            setIsExiting(true);
          }
        },
        { threshold, rootMargin },
      );

      observer.observe(rootRef.current);

      return () => observer.disconnect();
    }, [threshold, rootMargin, exitOnScrollOut, hasEnteredView]);

    const defaultFrom = useMemo<MotionStyle>(() => {
      const base: MotionStyle = {
        opacity: 0,
      };

      if (direction === "top" || direction === "bottom") {
        base.y = direction === "top" ? -40 : 40;
      } else {
        base.x = direction === "left" ? -40 : 40;
      }

      if (blur) {
        base.filter = "blur(10px)";
      }

      return base;
    }, [direction, blur]);

    const defaultTo = useMemo<MotionStyle[]>(() => {
      const axisKey = direction === "left" || direction === "right" ? "x" : "y";

      if (!blur) {
        return [
          {
            opacity: 1,
            [axisKey]: 0,
          },
        ];
      }

      const overshoot = direction === "top" || direction === "left" ? 5 : -5;

      return [
        {
          opacity: 0.7,
          [axisKey]: overshoot,
          filter: "blur(5px)",
        },
        {
          opacity: 1,
          [axisKey]: 0,
          filter: "blur(0px)",
        },
      ];
    }, [direction, blur]);

    const fromSnapshot = useMemo<MotionStyle>(
      () => from ?? defaultFrom,
      [from, defaultFrom],
    );

    const toSnapshots = useMemo<MotionStyle[]>(() => {
      if (!to) return defaultTo;
      return Array.isArray(to) ? to : [to];
    }, [to, defaultTo]);

    const stepCount = toSnapshots.length + 1;
    const times = useMemo(
      () =>
        Array.from({ length: stepCount }, (_, i) =>
          stepCount === 1 ? 0 : i / (stepCount - 1),
        ),
      [stepCount],
    );

    const { rowsSegments, totalSegments } = useMemo(() => {
      if (!text) {
        return { rowsSegments: [] as string[][], totalSegments: 0 };
      }

      const rows =
        separator && separator.length > 0
          ? text.split(separator)
          : text.split(/\r?\n/);

      const rowsSegments: string[][] = rows.map((row) => {
        switch (segmentBy) {
          case "chars":
            return row.split("");
          case "lines":
            return [row];
          case "words":
          default:
            return row.split(" ");
        }
      });

      const total = rowsSegments.reduce(
        (sum, rowSegs) => sum + rowSegs.length,
        0,
      );

      return { rowsSegments, totalSegments: total };
    }, [text, segmentBy, separator]);

    if (!text) return null;

    const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

    let globalIndexCounter = 0;

    const hasMultipleRows = rowsSegments.length > 1;

    const getStaggerDelay = (index: number, total: number): number => {
      if (prefersReducedMotion) return 0;

      switch (staggerDirection) {
        case "reverse":
          return ((total - 1 - index) * delay) / 1000;
        case "center": {
          const middle = (total - 1) / 2;
          const distanceFromCenter = Math.abs(index - middle);
          return (distanceFromCenter * delay) / 1000;
        }
        case "forward":
        default:
          return (index * delay) / 1000;
      }
    };

    const Wrapper = as;

    return (
      <Wrapper
        ref={rootRef as React.RefObject<HTMLParagraphElement>}
        className={`staggered-text ${hasMultipleRows || segmentBy === "lines" ? "block" : "flex flex-wrap"} whitespace-pre-wrap ${className}`}
      >
        {rowsSegments.map((rowSegments, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {rowSegments.map((segment, rowSegIndex) => {
              const globalIndex = globalIndexCounter++;
              const isLast = globalIndex === totalSegments - 1;

              const transition: Transition = prefersReducedMotion
                ? {
                    duration: 0.01,
                    delay: 0,
                  }
                : {
                    duration,
                    times,
                    delay: getStaggerDelay(globalIndex, totalSegments),
                    ease: easing,
                  };

              return (
                <motion.span
                  key={`seg-${rowIndex}-${rowSegIndex}`}
                  initial={fromSnapshot}
                  animate={
                    isExiting
                      ? fromSnapshot
                      : hasEnteredView
                        ? animateKeyframes
                        : fromSnapshot
                  }
                  transition={transition}
                  onAnimationComplete={
                    isLast
                      ? () => {
                          if (isExiting) {
                            onExitComplete?.();
                          } else {
                            onAnimationComplete?.();
                          }
                        }
                      : undefined
                  }
                  style={{
                    display: segmentBy === "lines" ? "block" : "inline-block",
                    willChange: "transform, filter, opacity",
                  }}
                >
                  {segmentBy === "chars"
                    ? segment === " "
                      ? "\u00A0"
                      : segment
                    : segment}
                  {segmentBy === "words" &&
                    rowSegIndex < rowSegments.length - 1 &&
                    "\u00A0"}
                </motion.span>
              );
            })}
            {rowIndex < rowsSegments.length - 1 && segmentBy !== "lines" && (
              <br key={`br-${rowIndex}`} />
            )}
          </React.Fragment>
        ))}
      </Wrapper>
    );
  },
);

StaggeredText.displayName = "StaggeredText";

export default StaggeredText;
