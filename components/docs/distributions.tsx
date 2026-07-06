"use client";

import { cn } from "@workspace/ui/lib/utils";
import { ArrowUpRight } from "lucide-react";

// ─── Featured card (top picks) ──────────────────────────────────────────────

type DistributionFeaturedCardProps = {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

export function DistributionFeaturedCard({
  name,
  description,
  href,
  icon,
}: DistributionFeaturedCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-start gap-4 rounded-xl border border-border/60 bg-muted/20 p-4",
        "hover:bg-muted/50 hover:border-border transition-all duration-150 no-underline",
      )}
    >
      <div className="shrink-0 size-10 rounded-lg overflow-hidden flex items-center justify-center bg-background border border-border/60">
        {icon}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground group-hover:text-foreground">
            {name}
          </span>
          <ArrowUpRight className="size-3 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0 mb-0">
          {description}
        </p>
      </div>
    </a>
  );
}

// ─── Compact card ───────────────────────────────────────────────────────────

type DistributionCardProps = {
  name: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
};

export function DistributionCard({
  name,
  href,
  icon,
  description,
}: DistributionCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-3",
        "hover:bg-muted/50 hover:border-border transition-all duration-150 no-underline",
      )}
    >
      <div className="shrink-0 size-8 rounded-md overflow-hidden flex items-center justify-center bg-background border border-border/60">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground leading-tight block">
          {name}
        </span>
        {description && (
          <span className="text-xs text-muted-foreground leading-tight block mt-0.5">
            {description}
          </span>
        )}
      </div>
      <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-auto" />
    </a>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

type DistributionSectionProps = {
  title: string;
  featured?: boolean;
  children: React.ReactNode;
};

export function DistributionSection({
  title,
  featured = false,
  children,
}: DistributionSectionProps) {
  return (
    <div className="flex flex-col gap-3 mt-8 first:mt-0">
      <h3 className="text-sm font-semibold text-foreground mt-0 mb-0">
        {title}
      </h3>
      <div
        className={cn(
          "grid gap-3",
          featured
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {children}
      </div>
    </div>
  );
}

// ─── FaviconIcon helper ──────────────────────────────────────────────────────

type FaviconIconProps = {
  domain: string;
  alt: string;
  size?: number;
};

export function FaviconIcon({ domain, alt, size = 32 }: FaviconIconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?sz=64&domain=${domain}`}
      alt={alt}
      width={size}
      height={size}
      className="size-full object-contain"
    />
  );
}

// ─── Suggest a distribution ──────────────────────────────────────────────────

export function DistributionSuggest() {
  return (
    <a
      className="mt-10 inline-flex rounded-md border px-3 py-2 text-sm no-underline"
      href="mailto:dev@unlumen.com?subject=Unlumen%20UI%20distribution%20suggestion"
    >
      Suggest a distribution
    </a>
  );
}
