"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import ScrollReveal from "@/components/ScrollReveal";

export default function HeroSection() {
  const textRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const currentPositionRef = useRef({ x: 50, y: 50 });
  const targetPositionRef = useRef({ x: 50, y: 50 });

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    const animate = () => {
      const current = currentPositionRef.current;
      const target = targetPositionRef.current;

      current.x += (target.x - current.x) * 0.01;
      current.y += (target.y - current.y) * 0.01;

      textElement.style.setProperty("--shine-x", `${current.x.toFixed(2)}%`);
      textElement.style.setProperty("--shine-y", `${current.y.toFixed(2)}%`);

      frameRef.current = window.requestAnimationFrame(animate);
    };

    textElement.style.setProperty("--shine-x", "50%");
    textElement.style.setProperty("--shine-y", "50%");
    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const updateShineTarget = (clientX: number, clientY: number) => {
    const textElement = textRef.current;
    if (!textElement) return;

    const rect = textElement.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    targetPositionRef.current = {
      x: Math.min(140, Math.max(-40, x)),
      y: Math.min(140, Math.max(-40, y)),
    };
  };

  return (
    <section
      className="relative min-h-[100svh]"
      onMouseMove={(event) => {
        updateShineTarget(event.clientX, event.clientY);
      }}
      onMouseLeave={() => {
        targetPositionRef.current = { x: 50, y: 50 };
      }}
    >
      <Image
        src="/images/Homepage-Hero-Image.JPG"
        alt="Homepage hero"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-x-0 top-0 h-[14%] bg-gradient-to-b from-black via-black/85 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[14%] bg-gradient-to-t from-black via-black/85 to-transparent" />
      <div className="relative flex min-h-[100svh] items-center justify-center px-6 text-center">
        <ScrollReveal delay={60}>
          <div
            ref={textRef}
            className="relative inline-block max-w-5xl cursor-default select-none"
          >
            <p className="text-metallic relative text-3xl font-extrabold leading-tight tracking-[-0.03em] [filter:drop-shadow(0_10px_24px_rgba(0,0,0,0.42))] [-webkit-text-stroke:1px_rgba(255,255,255,0.16)] md:text-5xl">
              Bringing Humanized Intelligent Technology for Society
            </p>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-clip-text text-3xl font-extrabold leading-tight tracking-[-0.03em] text-transparent [-webkit-background-clip:text] md:text-5xl"
              style={{
                backgroundImage:
                  "radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), rgba(255,255,255,1) 0%, rgba(255,255,255,0.98) 12%, rgba(255,255,255,0.88) 20%, rgba(255,255,255,0.5) 30%, rgba(255,255,255,0.16) 40%, rgba(255,255,255,0) 50%)",
                backgroundSize: "100% 100%",
                backgroundPosition: "0 0",
                backgroundRepeat: "no-repeat",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              Bringing Humanized Intelligent Technology for Society
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-clip-text text-3xl font-extrabold leading-tight tracking-[-0.03em] text-transparent opacity-80 blur-[7px] [-webkit-background-clip:text] md:text-5xl"
              style={{
                backgroundImage:
                  "radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.72) 18%, rgba(255,255,255,0.34) 30%, rgba(255,255,255,0.12) 42%, rgba(255,255,255,0) 56%)",
                backgroundSize: "100% 100%",
                backgroundPosition: "0 0",
                backgroundRepeat: "no-repeat",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              Bringing Humanized Intelligent Technology for Society
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
