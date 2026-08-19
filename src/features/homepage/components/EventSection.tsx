"use client";

import Link from "next/link";
import { useState } from "react";

import ScrollReveal from "@/components/ScrollReveal";
import SwipeSideHint from "@/components/SwipeSideHint";
import {
  type Department,
  defaultDepartmentImage,
  departments,
} from "@/features/homepage/data/departments";

type DepartmentSlide = {
  badge: string;
  title: string;
  description: string;
  href: string;
  hrefLabel: string;
  imageSrc: string;
  controlLabel?: string;
  titleClassName?: string;
  variant: "department" | "program";
};

function DepartmentCardFace({
  slide,
  isBack = false,
  isPositioned = false,
  onControlClick,
  isFlipping = false,
  allowHoverAccent = false,
}: {
  slide: DepartmentSlide;
  isBack?: boolean;
  isPositioned?: boolean;
  onControlClick?: () => void;
  isFlipping?: boolean;
  allowHoverAccent?: boolean;
}) {
  const isProgramFace = slide.variant === "program";

  return (
    <div
      className={[
        "flex h-full flex-col overflow-hidden bg-white",
        isPositioned ? "absolute inset-0 [backface-visibility:hidden]" : "",
        isBack ? "[transform:rotateY(180deg)]" : "",
      ].join(" ")}
    >
      <div className="relative h-56 w-full overflow-hidden bg-white">
        <img
          src={slide.imageSrc}
          alt={slide.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div
        className={[
          "flex flex-1 flex-col px-5 pb-6 pt-6",
          isProgramFace
            ? "bg-[#1D4ED8]"
            : [
                "bg-white",
                allowHoverAccent
                  ? "transition-colors duration-300 group-hover:bg-[#1D4ED8]"
                  : "",
              ].join(" "),
        ].join(" ")}
      >
        <p
          className={[
            "text-xs font-semibold uppercase tracking-[0.24em]",
            isProgramFace
              ? "text-white/80"
              : [
                  "text-[#1D4ED8]",
                  allowHoverAccent
                    ? "transition-colors duration-300 group-hover:text-white/80"
                    : "",
                ].join(" "),
          ].join(" ")}
        >
          {slide.badge}
        </p>

        <p
          className={[
            "mt-4 font-bold leading-tight",
            isProgramFace
              ? "text-[1.55rem] md:text-[26px]"
              : "text-[1.75rem] md:text-[30px]",
            slide.titleClassName ?? "",
            isProgramFace
              ? "text-white"
              : [
                  "text-[#1D4ED8]",
                  allowHoverAccent
                    ? "transition-colors duration-300 group-hover:text-white"
                    : "",
                ].join(" "),
          ].join(" ")}
        >
          {slide.title}
        </p>

        <p
          className={[
            "mt-3 leading-relaxed",
            isProgramFace
              ? "text-base md:text-[19px]"
              : "text-lg md:text-[21px]",
            isProgramFace
              ? "text-white/90"
              : [
                  "text-black/90",
                  allowHoverAccent
                    ? "transition-colors duration-300 group-hover:text-white"
                    : "",
                ].join(" "),
          ].join(" ")}
        >
          {slide.description}
        </p>

        {onControlClick ? (
          <div className="mt-auto flex flex-col items-start gap-5 pt-6">
            <Link
              href={slide.href}
              target="_blank"
              rel="noreferrer"
              className={[
                "inline-block w-fit text-sm font-medium uppercase transition-colors duration-300",
                slide.variant === "department" || slide.variant === "program"
                  ? "relative after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full"
                  : "",
                isProgramFace
                  ? "text-white/90 hover:text-white"
                  : [
                      "text-black",
                      allowHoverAccent
                        ? "group-hover:text-white"
                        : "hover:text-[#1D4ED8]",
                    ].join(" "),
              ].join(" ")}
            >
              {slide.hrefLabel}
            </Link>

            <button
              type="button"
              onClick={onControlClick}
              disabled={isFlipping}
              className={[
                "relative inline-block w-fit text-left text-sm font-medium uppercase after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full disabled:cursor-not-allowed disabled:opacity-70",
                isProgramFace
                  ? "text-white"
                  : [
                      "text-black transition-colors duration-300",
                      allowHoverAccent
                        ? "group-hover:text-white"
                        : "hover:text-[#1D4ED8]",
                    ].join(" "),
              ].join(" ")}
              aria-label={`Tampilkan tampilan berikutnya untuk ${slide.title}`}
            >
              {slide.controlLabel}
            </button>
          </div>
        ) : (
          <Link
            href={slide.href}
            target="_blank"
            rel="noreferrer"
            className={[
              "relative mt-auto inline-block w-fit pt-5 text-sm font-medium uppercase after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full",
              allowHoverAccent
                ? "text-black transition-colors duration-300 group-hover:text-white"
                : "text-black transition-colors duration-300 hover:text-[#1D4ED8]",
            ].join(" ")}
          >
            {slide.hrefLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

function DepartmentCard({ department }: { department: Department }) {
  const slides: DepartmentSlide[] = [
    {
      badge: "Departemen",
      title: department.name,
      description: department.description,
      href: department.href,
      hrefLabel: "Kunjungi halaman departemen ↗",
      imageSrc: department.imageSrc ?? defaultDepartmentImage,
      controlLabel: department.programs?.length ? "Selengkapnya" : undefined,
      titleClassName: department.titleClassName,
      variant: "department",
    },
    ...(department.programs?.map((program, index) => ({
      badge: `Prodi ${index + 1}/${department.programs?.length ?? 0}`,
      title: program.name,
      description: program.description,
      href: program.href,
      hrefLabel: "Kunjungi halaman prodi ↗",
      imageSrc:
        program.imageSrc ?? department.imageSrc ?? defaultDepartmentImage,
      controlLabel: "Next",
      titleClassName: program.titleClassName,
      variant: "program" as const,
    })) ?? []),
  ];

  const isFlippable = slides.length > 1;
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [frontSlideIndex, setFrontSlideIndex] = useState(0);
  const [backSlideIndex, setBackSlideIndex] = useState(isFlippable ? 1 : 0);
  const [rotation, setRotation] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const showingFrontFace = (rotation / 180) % 2 === 0;

  const handleAdvance = () => {
    if (!isFlippable || isFlipping) {
      return;
    }

    const nextSlideIndex = (activeSlideIndex + 1) % slides.length;

    if (showingFrontFace) {
      setBackSlideIndex(nextSlideIndex);
    } else {
      setFrontSlideIndex(nextSlideIndex);
    }

    setIsFlipping(true);
    setActiveSlideIndex(nextSlideIndex);
    setRotation((previousRotation) => previousRotation + 180);
  };

  if (!isFlippable) {
    return (
      <article className="group flex h-full flex-col overflow-hidden bg-white">
        <DepartmentCardFace slide={slides[0]} allowHoverAccent />
      </article>
    );
  }

  return (
    <article className="group relative min-h-[560px] overflow-visible bg-[#F3F3F3] [perspective:1600px]">
      <div
        className="absolute inset-0 transition-transform duration-700 [transform-style:preserve-3d]"
        style={{ transform: `rotateY(${rotation}deg)` }}
        onTransitionEnd={() => setIsFlipping(false)}
      >
        <DepartmentCardFace
          slide={slides[frontSlideIndex]}
          isPositioned
          onControlClick={handleAdvance}
          isFlipping={isFlipping}
          allowHoverAccent
        />
        <DepartmentCardFace
          slide={slides[backSlideIndex]}
          isBack
          isPositioned
          onControlClick={handleAdvance}
          isFlipping={isFlipping}
          allowHoverAccent
        />
      </div>
    </article>
  );
}

export default function EventSection() {
  return (
    <section className="bg-[#F3F3F3] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal delay={40}>
          <h3 className="text-center text-4xl font-extrabold uppercase text-[#1D4ED8] md:text-left md:text-5xl">
            Departemen
          </h3>
        </ScrollReveal>

        <div className="-mx-6 mt-10 flex w-auto snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-12 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
          {departments.map((department, index) => (
            <ScrollReveal
              key={department.name}
              delay={70 + index * 20}
              className="h-full w-[calc(100vw-3rem)] shrink-0 snap-center md:w-full"
            >
              <DepartmentCard department={department} />
            </ScrollReveal>
          ))}
        </div>

        <SwipeSideHint tone="light" />
      </div>
    </section>
  );
}
