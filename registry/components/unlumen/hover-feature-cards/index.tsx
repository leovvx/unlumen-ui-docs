"use client";

import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { motion } from "motion/react";

export interface HoverFeatureCard {
  name: string;
  description: string;
  href?: string;
  img?: string;
  imgLight?: string;
  imgClassName?: string;
  imgWidth?: number;
  containerClassName?: string;
  fadeBottom?: boolean;
  soon?: boolean;
}

export interface HoverFeatureCardsProps {
  items: HoverFeatureCard[];
  className?: string;
  renderLink?: (href: string, children: React.ReactNode) => React.ReactNode;
}

function HoverFeatureCard({
  item,
  renderLink,
}: {
  item: HoverFeatureCard;
  renderLink?: HoverFeatureCardsProps["renderLink"];
}) {
  const inner = (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      whileTap={{ scale: item.href && !item.soon ? 0.97 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      variants={{ rest: { scale: 1, y: 0 } }}
      className={cn(
        "group flex flex-col w-full relative",
        item.soon
          ? "opacity-80 cursor-not-allowed"
          : item.href
            ? "cursor-pointer"
            : "",
      )}
    >
      <div
        className={cn(
          "flex flex-col rounded-3xl border h-64 z-5 bg-surface transition-colors w-full",
          !item.soon && item.href ? "hover:border-border/80" : "",
          item.soon ? "border-dashed border-border" : "border-border",
        )}
      >
        {item.soon && (
          <span className="absolute top-3 right-3 z-10 text-xs text-muted-foreground border rounded-full px-2 py-1 bg-card">
            Coming soon
          </span>
        )}

        <div
          className={cn(
            "relative w-full overflow-hidden bg-muted/10 px-5 pt-6 pb-4 flex flex-col gap-3",
            item.containerClassName,
          )}
        >
          <span
            className={cn(
              "font-medium text-xl tracking-tight",
              item.soon ? "text-muted-foreground/80" : "text-foreground",
            )}
          >
            {item.name}
          </span>

          {item.img && (
            <img
              src={item.img}
              alt={item.name}
              width={item.imgWidth ?? 200}
              height={200}
              className={cn("h-auto hidden dark:block", item.imgClassName)}
            />
          )}
          {(item.imgLight ?? item.img) && (
            <img
              src={item.imgLight ?? item.img}
              alt={item.name}
              width={item.imgWidth ?? 200}
              height={200}
              className={cn("h-auto dark:hidden", item.imgClassName)}
            />
          )}

          {item.fadeBottom && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-22 bg-gradient-to-t from-surface to-transparent" />
          )}
        </div>
      </div>

      <motion.div
        variants={{
          rest: { opacity: 0.2, y: -30 },
          hover: { opacity: 1, y: 0 },
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="overflow-hidden z-1 w-11/12 self-center"
      >
        <div className="py-3 px-5 relative border-t-0 rounded-b-3xl border">
          <div className="pointer-events-none w-[103%] bg-gradient-to-b from-background to-transparent h-12 absolute -top-1 -left-1" />
          <p className="text-sm font-base text-muted-foreground">
            {item.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );

  if (item.href && renderLink) {
    return renderLink(item.href, inner);
  }

  return inner;
}

function HoverFeatureCards({
  items,
  className,
  renderLink,
}: HoverFeatureCardsProps) {
  return (
    <div
      className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4 w-full", className)}
    >
      {items.map((item) => (
        <HoverFeatureCard key={item.name} item={item} renderLink={renderLink} />
      ))}
    </div>
  );
}

export { HoverFeatureCards, HoverFeatureCard };
