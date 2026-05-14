"use client";

import { useEffect, useState } from "react";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

interface ScreenSize {
  width: number;
  height: number;
  lessThan: (bp: Breakpoint) => boolean;
  greaterThan: (bp: Breakpoint) => boolean;
}

export default function useScreenSize(): ScreenSize {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    ...size,
    lessThan: (bp: Breakpoint) => size.width < BREAKPOINTS[bp],
    greaterThan: (bp: Breakpoint) => size.width > BREAKPOINTS[bp],
  };
}
