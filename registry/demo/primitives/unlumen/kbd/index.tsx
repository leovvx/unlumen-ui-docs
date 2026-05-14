"use client";

import { Kbd, Shortcut } from "@/registry/primitives/unlumen/kbd";

export const KbdDemo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      {/* Single keys */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {["⌘", "⌥", "⇧", "⌃", "⏎", "⌫", "⇥", "Esc"].map((key) => (
          <Kbd key={key} size={size}>
            {key}
          </Kbd>
        ))}
      </div>

      {/* Common shortcuts */}
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <div className="flex items-center justify-between gap-8">
          <span>Save file</span>
          <Shortcut keys={["⌘", "S"]} size={size} />
        </div>
        <div className="flex items-center justify-between gap-8">
          <span>Open command menu</span>
          <Shortcut keys={["⌘", "K"]} size={size} />
        </div>
        <div className="flex items-center justify-between gap-8">
          <span>Undo</span>
          <Shortcut keys={["⌘", "Z"]} size={size} />
        </div>
        <div className="flex items-center justify-between gap-8">
          <span>Find &amp; replace</span>
          <Shortcut keys={["⌘", "⇧", "H"]} size={size} />
        </div>
      </div>
    </div>
  );
};
