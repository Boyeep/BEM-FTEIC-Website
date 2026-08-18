"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import ScrollReveal from "@/components/ScrollReveal";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const pendingPointerRef = useRef<
    { clientX: number; clientY: number } | "center" | null
  >(null);
  const isHeroVisibleRef = useRef(true);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      reduceMotionRef.current = reduceMotion.matches;
    };
    syncMotionPreference();
    reduceMotion.addEventListener("change", syncMotionPreference);

    const observer = new IntersectionObserver(([entry]) => {
      isHeroVisibleRef.current = Boolean(entry?.isIntersecting);

      if (!entry?.isIntersecting && frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
        pendingPointerRef.current = null;
      }
    });
    observer.observe(sectionElement);

    return () => {
      observer.disconnect();
      reduceMotion.removeEventListener("change", syncMotionPreference);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const scheduleShineUpdate = (
    pointer: { clientX: number; clientY: number } | "center",
  ) => {
    if (!isHeroVisibleRef.current || reduceMotionRef.current) return;

    pendingPointerRef.current = pointer;
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;

      const textElement = textRef.current;
      const pendingPointer = pendingPointerRef.current;
      pendingPointerRef.current = null;
      if (!textElement || !pendingPointer || !isHeroVisibleRef.current) return;

      if (pendingPointer === "center") {
        textElement.style.setProperty("--shine-x", "50%");
        textElement.style.setProperty("--shine-y", "50%");
        return;
      }

      const rect = textElement.getBoundingClientRect();
      const x = ((pendingPointer.clientX - rect.left) / rect.width) * 100;
      const y = ((pendingPointer.clientY - rect.top) / rect.height) * 100;

      textElement.style.setProperty(
        "--shine-x",
        `${Math.min(140, Math.max(-40, x)).toFixed(2)}%`,
      );
      textElement.style.setProperty(
        "--shine-y",
        `${Math.min(140, Math.max(-40, y)).toFixed(2)}%`,
      );
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh]"
      onPointerMove={(event) => {
        scheduleShineUpdate({
          clientX: event.clientX,
          clientY: event.clientY,
        });
      }}
      onPointerLeave={() => {
        scheduleShineUpdate("center");
      }}
    >
      <Image
        src="/images/Homepage-Hero-Image.webp"
        alt="Pengurus BEM FTEIC ITS"
        fill
        priority
        sizes="100vw"
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
