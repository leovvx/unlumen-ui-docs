"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@workspace/ui/lib/utils";
import { UnlumenSlider } from "@workspace/ui/components/ui/unlumen-slider";
import { imageToMatrix } from "@/registry/components/unlumen/matrix-image";
import { type Frame, Matrix } from "@/registry/components/unlumen/matrix";

const DEFAULT_SIZE = 24;
const MIN_SIZE = 16;
const MAX_SIZE = 96;
const MAX_CANVAS_PX = 360;
const SHIMMER_FRAMES = 20;

type Phase = "idle" | "loading" | "revealing" | "ambient";

function computeLayout(
  w: number,
  h: number,
  maxDim: number,
): { rows: number; cols: number } {
  const ratio = w / h;
  let cols: number, rows: number;
  if (ratio >= 1) {
    cols = maxDim;
    rows = Math.max(4, Math.round(maxDim / ratio));
  } else {
    rows = maxDim;
    cols = Math.max(4, Math.round(maxDim * ratio));
  }
  return { rows, cols };
}

function computeSize(rows: number, cols: number): number {
  return Math.max(2, Math.floor(MAX_CANVAS_PX / Math.max(rows, cols)) - 1);
}

// Spinning loader at arbitrary size: dots orbit the center at radius ~40% of min dimension.
function makeLoaderFrames(
  rows: number,
  cols: number,
  frameCount = 16,
): Frame[] {
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  const radius = Math.min(rows, cols) * 0.38;
  const dotCount = 8;
  const tailLength = 6;

  return Array.from({ length: frameCount }, (_, f) => {
    const frame: Frame = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => 0),
    );
    for (let i = 0; i < dotCount; i++) {
      const angle =
        (f / frameCount) * Math.PI * 2 + (i / dotCount) * Math.PI * 2;
      const x = Math.round(cx + Math.cos(angle) * radius);
      const y = Math.round(cy + Math.sin(angle) * radius);
      if (y >= 0 && y < rows && x >= 0 && x < cols) {
        const brightness = Math.max(0.15, 1 - i / tailLength);
        frame[y][x] = Math.max(frame[y][x], brightness);
      }
    }
    return frame;
  });
}

// Morph loader → image: each frame gradually replaces loader pixels with image pixels.
// Uses a random shuffle so pixels resolve in a scattered order, not row-by-row.
function makeMorphFrames(
  loaderFrames: Frame[],
  target: Frame,
  rows: number,
  cols: number,
  steps = 24,
): Frame[] {
  // Build a shuffled list of all pixel positions
  const positions: [number, number][] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) positions.push([r, c]);
  // Fisher-Yates shuffle
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  const pixelsPerStep = Math.ceil(positions.length / steps);
  const resolved = new Set<number>();

  return Array.from({ length: steps }, (_, step) => {
    const start = step * pixelsPerStep;
    const end = Math.min(start + pixelsPerStep, positions.length);
    for (let i = start; i < end; i++) {
      const [r, c] = positions[i];
      resolved.add(r * cols + c);
    }
    const loaderF =
      loaderFrames[Math.round((step / steps) * (loaderFrames.length - 1))];
    return Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) =>
        resolved.has(r * cols + c) ? target[r][c] : loaderF[r][c],
      ),
    );
  });
}

function makeShimmerFrames(
  target: Frame,
  rows: number,
  cols: number,
  count = SHIMMER_FRAMES,
): Frame[] {
  return Array.from({ length: count }, () =>
    Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => {
        const v = target[r][c];
        if (v < 0.55) return v;
        const delta = (Math.random() * 2 - 1) * 0.18;
        return Math.max(0, Math.min(1, v + delta));
      }),
    ),
  );
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

export default function MatrixImageDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [loaderFrames, setLoaderFrames] = useState<Frame[]>([]);
  const [revealFrames, setRevealFrames] = useState<Frame[]>([]);
  const [shimmerFrames, setShimmerFrames] = useState<Frame[]>([]);
  const [rows, setRows] = useState(DEFAULT_SIZE);
  const [cols, setCols] = useState(DEFAULT_SIZE);
  const [resolution, setResolution] = useState(DEFAULT_SIZE);
  const [inverted, setInverted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const fileRef = useRef<File | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const targetFrameRef = useRef<Frame | null>(null);
  const currentRowsRef = useRef(DEFAULT_SIZE);
  const currentColsRef = useRef(DEFAULT_SIZE);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File, res: number, inv: boolean) => {
      fileRef.current = file;
      setFileName(file.name);
      setLoaderFrames(makeLoaderFrames(res, res));
      setPhase("loading");

      const [img] = (await Promise.all([
        loadImageElement(file),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ])) as [HTMLImageElement, void];
      imageRef.current = img;

      const layout = computeLayout(img.naturalWidth, img.naturalHeight, res);
      const r = layout.rows;
      const c = layout.cols;
      setRows(r);
      setCols(c);
      currentRowsRef.current = r;
      currentColsRef.current = c;

      const lf = makeLoaderFrames(r, c);
      setLoaderFrames(lf);

      const target = imageToMatrix(img, r, c, inv);
      targetFrameRef.current = target;

      const morph = makeMorphFrames(lf, target, r, c);
      setRevealFrames(morph);
      setPhase("revealing");
    },
    [],
  );

  const handleRevealFrame = useCallback(
    (index: number) => {
      if (index === revealFrames.length - 1) {
        const target = targetFrameRef.current;
        if (!target) return;
        const r = currentRowsRef.current;
        const c = currentColsRef.current;
        const shimmer = makeShimmerFrames(target, r, c);
        setTimeout(() => {
          setShimmerFrames(shimmer);
          setPhase("ambient");
        }, 0);
      }
    },
    [revealFrames.length],
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      processFile(file, resolution, inverted);
    },
    [processFile, resolution, inverted],
  );

  const handleResolution = useCallback(
    (value: number) => {
      setResolution(value);
      if (!fileRef.current || !imageRef.current) return;
      const layout = computeLayout(
        imageRef.current.naturalWidth,
        imageRef.current.naturalHeight,
        value,
      );
      const r = layout.rows;
      const c = layout.cols;
      setRows(r);
      setCols(c);
      currentRowsRef.current = r;
      currentColsRef.current = c;
      const target = imageToMatrix(imageRef.current, r, c, inverted);
      targetFrameRef.current = target;
      setShimmerFrames(makeShimmerFrames(target, r, c));
      setPhase("ambient");
    },
    [inverted],
  );

  const handleInvert = useCallback(() => {
    const next = !inverted;
    setInverted(next);
    if (!imageRef.current) return;
    const r = currentRowsRef.current;
    const c = currentColsRef.current;
    const lf = makeLoaderFrames(r, c);
    setLoaderFrames(lf);
    const target = imageToMatrix(imageRef.current, r, c, next);
    targetFrameRef.current = target;
    const morph = makeMorphFrames(lf, target, r, c);
    setRevealFrames(morph);
    setPhase("revealing");
  }, [inverted]);

  const handleReset = useCallback(() => {
    setPhase("idle");
    setFileName(null);
    setInverted(false);
    setResolution(DEFAULT_SIZE);
    fileRef.current = null;
    imageRef.current = null;
    targetFrameRef.current = null;
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const size = computeSize(rows, cols);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 min-h-[420px]">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
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
          </motion.div>
        )}
      </AnimatePresence>

      {phase !== "idle" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-5"
        >
          {phase === "loading" && loaderFrames.length > 0 && (
            <Matrix
              rows={rows}
              cols={cols}
              frames={loaderFrames}
              fps={16}
              autoplay
              loop
              size={size}
              gap={1}
            />
          )}
          {phase === "revealing" && revealFrames.length > 0 && (
            <Matrix
              rows={rows}
              cols={cols}
              frames={revealFrames}
              fps={30}
              autoplay
              loop={false}
              onFrame={handleRevealFrame}
              size={size}
              gap={1}
            />
          )}
          {phase === "ambient" && shimmerFrames.length > 0 && (
            <Matrix
              rows={rows}
              cols={cols}
              frames={shimmerFrames}
              fps={10}
              autoplay
              loop
              size={size}
              gap={1}
            />
          )}

          {phase !== "loading" && (
            <div className="flex flex-col gap-2.5 w-full max-w-[320px]">
              <div className="flex items-center justify-between gap-2">
                {fileName && (
                  <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[140px]">
                    {fileName}
                  </span>
                )}
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    onClick={handleInvert}
                    className={cn(
                      "flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase transition-colors",
                      inverted
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground/60",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block w-3 h-3 rounded-full border transition-all",
                        inverted
                          ? "bg-foreground border-foreground"
                          : "bg-transparent border-muted-foreground",
                      )}
                    />
                    invert
                  </button>
                  <button
                    onClick={handleReset}
                    className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    reset
                  </button>
                </div>
              </div>

              <UnlumenSlider
                value={resolution}
                onChange={(v) => handleResolution(v as number)}
                min={MIN_SIZE}
                max={MAX_SIZE}
                step={1}
                label="res"
                valuePosition="right"
                formatValue={() => `${cols} × ${rows}`}
              />
            </div>
          )}
        </motion.div>
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
