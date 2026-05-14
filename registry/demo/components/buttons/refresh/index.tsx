"use client";

import {
  RefreshButton,
  type RefreshButtonProps,
} from "@/registry/components/buttons/refresh";

type RefreshButtonDemoProps = Pick<RefreshButtonProps, "variant" | "size">;

export const RefreshButtonDemo = ({
  variant = "neutral",
  size = "icon-sm",
}: RefreshButtonDemoProps) => {
  return (
    <div className="flex min-h-[240px] items-center justify-center gap-3">
      <RefreshButton variant={variant} size={size} />
      <RefreshButton variant={variant} label="Refresh" />
    </div>
  );
};
