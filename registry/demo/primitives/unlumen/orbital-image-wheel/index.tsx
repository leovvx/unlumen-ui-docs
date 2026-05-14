"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";

import {
  OrbitalImageWheel,
  type OrbitalImageWheelProps,
} from "@/registry/primitives/unlumen/orbital-image-wheel";

type OrbitalImageWheelDemoProps = Pick<
  OrbitalImageWheelProps,
  | "turns"
  | "blur"
  | "dim"
  | "brightnessBoost"
  | "darknessStrength"
  | "minSaturation"
  | "saturationStrength"
  | "focusSpread"
  | "scaleEffect"
  | "scrollSensitivity"
  | "itemWidth"
  | "itemHeight"
  | "wheelSize"
  | "cropRatio"
  | "scrollLength"
  | "captionOffset"
  | "showCaption"
  | "subtitleDirection"
  | "subtitleSpeed"
  | "subtitleStagger"
> & {
  imageCount?: number;
  smooth?: boolean;
};

const LABELS = [
  "Neural",
  "Capsule",
  "Vision",
  "Fusion",
  "Pulse",
  "Signal",
  "Orbit",
  "Clinic",
  "Vault",
  "Prism",
  "Quantum",
  "Nova",
];

const SUBTITLES = [
  "AI diagnostics",
  "Precision delivery",
  "Imaging stack",
  "Research pipeline",
  "Real-time monitoring",
  "Clinical workflow",
  "Predictive screening",
  "Data mesh",
  "Bioinformatics",
  "Automated QA",
  "Companion model",
  "Lab insights",
];

export default function OrbitalImageWheelDemo({
  turns = 4,
  blur = 4,
  dim = 40,
  brightnessBoost = 30,
  darknessStrength = 1.05,
  minSaturation = 55,
  saturationStrength = 0.6,
  focusSpread = 0.34,
  scaleEffect = 0.06,
  scrollSensitivity = 0.7,
  itemWidth = 220,
  itemHeight = 300,
  wheelSize = 2200,
  cropRatio = 0.75,
  scrollLength = 330,
  captionOffset = 8,
  showCaption = true,
  subtitleDirection = "top",
  subtitleSpeed = 1,
  subtitleStagger = 0.018,
  imageCount = 20,
  smooth = true,
}: OrbitalImageWheelDemoProps) {
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
    const qualityBias = Math.max(1, Math.round(previewWidth / 900));
    const targetWidth = Math.max(220, Math.round(itemWidth));
    const targetHeight = Math.max(280, Math.round(itemHeight));

    return Array.from({ length: imageCount }, (_, i) => ({
      src: `https://picsum.photos/seed/oiw${i + 1}/${targetWidth * qualityBias}/${targetHeight * qualityBias}`,
      alt: `Orbital image ${i + 1}`,
      label: LABELS[i % LABELS.length],
      subtitle: SUBTITLES[i % SUBTITLES.length],
    }));
  }, [imageCount, itemWidth, itemHeight, previewWidth]);

  const reloadKey = useMemo(
    () =>
      [
        turns,
        blur,
        dim,
        brightnessBoost,
        darknessStrength,
        minSaturation,
        saturationStrength,
        focusSpread,
        scaleEffect,
        scrollSensitivity,
        itemWidth,
        itemHeight,
        wheelSize ?? "",
        cropRatio,
        scrollLength,
        captionOffset,
        showCaption,
        subtitleDirection,
        subtitleSpeed,
        subtitleStagger,
        imageCount,
        smooth,
      ].join("|"),
    [
      turns,
      blur,
      dim,
      brightnessBoost,
      darknessStrength,
      minSaturation,
      saturationStrength,
      focusSpread,
      scaleEffect,
      scrollSensitivity,
      itemWidth,
      itemHeight,
      wheelSize,
      cropRatio,
      scrollLength,
      captionOffset,
      showCaption,
      subtitleDirection,
      subtitleSpeed,
      subtitleStagger,
      imageCount,
      smooth,
    ],
  );

  return (
    <div ref={scrollContainerRef} className="h-full w-full overflow-y-auto">
      <div ref={contentRef}>
        <OrbitalImageWheel
          key={reloadKey}
          images={images}
          turns={turns}
          blur={blur}
          dim={dim}
          brightnessBoost={brightnessBoost}
          darknessStrength={darknessStrength}
          minSaturation={minSaturation}
          saturationStrength={saturationStrength}
          focusSpread={focusSpread}
          scaleEffect={scaleEffect}
          scrollSensitivity={scrollSensitivity}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
          wheelSize={wheelSize}
          cropRatio={cropRatio}
          scrollLength={scrollLength}
          captionOffset={captionOffset}
          showCaption={showCaption}
          subtitleDirection={subtitleDirection}
          subtitleSpeed={subtitleSpeed}
          subtitleStagger={subtitleStagger}
          scrollContainerRef={scrollContainerRef}
        />
      </div>
    </div>
  );
}
