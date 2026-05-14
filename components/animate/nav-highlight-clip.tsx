"use client";

import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { useHighlight } from "./highlight";
import { Button } from "@workspace/ui/components/ui/button";

const SPRING = { stiffness: 400, damping: 30 };

type NavLink = { href: string; label: string };

type NavHighlightClipProps = {
  links: NavLink[];
  /** Extra leading spacer width (px) before the first link, e.g. for a logo */
  logoSize?: number;
};

export function NavHighlightClip({
  links,
  logoSize = 41,
}: NavHighlightClipProps) {
  const { activeValue } = useHighlight();
  const selfRef = useRef<HTMLDivElement>(null);

  const topMV = useSpring(0, SPRING);
  const rightMV = useSpring(0, SPRING);
  const bottomMV = useSpring(0, SPRING);
  const leftMV = useSpring(0, SPRING);
  const opacityMV = useSpring(0, { stiffness: 300, damping: 30 });

  const clipPath = useTransform(
    [topMV, rightMV, bottomMV, leftMV],
    ([t, r, b, l]) => `inset(${t}px ${r}px ${b}px ${l}px round 6px)`,
  );

  useEffect(() => {
    const container = selfRef.current?.closest<HTMLElement>(
      '[data-slot="motion-highlight-container"]',
    );
    if (!activeValue || !container) {
      opacityMV.set(0);
      return;
    }
    const el = container.querySelector<HTMLElement>(
      `[data-value="${activeValue}"][data-highlight="true"]`,
    );
    if (!el) {
      opacityMV.set(0);
      return;
    }
    const cr = container.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const t = er.top - cr.top;
    const l = er.left - cr.left;
    topMV.set(t);
    rightMV.set(cr.width - l - er.width);
    bottomMV.set(cr.height - t - er.height);
    leftMV.set(l);
    opacityMV.set(1);
  }, [activeValue, topMV, rightMV, bottomMV, leftMV, opacityMV]);

  return (
    <>
      <div ref={selfRef} style={{ display: "none" }} />
      <motion.div
        aria-hidden
        className="flex items-center gap-1"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 40,
          clipPath,
          opacity: opacityMV,
        }}
      >
        {/* Spacer matching the logo/leading item */}
        <div style={{ width: logoSize, flexShrink: 0 }} />
        {/* Accent-colored nav links */}
        {links.map((link) => (
          <Button
            key={link.href}
            variant="highlight"
            size="sm"
            className="text-sm hidden md:flex"
            style={{ color: "var(--accent-pro)" }}
            asChild
          >
            <span>{link.label}</span>
          </Button>
        ))}
      </motion.div>
    </>
  );
}
