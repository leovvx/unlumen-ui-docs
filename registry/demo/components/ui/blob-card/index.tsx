import {
  BlobCard,
  type BlobCardProps,
} from "@/registry/components/ui/blob-card";
import { Button } from "@workspace/ui/components/ui/button";

import {
  SparklesIcon,
  CodeSimpleIcon as Code2,
  Refresh03Icon as RefreshCw,
} from "hugeicons-react";

type BlobCardDemoProps = Pick<BlobCardProps, "headerHeight">;

export default function BlobCardDemo({
  headerHeight = 224,
}: BlobCardDemoProps) {
  const FEATURES = [
    { label: "Animated surface with layered depth", icon: SparklesIcon },
    { label: "Composable header and body sections", icon: Code2 },
    { label: "Tunable motion and layout props", icon: RefreshCw },
  ];

  return (
    <div className="absolute inset-0 flex w-full items-center justify-center p-8">
      <div className="max-w-sm">
        <BlobCard
          headerHeight={headerHeight}
          header={
            <>
              <span className="text-lg font-serif">
                Launch{" "}
                <span className="text-sm text-foreground/50">
                  {" "}
                  [ Product Card ]{" "}
                </span>
              </span>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-6xl font-medium tracking-tighter">
                  UI
                </span>
                <div className="flex flex-col text-xs leading-snug text-foreground/70">
                  <span>animated card</span>
                  <span>responsive content</span>
                </div>
              </div>
            </>
          }
        >
          <div className="flex w-full items-center justify-center">
            <Button variant="default" size="lg" className="px-10">
              Explore
            </Button>
          </div>
          <div className="px-8 pt-8 pb-8">
            <ul className="space-y-5">
              {FEATURES.map((f) => (
                <li
                  key={f.label}
                  className="flex items-center gap-4 text-sm text-foreground/80"
                >
                  <f.icon
                    className="size-5 shrink-0 text-foreground/50"
                    strokeWidth={1.5}
                  />
                  {f.label}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-center text-xs text-muted-foreground/80">
              Built for polished feature and product cards.
            </p>
          </div>
        </BlobCard>
      </div>
    </div>
  );
}
