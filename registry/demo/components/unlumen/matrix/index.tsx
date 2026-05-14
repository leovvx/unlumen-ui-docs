"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@workspace/ui/lib/utils";
import { UnlumenSlider } from "@workspace/ui/components/ui/unlumen-slider";
import {
  type Frame,
  Matrix,
  digits,
  emptyFrame,
  loader,
  pulse,
  setPixel,
  snake,
  wave,
} from "@/registry/components/unlumen/matrix";

const COLON: Frame = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const COLON_OFF: Frame = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

function ClockDisplay({ size = 10, gap = 2 }: { size?: number; gap?: number }) {
  const [now, setNow] = useState<Date | null>(null);
  const [colonOn, setColonOn] = useState(true);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => {
      setNow(new Date());
      setColonOn((v) => !v);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return (
      <div style={{ height: 7 * (size + gap) - gap }} className="opacity-0" />
    );
  }

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  const parts: Array<{ type: "digit"; value: number } | { type: "colon" }> = [
    { type: "digit", value: Math.floor(h / 10) },
    { type: "digit", value: h % 10 },
    { type: "colon" },
    { type: "digit", value: Math.floor(m / 10) },
    { type: "digit", value: m % 10 },
    { type: "colon" },
    { type: "digit", value: Math.floor(s / 10) },
    { type: "digit", value: s % 10 },
  ];

  return (
    <div className="flex items-center gap-1">
      {parts.map((part, i) =>
        part.type === "colon" ? (
          <Matrix
            key={i}
            rows={7}
            cols={3}
            pattern={colonOn ? COLON : COLON_OFF}
            size={size}
            gap={gap}
            ariaLabel=":"
          />
        ) : (
          <Matrix
            key={i}
            rows={7}
            cols={5}
            pattern={digits[part.value]}
            size={size}
            gap={gap}
            ariaLabel={String(part.value)}
          />
        ),
      )}
    </div>
  );
}

const NUM_BANDS = 16;

function useVuLevels(numBands: number) {
  const [levels, setLevels] = useState<number[]>(() =>
    Array.from({ length: numBands }, (_, i) => {
      const t = i / (numBands - 1);
      return 0.15 + Math.sin(t * Math.PI) * 0.55;
    }),
  );

  const frameRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      frameRef.current++;
      const f = frameRef.current;
      setLevels((prev) =>
        prev.map((v, i) => {
          const bass =
            Math.abs(Math.sin(f * 0.07 + i * 0.35)) *
            (i < numBands * 0.4 ? 0.9 : 0.5);
          const mid =
            Math.abs(Math.sin(f * 0.13 + i * 0.6)) *
            (i >= numBands * 0.3 && i < numBands * 0.7 ? 0.7 : 0.2);
          const treble =
            Math.abs(Math.sin(f * 0.21 + i * 0.9)) *
            (i >= numBands * 0.6 ? 0.6 : 0.1);
          const noise = (Math.random() - 0.5) * 0.08;
          const target = Math.max(
            0.04,
            Math.min(1, bass + mid + treble + noise),
          );
          return v + (target - v) * 0.25;
        }),
      );
    }, 60);
    return () => clearInterval(id);
  }, [numBands]);

  return levels;
}

// ─── Preset showcase ──────────────────────────────────────────────────────────

const PRESETS = [
  { name: "Loader", frames: loader },
  { name: "Wave", frames: wave },
  { name: "Snake", frames: snake },
  { name: "Pulse", frames: pulse },
] as const;

// ─── Draw pad ─────────────────────────────────────────────────────────────────

const PAD_ROWS = 7;
const PAD_COLS = 7;

function DrawPad({ size = 24, gap = 3 }: { size?: number; gap?: number }) {
  const [grid, setGrid] = useState<Frame>(() => emptyFrame(PAD_ROWS, PAD_COLS));
  const painting = useRef(false);
  const lastCell = useRef<string | null>(null);

  function toggleCell(row: number, col: number, forceOn?: boolean) {
    const key = `${row}-${col}`;
    if (key === lastCell.current) return;
    lastCell.current = key;
    setGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] =
        forceOn != null ? (forceOn ? 1 : 0) : prev[row][col] > 0 ? 0 : 1;
      return next;
    });
  }

  const cellW = size + gap;
  const svgW = PAD_COLS * cellW - gap;
  const svgH = PAD_ROWS * cellW - gap;

  function getCellFromEvent(
    e: React.MouseEvent<SVGSVGElement>,
  ): [number, number] | null {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / cellW);
    const row = Math.floor(y / cellW);
    if (row < 0 || row >= PAD_ROWS || col < 0 || col >= PAD_COLS) return null;
    return [row, col];
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="cursor-crosshair touch-none select-none"
        onMouseDown={(e) => {
          painting.current = true;
          lastCell.current = null;
          const cell = getCellFromEvent(e);
          if (cell) toggleCell(cell[0], cell[1]);
        }}
        onMouseMove={(e) => {
          if (!painting.current) return;
          const cell = getCellFromEvent(e);
          if (cell) toggleCell(cell[0], cell[1], true);
        }}
        onMouseUp={() => {
          painting.current = false;
          lastCell.current = null;
        }}
        onMouseLeave={() => {
          painting.current = false;
          lastCell.current = null;
        }}
      >
        {Array.from({ length: PAD_ROWS }, (_, row) =>
          Array.from({ length: PAD_COLS }, (_, col) => {
            const on = grid[row]?.[col] > 0;
            const cx = col * cellW + size / 2;
            const cy = row * cellW + size / 2;
            return (
              <circle
                key={`${row}-${col}`}
                cx={cx}
                cy={cy}
                r={(size / 2) * 0.85}
                className={cn(
                  "transition-all duration-100",
                  on
                    ? "fill-foreground drop-shadow-[0_0_4px_currentColor]"
                    : "fill-muted-foreground/20 hover:fill-muted-foreground/40",
                )}
              />
            );
          }),
        )}
      </svg>
      <button
        onClick={() => setGrid(emptyFrame(PAD_ROWS, PAD_COLS))}
        className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
      >
        clear
      </button>
    </div>
  );
}

// ─── Image to Frame ───────────────────────────────────────────────────────────

const IMG_MIN = 4;
const IMG_MAX = 32;
const IMG_DEFAULT = 16;

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

function ImageToFramePanel() {
  const [frame, setFrame] = useState<Frame | null>(null);
  const [rows, setRows] = useState(IMG_DEFAULT);
  const [cols, setCols] = useState(IMG_DEFAULT);
  const [threshold, setThreshold] = useState(0.5);
  const [invert, setInvert] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function recompute(
    img: HTMLImageElement,
    r: number,
    c: number,
    t: number,
    inv: boolean,
  ) {
    setFrame(imageToFrame(img, r, c, t, inv));
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      imageRef.current = img;
      recompute(img, rows, cols, threshold, invert);
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  }

  const pixelSize = Math.max(2, Math.floor(320 / Math.max(rows, cols)) - 1);

  return (
    <div className="flex flex-col items-center gap-5 w-full">
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
            "w-56 h-40 rounded-xl border-2 border-dashed",
            "transition-all duration-200 cursor-pointer",
            isDragging
              ? "border-foreground/40 bg-foreground/5"
              : "border-border hover:border-foreground/30 hover:bg-muted/30",
          )}
        >
          <svg
            width="24"
            height="24"
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
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <Matrix
            rows={rows}
            cols={cols}
            pattern={frame}
            size={pixelSize}
            gap={1}
            ariaLabel="image to frame preview"
          />
          <div className="flex flex-col gap-2.5 w-full">
            <div className="flex gap-4">
              <UnlumenSlider
                value={rows}
                onChange={(v) => {
                  const n = v as number;
                  setRows(n);
                  if (imageRef.current)
                    recompute(imageRef.current, n, cols, threshold, invert);
                }}
                min={IMG_MIN}
                max={IMG_MAX}
                step={1}
                label="rows"
                valuePosition="right"
                className="flex-1"
              />
              <UnlumenSlider
                value={cols}
                onChange={(v) => {
                  const n = v as number;
                  setCols(n);
                  if (imageRef.current)
                    recompute(imageRef.current, rows, n, threshold, invert);
                }}
                min={IMG_MIN}
                max={IMG_MAX}
                step={1}
                label="cols"
                valuePosition="right"
                className="flex-1"
              />
            </div>
            <UnlumenSlider
              value={threshold}
              onChange={(v) => {
                const n = v as number;
                setThreshold(n);
                if (imageRef.current)
                  recompute(imageRef.current, rows, cols, n, invert);
              }}
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
                  onClick={() => {
                    const next = !invert;
                    setInvert(next);
                    if (imageRef.current)
                      recompute(imageRef.current, rows, cols, threshold, next);
                  }}
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
                onClick={() => {
                  if (!frame) return;
                  navigator.clipboard.writeText(frameToCode(frame));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                }}
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

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = "clock" | "presets" | "vu" | "draw" | "image";

const TABS: { id: Tab; label: string }[] = [
  { id: "clock", label: "Clock" },
  { id: "presets", label: "Presets" },
  { id: "vu", label: "VU Meter" },
  { id: "draw", label: "Draw" },
  { id: "image", label: "Image" },
];

// ─── Main demo ────────────────────────────────────────────────────────────────

export default function MatrixDemo() {
  const [tab, setTab] = useState<Tab>("clock");
  const [activePreset, setActivePreset] = useState(0);
  const vuLevels = useVuLevels(NUM_BANDS);

  useEffect(() => {
    if (tab !== "presets") return;
    const id = setInterval(
      () => setActivePreset((p) => (p + 1) % PRESETS.length),
      2800,
    );
    return () => clearInterval(id);
  }, [tab]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 min-h-[420px]">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200",
              tab === id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Panels */}
      {tab === "clock" && (
        <div className="flex flex-col items-center gap-4">
          <ClockDisplay size={10} gap={2} />
          <p className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
            Live clock · digit matrices
          </p>
        </div>
      )}

      {tab === "presets" && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-8 items-end">
            {PRESETS.map((preset, i) => (
              <button
                key={preset.name}
                onClick={() => setActivePreset(i)}
                className="flex flex-col items-center gap-2 group"
              >
                <Matrix
                  rows={7}
                  cols={7}
                  frames={preset.frames}
                  fps={i === activePreset ? 10 : 6}
                  size={11}
                  gap={2}
                  className={cn(
                    "transition-opacity duration-300",
                    i === activePreset ? "opacity-100" : "opacity-100",
                  )}
                  ariaLabel={preset.name}
                />
                <span
                  className={cn(
                    "text-[9px] font-mono tracking-widest uppercase transition-colors duration-300",
                    i === activePreset
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground/60",
                  )}
                >
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
            Click a preset to focus
          </p>
        </div>
      )}

      {tab === "vu" && (
        <div className="flex flex-col items-center gap-4">
          <Matrix
            rows={7}
            cols={NUM_BANDS}
            mode="vu"
            levels={vuLevels}
            size={10}
            gap={2}
            ariaLabel="VU meter"
          />
          <p className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
            Simulated audio levels
          </p>
        </div>
      )}

      {tab === "draw" && (
        <div className="flex flex-col items-center gap-4">
          <DrawPad size={22} gap={3} />
          <p className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
            Click or drag to draw
          </p>
        </div>
      )}

      {tab === "image" && <ImageToFramePanel />}
    </div>
  );
}
