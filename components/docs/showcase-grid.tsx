"use client";

import { showcaseProjects } from "@/lib/showcase";
import { cn } from "@workspace/ui/lib/utils";
import { LinkSquare02Icon as ExternalIcon } from "hugeicons-react";
import Link from "next/link";

export function ShowcaseGrid({ className }: { className?: string }) {
  if (showcaseProjects.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-16 px-6 text-center",
          className,
        )}
      >
        <p className="text-sm font-medium text-foreground mb-1">
          No projects yet
        </p>
        <p className="text-sm text-muted-foreground max-w-sm">
          Be the first to share what you&apos;ve built with Unlumen UI.
        </p>
        <Link
          href="/showcase/submit"
          className="mt-4 inline-flex no-underline items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Submit your project
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col my-2.5 ", className)}>
      {showcaseProjects.map((project, i) => (
        <Link
          key={project.url}
          className={cn(
            "flex flex-col gap-2 px-6 no-underline py-4 hover:bg-accent rounded-3xl",
            i !== 0 && "",
          )}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* Header row: name + author + external link */}
          <div className="flex items-start gap-2">
            <div className="flex gap-2 justify-between items-center w-full">
              <Link
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-medium text-foreground no-underline hover:underline underline-offset-4  truncate"
              >
                {project.name}
              </Link>
              {/* Horizontal line */}
              <div className="flex-1 w-full h-px bg-foreground/20" />
            </div>
            <Link
              href={project.authorUrl || project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${project.name}`}
              className="shrink-0 text-muted-foreground inline-flex items-center gap-2.5 no-underline hover:text-foreground transition-colors"
            >
              by {project.author}
              <ExternalIcon className="size-3.5" strokeWidth={2} />
            </Link>
          </div>

          {/* Description */}
          <div className="text-sm text-muted-foreground items-start my-0.5 leading-relaxed">
            {project.description}
          </div>
        </Link>
      ))}
    </div>
  );
}
