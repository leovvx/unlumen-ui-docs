"use client";

import { useEffect } from "react";
import { useThemeTransition } from "@/lib/use-theme-transition";

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;

  return Boolean(target.closest('[contenteditable="true"]'));
}

export function GlobalThemeHotkey() {
  const { toggle } = useThemeTransition();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (e.repeat) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isEditableTarget(e.target)) return;
      if (e.key.toLowerCase() !== "d") return;

      e.preventDefault();
      toggle();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [toggle]);

  return null;
}
