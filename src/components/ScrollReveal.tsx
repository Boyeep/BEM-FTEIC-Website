"use client";

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import clsxm from "@/lib/clsxm";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  threshold = 0.12,
  rootMargin = "0px 0px -10% 0px",
  style,
  ...rest
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setIsVisible(true);
        observer.disconnect();
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold]);

  return (
    <div
      ref={ref}
      className={clsxm(
        "scroll-reveal",
        isVisible ? "scroll-reveal-visible" : "scroll-reveal-hidden",
        className,
      )}
      style={
        {
          ...style,
          "--scroll-reveal-delay": `${delay}ms`,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </div>
  );
}
