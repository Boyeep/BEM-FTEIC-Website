"use client";

import { type MouseEvent, useEffect, useMemo, useState } from "react";

import {
  type RichContentBlock,
  parseRichContent,
} from "@/features/content/richContent";
import clsxm from "@/lib/clsxm";

interface RichContentBodyProps {
  content: string;
}

function renderBlock(block: RichContentBlock, index: number) {
  const spacingClass = index === 0 ? "" : "mt-8 md:mt-10";

  if (block.type === "heading") {
    if (block.level === 2) {
      return (
        <h2
          key={block.id}
          id={block.id}
          className={clsxm(
            spacingClass,
            "scroll-mt-32 text-2xl font-bold leading-tight text-black md:text-[2.1rem]",
          )}
        >
          {block.text}
        </h2>
      );
    }

    return (
      <h3
        key={block.id}
        id={block.id}
        className={clsxm(
          spacingClass,
          "scroll-mt-32 text-xl font-semibold leading-tight text-black md:text-[1.6rem]",
        )}
      >
        {block.text}
      </h3>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p
        key={`paragraph-${index}`}
        className={clsxm(
          spacingClass,
          "break-words text-[1.06rem]/[1.85] text-black/75 [overflow-wrap:anywhere] md:text-[1.22rem]/[1.9]",
        )}
      >
        {block.text}
      </p>
    );
  }

  if (block.type === "image") {
    return (
      <figure
        key={`image-${index}`}
        className={clsxm(spacingClass, "overflow-hidden rounded-[24px]")}
      >
        <img
          src={block.src}
          alt={block.alt}
          className="h-auto max-h-[720px] w-full rounded-[24px] border border-black/10 object-cover"
        />
      </figure>
    );
  }

  const ListTag = block.style === "ordered" ? "ol" : "ul";
  const listClassName =
    block.style === "ordered"
      ? "list-decimal pl-7 marker:font-semibold"
      : "list-disc pl-7";

  return (
    <ListTag
      key={`list-${index}`}
      className={clsxm(
        spacingClass,
        listClassName,
        "space-y-3 break-words text-[1.06rem]/[1.85] text-black/75 marker:text-black/45 [overflow-wrap:anywhere] md:text-[1.2rem]/[1.85]",
      )}
    >
      {block.items.map((item, itemIndex) => (
        <li key={`${block.style}-${index}-${itemIndex}`} className="pl-2">
          {item}
        </li>
      ))}
    </ListTag>
  );
}

export default function RichContentBody({ content }: RichContentBodyProps) {
  const parsedDocument = useMemo(() => parseRichContent(content), [content]);
  const [activeSectionId, setActiveSectionId] = useState(
    parsedDocument.sections[0]?.id ?? "",
  );

  const handleSectionClick = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    event.preventDefault();

    const targetElement = document.getElementById(sectionId);
    if (!targetElement) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    targetElement.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", `#${sectionId}`);
    setActiveSectionId(sectionId);
  };

  useEffect(() => {
    setActiveSectionId(parsedDocument.sections[0]?.id ?? "");
  }, [parsedDocument.sections]);

  useEffect(() => {
    if (typeof window === "undefined" || parsedDocument.sections.length === 0) {
      return;
    }

    const headingElements = parsedDocument.sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (headingElements.length === 0) {
      return;
    }

    const updateActiveSection = () => {
      const headingsAboveFold = headingElements.filter(
        (element) => element.getBoundingClientRect().top <= 180,
      );

      if (headingsAboveFold.length > 0) {
        const nextActiveSectionId =
          headingsAboveFold[headingsAboveFold.length - 1]?.id || "";
        setActiveSectionId((current) =>
          current === nextActiveSectionId ? current : nextActiveSectionId,
        );
        return;
      }

      const firstVisibleHeading = headingElements.find(
        (element) => element.getBoundingClientRect().top >= 0,
      );

      if (firstVisibleHeading) {
        setActiveSectionId((current) =>
          current === firstVisibleHeading.id ? current : firstVisibleHeading.id,
        );
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, [parsedDocument.sections]);

  if (parsedDocument.blocks.length === 0) {
    return null;
  }

  return (
    <div
      className={
        parsedDocument.sections.length > 0
          ? "xl:grid xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-10"
          : ""
      }
    >
      <div className="min-w-0 xl:self-start">
        {parsedDocument.blocks.map((block, index) => renderBlock(block, index))}
      </div>

      {parsedDocument.sections.length > 0 ? (
        <aside className="hidden xl:block xl:self-stretch">
          <div className="sticky top-48 max-h-[calc(100vh-13rem)] overflow-y-auto py-4 pr-2">
            <div className="flex items-stretch gap-6">
              <div className="w-[2px] shrink-0 bg-black/16" />
              <div className="min-w-0 py-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
                  Table of Content
                </p>
                <nav className="mt-4 flex flex-col gap-2 pl-1">
                  {parsedDocument.sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={(event) => handleSectionClick(event, section.id)}
                      aria-current={
                        activeSectionId === section.id ? "location" : undefined
                      }
                      className={clsxm(
                        "break-words text-sm leading-relaxed text-black/45 transition-[color,filter] duration-200 hover:text-brand-blue hover:[filter:drop-shadow(0_0_8px_rgba(81,114,232,0.22))]",
                        section.level === 3 ? "pl-4" : "",
                        activeSectionId === section.id
                          ? "font-semibold text-brand-blue [filter:drop-shadow(0_0_10px_rgba(81,114,232,0.34))]"
                          : "",
                      )}
                    >
                      {section.text}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
