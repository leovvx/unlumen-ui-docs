"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

class Pixel {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
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
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number,
  ) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size,
    );
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }
    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }
    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) {
      this.isIdle = true;
      return;
    } else {
      this.size -= 0.1;
    }
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }
    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

function getEffectiveSpeed(value: number, reducedMotion: boolean) {
  const min = 0;
  const max = 100;
  const throttle = 0.001;

  if (value <= min || reducedMotion) {
    return min;
  } else if (value >= max) {
    return max * throttle;
  } else {
    return value * throttle;
  }
}

export interface PixelBackgroundProps {
  gap?: number;
  speed?: number;
  darkColors?: string;
  lightColors?: string;
  className?: string;
  children: React.ReactNode;
}

const DEFAULT_DARK_COLORS = "#2a2a2a,#3b3b3b,#525252";
const DEFAULT_LIGHT_COLORS = "#d4d4d4,#bdbdbd,#a3a3a3";

export function PixelBackground({
  gap = 5,
  speed = 35,
  darkColors = DEFAULT_DARK_COLORS,
  lightColors = DEFAULT_LIGHT_COLORS,
  className = "",
  children,
}: PixelBackgroundProps) {
  const { resolvedTheme } = useTheme();
  const colors =
    (resolvedTheme === "dark" ? darkColors : lightColors) ?? lightColors;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(
    null,
  );
  const timePreviousRef = useRef(0);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    timePreviousRef.current = performance.now();
  }, []);

  const initPixels = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = width;
    canvasRef.current.height = height;
    canvasRef.current.style.width = `${width}px`;
    canvasRef.current.style.height = `${height}px`;

    const colorsArray = colors.split(",");
    const pxs: Pixel[] = [];
    const gapInt = Math.max(1, Math.floor(gap));

    for (let x = 0; x < width; x += gapInt) {
      for (let y = 0; y < height; y += gapInt) {
        const color =
          colorsArray[Math.floor(Math.random() * colorsArray.length)];
        const dx = x - width / 2;
        const dy = y - height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const delay = reducedMotionRef.current ? 0 : distance;
        pxs.push(
          new Pixel(
            canvasRef.current!,
            ctx,
            x,
            y,
            color,
            getEffectiveSpeed(speed, reducedMotionRef.current),
            delay,
          ),
        );
      }
    }
    pixelsRef.current = pxs;
  }, [gap, speed, colors]);

  const doAnimate = useCallback(function animate(
    fnName: "appear" | "disappear",
  ) {
    animationRef.current = requestAnimationFrame(() => animate(fnName));
    const timeNow = performance.now();
    const timePassed = timeNow - timePreviousRef.current;
    const timeInterval = 1000 / 60;

    if (timePassed < timeInterval) return;
    timePreviousRef.current = timeNow - (timePassed % timeInterval);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    let allIdle = true;
    for (let i = 0; i < pixelsRef.current.length; i++) {
      const pixel = pixelsRef.current[i];
      pixel[fnName]();
      if (!pixel.isIdle) {
        allIdle = false;
      }
    }
    if (allIdle && animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const handleAnimation = useCallback(
    (name: "appear" | "disappear") => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(() => doAnimate(name));
    },
    [doAnimate],
  );

  const onMouseEnter = useCallback(
    () => handleAnimation("appear"),
    [handleAnimation],
  );
  const onMouseLeave = useCallback(
    () => handleAnimation("disappear"),
    [handleAnimation],
  );

  useEffect(() => {
    initPixels();
    const observer = new ResizeObserver(() => {
      initPixels();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      observer.disconnect();
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initPixels]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden isolate ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <canvas
        className="absolute inset-0 w-full h-full pointer-events-none"
        ref={canvasRef}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
