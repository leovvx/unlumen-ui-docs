"use client";

import * as React from "react";
import {
  IconBolt,
  IconCloudShowers,
  IconCurrencyDollar,
  IconFlower2,
  IconMonitor,
  IconShield,
} from "nucleo-arcade";
import { motion, type HTMLMotionProps } from "motion/react";

import { cn } from "@workspace/ui/lib/utils";

export type TagVariant =
  | "digital"
  | "finance"
  | "simple"
  | "fast"
  | "secure"
  | "fluid";

export type TagSize = "sm" | "md" | "lg";

type TagIcon = React.ComponentType<{ className?: string }>;

type TagVariantConfig = {
  label: string;
  icon: TagIcon;
  container: string;
  text: string;
  iconColor: string;
  shadowColor: string;
};

const TAG_VARIANTS = {
  digital: {
    label: "Digital",
    icon: IconMonitor,
    container: "border-[#1e6ef0] bg-[#edf4ff]",
    text: "text-[#1560df]",
    iconColor: "text-[#82abf5]",
    shadowColor: "rgba(30,110,240,0.9)",
  },
  finance: {
    label: "Finance",
    icon: IconCurrencyDollar,
    container: "border-[#10b877] bg-[#e8f8f2]",
    text: "text-[#07936a]",
    iconColor: "text-[#22b37f]",
    shadowColor: "rgba(16,184,119,0.9)",
  },
  simple: {
    label: "Simple",
    icon: IconFlower2,
    container: "border-[#8b5cf6] bg-[#f3efff]",
    text: "text-[#8456ef]",
    iconColor: "text-[#8e60f5]",
    shadowColor: "rgba(139,92,246,0.88)",
  },
  fast: {
    label: "Fast",
    icon: IconBolt,
    container: "border-[#ff7308] bg-[#fff3e7]",
    text: "text-[#d56a0f]",
    iconColor: "text-[#ff7a0f]",
    shadowColor: "rgba(255,115,8,0.9)",
  },
  secure: {
    label: "Secure",
    icon: IconShield,
    container: "border-[#2848a5] bg-[#e8eefc]",
    text: "text-[#193e9d]",
    iconColor: "text-[#2848a5]",
    shadowColor: "rgba(40,72,165,0.9)",
  },
  fluid: {
    label: "Fluid",
    icon: IconCloudShowers,
    container: "border-[#11b9d8] bg-[#e6f8fc]",
    text: "text-[#0896b5]",
    iconColor: "text-[#11b9d8]",
    shadowColor: "rgba(17,185,216,0.88)",
  },
} satisfies Record<TagVariant, TagVariantConfig>;

const sizeStyles: Record<
  TagSize,
  {
    container: string;
    icon: string;
    label: string;
  }
> = {
  sm: {
    container: "gap-2 rounded-[1.35rem] border-[2px] px-3 py-2",
    icon: "size-4",
    label: "text-base",
  },
  md: {
    container: "gap-3 rounded-[1.8rem] border-[3px] px-4 py-2.5",
    icon: "size-5",
    label: "text-[2rem] leading-none",
  },
  lg: {
    container: "gap-4 rounded-[2.1rem] border-[3px] px-5 py-3",
    icon: "size-6",
    label: "text-[2.25rem] leading-none",
  },
};

export interface TagProps extends Omit<HTMLMotionProps<"div">, "style"> {
  label?: string;
  variant?: TagVariant;
  size?: TagSize;
  icon?: React.ReactNode;
  animated?: boolean;
}

export type TagGroupItem = {
  id?: string;
  label?: string;
  variant: TagVariant;
  icon?: React.ReactNode;
};

export interface TagGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: TagGroupItem[];
  size?: TagSize;
  animated?: boolean;
  staggerDelay?: number;
}

export const defaultTagItems: TagGroupItem[] = [
  { variant: "digital" },
  { variant: "finance" },
  { variant: "simple" },
  { variant: "fast" },
  { variant: "secure" },
  { variant: "fluid" },
];

export const tagVariants = Object.keys(TAG_VARIANTS) as TagVariant[];

export function Tag({
  label,
  variant = "digital",
  size = "md",
  icon,
  animated = true,
  className,
  ...props
}: Readonly<TagProps>) {
  const config = TAG_VARIANTS[variant];
  const sizeStyle = sizeStyles[size];
  const Icon = config.icon;
  const baseShadow = `-3px 6px 0 0 ${config.shadowColor}`;
  const hoverShadow = `-1.5px 3px 0 0 ${config.shadowColor}`;
  const pressedShadow = `0px 0px 0 0 ${config.shadowColor}`;

  return (
    <motion.div
      initial={
        animated
          ? {
              x: 0,
              y: 0,
              boxShadow: baseShadow,
            }
          : undefined
      }
      animate={
        animated
          ? {
              x: 0,
              y: 0,
              boxShadow: baseShadow,
            }
          : undefined
      }
      whileHover={
        animated
          ? {
              x: -3,
              y: 4,
              boxShadow: hoverShadow,
            }
          : undefined
      }
      whileTap={
        animated
          ? {
              x: -8,
              y: 8,
              boxShadow: pressedShadow,
            }
          : undefined
      }
      transition={{ type: "spring", stiffness: 360, damping: 24, mass: 0.6 }}
      className={cn(
        "inline-flex w-fit items-center font-medium tracking-[-0.045em]",
        "select-none border-solid backdrop-blur-sm",
        sizeStyle.container,
        config.container,
        className,
      )}
      {...props}
    >
      <motion.span
        animate={
          animated
            ? {
                rotate: [0, -4, 0],
                y: [0, -2, 0],
              }
            : undefined
        }
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
        className="inline-flex shrink-0 items-center justify-center"
      >
        {icon ?? <Icon className={cn(sizeStyle.icon, config.iconColor)} />}
      </motion.span>

      <span className={cn("truncate", sizeStyle.label, config.text)}>
        {label ?? config.label}
      </span>
    </motion.div>
  );
}

export function TagGroup({
  items = defaultTagItems,
  size = "md",
  animated = true,
  staggerDelay = 0.08,
  className,
  ...props
}: Readonly<TagGroupProps>) {
  return (
    <div
      className={cn("flex w-full flex-col items-start gap-10", className)}
      {...props}
    >
      {items.map((item, index) => {
        const key = item.id ?? `${item.variant}-${item.label ?? index}`;

        return (
          <motion.div
            key={key}
            initial={animated ? { opacity: 0, x: -18, scale: 0.96 } : false}
            animate={animated ? { opacity: 1, x: 0, scale: 1 } : undefined}
            transition={{
              delay: index * staggerDelay,
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Tag
              variant={item.variant}
              label={item.label}
              icon={item.icon}
              size={size}
              animated={animated}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
