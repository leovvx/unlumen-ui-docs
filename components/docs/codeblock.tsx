"use client";

import {
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from "react";
import { cn } from "@workspace/ui/lib/utils";
import {
  ScrollArea,
  ScrollBar,
  ScrollViewport,
} from "@workspace/ui/components/ui/scroll-area";
import type { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
import { CopyButton } from "@/components/buttons/copy";

export type CodeBlockProps = HTMLAttributes<HTMLElement> & {
  icon?: ReactNode;
  allowCopy?: boolean;
  viewportProps?: ScrollAreaPrimitive.ScrollAreaViewportProps;
  onCopy?: () => void;
};

export const Pre = forwardRef<HTMLPreElement, HTMLAttributes<HTMLPreElement>>(
  ({ className, ...props }, ref) => {
    return (
      <pre
        ref={ref}
        className={cn("p-4 focus-visible:outline-none", className)}
        {...props}
      >
        {props.children}
      </pre>
    );
  },
);

Pre.displayName = "Pre";

export const CodeBlock = forwardRef<HTMLElement, CodeBlockProps>(
  (
    {
      title,
      allowCopy = true,
      icon,
      viewportProps,
      onCopy: onCopyEvent,
      ...props
    },
    ref,
  ) => {
    const [isCopied, setIsCopied] = useState(false);
    const areaRef = useRef<HTMLDivElement>(null);

    const onCopy = useCallback(() => {
      const pre = areaRef.current?.getElementsByTagName("pre").item(0);

      if (!pre) return;

      const clone = pre.cloneNode(true) as HTMLElement;
      clone.querySelectorAll(".nd-copy-ignore").forEach((node) => {
        node.remove();
      });

      void navigator.clipboard.writeText(clone.textContent ?? "").then(() => {
        setIsCopied(true);
        onCopyEvent?.();
        setTimeout(() => setIsCopied(false), 3000);
      });
    }, [onCopyEvent]);

    return (
      <figure
        ref={ref}
        {...props}
        className={cn(
          "not-prose group fd-codeblock relative mt-2 mb-8 overflow-hidden rounded-xl border border-border/60 text-sm ",
          props.className,
        )}
      >
        {title ? (
          <div className="flex flex-row items-center gap-2 pl-4 pr-3 h-10  backdrop-blur-sm">
            {icon ? (
              <div
                className="text-muted-foreground/70 [&_svg]:size-3.5"
                dangerouslySetInnerHTML={
                  typeof icon === "string" ? { __html: icon } : undefined
                }
              >
                {typeof icon !== "string" ? icon : null}
              </div>
            ) : null}
            <figcaption className="flex-1 truncate text-xs font-mono text-muted-foreground font-medium">
              {title}
            </figcaption>
            {allowCopy ? (
              <CopyButton
                size="xs"
                variant="ghost"
                className="-me-1 bg-transparent hover:bg-foreground/5 dark:hover:bg-foreground/10"
                onClick={onCopy}
                isCopied={isCopied}
              />
            ) : null}
          </div>
        ) : (
          allowCopy && (
            <div className="absolute right-2 top-2 z-[2]">
              <CopyButton
                size="xs"
                variant="ghost"
                className="bg-accent/80 backdrop-blur-sm border border-border/40 hover:bg-accent"
                onClick={onCopy}
                isCopied={isCopied}
              />
            </div>
          )
        )}
        <div className={cn("p-1.5", title && "pt-1.5")}>
          <ScrollArea ref={areaRef} dir="ltr">
            <ScrollViewport
              {...viewportProps}
              data-slot="codeblock-viewport"
              className={cn(
                "max-h-[600px] bg-background rounded-lg [&_code]:!text-[13px] [&_code_.line]:!px-0",
                viewportProps?.className,
              )}
            >
              {props.children}
            </ScrollViewport>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </figure>
    );
  },
);

CodeBlock.displayName = "CodeBlock";
