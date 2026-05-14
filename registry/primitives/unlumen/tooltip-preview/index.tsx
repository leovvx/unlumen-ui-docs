"use client";

import { useState, useRef, type ReactNode, type HTMLAttributes } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@workspace/ui/lib/utils";

interface TooltipPreviewProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
  children: ReactNode;
}

function TooltipPreview({
  href,
  title,
  description,
  image,
  favicon,
  children,
  className,
  ...props
}: TooltipPreviewProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(true), 200);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(false), 100);
  };

  const domain = (() => {
    try {
      return new URL(href).hostname.replace(/^www\./, "");
    } catch {
      return href;
    }
  })();

  return (
    <span className="relative inline-block">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "underline decoration-dotted underline-offset-2 decoration-muted-foreground/50 hover:decoration-foreground/60 transition-colors",
          className,
        )}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        {...props}
      >
        {children}
      </a>

      <AnimatePresence>
        {open && (
          <motion.div
            role="tooltip"
            className={cn(
              "absolute bottom-full left-1/2 z-50 mb-3 w-64 -translate-x-1/2",
              "rounded-xl border border-border bg-card shadow-xl shadow-black/10",
              "pointer-events-none overflow-hidden",
            )}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: 4,
              scale: 0.97,
              transition: { duration: 0.1 },
            }}
            transition={{ type: "spring", duration: 0.25, bounce: 0.1 }}
            onMouseEnter={show}
            onMouseLeave={hide}
          >
            {image && (
              <div className="h-32 w-full overflow-hidden border-b border-border">
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="p-3 space-y-1">
              <div className="flex items-center gap-2">
                {favicon ? (
                  <img
                    src={favicon}
                    alt=""
                    className="h-4 w-4 rounded-sm object-contain"
                    aria-hidden
                  />
                ) : (
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-sm bg-muted text-[9px] font-bold text-muted-foreground uppercase shrink-0"
                    aria-hidden
                  >
                    {domain.charAt(0)}
                  </span>
                )}
                <span className="text-[12px] font-semibold text-foreground line-clamp-1 leading-tight">
                  {title}
                </span>
              </div>
              {description && (
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {description}
                </p>
              )}
              <p className="text-[11px] text-muted-foreground/60 truncate">
                {domain}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

export { TooltipPreview };
export type { TooltipPreviewProps };
