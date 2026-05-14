"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  type Variants,
} from "motion/react";
import { Pin } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

export interface PinnedListItem {
  id: string;
  name: string;
  /** e.g. "Category · Detail" */
  subtitle: string;
  icon: React.ReactNode;
}

export interface PinnedListProps {
  items: PinnedListItem[];
  className?: string;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 20, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -4,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

function ItemCard({
  item,
  pinned,
  onToggle,
}: {
  item: PinnedListItem;
  pinned: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layoutId={item.id}
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-3.5",
        "bg-muted text-muted-foreground/50",
        "border border-transparent",
        pinned && " bg-blue-100 dark:bg-blue-950/30",
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl",
          "bg-background ",
          "text-foreground/70",
        )}
      >
        {item.icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-medium leading-tight text-foreground">
          {item.name}
        </p>
        <p className="truncate text-sm text-muted-foreground">
          {item.subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-label={pinned ? `Unpin ${item.name}` : `Pin ${item.name}`}
        className={cn(
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
          "transition-colors duration-200",
          pinned
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-muted-foreground/10 text-muted-foreground hover:bg-muted-foreground/20",
        )}
      >
        <Pin
          size={17}
          className={cn(
            "transition-transform duration-200",
            pinned && "-rotate-45",
          )}
        />
      </button>
    </motion.div>
  );
}

const headingVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 22 },
  },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15, ease: "easeIn" } },
};

export function PinnedList({ items, className }: PinnedListProps) {
  const [pinnedIds, setPinnedIds] = React.useState<Set<string>>(new Set());
  // keep section visible until item exit animations finish, then unmount to trigger section exit
  const [showPinnedSection, setShowPinnedSection] = React.useState(false);
  const pinnedLengthRef = React.useRef(0);

  const togglePin = (id: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const pinned = items.filter((i) => pinnedIds.has(i.id));
  const unpinned = items.filter((i) => !pinnedIds.has(i.id));

  pinnedLengthRef.current = pinned.length;

  const [showAllSection, setShowAllSection] = React.useState(true);
  const unpinnedLengthRef = React.useRef(unpinned.length);
  unpinnedLengthRef.current = unpinned.length;

  // show as soon as something is pinned; hiding is triggered from inner AnimatePresence onExitComplete
  React.useEffect(() => {
    if (pinned.length > 0) setShowPinnedSection(true);
  }, [pinned.length]);

  React.useEffect(() => {
    if (unpinned.length > 0) setShowAllSection(true);
  }, [unpinned.length]);

  return (
    <LayoutGroup>
      <motion.div
        layout
        className={cn("flex w-full flex-col gap-1", className)}
      >
        <AnimatePresence onExitComplete={() => setShowPinnedSection(false)}>
          {showPinnedSection && (
            <motion.div
              key="pinned-section"
              layout
              variants={headingVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-1"
            >
              <motion.p
                layout="position"
                className="px-1 pb-0.5 pt-1 text-sm font-medium text-muted-foreground"
              >
                Pinned Items
              </motion.p>
              <AnimatePresence
                mode="popLayout"
                onExitComplete={() => {
                  if (pinnedLengthRef.current === 0)
                    setShowPinnedSection(false);
                }}
              >
                {pinned.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    pinned
                    onToggle={() => togglePin(item.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence onExitComplete={() => setShowAllSection(false)}>
          {showAllSection && (
            <motion.div
              key="all-section"
              layout
              variants={headingVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-1"
            >
              <motion.p
                layout="position"
                className={cn(
                  "px-1 pb-0.5 text-sm font-medium text-muted-foreground",
                  pinned.length > 0 ? "pt-3 " : "pt-1",
                )}
              >
                All Items
              </motion.p>
              <AnimatePresence
                mode="popLayout"
                onExitComplete={() => {
                  if (unpinnedLengthRef.current === 0) setShowAllSection(false);
                }}
              >
                {unpinned.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    pinned={false}
                    onToggle={() => togglePin(item.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
