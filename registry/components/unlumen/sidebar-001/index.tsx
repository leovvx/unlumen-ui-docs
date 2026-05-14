"use client";

import * as React from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

const MotionChevron = motion.create(ChevronRight);

const EFFECTS_KEY = "sidebar-001-effects";

const EffectsContext = createContext<{ enabled: boolean; toggle: () => void }>({
  enabled: true,
  toggle: () => {},
});

function EffectsProvider({
  children,
  defaultEnabled = true,
}: {
  children: React.ReactNode;
  defaultEnabled?: boolean;
}) {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return defaultEnabled;
    const stored = localStorage.getItem(EFFECTS_KEY);
    return stored !== null ? stored === "true" : defaultEnabled;
  });

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(EFFECTS_KEY, String(next));
      return next;
    });
  }, []);

  const value = useMemo(() => ({ enabled, toggle }), [enabled, toggle]);
  return (
    <EffectsContext.Provider value={value}>{children}</EffectsContext.Provider>
  );
}

export function useSidebar001Effects() {
  return useContext(EffectsContext);
}

// ─── Hover context ────────────────────────────────────────────────────────────

interface HoverRect {
  top: number;
  height: number;
  left: number;
}

const HoverContext = createContext<{
  hovered: string | null;
  hoverRect: HoverRect | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setHovered: (id: string | null, rect?: HoverRect | null) => void;
}>({
  hovered: null,
  hoverRect: null,
  containerRef: { current: null },
  setHovered: () => {},
});

function HoverProvider({
  children,
  containerRef,
}: {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [hovered, setHoveredId] = useState<string | null>(null);
  const [hoverRect, setHoverRect] = useState<HoverRect | null>(null);

  const setHovered = useCallback(
    (id: string | null, rect?: HoverRect | null) => {
      setHoveredId(id);
      setHoverRect(rect ?? null);
    },
    [],
  );

  const value = useMemo(
    () => ({ hovered, hoverRect, containerRef, setHovered }),
    [hovered, hoverRect, containerRef, setHovered],
  );

  return (
    <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
  );
}

// ─── Scroll to active ─────────────────────────────────────────────────────────

function useScrollToActive(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const scrolled = useRef(false);

  useEffect(() => {
    if (!active || scrolled.current || !ref.current) return;
    scrolled.current = true;
    const el = ref.current;
    const schedule =
      typeof requestIdleCallback !== "undefined"
        ? (cb: () => void) => requestIdleCallback(cb)
        : (cb: () => void) => setTimeout(cb, 100);
    const cancel =
      typeof cancelIdleCallback !== "undefined"
        ? cancelIdleCallback
        : clearTimeout;
    const id = schedule(() => {
      const viewport = el.closest("[data-scroll-viewport]");
      if (!(viewport instanceof HTMLElement)) return;
      const vpRect = viewport.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const offset =
        elRect.top - vpRect.top - vpRect.height / 2 + elRect.height / 2;
      if (Math.abs(offset) > 40)
        viewport.scrollBy({ top: offset, behavior: "smooth" });
    });
    return () => cancel(id as number);
  }, [active]);

  useEffect(() => {
    if (!active) scrolled.current = false;
  }, [active]);

  return ref;
}

// ─── HoverHighlight ───────────────────────────────────────────────────────────

function HoverHighlight() {
  const { hoverRect, hovered } = useContext(HoverContext);
  const { enabled } = useContext(EffectsContext);

  return (
    <AnimatePresence>
      {enabled && hovered && hoverRect && (
        <motion.div
          key="sb001-hover-bg"
          className="pointer-events-none absolute z-0 rounded-md bg-accent/50"
          style={{ right: 0 }}
          initial={false}
          animate={{
            top: hoverRect.top + 2,
            height: hoverRect.height - 4,
            left: hoverRect.left,
            opacity: 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </AnimatePresence>
  );
}

// ─── Sidebar001Item ───────────────────────────────────────────────────────────

export interface Sidebar001ItemProps {
  href: string;
  label: React.ReactNode;
  isActive: boolean;
  isNew?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const Sidebar001Item = memo(function Sidebar001Item({
  href,
  label,
  isActive,
  isNew,
  className,
  onClick,
}: Sidebar001ItemProps) {
  const { hovered, setHovered, containerRef } = useContext(HoverContext);
  const isHovered = hovered === href;
  const itemRef = useScrollToActive(isActive);

  const opacity = isActive
    ? 1
    : hovered !== null
      ? isHovered
        ? 1
        : 0.3
      : 0.55;
  const x = isActive ? 8 : isHovered ? 6 : 0;

  return (
    <div className="relative">
      {isActive && (
        <motion.span
          layoutId="sb001-active-bar"
          className="pointer-events-none absolute z-10 left-[4px] top-1/2 h-[1.8px] -translate-y-1/2 rounded-full bg-accent-pro"
          animate={{ width: 23 }}
          transition={{ type: "spring", stiffness: 800, damping: 40 }}
        />
      )}

      <motion.span
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-px bg-foreground/50"
        animate={{ width: isActive ? 0 : isHovered ? 26 : 18 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
      />
      <motion.span className="pointer-events-none absolute w-[13px] left-0 top-1/4 h-px bg-foreground/30" />
      <motion.span className="pointer-events-none absolute w-[16px] left-0 top-0 h-px bg-foreground/30" />
      <motion.span className="pointer-events-none absolute w-[13px] left-0 top-3/4 h-px bg-foreground/30" />

      <motion.div
        ref={itemRef}
        animate={{ opacity, x }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        style={{ transformOrigin: "left center" }}
      >
        <a
          href={href}
          onClick={onClick}
          onMouseEnter={() => {
            const el = itemRef.current;
            const container = containerRef.current;
            if (el && container) {
              const elRect = el.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();
              setHovered(href, {
                top: elRect.top - containerRect.top,
                height: elRect.height,
                left: 25,
              });
            } else {
              setHovered(href);
            }
          }}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "relative flex items-center gap-2 ml-2 pl-4 py-1.5 text-sm select-none",
            className,
          )}
        >
          <span className="relative z-1 truncate">{label}</span>
          {isNew && (
            <span className="size-1.5 rounded-full bg-accent-pro shrink-0" />
          )}
        </a>
      </motion.div>
    </div>
  );
});

// ─── Sidebar001Separator ──────────────────────────────────────────────────────

export function Sidebar001Separator({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-0 py-3.5 mt-2 text-sm font-medium text-foreground/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── Sidebar001Group ──────────────────────────────────────────────────────────

export interface Sidebar001GroupProps {
  label: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function Sidebar001Group({
  label,
  children,
  defaultOpen = false,
  icon,
  className,
}: Sidebar001GroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const { setHovered, containerRef } = useContext(HoverContext);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsOpen(defaultOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = useCallback(() => {
    const el = buttonRef.current;
    const container = containerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setHovered(id, {
        top: elRect.top - containerRect.top,
        height: elRect.height,
        left: 0,
      });
    } else {
      setHovered(id);
    }
  }, [id, setHovered, containerRef]);

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
  }, [setHovered]);

  return (
    <div className={cn("flex flex-col", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative z-1 flex items-center gap-1.5 py-1.5 pr-2 select-none text-left w-full group"
      >
        {icon ? (
          <>
            <span className="shrink-0 text-foreground/35 [&_svg]:size-3.5">
              {icon}
            </span>
            <span className="text-sm text-foreground/45 group-hover:text-foreground/70 transition-colors duration-150 flex-1">
              {label}
            </span>
            <MotionChevron
              size={14}
              strokeWidth={2.5}
              className="shrink-0 text-foreground/25 mr-1"
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </>
        ) : (
          <>
            <MotionChevron
              size={11}
              strokeWidth={2.5}
              className="shrink-0 text-foreground/35"
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
            <span className="text-sm text-foreground/45 group-hover:text-foreground/70 transition-colors duration-150">
              {label}
            </span>
          </>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            style={{ overflow: "hidden" }}
          >
            <div className="flex flex-col pl-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sidebar001Section ────────────────────────────────────────────────────────

export function Sidebar001Section({
  label,
  children,
  className,
}: {
  label?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      {label && <Sidebar001Separator>{label}</Sidebar001Separator>}
      {children}
    </div>
  );
}

// ─── Sidebar001Content ────────────────────────────────────────────────────────

export function Sidebar001Content({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useContext(HoverContext).containerRef;

  return (
    <div
      className={cn("flex-1 overflow-y-auto py-4 no-scrollbar", className)}
      data-scroll-viewport
    >
      <div ref={containerRef} className="relative px-1">
        <HoverHighlight />
        {children}
      </div>
    </div>
  );
}

// ─── Sidebar001 (with resize) ─────────────────────────────────────────────────

export interface Sidebar001Props {
  children: React.ReactNode;
  className?: string;
  defaultEffectsEnabled?: boolean;
  /** Initial width in px. Default: 240 */
  defaultWidth?: number;
  /** Min resize width in px. Default: 160 */
  minWidth?: number;
  /** Max resize width in px. Default: 400 */
  maxWidth?: number;
}

export function Sidebar001({
  children,
  className,
  defaultEffectsEnabled = true,
  defaultWidth = 240,
  minWidth = 160,
  maxWidth = 400,
}: Sidebar001Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(defaultWidth);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      startW.current = width;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [width],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const next = Math.min(
        maxWidth,
        Math.max(minWidth, startW.current + e.clientX - startX.current),
      );
      setWidth(next);
    },
    [minWidth, maxWidth],
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <EffectsProvider defaultEnabled={defaultEffectsEnabled}>
      <HoverProvider containerRef={containerRef}>
        <aside
          className={cn(
            "relative flex flex-col h-full shrink-0 bg-background",
            className,
          )}
          style={{ width }}
        >
          {children}

          {/* Resize handle */}
          <div
            className="absolute top-0 right-0 h-full w-1 cursor-col-resize group/handle z-20"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <div className="absolute right-0 top-0 h-full w-px bg-border/50 group-hover/handle:bg-border transition-colors duration-150" />
          </div>
        </aside>
      </HoverProvider>
    </EffectsProvider>
  );
}

// ─── Sidebar001Header ─────────────────────────────────────────────────────────

export function Sidebar001Header({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("shrink-0 px-3 pt-4 pb-2", className)}>{children}</div>
  );
}

// ─── Sidebar001Footer ─────────────────────────────────────────────────────────

export function Sidebar001Footer({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "shrink-0 px-3 pb-4 pt-2 border-t border-border/50",
        className,
      )}
    >
      {children}
    </div>
  );
}
