"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import useMeasure from "react-use-measure";

import { cn } from "@workspace/ui/lib/utils";

import { evaluateMathExpression } from "./math-expression";

const CURVE_COLORS = ["#3b82f6", "#22d3ee", "#f472b6", "#a78bfa"];

const CURVE_BG = [
  "rgba(59,130,246,0.08)",
  "rgba(34,211,238,0.08)",
  "rgba(244,114,182,0.08)",
  "rgba(167,139,250,0.08)",
];

function evalMath(expr: string, x: number): number | null {
  return evaluateMathExpression(expr, x);
}

function validateExpr(expr: string): boolean {
  if (!expr.trim()) return false;
  try {
    const r = evalMath(expr, 1);
    return r !== null || evalMath(expr, 0) !== null;
  } catch {
    return false;
  }
}

function buildPath(
  expr: string,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  width: number,
  height: number,
  steps = 500,
): string {
  if (!width || !height) return "";

  const toSX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
  const toSY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;

  const yRange = yMax - yMin;
  const segments: string[] = [];
  let seg: string[] = [];
  let lastY: number | null = null;

  for (let i = 0; i <= steps; i++) {
    const mx = xMin + (i / steps) * (xMax - xMin);
    const my = evalMath(expr, mx);

    if (my === null) {
      if (seg.length > 1) segments.push(seg.join(" "));
      seg = [];
      lastY = null;
      continue;
    }

    if (lastY !== null && Math.abs(my - lastY) > yRange * 2) {
      if (seg.length > 1) segments.push(seg.join(" "));
      seg = [];
    }

    const sx = toSX(mx).toFixed(2);
    const sy = toSY(my).toFixed(2);
    seg.push(seg.length === 0 ? `M ${sx} ${sy}` : `L ${sx} ${sy}`);
    lastY = my;
  }

  if (seg.length > 1) segments.push(seg.join(" "));
  return segments.join(" ");
}

function niceStep(range: number, targetCount: number): number {
  const rough = range / targetCount;
  const pow10 = Math.pow(10, Math.floor(Math.log10(Math.abs(rough) || 1)));
  for (const n of [1, 2, 2.5, 5, 10]) {
    if (n * pow10 >= rough) return n * pow10;
  }
  return pow10 * 10;
}

function getTicks(min: number, max: number, step: number): number[] {
  const ticks: number[] = [];
  const start = Math.ceil(min / step) * step;
  for (let t = start; t <= max + 1e-9; t += step) {
    ticks.push(parseFloat(t.toPrecision(10)));
  }
  return ticks;
}

function fmtLabel(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1000)
    return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (Number.isInteger(n)) return String(n);
  return n.toPrecision(3).replace(/\.?0+$/, "");
}

type ExprEntry = {
  id: string;
  expr: string;
  color: string;
  bg: string;
  valid: boolean;
};

const DEFAULT_PRESETS = [
  "sin(x)",
  "x**2 / 4 - 2",
  "tan(x)",
  "exp(-x**2 / 2)",
  "abs(sin(x)) * 3",
  "log(abs(x) + 1)",
] as const;

interface MathGraphProps {
  initialExpressions?: string[];
  xMin?: number;
  xMax?: number;
  resolution?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  animated?: boolean;
  className?: string;
}

function MathGraph({
  initialExpressions = ["sin(x)", "cos(x)"],
  xMin: initXMin = -2 * Math.PI,
  xMax: initXMax = 2 * Math.PI,
  resolution = 600,
  showGrid = true,
  showLabels = true,
  animated = true,
  className,
}: MathGraphProps) {
  const [measureRef, { width, height }] = useMeasure();

  const [xMin, setXMin] = React.useState(initXMin);
  const [xMax, setXMax] = React.useState(initXMax);
  const isDefaultView =
    Math.abs(xMin - initXMin) < 0.01 && Math.abs(xMax - initXMax) < 0.01;

  const [entries, setEntries] = React.useState<ExprEntry[]>(() =>
    initialExpressions.slice(0, 4).map((expr, i) => ({
      id: crypto.randomUUID(),
      expr,
      color: CURVE_COLORS[i % CURVE_COLORS.length]!,
      bg: CURVE_BG[i % CURVE_BG.length]!,
      valid: true,
    })),
  );

  // debounced to avoid recomputing expensive paths/yRange on every keystroke
  const [debounced, setDebounced] = React.useState<ExprEntry[]>(entries);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(entries), 220);
    return () => clearTimeout(id);
  }, [entries]);

  // increments only on zoom (not pan) — used as motion.path key to replay the draw animation
  const [zoomKey, setZoomKey] = React.useState(0);
  const prevScaleRef = React.useRef(initXMax - initXMin);
  React.useEffect(() => {
    const newScale = xMax - xMin;
    if (
      Math.abs(newScale - prevScaleRef.current) / (prevScaleRef.current || 1) >
      5e-4
    ) {
      prevScaleRef.current = newScale;
      setZoomKey((k) => k + 1);
    }
  }, [xMin, xMax]);

  const [hover, setHover] = React.useState<{
    svgX: number;
    svgY: number;
    mathX: number;
  } | null>(null);

  const drag = React.useRef<{
    startSvgX: number;
    startXMin: number;
    startXMax: number;
  } | null>(null);

  const { yMin, yMax } = React.useMemo(() => {
    if (!width) return { yMin: -5, yMax: 5 };
    const ys: number[] = [];
    for (const e of debounced) {
      if (!e.valid || !e.expr) continue;
      for (let i = 0; i <= 300; i++) {
        const x = xMin + (i / 300) * (xMax - xMin);
        const y = evalMath(e.expr, x);
        if (y !== null) ys.push(y);
      }
    }
    if (ys.length === 0) return { yMin: -5, yMax: 5 };
    const lo = Math.min(...ys);
    const hi = Math.max(...ys);
    const pad = Math.max((hi - lo) * 0.18, 1.5);
    return { yMin: lo - pad, yMax: hi + pad };
  }, [debounced, xMin, xMax, width]);

  const toSX = React.useCallback(
    (x: number) => ((x - xMin) / (xMax - xMin)) * width,
    [xMin, xMax, width],
  );
  const toSY = React.useCallback(
    (y: number) => height - ((y - yMin) / (yMax - yMin)) * height,
    [yMin, yMax, height],
  );
  const toMX = React.useCallback(
    (sx: number) => xMin + (sx / width) * (xMax - xMin),
    [xMin, xMax, width],
  );

  const xStep = niceStep(xMax - xMin, Math.max(4, Math.floor(width / 80)));
  const yStep = niceStep(yMax - yMin, Math.max(3, Math.floor(height / 55)));
  const xTicks = getTicks(xMin, xMax, xStep);
  const yTicks = getTicks(yMin, yMax, yStep);
  const axisY = toSY(0);
  const axisX = toSX(0);

  const paths = React.useMemo(() => {
    if (!width || !height) return [];
    return debounced.map((e) => ({
      ...e,
      d:
        e.valid && e.expr
          ? buildPath(e.expr, xMin, xMax, yMin, yMax, width, height, resolution)
          : "",
    }));
  }, [debounced, xMin, xMax, yMin, yMax, width, height, resolution]);

  // non-passive wheel listener so e.preventDefault() blocks page scroll
  const graphDivRef = React.useRef<HTMLDivElement>(null);

  // stable refs so the wheel handler always has fresh values without re-creating
  const xMinRef = React.useRef(xMin);
  const xMaxRef = React.useRef(xMax);
  const widthRef = React.useRef(width);
  React.useEffect(() => {
    xMinRef.current = xMin;
  }, [xMin]);
  React.useEffect(() => {
    xMaxRef.current = xMax;
  }, [xMax]);
  React.useEffect(() => {
    widthRef.current = width;
  }, [width]);

  React.useEffect(() => {
    const el = graphDivRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const curXMin = xMinRef.current;
      const curXMax = xMaxRef.current;
      const curWidth = widthRef.current;
      const mx = curXMin + (sx / curWidth) * (curXMax - curXMin);
      const factor = e.deltaY > 0 ? 1.14 : 0.88;
      setXMin(mx + (curXMin - mx) * factor);
      setXMax(mx + (curXMax - mx) * factor);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      drag.current = {
        startSvgX: e.clientX - rect.left,
        startXMin: xMin,
        startXMax: xMax,
      };
    },
    [xMin, xMax],
  );

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const mx = toMX(sx);
      setHover({ svgX: sx, svgY: sy, mathX: mx });

      if (drag.current) {
        const dx = sx - drag.current.startSvgX;
        const range = drag.current.startXMax - drag.current.startXMin;
        const shift = -(dx / width) * range;
        setXMin(drag.current.startXMin + shift);
        setXMax(drag.current.startXMax + shift);
      }
    },
    [toMX, width],
  );

  const handleMouseUp = React.useCallback(() => {
    drag.current = null;
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    drag.current = null;
    setHover(null);
  }, []);

  const updateEntry = React.useCallback((id: string, expr: string) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        return { ...e, expr, valid: validateExpr(expr) };
      }),
    );
  }, []);

  const addEntry = React.useCallback(() => {
    if (entries.length >= 4) return;
    const idx = entries.length;
    setEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        expr: "",
        color: CURVE_COLORS[idx % CURVE_COLORS.length]!,
        bg: CURVE_BG[idx % CURVE_BG.length]!,
        valid: false,
      },
    ]);
  }, [entries.length]);

  const removeEntry = React.useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const applyPreset = React.useCallback((expr: string) => {
    setEntries([
      {
        id: crypto.randomUUID(),
        expr,
        color: CURVE_COLORS[0]!,
        bg: CURVE_BG[0]!,
        valid: true,
      },
    ]);
  }, []);

  const resetView = React.useCallback(() => {
    setXMin(initXMin);
    setXMax(initXMax);
  }, [initXMin, initXMax]);

  return (
    <div
      className={cn(
        "flex flex-col select-none overflow-hidden rounded-xl border border-border bg-background",
        className,
      )}
    >
      <div className="flex flex-col gap-1.5 p-3 border-b border-border bg-muted/20">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-white/10"
              style={{ backgroundColor: entry.color }}
            />

            <div className="relative flex-1">
              <input
                value={entry.expr}
                onChange={(ev) => updateEntry(entry.id, ev.target.value)}
                placeholder="e.g.  sin(x) * 2"
                spellCheck={false}
                autoComplete="off"
                className={cn(
                  "w-full h-8 bg-background border rounded-lg px-3 text-sm font-mono outline-none transition-all",
                  entry.expr && !entry.valid
                    ? "border-red-500/50 text-red-400 focus:border-red-400"
                    : "border-border/60 focus:border-ring",
                )}
              />
            </div>

            {entries.length > 1 && (
              <button
                onClick={() => removeEntry(entry.id)}
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors text-xs"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          {entries.length < 4 && (
            <button
              onClick={addEntry}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors h-6 px-2 rounded-md hover:bg-muted"
            >
              + function
            </button>
          )}
          <div className="flex-1" />
          {DEFAULT_PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => applyPreset(p)}
              className="text-xs h-6 px-2 rounded-md border border-border/60 bg-background hover:bg-muted transition-colors font-mono text-muted-foreground hover:text-foreground"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={(el) => {
          measureRef(el);
          (
            graphDivRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = el;
        }}
        className="relative cursor-crosshair"
        style={{ height: 380 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          width={width}
          height={height}
          className="absolute inset-0 block"
          style={{ overflow: "visible" }}
        >
          {showGrid && width > 0 && (
            <g>
              {xTicks.map((t) => (
                <line
                  key={`xg-${t}`}
                  x1={toSX(t)}
                  y1={0}
                  x2={toSX(t)}
                  y2={height}
                  stroke="currentColor"
                  strokeWidth={0.5}
                  className="text-border"
                  opacity={0.5}
                />
              ))}
              {yTicks.map((t) => (
                <line
                  key={`yg-${t}`}
                  x1={0}
                  y1={toSY(t)}
                  x2={width}
                  y2={toSY(t)}
                  stroke="currentColor"
                  strokeWidth={0.5}
                  className="text-border"
                  opacity={0.5}
                />
              ))}
            </g>
          )}

          {width > 0 && height > 0 && (
            <g>
              {axisY >= 0 && axisY <= height && (
                <line
                  x1={0}
                  y1={axisY}
                  x2={width}
                  y2={axisY}
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="text-foreground/25"
                />
              )}
              {axisX >= 0 && axisX <= width && (
                <line
                  x1={axisX}
                  y1={0}
                  x2={axisX}
                  y2={height}
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="text-foreground/25"
                />
              )}
            </g>
          )}

          {showLabels && width > 0 && height > 0 && (
            <g
              fontSize={10}
              fontFamily="ui-monospace, monospace"
              className="text-muted-foreground"
            >
              {xTicks
                .filter((t) => Math.abs(t) > xStep * 0.01)
                .map((t) => {
                  const lx = toSX(t);
                  if (lx < 4 || lx > width - 4) return null;
                  const ly = Math.min(height - 4, Math.max(13, axisY + 14));
                  return (
                    <text
                      key={`xl-${t}`}
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      fill="currentColor"
                      opacity={0.55}
                    >
                      {fmtLabel(t)}
                    </text>
                  );
                })}
              {yTicks
                .filter((t) => Math.abs(t) > yStep * 0.01)
                .map((t) => {
                  const ly = toSY(t);
                  if (ly < 8 || ly > height - 4) return null;
                  const lx = Math.min(width - 4, Math.max(4, axisX - 6));
                  return (
                    <text
                      key={`yl-${t}`}
                      x={lx}
                      y={ly + 3}
                      textAnchor="end"
                      fill="currentColor"
                      opacity={0.55}
                    >
                      {fmtLabel(t)}
                    </text>
                  );
                })}
            </g>
          )}

          <AnimatePresence>
            {paths.map(({ id, d, color }) =>
              d ? (
                <motion.path
                  key={`${id}-${zoomKey}`}
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    pathLength: {
                      duration: animated ? 0.7 : 0,
                      ease: [0.4, 0, 0.2, 1],
                    },
                    opacity: { duration: 0.25 },
                  }}
                />
              ) : null,
            )}
          </AnimatePresence>

          {hover && (
            <>
              <line
                x1={hover.svgX}
                y1={0}
                x2={hover.svgX}
                y2={height}
                stroke="currentColor"
                strokeWidth={1}
                className="text-foreground/15"
                strokeDasharray="4 4"
              />
              {paths.map(({ id, expr, color, valid }) => {
                if (!valid || !expr) return null;
                const y = evalMath(expr, hover.mathX);
                if (y === null) return null;
                const cy = toSY(y);
                if (cy < -4 || cy > height + 4) return null;
                return (
                  <g key={id}>
                    <circle
                      cx={hover.svgX}
                      cy={cy}
                      r={5}
                      fill={color}
                      opacity={0.2}
                    />
                    <circle
                      cx={hover.svgX}
                      cy={cy}
                      r={3}
                      fill={color}
                      stroke="white"
                      strokeWidth={1.5}
                    />
                  </g>
                );
              })}
            </>
          )}
        </svg>

        <AnimatePresence>
          {hover && (
            <motion.div
              className="absolute pointer-events-none z-10 bg-background/90 backdrop-blur-sm border border-border/60 rounded-lg px-2.5 py-1.5 text-xs font-mono shadow-lg"
              style={{
                left:
                  hover.svgX > width * 0.68 ? hover.svgX - 12 : hover.svgX + 14,
                top: Math.max(6, hover.svgY - 44),
                transform:
                  hover.svgX > width * 0.68 ? "translateX(-100%)" : undefined,
              }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.1 }}
            >
              <div className="text-muted-foreground mb-1 text-[10px]">
                x = {hover.mathX.toFixed(3)}
              </div>
              {paths.map(({ id, expr, color, valid }) => {
                if (!valid || !expr) return null;
                const y = evalMath(expr, hover.mathX);
                if (y === null) return null;
                return (
                  <div
                    key={id}
                    className="leading-snug text-[10px]"
                    style={{ color }}
                  >
                    f = {y.toFixed(4)}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between pointer-events-none">
          <AnimatePresence>
            {!isDefaultView && (
              <motion.button
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="pointer-events-auto text-[10px] text-muted-foreground/70 hover:text-foreground transition-colors h-5 px-1.5 rounded bg-background/60 backdrop-blur-sm border border-border/40 hover:bg-muted"
                onClick={resetView}
              >
                reset view
              </motion.button>
            )}
          </AnimatePresence>
          <span className="text-[10px] text-muted-foreground/30 ml-auto">
            scroll to zoom · drag to pan
          </span>
        </div>
      </div>
    </div>
  );
}

export { MathGraph, type MathGraphProps };
