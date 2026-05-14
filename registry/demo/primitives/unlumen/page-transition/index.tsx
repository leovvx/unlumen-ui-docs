"use client";

import * as React from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

const EASE_CURTAIN = CustomEase.create(
  "pt_curtain",
  "M0,0 C0.38,0.05 0.48,0.58 0.65,0.82 0.82,1 1,1 1,1",
);

const EASE_SLIDE = CustomEase.create(
  "pt_slide",
  "M0,0 C0.178,0.031 0.279,0.802 0.345,0.856 0.421,0.918 0.374,1 1,1",
);

interface PageData {
  namespace: string;
  label: string;
  title: string;
  subtitle: string;
  accent: string;
  bg: string;
  path: string;
}

const PAGES: PageData[] = [
  {
    namespace: "home",
    label: "01",
    title: "Design",
    subtitle: "Where ideas become interfaces.",
    accent: "#818cf8",
    bg: "#0c0c12",
    path: "/home",
  },
  {
    namespace: "motion",
    label: "02",
    title: "Motion",
    subtitle: "Breath between states.",
    accent: "#fb7185",
    bg: "#120c0e",
    path: "/motion",
  },
  {
    namespace: "code",
    label: "03",
    title: "Code",
    subtitle: "Precision in every keystroke.",
    accent: "#34d399",
    bg: "#0c1210",
    path: "/code",
  },
  {
    namespace: "ship",
    label: "04",
    title: "Ship",
    subtitle: "Done is better than perfect.",
    accent: "#fbbf24",
    bg: "#121009",
    path: "/ship",
  },
];

type TransitionVariant = "curtain" | "slide";

function runCurtainTransition(
  currentEl: HTMLElement,
  nextEl: HTMLElement,
  duration: number,
): Promise<void> {
  gsap.set(nextEl, {
    clipPath: "inset(100% 0% 0% 0%)",
    opacity: 1,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 10,
    force3D: true,
  });
  return new Promise<void>((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });
    tl.to(
      currentEl,
      {
        y: "-30%",
        opacity: 0.4,
        scale: 0.8,
        duration,
        force3D: true,
        ease: EASE_CURTAIN,
      },
      0,
    ).to(
      nextEl,
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration,
        force3D: true,
        ease: EASE_CURTAIN,
      },
      0,
    );
  });
}

function runSlideTransition(
  currentEl: HTMLElement,
  nextEl: HTMLElement,
  duration: number,
): Promise<void> {
  gsap.set(nextEl, {
    opacity: 1,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    x: "100%",
    zIndex: 10,
    force3D: true,
  });
  return new Promise<void>((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });
    tl.to(
      currentEl,
      {
        x: "-50%",
        scale: 0.8,
        opacity: 0.4,
        duration,
        force3D: true,
        ease: EASE_SLIDE,
      },
      0,
    ).to(nextEl, { x: 0, duration, force3D: true, ease: EASE_SLIDE }, 0);
  });
}

interface PageTransitionDemoProps {
  variant?: TransitionVariant;
  duration?: number;
}

export default function PageTransitionDemo({
  variant = "curtain",
  duration,
}: PageTransitionDemoProps) {
  const effectiveDuration = duration ?? (variant === "slide" ? 1.5 : 0.7);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const isTransitioningRef = React.useRef(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const currentContainerRef = React.useRef<HTMLDivElement>(null);

  const configRef = React.useRef({ variant, duration: effectiveDuration });
  React.useEffect(() => {
    configRef.current = { variant, duration: effectiveDuration };
  }, [variant, effectiveDuration]);

  const goTo = React.useCallback(
    async (nextIndex: number) => {
      if (isTransitioningRef.current) return;
      if (nextIndex === currentIndex) return;

      const wrapper = wrapperRef.current;
      const currentEl = currentContainerRef.current;
      if (!wrapper || !currentEl) return;

      isTransitioningRef.current = true;
      setCurrentIndex(nextIndex);

      const nextPage = PAGES[nextIndex];

      const nextEl = document.createElement("div");
      nextEl.style.cssText = "position:absolute;inset:0;overflow:hidden;";
      nextEl.innerHTML = `
        <div style="display:flex;height:100%;width:100%;flex-direction:column;align-items:center;justify-content:center;background:${nextPage.bg};box-sizing:border-box;">
          <p style="font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:${nextPage.accent};opacity:0.6;margin-bottom:1.25rem;">${nextPage.label} — ${nextPage.path}</p>
          <h2 style="color:white;font-size:clamp(3rem,8vw,5rem);font-weight:700;line-height:1;letter-spacing:-0.04em;margin:0 0 0.75rem;">${nextPage.title}</h2>
          <p style="color:rgba(255,255,255,0.3);font-size:0.8rem;letter-spacing:0.02em;">${nextPage.subtitle}</p>
        </div>
      `;

      wrapper.appendChild(nextEl);

      const { variant: v, duration: d } = configRef.current;
      const runner = v === "slide" ? runSlideTransition : runCurtainTransition;
      await runner(currentEl, nextEl, d);

      nextEl.remove();
      gsap.set(currentEl, {
        clearProps:
          "clipPath,position,top,left,width,height,zIndex,opacity,x,y,scale,transform",
      });

      isTransitioningRef.current = false;
    },
    [currentIndex],
  );

  const page = PAGES[currentIndex];

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Page viewport */}
      <div
        ref={wrapperRef}
        className="absolute inset-0 overflow-hidden"
        style={{ backgroundColor: page.bg }}
      >
        {/* Current page — centred minimal layout */}
        <div
          ref={currentContainerRef}
          className="absolute inset-0 overflow-hidden"
          data-namespace={page.namespace}
          style={{ willChange: "transform", backfaceVisibility: "hidden" }}
        >
          <div
            className="flex h-full w-full flex-col items-center justify-center"
            style={{ backgroundColor: page.bg }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: page.accent,
                opacity: 0.6,
                marginBottom: "1.25rem",
              }}
            >
              {page.label} — {page.path}
            </p>
            <h2
              style={{
                color: "white",
                fontSize: "clamp(3rem, 8vw, 5rem)",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                margin: "0 0 0.75rem",
              }}
            >
              {page.title}
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.8rem",
                letterSpacing: "0.02em",
              }}
            >
              {page.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Centered navbar overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-5 flex justify-center">
        <nav
          className="pointer-events-auto flex items-center gap-1 rounded-full px-2 py-1.5"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {PAGES.map((p, i) => (
            <button
              key={p.namespace}
              onClick={() => goTo(i)}
              aria-label={`Go to ${p.title}`}
              className="rounded-full px-4 py-1 text-xs transition-all duration-200"
              style={{
                color: currentIndex === i ? "white" : "rgba(255,255,255,0.4)",
                background:
                  currentIndex === i ? "rgba(255,255,255,0.1)" : "transparent",
                fontWeight: currentIndex === i ? 500 : 400,
              }}
            >
              {p.title}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export { PageTransitionDemo };
