"use client";

import { ShimmerSkeleton } from "@/registry/primitives/unlumen/shimmer-skeleton";

export const ShimmerSkeletonDemo = ({
  animate = true,
}: {
  animate?: boolean;
}) => {
  return (
    <div className="w-full max-w-sm space-y-4 p-8">
      {/* Card skeleton */}
      <div className="space-y-3">
        <ShimmerSkeleton
          className="h-40 w-full"
          rounded="lg"
          animate={animate}
        />
        <div className="flex items-center gap-3">
          <ShimmerSkeleton
            className="h-10 w-10 shrink-0"
            rounded="full"
            animate={animate}
          />
          <div className="flex-1 space-y-2">
            <ShimmerSkeleton className="h-3.5 w-3/4" animate={animate} />
            <ShimmerSkeleton className="h-3 w-1/2" animate={animate} />
          </div>
        </div>
        <ShimmerSkeleton className="h-3 w-full" animate={animate} />
        <ShimmerSkeleton className="h-3 w-5/6" animate={animate} />
        <ShimmerSkeleton className="h-3 w-4/6" animate={animate} />
      </div>
    </div>
  );
};
