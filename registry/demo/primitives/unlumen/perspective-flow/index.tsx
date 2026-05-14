"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";

import {
  PerspectiveFlow,
  type PerspectiveFlowProps,
} from "@/registry/primitives/unlumen/perspective-flow";

type PerspectiveFlowDemoProps = Pick<
  PerspectiveFlowProps,
  "engine" | "perspective" | "gap" | "verticalGap" | "minItemWidth"
> & {
  imageCount?: number;
  smooth?: boolean;
};

export default function PerspectiveFlowDemo({
  engine = "gsap",
  perspective = 2000,
  gap = 32,
  verticalGap = 92,
  minItemWidth = 170,
  imageCount = 24,
  smooth = true,
}: PerspectiveFlowDemoProps) {
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
    const availableWidth = Math.max(320, previewWidth);
    const estimatedColumns = Math.max(
      1,
      Math.min(2, Math.round(availableWidth / (minItemWidth + 30))),
    );
    const targetWidth = Math.max(
      260,
      Math.round(
        (availableWidth - (estimatedColumns - 1) * 24) / estimatedColumns,
      ),
    );
    const targetHeight = Math.round(targetWidth * 1.2);

    return Array.from({ length: imageCount }, (_, i) => ({
      src: `https://picsum.photos/seed/ps${i + 1}/${targetWidth}/${targetHeight}`,
      alt: `Demo image ${i + 1}`,
    }));
  }, [imageCount, minItemWidth, previewWidth]);

  const reloadKey = useMemo(
    () =>
      [
        engine,
        perspective,
        gap,
        verticalGap ?? "",
        minItemWidth,
        imageCount,
        smooth,
      ].join("|"),
    [engine, perspective, gap, verticalGap, minItemWidth, imageCount, smooth],
  );

  return (
    <div ref={scrollContainerRef} className="h-full w-full overflow-y-auto">
      <div ref={contentRef}>
        <div className="spacer h-40" />
        <PerspectiveFlow
          key={reloadKey}
          images={images}
          engine={engine}
          perspective={perspective}
          maxWidth="100%"
          gap={gap}
          verticalGap={verticalGap}
          minItemWidth={minItemWidth}
          scrollContainerRef={scrollContainerRef}
        />
      </div>
    </div>
  );
}
