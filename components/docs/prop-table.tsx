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
    <div className="mt-4 overflow-hidden rounded-lg">
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="w-[22%] px-4 py-2.5 text-sm font-normal text-muted-foreground">
              Prop
            </th>
            <th className="w-[24%] px-4 py-2.5 text-sm font-normal text-muted-foreground">
              Type
            </th>
            <th className="w-[14%] px-4 py-2.5 text-sm font-normal text-muted-foreground">
              Default
            </th>
            <th className="px-4 py-2.5 text-sm font-normal text-muted-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([name, prop], i) => (
            <tr key={name} className={cn(i !== 0 && "border-t border-border")}>
              <td className="px-4 py-2.5 align-top">
                <code className="inline-block max-w-full overflow-x-auto border-0 rounded-md bg-accent px-2 py-0.5 font-mono text-sm tracking-tight text-foreground">
                  {name}
                  {prop.required ? "" : "?"}
                </code>
              </td>
              <td className="px-4 py-2.5 align-top">
                <code className="inline-block max-w-full overflow-x-auto whitespace-nowrap border-0 rounded-md bg-accent px-2 py-0.5 font-mono text-sm tracking-tight text-foreground">
                  {prop.type}
                </code>
              </td>
              <td className="px-4 py-2.5 align-top">
                {prop.default !== undefined ? (
                  <code className="inline-block max-w-full overflow-x-auto whitespace-nowrap border-0 rounded-md bg-accent px-2 py-0.5 font-mono text-sm tracking-tight text-foreground">
                    {prop.default}
                  </code>
                ) : (
                  <span className="font-mono text-sm text-muted-foreground">
                    -
                  </span>
                )}
              </td>
              <td className="px-4 py-2.5 align-top">
                {prop.description ? (
                  <span className="block text-sm leading-relaxed text-muted-foreground">
                    {prop.description}
                  </span>
                ) : (
                  <span className="font-mono text-sm text-muted-foreground">
                    -
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
