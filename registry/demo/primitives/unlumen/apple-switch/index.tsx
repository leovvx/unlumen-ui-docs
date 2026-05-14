"use client";

import { useState } from "react";
import { AppleSwitch } from "@/registry/primitives/unlumen/apple-switch";
import { cn } from "@workspace/ui/lib/utils";

const tones = ["neutral", "accent"] as const;

const AppleSwitchDemo = () => {
  const [tone, setTone] = useState<(typeof tones)[number]>("neutral");
  const [active, setActive] = useState(true);
  const [inactive, setInactive] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-5 rounded-xl p-5">
      <div className="flex items-center gap-2">
        {tones.map((toneOption) => (
          <button
            key={toneOption}
            type="button"
            aria-label={`${toneOption} color`}
            aria-pressed={tone === toneOption}
            onClick={() => setTone(toneOption)}
            className={cn(
              "size-5 rounded-full border border-white/30 outline-none transition",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              tone === toneOption && "ring-2 ring-foreground/70 ring-offset-2",
              toneOption === "neutral" ? "bg-[#34c759]" : "bg-foreground",
            )}
          />
        ))}
      </div>

      <div className=" gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <AppleSwitch
            checked={active}
            onCheckedChange={setActive}
            aria-label="Active switch"
            size="md"
            tone={tone}
          />
        </div>
      </div>
    </div>
  );
};

export default AppleSwitchDemo;
export { AppleSwitchDemo };
