"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { motion, useSpring, useTransform } from "motion/react";

import { cn } from "@workspace/ui/lib/utils";

function Switch({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const [isChecked, setIsChecked] = React.useState(
    checked ?? defaultChecked ?? false,
  );
  const [isPressed, setIsPressed] = React.useState(false);

  React.useEffect(() => {
    if (checked !== undefined) setIsChecked(checked);
  }, [checked]);

  const handleChange = React.useCallback(
    (val: boolean) => {
      if (checked === undefined) setIsChecked(val);
      onCheckedChange?.(val);
    },
    [checked, onCheckedChange],
  );

  // Spring-driven thumb position (0 → off, 1 → on)
  const progress = useSpring(0, {
    stiffness: 200,
    damping: 25,
  });

  React.useEffect(() => {
    progress.set(isChecked ? 1 : 0);
  }, [isChecked, progress]);

  // Thumb slides from 0px to 14px (w-8 = 32px − size-4 = 16px − 2px padding)
  const thumbX = useTransform(progress, [0, 1], [0, 14]);

  // Squish effect when pressing: thumb stretches horizontally
  const thumbScaleX = useSpring(1, {
    stiffness: 400,
    damping: 28,
  });
  const thumbScaleY = useSpring(1, {
    stiffness: 400,
    damping: 28,
  });

  React.useEffect(() => {
    thumbScaleX.set(isPressed ? 1.15 : 1);
    thumbScaleY.set(isPressed ? 0.85 : 1);
  }, [isPressed, thumbScaleX, thumbScaleY]);

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={handleChange}
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
        className,
      )}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      {...props}
    >
      <SwitchPrimitive.Thumb data-slot="switch-thumb" asChild>
        <motion.span
          className="bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full shadow-sm"
          style={{
            x: thumbX,
            scaleX: thumbScaleX,
            scaleY: thumbScaleY,
          }}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
