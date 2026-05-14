"use client";

import { GlowingBadge } from "@/registry/primitives/glowing-badge";

export const GlowingBadgeDemo = ({
  variant = "success",
  pulse = true,
  dot = true,
}: {
  variant?: "default" | "success" | "warning" | "error" | "info";
  pulse?: boolean;
  dot?: boolean;
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-8">
      <GlowingBadge variant="success" pulse={pulse} dot={dot}>
        Live
      </GlowingBadge>
      <GlowingBadge variant="neutral" pulse={pulse} dot={dot}>
        Ghost
      </GlowingBadge>
      <GlowingBadge variant="info" pulse={pulse} dot={dot}>
        In Progress
      </GlowingBadge>
      <GlowingBadge variant="warning" pulse={pulse} dot={dot}>
        Pending
      </GlowingBadge>
      <GlowingBadge variant="error" pulse={pulse} dot={dot}>
        Offline
      </GlowingBadge>
      <GlowingBadge variant="default" pulse={pulse} dot={dot}>
        Draft
      </GlowingBadge>
    </div>
  );
};
