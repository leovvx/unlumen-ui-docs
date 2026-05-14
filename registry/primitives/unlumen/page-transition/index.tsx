"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

/* ------------------------------------------------------------------ */
/*  Custom eases — exact bezier curves from the codrops demo           */
/* ------------------------------------------------------------------ */

const EASE_CURTAIN = CustomEase.create(
  "pageTransition",
  "M0,0 C0.38,0.05 0.48,0.58 0.65,0.82 0.82,1 1,1 1,1",
);

const EASE_SLIDE = CustomEase.create(
  "pageTransition2",
  "M0,0 C0.178,0.031 0.279,0.802 0.345,0.856 0.421,0.918 0.374,1 1,1",
);

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type PageTransitionVariant = "curtain" | "slide";

export interface PageTransitionConfig {
  /** Which transition animation to use. @default "curtain" */
  variant?: PageTransitionVariant;
  /** Duration in seconds. @default 0.7 for curtain, 1.5 for slide */
  duration?: number;
}

export interface PageTransitionProviderProps {
  children: React.ReactNode;
  config?: PageTransitionConfig;
}

/* ------------------------------------------------------------------ */
/*  Context                                                             */
/* ------------------------------------------------------------------ */

interface TransitionContextValue {
  navigate: (href: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = React.createContext<TransitionContextValue>({
  navigate: () => {},
  isTransitioning: false,
});

export function usePageTransition() {
  return React.useContext(TransitionContext);
}

/* ------------------------------------------------------------------ */
/*  Transition animations — ported 1:1 from the codrops source         */
/* ------------------------------------------------------------------ */

function runCurtainTransition(
  currentEl: HTMLElement,
  nextEl: HTMLElement,
  duration: number,
): Promise<void> {
  // Incoming page: position fixed, hidden behind a top clip
  gsap.set(nextEl, {
    clipPath: "inset(100% 0% 0% 0%)",
    opacity: 1,
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    zIndex: 10,
    force3D: true,
  });

  return new Promise<void>((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });

    // Current page: scale down, move up, fade
    tl.to(
      currentEl,
      {
        y: "-30vh",
        opacity: 0.4,
        scale: 0.8,
        duration,
        force3D: true,
        ease: EASE_CURTAIN,
      },
      0,
    )
      // Incoming page: curtain drops from top
      .to(
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
  // Incoming page: positioned to the right, ready to slide in
  gsap.set(nextEl, {
    opacity: 1,
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    x: "100%",
    zIndex: 10,
    force3D: true,
  });

  return new Promise<void>((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });

    // Current page: push left + shrink + fade
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
    )
      // Incoming page: slide in from right
      .to(
        nextEl,
        {
          x: 0,
          duration,
          force3D: true,
          ease: EASE_SLIDE,
        },
        0,
      );
  });
}

/* ------------------------------------------------------------------ */
/*  Provider                                                            */
/* ------------------------------------------------------------------ */

export function PageTransitionProvider({
  children,
  config = {},
}: PageTransitionProviderProps) {
  const { variant = "curtain", duration } = config;
  const effectiveDuration = duration ?? (variant === "slide" ? 1.5 : 0.7);

  const router = useRouter();
  const pathname = usePathname();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const isTransitioningRef = React.useRef(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Store the latest config in a ref so the navigate callback is always fresh
  const configRef = React.useRef({ variant, duration: effectiveDuration });
  React.useEffect(() => {
    configRef.current = { variant, duration: effectiveDuration };
  }, [variant, effectiveDuration]);

  const navigate = React.useCallback(
    async (href: string) => {
      if (isTransitioningRef.current) return;
      if (href === window.location.pathname) return;

      isTransitioningRef.current = true;
      setIsTransitioning(true);

      const wrapper = wrapperRef.current;
      if (!wrapper) {
        router.push(href);
        isTransitioningRef.current = false;
        setIsTransitioning(false);
        return;
      }

      const currentContainer = wrapper.querySelector<HTMLElement>(
        "[data-pt-container]",
      );
      if (!currentContainer) {
        router.push(href);
        isTransitioningRef.current = false;
        setIsTransitioning(false);
        return;
      }

      // Pre-fetch then fetch the next page HTML
      const res = await fetch(href, { credentials: "same-origin" });
      const html = await res.text();
      const parser = new DOMParser();
      const nextDoc = parser.parseFromString(html, "text/html");
      const nextContent = nextDoc.querySelector("[data-pt-container]");

      if (!nextContent) {
        router.push(href);
        isTransitioningRef.current = false;
        setIsTransitioning(false);
        return;
      }

      // Clone and inject the next container alongside the current one
      const nextContainer = nextContent.cloneNode(true) as HTMLElement;
      wrapper.appendChild(nextContainer);

      // Wait for images in the incoming page to load
      const images = nextContainer.querySelectorAll<HTMLImageElement>("img");
      if (images.length > 0) {
        await Promise.all(
          Array.from(images).map(
            (img) =>
              new Promise<void>((resolve) => {
                if (img.complete) return resolve();
                img.onload = () => resolve();
                img.onerror = () => resolve();
              }),
          ),
        );
      }

      // Run the transition animation
      const { variant: v, duration: d } = configRef.current;
      const runner = v === "slide" ? runSlideTransition : runCurtainTransition;
      await runner(currentContainer, nextContainer, d);

      // Commit the navigation in the Next.js router
      router.push(href);

      // Clean up: remove the cloned container and reset styles
      nextContainer.remove();
      gsap.set(currentContainer, {
        clearProps:
          "clipPath,position,top,left,width,height,zIndex,opacity,x,y,scale",
      });

      isTransitioningRef.current = false;
      setIsTransitioning(false);
    },
    [router],
  );

  return (
    <TransitionContext.Provider value={{ navigate, isTransitioning }}>
      <div ref={wrapperRef} style={{ position: "relative" }}>
        <div data-pt-container>{children}</div>
      </div>
    </TransitionContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  TransitionLink — drop-in replacement for next/link                 */
/* ------------------------------------------------------------------ */

export interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export function TransitionLink({
  href,
  children,
  onClick,
  ...props
}: TransitionLinkProps) {
  const { navigate, isTransitioning } = usePageTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (cmd+click, ctrl+click) pass through normally
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onClick?.(e);
    navigate(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      aria-disabled={isTransitioning}
      {...props}
    >
      {children}
    </a>
  );
}

export default PageTransitionProvider;
