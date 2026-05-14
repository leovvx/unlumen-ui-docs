"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";

import {
  HorizontalDepthFade,
  type HorizontalDepthFadeProps,
} from "@/registry/primitives/unlumen/horizontal-depth-fade";

type HorizontalDepthFadeDemoProps = Pick<
  HorizontalDepthFadeProps,
  | "travel"
  | "blur"
  | "dim"
  | "brightnessBoost"
  | "darknessStrength"
  | "minSaturation"
  | "saturationStrength"
  | "focusSpread"
  | "scaleEffect"
  | "scrollSensitivity"
  | "gap"
  | "itemWidth"
  | "itemHeight"
  | "scrollLength"
> & {
  imageCount?: number;
  smooth?: boolean;
};

export default function HorizontalDepthFadeDemo({
  travel = 100,
  blur = 10,
  dim = 20,
  brightnessBoost = 55,
  darknessStrength = 1.35,
  minSaturation = 0,
  saturationStrength = 1.35,
  focusSpread = 0.14,
  scaleEffect = 0.11,
  scrollSensitivity = 0.6,
  gap = 24,
  itemWidth = 360,
  itemHeight = 460,
  scrollLength = 360,
  imageCount = 20,
  smooth = true,
}: HorizontalDepthFadeDemoProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(900);

  useEffect(() => {
    const node = scrollContainerRef.current;
    if (!node) return;

    const update = () => setPreviewWidth(node.clientWidth || 900);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const wrapper = scrollContainerRef.current;
    const content = contentRef.current;
    if (!smooth || !wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      lerp: 0.09,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [smooth]);

  const images = useMemo(() => {
    const targetWidth = Math.max(220, Math.round(itemWidth));
    const targetHeight = Math.max(260, Math.round(itemHeight));
    const qualityBias = Math.max(1, Math.round(previewWidth / 900));

    return Array.from({ length: imageCount }, (_, i) => ({
      src: `https://picsum.photos/seed/hbs${i + 1}/${targetWidth * qualityBias}/${targetHeight * qualityBias}`,
      alt: `Demo image ${i + 1}`,
    }));
  }, [imageCount, itemWidth, itemHeight, previewWidth]);

  const reloadKey = useMemo(
    () =>
      [
        travel,
        blur,
        dim,
        brightnessBoost,
        darknessStrength,
        minSaturation,
        saturationStrength,
        focusSpread,
        scaleEffect,
        scrollSensitivity,
        gap,
        itemWidth,
        itemHeight,
        scrollLength,
        imageCount,
        smooth,
      ].join("|"),
    [
      travel,
      blur,
      dim,
      brightnessBoost,
      darknessStrength,
      minSaturation,
      saturationStrength,
      focusSpread,
      scaleEffect,
      scrollSensitivity,
      gap,
      itemWidth,
      itemHeight,
      scrollLength,
      imageCount,
      smooth,
    ],
  );

  return (
    <div ref={scrollContainerRef} className="h-full w-full overflow-y-auto">
      <div ref={contentRef}>
        <div className="flex h-44 w-full items-center justify-center">
          <h1 className="text-center text-xl font-medium tracking-tight">
            Horizontal Depth Fade
          </h1>
        </div>

        <HorizontalDepthFade
          key={reloadKey}
          images={images}
          travel={travel}
          blur={blur}
          dim={dim}
          brightnessBoost={brightnessBoost}
          darknessStrength={darknessStrength}
          minSaturation={minSaturation}
          saturationStrength={saturationStrength}
          focusSpread={focusSpread}
          scaleEffect={scaleEffect}
          scrollSensitivity={scrollSensitivity}
          gap={gap}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
          scrollLength={scrollLength}
          scrollContainerRef={scrollContainerRef}
        />
      </div>
    </div>
  );
}
