"use client";

import { useCallback, useRef, useState } from "react";

import { cn } from "@workspace/ui/lib/utils";
import { UnlumenSlider } from "@workspace/ui/components/ui/unlumen-slider";
import { type Frame, Matrix } from "@/registry/components/unlumen/matrix";

const DEFAULT_ROWS = 16;
const DEFAULT_COLS = 16;
const MIN_SIZE = 4;
const MAX_SIZE = 32;

function imageToFrame(
  image: HTMLImageElement,
  rows: number,
  cols: number,
  threshold: number,
  invert: boolean,
): Frame {
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, cols, rows);
  const { data } = ctx.getImageData(0, 0, cols, rows);
  const frame: Frame = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const i = (r * cols + c) * 4;
      const luma =
        (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      const alpha = data[i + 3] / 255;
      const value = invert ? luma : 1 - luma;
      row.push(value * alpha >= threshold ? 1 : 0);
    }
    frame.push(row);
  }
  return frame;
}

function frameToCode(frame: Frame): string {
  const inner = frame.map((row) => `  [${row.join(", ")}]`).join(",\n");
  return `const frame: Frame = [\n${inner},\n];`;
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

export default function MatrixImageToFrameDemo() {
  const [frame, setFrame] = useState<Frame | null>(null);
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [threshold, setThreshold] = useState(0.5);
  const [invert, setInvert] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const recompute = useCallback(
    (img: HTMLImageElement, r: number, c: number, t: number, inv: boolean) => {
      setFrame(imageToFrame(img, r, c, t, inv));
    },
    [],
  );

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const img = await loadImageElement(file);
      imageRef.current = img;
      recompute(img, rows, cols, threshold, invert);
    },
    [rows, cols, threshold, invert, recompute],
  );

  const handleRows = useCallback(
    (v: number) => {
      setRows(v);
      if (imageRef.current)
        recompute(imageRef.current, v, cols, threshold, invert);
    },
    [cols, threshold, invert, recompute],
  );

  const handleCols = useCallback(
    (v: number) => {
      setCols(v);
      if (imageRef.current)
        recompute(imageRef.current, rows, v, threshold, invert);
    },
    [rows, threshold, invert, recompute],
  );

  const handleThreshold = useCallback(
    (v: number) => {
      setThreshold(v);
      if (imageRef.current) recompute(imageRef.current, rows, cols, v, invert);
    },
    [rows, cols, invert, recompute],
  );

  const handleInvert = useCallback(() => {
    const next = !invert;
    setInvert(next);
    if (imageRef.current)
      recompute(imageRef.current, rows, cols, threshold, next);
  }, [invert, rows, cols, threshold, recompute]);

  const handleCopy = useCallback(() => {
    if (!frame) return;
    navigator.clipboard.writeText(frameToCode(frame));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [frame]);

  const pixelSize = Math.max(2, Math.floor(320 / Math.max(rows, cols)) - 1);

  return (
    <div className="flex flex-col items-center gap-6 p-8 min-h-[420px]">
      {!frame ? (
        <button
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          className={cn(
            "group flex flex-col items-center justify-center gap-3",
            "w-64 h-48 rounded-xl border-2 border-dashed",
            "transition-all duration-200 cursor-pointer",
            isDragging
              ? "border-foreground/40 bg-foreground/5"
              : "border-border hover:border-foreground/30 hover:bg-muted/30",
          )}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "transition-colors duration-200",
              isDragging
                ? "text-foreground/60"
                : "text-muted-foreground group-hover:text-foreground/50",
            )}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <span className="text-xs text-muted-foreground font-mono tracking-wide">
            {isDragging ? "drop image" : "upload image"}
          </span>
        </button>
      ) : (
        <div className="flex flex-col items-center gap-5 w-full max-w-sm">
          <Matrix
            rows={rows}
            cols={cols}
            pattern={frame}
            size={pixelSize}
            gap={1}
            ariaLabel="image to matrix preview"
          />

          <div className="flex flex-col gap-2.5 w-full">
            <div className="flex gap-4">
              <UnlumenSlider
                value={rows}
                onChange={(v) => handleRows(v as number)}
                min={MIN_SIZE}
                max={MAX_SIZE}
                step={1}
                label="rows"
                valuePosition="right"
                className="flex-1"
              />
              <UnlumenSlider
                value={cols}
                onChange={(v) => handleCols(v as number)}
                min={MIN_SIZE}
                max={MAX_SIZE}
                step={1}
                label="cols"
                valuePosition="right"
                className="flex-1"
              />
            </div>

            <UnlumenSlider
              value={threshold}
              onChange={(v) => handleThreshold(v as number)}
              min={0.1}
              max={0.9}
              step={0.01}
              label="threshold"
              valuePosition="right"
              formatValue={(v) => v.toFixed(2)}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleInvert}
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase transition-colors",
                    invert
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground/60",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block w-3 h-3 rounded-full border transition-all",
                      invert
                        ? "bg-foreground border-foreground"
                        : "bg-transparent border-muted-foreground",
                    )}
                  />
                  invert
                </button>
                <button
                  onClick={() => inputRef.current?.click()}
                  className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  change
                </button>
              </div>
              <button
                onClick={handleCopy}
                className={cn(
                  "text-[10px] font-mono tracking-widest uppercase transition-colors px-2.5 py-1 rounded border",
                  copied
                    ? "border-foreground/30 text-foreground bg-foreground/5"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
                )}
              >
                {copied ? "copied!" : "copy frame"}
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
