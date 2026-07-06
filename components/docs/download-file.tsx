"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Download, File } from "lucide-react";

interface DownloadFileProps {
  /**
   * The registry component name — used to hit the right API route and
   * determine if the file is premium-gated.
   * e.g. "glow"
   */
  name: string;
  /**
   * Path to the file relative to apps/www/registry.
   * e.g. "components/buttons/glow/index.tsx"
   */
  file: string;
  /** Filename shown in the UI and used for the download attribute. Defaults to the basename of `file`. */
  label?: string;
  /** When true, only Pro users can download. */
  pro?: boolean;
  /** Optional description shown below the button. */
  description?: string;
  className?: string;
}

export function DownloadFile({
  name,
  file,
  label,
  pro = false,
  description,
  className,
}: DownloadFileProps) {
  const filename = label ?? file.split("/").pop() ?? "file";
  const downloadUrl = `/docs/r/${name}.json`;

  return (
    <div className={cn("my-4 flex flex-col gap-1.5", className)}>
      <div
        className={cn(
          "inline-flex items-center gap-2.5 rounded-xl bg-surface px-4.5 py-3 text-base transition-colors",
          "hover:bg-muted/70 cursor-pointer",
        )}
      >
        <a
          href={downloadUrl}
          download={`${name}.json`}
          className="flex items-center gap-3 w-full no-underline text-foreground"
        >
          <File className="size-8 shrink-0 text-muted-foreground/70" />
          <div>
            <span className="font-medium">{filename}</span>
            {description && (
              <p className="text-sm text-muted-foreground/70">{description}</p>
            )}
          </div>
          <span className="ml-auto text-xs text-muted-foreground/70">
            <Download className="size-3.5" />
          </span>
        </a>
      </div>
    </div>
  );
}
