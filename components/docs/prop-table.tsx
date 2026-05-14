import { cn } from "@workspace/ui/lib/utils";
import type { TypeTable as FumaTypeTable } from "fumadocs-ui/components/type-table";

type PropEntry = {
  description?: string;
  type: string;
  required?: boolean;
  default?: string;
};

type PropTableProps = React.ComponentProps<typeof FumaTypeTable>;

export function PropTable({ type }: PropTableProps) {
  const entries = Object.entries(type) as [string, PropEntry][];

  return (
    <div className="rounded-none border-border mt-4 overflow-hidden">
      {entries.map(([name, prop], i) => (
        <div
          key={name}
          className={cn(
            "flex items-start gap-4 px-5 py-4",
            i !== 0 && "border-t border-border",
          )}
        >
          {/* Prop name */}
          <div className="w-44 shrink-0">
            <code className="text-sm bg-muted py-1 px-2 rounded-lg whitespace-nowrap">
              {name}
              {prop.required ? "" : "?"}
            </code>
          </div>

          {/* Right side: type + default on same row, description below */}
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <code className="text-sm font-mono text-foreground/60 bg-muted/50 px-2 py-0.5 rounded-md whitespace-nowrap">
                {prop.type}
              </code>
              <div className="flex-1" />
              {prop.default !== undefined ? (
                <code className="text-sm font-mono text-foreground bg-muted/50 px-2 py-0.5 rounded-md whitespace-nowrap max-w-48 overflow-x-auto shrink-0">
                  {prop.default}
                </code>
              ) : (
                <span className="text-sm text-foreground/ shrink-0">—</span>
              )}
            </div>
            {prop.description && (
              <p className="text-sm text-foreground/40 leading-relaxed">
                {prop.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
