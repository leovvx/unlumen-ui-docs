import type { BuildPageTreeOptions } from "fumadocs-core/source";
import { cn } from "@workspace/ui/lib/utils";
import { Dancing_Script } from "next/font/google";

const dancing = Dancing_Script({ subsets: ["latin"] });

const Badge = ({
  name,
  className,
  children,
}: {
  name: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <span className="flex items-center gap-3 w-full justify-between">
      <span className="!font-normal">{name}</span>{" "}
      <span
        className={cn(
          "text-[17px] text-nowrap text-foreground leading-1 font-black",
          className,
        )}
      >
        <span className={cn(dancing.className, "leading-1")}>{children}</span>
      </span>
    </span>
  );
};

export const attachFile: BuildPageTreeOptions["attachFile"] = (node, file) => {
  if (!file) return node;
  const data = file.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (data as any)._exports?.frontmatter ?? {};

  // Premium components must not show any badge in the sidebar.
  // All items should feel equally discoverable — access restriction
  // happens at the source code level, not at navigation level.
  if (raw.premium === true) {
    return node;
  }

  if (raw.new === true) {
    node.name = (
      <span className="inline-flex items-center gap-1.5">
        <span className="!font-normal">{node.name}</span>
        <span className="size-1.5 rounded-full bg-accent-pro shrink-0" />
      </span>
    );
  }

  if (raw.alpha === true) {
    node.name = (
      <Badge
        name={node.name}
        className="bg-gradient-to-br text-pink-600 dark:text-pink-400"
      >
        alpha
      </Badge>
    );
  }

  if (raw.beta === true) {
    node.name = (
      <Badge name={node.name} className="text-blue-600 dark:text-blue-400">
        beta
      </Badge>
    );
  }

  if (raw.deprecated === true) {
    node.name = (
      <Badge name={node.name} className="text-red-600 dark:text-red-400">
        deprecated
      </Badge>
    );
  }

  if (raw.updated === true) {
    node.name = (
      <Badge
        name={node.name}
        className="text-emerald-600 dark:text-emerald-400"
      >
        updated
      </Badge>
    );
  }

  return node;
};
