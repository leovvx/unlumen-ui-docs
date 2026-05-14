"use client";

import { useTheme } from "next-themes";
import { useCallback, useRef } from "react";

/**
 * Drop-in replacement for next-themes `setTheme` that plays a circular
 * reveal animation originating from the last pointer position.
 *
 * Usage:
 *   const { toggle, ref } = useThemeTransition();
 *   <button ref={ref} onClick={toggle} />
 */
export function useThemeTransition() {
  const { resolvedTheme, setTheme } = useTheme();
  const originRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  /** Call this on the element that triggers the change to capture position. */
  const captureOrigin = useCallback((e: React.MouseEvent | MouseEvent) => {
    originRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const toggle = useCallback(
    (e?: React.MouseEvent | MouseEvent) => {
      if (e) captureOrigin(e);
      const next = resolvedTheme === "dark" ? "light" : "dark";
      applyThemeTransition(
        { x: originRef.current.x, y: originRef.current.y },
        () => setTheme(next),
      );
    },
    [resolvedTheme, setTheme, captureOrigin],
  );

  const setThemeAnimated = useCallback(
    (theme: string, e?: React.MouseEvent | MouseEvent) => {
      if (e) captureOrigin(e);
      applyThemeTransition(
        { x: originRef.current.x, y: originRef.current.y },
        () => setTheme(theme),
      );
    },
    [setTheme, captureOrigin],
  );

  return { toggle, setThemeAnimated, captureOrigin, resolvedTheme };
}

function applyThemeTransition(
  origin: { x: number; y: number },
  apply: () => void,
) {
  const { x, y } = origin;

  // Fallback for browsers that don't support View Transitions,
  // or skip on very large screens where rasterizing a full-page snapshot is too expensive
  if (!document.startViewTransition || window.innerWidth > 1800) {
    apply();
    return;
  }

  // Compute radius large enough to cover the farthest corner
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  document.documentElement.style.setProperty("--vt-x", `${x}px`);
  document.documentElement.style.setProperty("--vt-y", `${y}px`);
  document.documentElement.style.setProperty("--vt-r", `${endRadius}px`);

  const transition = document.startViewTransition(apply);
  transition.ready.catch(() => {}); // suppress unhandled rejection if interrupted
}
