"use client";

import { useEffect, useRef, useCallback, type CSSProperties } from "react";
import { useTheme } from "next-themes";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Bar {
  x: number;
  barWidth: number;
  current: number; // rendered height (px) — interpolated
  target: number; // lerp destination
  idle: number; // resting breath height
  timer: number; // frames until next spike
  state: "idle" | "rising" | "holding" | "falling";
  holdFrames: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function randBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// ---------------------------------------------------------------------------
// VisualizerBars
//
// Audio-visualizer-style bars anchored at the bottom.
// Spikes fire randomly with a neighborhood spread, then decay smoothly.
// Designed to sit at the bottom of a card with a gradient-mask fade up.
// ---------------------------------------------------------------------------
export interface VisualizerBarsProps {
  /** Canvas height in px. Default 72. */
  height?: number;
  /** Bar width in px. Default 2. */
  barWidth?: number;
  /** Gap between bars in px. Default 3. */
  barGap?: number;
  /** Max spike height as fraction of canvas height (0–1). Default 0.82. */
  maxSpikeFraction?: number;
  className?: string;
  style?: CSSProperties;
}

export function VisualizerBars({
  height = 72,
  barWidth = 2,
  barGap = 3,
  maxSpikeFraction = 0.82,
  className = "",
  style,
}: VisualizerBarsProps) {
  const { resolvedTheme } = useTheme();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<Bar[]>([]);
  const rafRef = useRef<number | null>(null);
  const prevTimeRef = useRef(0);

  // Theme color stored in a ref so the RAF loop always reads the latest value
  // without needing to be recreated.
  const colorRef = useRef<string>("rgba(255,255,255,0.22)");
  useEffect(() => {
    colorRef.current =
      resolvedTheme === "dark"
        ? "rgba(255, 255, 255, 0.22)"
        : "rgba(0, 0, 0, 0.16)";
  }, [resolvedTheme]);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const { width } = container.getBoundingClientRect();
    const w = Math.floor(width);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = w;
    canvas.height = height;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${height}px`;

    const step = barWidth + barGap;
    const bars: Bar[] = [];

    for (let x = 0; x <= w - barWidth; x += step) {
      const idle = randBetween(1.5, 4);
      bars.push({
        x,
        barWidth,
        current: idle,
        target: idle,
        idle,
        // Stagger timers so bars don't all spike together at startup
        timer: Math.floor(randBetween(20, 160)),
        state: "idle",
        holdFrames: 0,
      });
    }

    barsRef.current = bars;
  }, [height, barWidth, barGap]);

  const loop = useCallback(() => {
    rafRef.current = requestAnimationFrame((now) => {
      // 60 fps throttle
      const interval = 1000 / 60;
      const elapsed = now - prevTimeRef.current;
      if (elapsed < interval) {
        loop();
        return;
      }
      prevTimeRef.current = now - (elapsed % interval);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) {
        loop();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bars = barsRef.current;
      const maxH = canvas.height * maxSpikeFraction;

      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i];

        // ── State machine ──────────────────────────────────────────────
        if (bar.state === "idle") {
          // Gentle idle breathing: slowly oscillate around idle height
          const breathTarget =
            bar.idle + Math.sin(now * 0.0008 + i * 0.7) * 1.2;
          bar.current = lerp(bar.current, breathTarget, 0.08);

          bar.timer--;
          if (bar.timer <= 0) {
            // Fire a spike
            bar.target = randBetween(maxH * 0.3, maxH);
            bar.state = "rising";
            bar.holdFrames = Math.floor(randBetween(4, 14));

            // Spread a softer spike to neighbors (±1 to ±3 bars)
            const spread = Math.floor(randBetween(1, 4));
            for (let d = 1; d <= spread; d++) {
              const falloff = 1 - d / (spread + 1);
              for (const ni of [i - d, i + d]) {
                if (ni >= 0 && ni < bars.length && bars[ni].state === "idle") {
                  bars[ni].target = randBetween(
                    maxH * 0.1 * falloff,
                    bar.target * falloff * 0.75,
                  );
                  bars[ni].state = "rising";
                  bars[ni].holdFrames = Math.floor(randBetween(2, 10));
                }
              }
            }
          }
        } else if (bar.state === "rising") {
          // Fast attack: lerp up quickly
          bar.current = lerp(bar.current, bar.target, 0.32);
          if (Math.abs(bar.current - bar.target) < 0.8) {
            bar.state = "holding";
          }
        } else if (bar.state === "holding") {
          // Brief hold at peak
          bar.holdFrames--;
          if (bar.holdFrames <= 0) {
            bar.target = bar.idle;
            bar.state = "falling";
          }
        } else if (bar.state === "falling") {
          // Slow decay back to idle
          bar.current = lerp(bar.current, bar.target, 0.055);
          if (Math.abs(bar.current - bar.target) < 0.3) {
            bar.current = bar.target;
            bar.state = "idle";
            // Random interval before next spike: 60–300 frames (~1–5s)
            bar.timer = Math.floor(randBetween(60, 300));
          }
        }

        // ── Draw ───────────────────────────────────────────────────────
        const h = Math.max(0, bar.current);
        ctx.fillStyle = colorRef.current;
        ctx.fillRect(bar.x, canvas.height - h, bar.barWidth, h);
      }

      loop();
    });
  }, [maxSpikeFraction]);

  useEffect(() => {
    prevTimeRef.current = performance.now();
    init();

    const observer = new ResizeObserver(() => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      init();
      loop();
    });
    if (containerRef.current) observer.observe(containerRef.current);

    loop();

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [init, loop]);

  return (
    <div
      ref={containerRef}
      className={`absolute bottom-0 left-0 right-0 ${className}`}
      style={{ height, ...style }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
