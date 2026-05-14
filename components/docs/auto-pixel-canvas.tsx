"use client";

import { useEffect, useRef, useCallback, type CSSProperties } from "react";

// ---------------------------------------------------------------------------
// Pixel — each instance stores a colorIndex and reads from a shared palette
// ref so the palette can be swapped (theme change) without rebuilding pixels.
// ---------------------------------------------------------------------------
class Pixel {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  colorIndex: number;
  paletteRef: { current: string[] };
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInteger: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    colorIndex: number,
    paletteRef: { current: string[] },
    speed: number,
    delay: number,
  ) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.colorIndex = colorIndex;
    this.paletteRef = paletteRef;
    this.speed = (Math.random() * 0.8 + 0.1) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize =
      Math.random() * (this.maxSizeInteger - this.minSize) + this.minSize;
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  draw() {
    const palette = this.paletteRef.current;
    const color = palette[this.colorIndex % palette.length];
    const offset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this.x + offset, this.y + offset, this.size, this.size);
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) this.isShimmer = true;
    if (this.isShimmer) {
      // Shimmer oscillates forever — isIdle never set to true in appear mode
      if (this.size >= this.maxSize) this.isReverse = true;
      else if (this.size <= this.minSize) this.isReverse = false;
      this.size += this.isReverse ? -this.speed : this.speed;
    } else {
      this.size += this.sizeStep;
    }
    this.draw();
  }
}

function effectiveSpeed(value: number) {
  return Math.min(Math.max(value, 0), 100) * 0.001;
}

// ---------------------------------------------------------------------------
// AutoPixelCanvas
// Renders a pixel shimmer canvas that starts automatically on mount and loops
// forever. Designed to be used as a decorative background layer.
// ---------------------------------------------------------------------------
export interface AutoPixelCanvasProps {
  /** Gap between pixels in px. Default 5. */
  gap?: number;
  /** Shimmer speed 0–100. Default 25. */
  speed?: number;
  /** Comma-separated hex colors for dark mode. */
  darkColors?: string;
  /** Comma-separated hex colors for light mode. */
  lightColors?: string;
  className?: string;
  style?: CSSProperties;
  /**
   * When provided, adds a smooth circular reveal spot at this position
   * (px coords relative to the canvas container). Set to null to fade out.
   */
  revealPos?: { x: number; y: number } | null;
  /** Radius of the mouse-reveal spot in px. Default 110. */
  revealRadius?: number;
}

const DARK = "#2a2a2a,#3b3b3b,#525252";
const LIGHT = "#d4d4d4,#bdbdbd,#a3a3a3";

/** Read current theme from the DOM directly — no React state, no re-render. */
function isDarkMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export function AutoPixelCanvas({
  gap = 5,
  speed = 25,
  darkColors = DARK,
  lightColors = LIGHT,
  className = "",
  style,
  revealPos,
  revealRadius = 110,
}: AutoPixelCanvasProps) {
  // Keep color props in refs so the MutationObserver closure always reads fresh values
  const darkColorsRef = useRef(darkColors);
  const lightColorsRef = useRef(lightColors);
  useEffect(() => {
    darkColorsRef.current = darkColors;
  }, [darkColors]);
  useEffect(() => {
    lightColorsRef.current = lightColors;
  }, [lightColors]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const rafRef = useRef<number | null>(null);
  const prevTimeRef = useRef(0);
  const prevSizeRef = useRef({ w: 0, h: 0 });

  // Palette ref — updated via MutationObserver, never causes a React re-render
  const paletteRef = useRef<string[]>(
    (isDarkMode() ? darkColors : lightColors).split(","),
  );

  // Mouse reveal state — all mutable refs so the loop reads fresh values
  const revealPosRef = useRef<{ x: number; y: number } | null>(null);
  const revealLerpXRef = useRef(0);
  const revealLerpYRef = useRef(0);
  const revealOpacityRef = useRef(0);
  const revealRadiusRef = useRef(revealRadius);

  // Sync props → refs
  useEffect(() => {
    revealRadiusRef.current = revealRadius;
  }, [revealRadius]);
  useEffect(() => {
    if (revealPos && !revealPosRef.current) {
      // First appearance — jump lerp position to avoid sliding from 0,0
      revealLerpXRef.current = revealPos.x;
      revealLerpYRef.current = revealPos.y;
    }
    revealPosRef.current = revealPos ?? null;
  }, [revealPos]);

  // Extract base maskImage from style so we can combine it dynamically
  const {
    maskImage: baseMaskProp,
    WebkitMaskImage: _wk,
    ...restStyle
  } = (style ?? {}) as CSSProperties & { WebkitMaskImage?: string };
  const baseMaskRef = useRef(baseMaskProp ?? "");
  useEffect(() => {
    baseMaskRef.current = baseMaskProp ?? "";
  }, [baseMaskProp]);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return false;

    const { width, height } = container.getBoundingClientRect();
    const w = Math.floor(width);
    const h = Math.floor(height);

    if (
      Math.abs(w - prevSizeRef.current.w) < 2 &&
      Math.abs(h - prevSizeRef.current.h) < 2
    )
      return false;
    prevSizeRef.current = { w, h };

    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    // paletteRef is kept up to date by its own useEffect — no need to sync here
    const palette = paletteRef.current;
    const gapInt = Math.max(1, Math.floor(gap));
    const spd = effectiveSpeed(speed);
    const pixels: Pixel[] = [];

    for (let x = 0; x < w; x += gapInt) {
      for (let y = 0; y < h; y += gapInt) {
        const colorIndex = Math.floor(Math.random() * palette.length);
        const dx = x - w / 2;
        const dy = y - h / 2;
        const delay = Math.sqrt(dx * dx + dy * dy);
        pixels.push(
          new Pixel(canvas, ctx, x, y, colorIndex, paletteRef, spd, delay),
        );
      }
    }

    pixelsRef.current = pixels;
    return true;
  }, [gap, speed]); // colors intentionally omitted — palette updates via paletteRef without reinit

  const loop = useCallback(() => {
    rafRef.current = requestAnimationFrame((now) => {
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
      for (const px of pixelsRef.current) px.appear();

      // Dynamic mask: combine static base with lerped mouse-reveal spot
      const container = containerRef.current;
      if (container) {
        const pos = revealPosRef.current;
        const hasSpot = pos !== null || revealOpacityRef.current > 0.004;
        if (hasSpot) {
          if (pos) {
            revealLerpXRef.current += (pos.x - revealLerpXRef.current) * 0.16;
            revealLerpYRef.current += (pos.y - revealLerpYRef.current) * 0.16;
            // Scale opacity by vertical position: full effect in bottom 35%, fades above
            const h = canvas.height || 1;
            const vw = Math.min(
              1,
              Math.max(0, (revealLerpYRef.current / h - 0.3) / 0.35),
            );
            const target = vw;
            revealOpacityRef.current +=
              (target - revealOpacityRef.current) * 0.1;
          } else {
            revealOpacityRef.current *= 0.88;
          }
          const a = revealOpacityRef.current;
          const r = revealRadiusRef.current;
          const rx = revealLerpXRef.current.toFixed(1);
          const ry = revealLerpYRef.current.toFixed(1);
          const spot = `radial-gradient(circle ${r}px at ${rx}px ${ry}px, rgba(0,0,0,${a.toFixed(3)}) 20%, transparent 100%)`;
          const base = baseMaskRef.current;
          const combined = base ? `${spot}, ${base}` : spot;
          container.style.maskImage = combined;
          container.style.setProperty("-webkit-mask-image", combined);
          container.style.maskComposite = "add";
          container.style.setProperty("-webkit-mask-composite", "source-over");
        } else {
          const base = baseMaskRef.current;
          container.style.maskImage = base;
          container.style.setProperty("-webkit-mask-image", base);
        }
      }

      loop();
    });
  }, []);

  useEffect(() => {
    prevTimeRef.current = performance.now();
    prevSizeRef.current = { w: 0, h: 0 }; // reset so first init always runs
    init();

    const resizeObserver = new ResizeObserver(() => {
      if (init()) {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        loop();
      }
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    // Watch the <html> class attribute for dark/light switches.
    // Updating paletteRef directly — zero React re-render.
    const themeObserver = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      paletteRef.current = (
        dark ? darkColorsRef.current : lightColorsRef.current
      ).split(",");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    loop();

    return () => {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [init, loop]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      style={restStyle}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
