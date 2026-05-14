"use client";

import { MathGraph } from "@/registry/primitives/math-graph";

interface MathGraphDemoProps {
  resolution: number;
  showGrid: boolean;
  showLabels: boolean;
  animated: boolean;
}

export const MathGraphDemo = ({
  resolution = 600,
  showGrid = true,
  showLabels = true,
  animated = true,
}: MathGraphDemoProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <MathGraph
        initialExpressions={["sin(x)", "cos(x)"]}
        resolution={resolution}
        showGrid={showGrid}
        showLabels={showLabels}
        animated={animated}
        className="w-full"
      />
    </div>
  );
};
