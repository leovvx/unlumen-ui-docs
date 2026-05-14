"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@workspace/ui/lib/utils";

export type ExpandMenuItemType = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

export type ExpandMenuProps = {
  items: ExpandMenuItemType[];
  direction?: "up" | "down" | "left" | "right";
  showLabels?: boolean;
  triggerIcon?: React.ReactNode;
  className?: string;
};

// anchor so the trigger stays in place while items expand away from it
const anchorStyle: Record<string, React.CSSProperties> = {
  down: { top: 0, left: 0 },
  right: { top: 0, left: 0 },
  up: { bottom: 0, left: 0 },
  left: { top: 0, right: 0 },
};

// "up" / "left" need the trigger last so it stays at the anchor corner
const triggerLast = (d: string) => d === "up" || d === "left";

const flexDirMap: Record<string, React.CSSProperties["flexDirection"]> = {
  down: "column",
  up: "column",
  right: "row",
  left: "row",
};

function TriggerButton({
  open,
  triggerIcon,
  onClick,
}: {
  open: boolean;
  triggerIcon?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      layout
      onClick={onClick}
      aria-expanded={open}
      style={{ borderRadius: 9999, flexShrink: 0 }}
      className="flex items-center justify-center w-9 h-9 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer"
    >
      <motion.span
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="flex items-center justify-center"
      >
        {triggerIcon ?? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="text-gray-700"
          >
            <path d="M8 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm0 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm0 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
          </svg>
        )}
      </motion.span>
    </motion.button>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  index,
  showLabels,
}: ExpandMenuItemType & { index: number; showLabels: boolean }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{
        delay: index * 0.04,
        type: "spring",
        stiffness: 400,
        damping: 28,
      }}
      onClick={onClick}
      title={!showLabels ? label : undefined}
      style={{ borderRadius: 14, flexShrink: 0 }}
      className={cn(
        "flex items-center gap-2 hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900 cursor-pointer",
        showLabels ? "px-3 py-2 justify-start" : "w-9 h-9 justify-center",
      )}
    >
      <span className="flex-shrink-0">{icon}</span>
      {showLabels && (
        <span className="text-sm font-medium whitespace-nowrap text-left">
          {label}
        </span>
      )}
    </motion.button>
  );
}

export function ExpandMenu({
  items,
  direction = "down",
  showLabels = false,
  triggerIcon,
  className,
}: ExpandMenuProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const trigger = (
    <TriggerButton
      open={open}
      triggerIcon={triggerIcon}
      onClick={() => setOpen((v) => !v)}
    />
  );

  const menuItems = (
    <AnimatePresence>
      {open &&
        items.map((item, i) => (
          <MenuItem
            key={item.label}
            {...item}
            index={i}
            showLabels={showLabels}
            onClick={() => {
              item.onClick?.();
              setOpen(false);
            }}
          />
        ))}
    </AnimatePresence>
  );

  return (
    <div
      ref={ref}
      className={cn("relative z-50", className)}
      style={{ width: 36, height: 36 }}
    >
      <motion.div
        layout
        style={{
          position: "absolute",
          ...anchorStyle[direction],
          flexDirection: flexDirMap[direction],
          borderRadius: open ? 20 : 9999,
          padding: open ? 6 : 0,
          gap: open ? 4 : 0,
          display: "inline-flex",
          alignItems: "center",
        }}
        className="bg-white border border-gray-200 shadow-md overflow-hidden"
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        {triggerLast(direction) ? (
          <>
            {menuItems}
            {trigger}
          </>
        ) : (
          <>
            {trigger}
            {menuItems}
          </>
        )}
      </motion.div>
    </div>
  );
}
