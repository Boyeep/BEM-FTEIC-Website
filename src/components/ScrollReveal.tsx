"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const element = ref.current;
    if (!element || reduceMotion.matches || !element.animate) return;

    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    let animation: Animation | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        animation = element.animate(
          [
            {
              opacity: 0,
              transform: "translate3d(0, 16px, 0) scale(0.995)",
            },
            { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
          ],
          {
            duration: 320,
            delay,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "backwards",
          },
        );
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
      animation?.cancel();
    };
  }, [delay, rootMargin, threshold]);

  return (
    <div
      ref={ref}
      className={clsxm("scroll-reveal", className)}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}
