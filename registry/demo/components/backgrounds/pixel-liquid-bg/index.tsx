import {
  PixelLiquidBg,
  type PixelLiquidBgProps,
} from "@/registry/components/backgrounds/pixel-liquid-bg";

type PixelLiquidBgDemoProps = Pick<
  PixelLiquidBgProps,
  "pixelSize" | "resolution" | "mouseForce" | "cursorSize" | "autoDemo"
>;

export default function PixelLiquidBgDemo({
  pixelSize,
  resolution,
  mouseForce,
  cursorSize,
  autoDemo,
}: PixelLiquidBgDemoProps) {
  return (
    <PixelLiquidBg
      className="absolute inset-0 flex items-center justify-center"
      pixelSize={pixelSize}
      resolution={resolution}
      mouseForce={mouseForce}
      cursorSize={cursorSize}
      autoDemo={autoDemo}
    />
  );
}
