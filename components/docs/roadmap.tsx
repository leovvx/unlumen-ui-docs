"use client";

import { cn } from "@workspace/ui/lib/utils";
import {
  CheckmarkCircle01Icon as CheckCircle2,
  Refresh03Icon as RefreshCw,
  Bookmark01Icon as Bookmark,
  TestTube01Icon as FlaskConical,
  HelpSquareIcon as FileQuestion,
} from "hugeicons-react";
import { useState } from "react";

// ─── Status config ─────────────────────────────────────────────────────────

export type RoadmapStatus =
  | "done"
  | "in-progress"
  | "planned"
  | "experimental"
  | "tbd";

type RoadmapStatusIconProps = {
  className?: string;
  strokeWidth?: number;
};

const STATUS_CONFIG: Record<
  RoadmapStatus,
  {
    label: string;
    Icon: React.ComponentType<RoadmapStatusIconProps>;
    color: string;
    dot: string;
  }
> = {
  done: {
    label: "Done",
    Icon: CheckCircle2,
    color: "text-emerald-500",
    dot: "bg-emerald-500",
  },
  "in-progress": {
    label: "In progress",
    Icon: RefreshCw,
    color: "text-blue-500",
    dot: "bg-blue-500",
  },
  planned: {
    label: "Planned",
    Icon: Bookmark,
    color: "text-neutral-400",
    dot: "bg-neutral-400",
  },
  experimental: {
    label: "Experimental",
    Icon: FlaskConical,
    color: "text-violet-500",
    dot: "bg-violet-500",
  },
  tbd: {
    label: "To define",
    Icon: FileQuestion,
    color: "text-neutral-400",
    dot: "bg-neutral-400",
  },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as RoadmapStatus[];

// ─── Context ────────────────────────────────────────────────────────────────

import { createContext, useContext } from "react";

const RoadmapContext = createContext<{ activeFilter: RoadmapStatus | null }>({
  activeFilter: null,
});

// ─── Roadmap root ───────────────────────────────────────────────────────────

type RoadmapProps = React.ComponentProps<"div">;

export function Roadmap({ className, children, ...props }: RoadmapProps) {
  const [activeFilter, setActiveFilter] = useState<RoadmapStatus | null>(null);

  return (
    <RoadmapContext.Provider value={{ activeFilter }}>
      <div className={cn("mt-6 flex flex-col gap-8", className)} {...props}>
        {/* Filter bar */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter(null)}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
              activeFilter === null
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground",
            )}
          >
            All
          </button>
          {ALL_STATUSES.map((s) => {
            const { label, Icon, color } = STATUS_CONFIG[s];
            const active = activeFilter === s;
            return (
              <button
                key={s}
                onClick={() => setActiveFilter(active ? null : s)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground",
                )}
              >
                <Icon
                  className={cn("size-3", active ? "text-background" : color)}
                  strokeWidth={2.2}
                />
                {label}
              </button>
            );
          })}
        </div>

        {children}
      </div>
    </RoadmapContext.Provider>
  );
}

// ─── Section ────────────────────────────────────────────────────────────────

type RoadmapSectionProps = React.ComponentProps<"div"> & {
  title: string;
};

export function RoadmapSection({
  title,
  children,
  className,
  ...props
}: RoadmapSectionProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      <h3 className="text-sm font-semibold text-foreground mb-3 mt-0">
        {title}
      </h3>
      <div className="flex flex-col gap-1 pl-0">{children}</div>
    </div>
  );
}

// ─── Item ───────────────────────────────────────────────────────────────────

type RoadmapItemProps = {
  status: RoadmapStatus;
  title: string;
  description?: string;
};

export function RoadmapItem({ status, title, description }: RoadmapItemProps) {
  const { activeFilter } = useContext(RoadmapContext);
  const { Icon, color } = STATUS_CONFIG[status];

  const hidden = activeFilter !== null && activeFilter !== status;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 border border-transparent",
        status === "done"
          ? "hover:bg-emerald-500/5 hover:border-emerald-500/15"
          : status === "in-progress"
            ? "hover:bg-blue-500/5 hover:border-blue-500/15"
            : status === "experimental"
              ? "hover:bg-violet-500/5 hover:border-violet-500/15"
              : "hover:bg-accent hover:border-border/60",
        hidden ? "opacity-20 pointer-events-none" : "opacity-100",
      )}
    >
      <Icon className={cn("size-4 shrink-0 mt-0.5", color)} strokeWidth={2} />
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className={cn(
            "text-sm font-medium leading-tight",
            status === "done"
              ? "line-through text-muted-foreground"
              : "text-foreground",
          )}
        >
          {title}
        </span>
        {description && (
          <span className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Objective ──────────────────────────────────────────────────────────────

type RoadmapObjectivesProps = React.ComponentProps<"div">;

export function RoadmapObjectives({
  children,
  className,
  ...props
}: RoadmapObjectivesProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl border border-border/60 p-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type RoadmapObjectiveProps = {
  index: number;
  title: string;
  description: string;
};

export function RoadmapObjective({
  index,
  title,
  description,
}: RoadmapObjectiveProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="shrink-0 size-7 flex items-center justify-center rounded-full bg-muted text-md font-semibold text-muted-foreground mt-0.5">
        {index}
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-md font-semibold text-foreground">{title}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
    </div>
  );
}

// ─── Request form ────────────────────────────────────────────────────────────

export function RoadmapRequest() {
  return (
    <a
      className="mt-10 inline-flex rounded-md border px-3 py-2 text-sm no-underline"
      href="mailto:dev@unlumen.com?subject=Unlumen%20UI%20roadmap%20request"
    >
      Send a roadmap request
    </a>
  );
}
