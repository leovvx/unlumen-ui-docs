"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@workspace/ui/lib/utils";
import { type Frame, Matrix } from "@/registry/components/unlumen/matrix";

interface MatrixImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  data?: Frame;
  rows?: number;
  cols?: number;
  size?: number;
  gap?: number;
  palette?: { on: string; off: string };
  brightness?: number;
  invert?: boolean;
  ariaLabel?: string;
}

export function imageToMatrix(
  image: HTMLImageElement | HTMLCanvasElement,
  rows: number,
  cols: number,
  invert = false,
): Frame {
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d")!;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, cols, rows);

  const imageData = ctx.getImageData(0, 0, cols, rows);
  const pixels = imageData.data;
  const frame: Frame = [];

  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const i = (r * cols + c) * 4;
      const R = pixels[i];
      const G = pixels[i + 1];
      const B = pixels[i + 2];
      const A = pixels[i + 3] / 255;
      const luma = (0.299 * R + 0.587 * G + 0.114 * B) / 255;
      const value = (invert ? luma : 1 - luma) * A;
      row.push(Math.round(value * 100) / 100);
    }
    frame.push(row);
  }

  return frame;
}

export function fileToMatrix(
  file: File,
  rows: number,
  cols: number,
  invert?: boolean,
): Promise<Frame> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      resolve(imageToMatrix(img, rows, cols, invert));
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

export function srcToMatrix(
  src: string,
  rows: number,
  cols: number,
  invert?: boolean,
): Promise<Frame> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(imageToMatrix(img, rows, cols, invert));
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

export const MatrixImage = React.forwardRef<HTMLDivElement, MatrixImageProps>(
  (
    {
      src,
      data,
      rows = 32,
      cols = 32,
      size = 6,
      gap = 2,
      palette,
      brightness = 1,
      invert = false,
      ariaLabel,
      className,
      ...props
    },
    ref,
  ) => {
    const [frame, setFrame] = useState<Frame | null>(data ?? null);
    const prevSrc = useRef<string | undefined>(undefined);

    const loadImage = useCallback(
      async (imageSrc: string) => {
        try {
          const result = await srcToMatrix(imageSrc, rows, cols, invert);
          setFrame(result);
        } catch {
          setFrame(null);
        }
      },
      [rows, cols, invert],
    );

    useEffect(() => {
      if (data) {
        setFrame(data);
        return;
      }

      if (src && src !== prevSrc.current) {
        prevSrc.current = src;
        loadImage(src);
      }
    }, [src, data, loadImage]);

    if (!frame) {
      return (
        <div ref={ref} className={cn("inline-block", className)} {...props} />
      );
    }

    return (
      <Matrix
        ref={ref}
        rows={rows}
        cols={cols}
        pattern={frame}
        size={size}
        gap={gap}
        palette={palette}
        brightness={brightness}
        ariaLabel={ariaLabel ?? "matrix image"}
        className={className}
        {...props}
      />
    );
  },
);

MatrixImage.displayName = "MatrixImage";
