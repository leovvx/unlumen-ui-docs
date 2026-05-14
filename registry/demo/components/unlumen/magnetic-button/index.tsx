"use client";

import { MagneticButton } from "@/registry/components/unlumen/magnetic-button";
import type { VariantProps } from "class-variance-authority";
import type { magneticButtonVariants } from "@/registry/components/unlumen/magnetic-button";

interface MagneticButtonDemoProps {
  radius?: number;
  strength?: number;
  stiffness?: number;
  damping?: number;
  variant?: VariantProps<typeof magneticButtonVariants>["variant"];
  size?: VariantProps<typeof magneticButtonVariants>["size"];
}

export const MagneticButtonDemo = ({
  radius = 100,
  strength = 0.5,
  stiffness = 150,
  damping = 15,
  variant = "default",
  size = "default",
}: MagneticButtonDemoProps) => {
  const springOptions = { stiffness, damping, mass: 0.1 };

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-16">
      <MagneticButton
        variant={variant}
        size={size}
        radius={radius}
        strength={strength}
        springOptions={springOptions}
      >
        Deploy
      </MagneticButton>

      <MagneticButton
        variant={variant}
        size={size}
        radius={radius}
        strength={strength}
        springOptions={springOptions}
      >
        Preview
      </MagneticButton>

      <MagneticButton
        variant={variant}
        size={size}
        radius={radius}
        strength={strength}
        springOptions={springOptions}
      >
        Cancel
      </MagneticButton>
    </div>
  );
};

export default MagneticButtonDemo;
