"use client";

import {
  ProgressiveBlur,
  type ProgressiveBlurProps,
} from "@/registry/primitives/unlumen/progressive-blur";

const LINES = [
  "The quick brown fox jumps over the lazy dog.",
  "Pack my box with five dozen liquor jugs.",
  "How vexingly quick daft zebras jump!",
  "The five boxing wizards jump quickly.",
  "Sphinx of black quartz, judge my vow.",
  "Two driven jocks help fax my big quiz.",
  "Five quacking zephyrs jolt my wax bed.",
  "The jay, pig, fox, zebra and my wolves quack!",
  "Blowzy red vixens fight for a quick jump.",
  "Jumpy halfback vows to protect the dizzy quarterback.",
  "Bright vixens jump; dozy fowl quack.",
  "Quick wafting zephyrs vex bold Jim.",
  "Quick zephyrs blow, vexing daft Jim.",
  "Sex-charged fop blew my junk TV quiz.",
  "How quickly daft jumping zebras vex.",
  "Two driven jocks help fax my big quiz.",
];

type ProgressiveBlurDemoProps = Pick<
  ProgressiveBlurProps,
  "strength" | "size" | "tint"
>;

export const ProgressiveBlurDemo = ({
  strength = 4,
  size = "160px",
  tint = true,
}: ProgressiveBlurDemoProps) => {
  return (
    <div className="relative h-[500px] w-full  overflow-hidden rounded-lg border border-border bg-background">
      {/* Top blur */}
      <ProgressiveBlur side="top" strength={strength} size={size} tint={tint} />

      {/* Scrollable content */}
      <div className="h-full overflow-y-auto">
        <ul className="space-y-3">
          {LINES.map((line, i) => (
            <li
              key={i}
              className="text-4xl p-12 pb-1 text-foreground font-medium tracking-tight"
            >
              {line}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom blur */}
      <ProgressiveBlur
        side="bottom"
        strength={strength}
        size={size}
        tint={tint}
      />
    </div>
  );
};
