"use client";

import { useEffect } from "react";

interface AutoScrollToContentOnMountProps {
  targetId: string;
  triggerKey: string;
}

export default function AutoScrollToContentOnMount({
  targetId,
  triggerKey,
}: AutoScrollToContentOnMountProps) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (window.scrollY > 8) {
        return;
      }

      const targetElement = document.getElementById(targetId);
      if (!targetElement) {
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const visualOffset = window.innerWidth >= 768 ? 72 : 52;
      const targetTop = Math.max(
        0,
        targetElement.getBoundingClientRect().top +
          window.scrollY -
          visualOffset,
      );

      window.scrollTo({
        top: targetTop,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }, 120);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [targetId, triggerKey]);

  return null;
}
