"use client";

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@workspace/ui/lib/utils";

interface ClippedCircleProps {
  className?: string;
  circleClassName?: string;
  circleSize?: number;
}

function ClippedCircle({
  className,
  circleClassName = "bg-white/20",
  circleSize = 400,
}: ClippedCircleProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [position, setPosition] = React.useState({ x: "50%", y: "50%" });

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || !container.parentElement) return;

    const parent = container.parentElement;

    const handleMouseEnter = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPosition({ x: `${x}%`, y: `${y}%` });
      setIsHovered(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPosition({ x: `${x}%`, y: `${y}%` });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className,
      )}
    >
      <motion.div
        className={cn(
          "pointer-events-none absolute rounded-full",
          circleClassName,
        )}
        style={{
          left: position.x,
          top: position.y,
          width: circleSize,
          height: circleSize,
          mixBlendMode: "difference",
        }}
        initial={{ scale: 0, x: "-50%", y: "-50%" }}
        animate={{
          scale: isHovered ? 1 : 0,
          x: "-50%",
          y: "-50%",
        }}
        transition={{
          duration: 0.5,
          ease: [0.19, 1, 0.22, 1],
        }}
      />
    </div>
  );
}

export { ClippedCircle, type ClippedCircleProps };
