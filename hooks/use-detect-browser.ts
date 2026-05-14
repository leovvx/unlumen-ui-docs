"use client";

import { useEffect, useState } from "react";

type BrowserName = "Chrome" | "Firefox" | "Safari" | "Edge" | "Unknown";

export default function useDetectBrowser(): BrowserName | null {
  const [browser, setBrowser] = useState<BrowserName | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    if (ua.includes("Edg/")) {
      setBrowser("Edge");
    } else if (ua.includes("Chrome")) {
      setBrowser("Chrome");
    } else if (ua.includes("Firefox")) {
      setBrowser("Firefox");
    } else if (ua.includes("Safari")) {
      setBrowser("Safari");
    } else {
      setBrowser("Unknown");
    }
  }, []);

  return browser;
}
