"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@workspace/ui/lib/utils";

function SunIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  );
}

function MoonIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// no-op fallback for browsers that don't support startViewTransition
function applyWithTransition(
  origin: { x: number; y: number },
  apply: () => void,
) {
  if (!document.startViewTransition || window.innerWidth > 1800) {
    apply();
    return;
  }
  const { x, y } = origin;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );
  document.documentElement.style.setProperty("--vt-x", `${x}px`);
  document.documentElement.style.setProperty("--vt-y", `${y}px`);
  document.documentElement.style.setProperty("--vt-r", `${endRadius}px`);
  document.startViewTransition(apply).ready.catch(() => {});
}

interface ThemeSwitchProps {
  /** @default 16 */
  iconSize?: number;
  className?: string;
}

function ThemeSwitch({ iconSize = 16, className }: ThemeSwitchProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const originRef = useRef({ x: 0, y: 0 });

  useEffect(() => setMounted(true), []);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    originRef.current = { x: e.clientX, y: e.clientY };
    const next = resolvedTheme === "dark" ? "light" : "dark";
    applyWithTransition(originRef.current, () => setTheme(next));
  };

  const isDark = resolvedTheme === "dark";

  if (!mounted) {
    // placeholder to prevent layout shift before hydration
    return (
      <div
        aria-hidden
        className={cn(
          "size-9 rounded-full bg-accent border border-border",
          className,
        )}
      />
    );
  }

  return (
    <motion.button
      onClick={toggle}
      className={cn(
        "relative flex items-center justify-center size-9 rounded-full",
        "bg-accent border border-border cursor-pointer",
        "text-foreground outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", duration: 0.2, bounce: 0 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -45, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 45, scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.28, bounce: 0.3 }}
            className="flex items-center justify-center"
          >
            <MoonIcon size={iconSize} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 45, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -45, scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.28, bounce: 0.3 }}
            className="flex items-center justify-center"
          >
            <SunIcon size={iconSize} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export { ThemeSwitch, type ThemeSwitchProps };
