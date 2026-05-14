"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export interface ScrollRevealImageProps {
  // Image
  src: string;
  alt: string;
  quality?: number;
  priority?: boolean;

  // Container
  height?: string;
  fromWidth?: string;
  toWidth?: string;
  fromRadius?: string;
  toRadius?: string;
  /** Scroll progress (0–1) at which border radius starts animating */
  radiusStart?: number;

  // Inner image — wider than container to allow the zoom effect
  innerWidth?: string;
  fromScale?: number;
  toScale?: number;

  // Spring physics
  stiffness?: number;
  damping?: number;

  // Scroll offset (framer-motion OffsetPoint tuple)
  scrollOffset?: NonNullable<Parameters<typeof useScroll>[0]>["offset"];

  /** Optional scrollable ancestor ref (defaults to viewport) */
  container?: React.RefObject<HTMLElement | null>;

  // Layout
  className?: string;
  imageClassName?: string;
}

export default function ScrollRevealImage({
  src,
  alt,
  quality = 100,
  priority = false,
  height = "80vh",
  fromWidth = "40vw",
  toWidth = "95vw",
  fromRadius = "0px",
  toRadius = "22px",
  radiusStart = 0.5,
  innerWidth = "95vw",
  fromScale = 1.6,
  toScale = 1,
  stiffness = 120,
  damping = 80,
  scrollOffset = ["start end", "start start"] as const,
  container,
  className,
  imageClassName,
}: ScrollRevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container,
    offset: scrollOffset,
  });

  const width = useTransform(scrollYProgress, [0, 1], [fromWidth, toWidth]);
  const scale = useTransform(scrollYProgress, [0, 1], [fromScale, toScale]);
  const radius = useTransform(
    scrollYProgress,
    [radiusStart, 1],
    [fromRadius, toRadius],
  );

  const smoothWidth = useSpring(width, { stiffness, damping });
  const smoothScale = useSpring(scale, { stiffness, damping });
  const smoothRadius = useSpring(radius, { stiffness, damping });

  return (
    <motion.div
      ref={containerRef}
      className={className}
      style={{
        width: smoothWidth,
        position: "relative",
        height,
        borderRadius: smoothRadius,
        overflow: "hidden",
        margin: "0 auto",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          left: "50%",
          x: "-50%",
          width: innerWidth,
          height: "100%",
          scale: smoothScale,
          originX: 0.5,
          originY: 0.5,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          quality={quality}
          priority={priority}
          className={`object-cover${imageClassName ? ` ${imageClassName}` : ""}`}
        />
      </motion.div>
    </motion.div>
  );
}
