import { Fragment, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

type KbdSize = "sm" | "md" | "lg";

interface KbdProps extends HTMLAttributes<HTMLElement> {
  size?: KbdSize;
  children: ReactNode;
}

interface ShortcutProps extends HTMLAttributes<HTMLSpanElement> {
  keys: string[];
  separator?: ReactNode;
  size?: KbdSize;
}

function Kbd({ size = "md", children, className, ...props }: KbdProps) {
  const sizeClass: Record<KbdSize, string> = {
    sm: "h-5 min-w-5 px-1.5 text-[10px]",
    md: "h-6 min-w-6 px-2 text-[11px]",
    lg: "h-7 min-w-7 px-2.5 text-xs",
  };

  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-accent font-mono font-medium leading-none text-accent-foreground/75 select-none",
        sizeClass[size],
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}

function Shortcut({
  keys,
  separator = "+",
  size = "md",
  className,
  ...props
}: ShortcutProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={keys.join(separator === "+" ? " + " : " then ")}
      {...props}
    >
      {keys.map((key, i) => (
        <Fragment key={key}>
          <Kbd size={size}>{key}</Kbd>
          {i < keys.length - 1 && (
            <span
              className="px-0.5 text-[10px] font-medium text-muted-foreground/45"
              aria-hidden
            >
              {separator}
            </span>
          )}
        </Fragment>
      ))}
    </span>
  );
}

export { Kbd, Shortcut };
export type { KbdProps, ShortcutProps, KbdSize };
