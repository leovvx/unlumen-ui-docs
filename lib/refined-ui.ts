/**
 * primitives configuration for doc sidebar sections.
 *
 * Centralized config for sidebar section titles, icons, and styling.
 * Used by attach-separator.tsx to replace hardcoded logic.
 */

import DAlogo from "@/components/docs/DAlogo";
import {
  Code2 as CodeSimpleIcon,
  Image as AiImageIcon,
  LayoutGrid as LayoutGridIcon,
  RectangleHorizontal as RectangularIcon,
  Sparkles as SparklesIcon,
  Type as TextFontIcon,
} from "lucide-react";

export type RefinedUISectionConfig = {
  /** Section name (matched against node.name in attachSeparator) */
  name: string;
  /** Icon component class (React component) */
  Icon: any;
  /** Icon props */
  iconProps?: Record<string, any>;
};

export const REFINED_UI_SECTIONS: RefinedUISectionConfig[] = [
  {
    name: "Unlumen UI",
    Icon: DAlogo,
    iconProps: { size: 12 },
  },
  {
    name: "Buttons",
    Icon: RectangularIcon,
    iconProps: { strokeWidth: 1.5 },
  },
  {
    name: "Texts",
    Icon: TextFontIcon,
    iconProps: { strokeWidth: 1.5 },
  },
  {
    name: "Guide",
    Icon: CodeSimpleIcon,
    iconProps: { strokeWidth: 1.25 },
  },
  {
    name: "Menu",
    Icon: LayoutGridIcon,
    iconProps: { strokeWidth: 1.5 },
  },
  {
    name: "Showcase",
    Icon: SparklesIcon,
    iconProps: { strokeWidth: 1.5 },
  },
];
