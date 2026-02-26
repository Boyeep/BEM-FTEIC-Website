"use client";

import { ChevronDown, ChevronUp, MoveUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import clsxm from "@/lib/clsxm";

const eventItems = [
  "FTEIC",
  "TEKNIK ELEKTRO",
  "TEKNIK INFORMATIKA",
  "SISTEM INFORMASI",
  "TEKNIK KOMPUTER",
  "TEKNIK BIOMEDIK",
  "TEKNOLOGI INFORMASI",
];

const kabinetItems = [
  "STRUKTUR",
  "BPH",
  "ORGANIZATIONAL AFFAIRS",
  "DEPARTMENT SECRETARY",
  "INTERNAL AFFAIRS",
  "EXTERNAL AFFAIRS",
  "ENTREPRENEURSHIP",
  "RESOURCE DEVELOPMENT",
  "SOCIAL COMMUNITY AFFAIRS",
  "RESEARCH TECHNOLOGY",
];

function DropdownList({ items }: { items: string[] }) {
  return (
    <div className="w-[320px] border border-black/20 bg-[#FCD704]">
      {items.map((item) => (
        <Link
          key={item}
          href="#"
          className={clsxm(
            "flex items-center justify-between border-b border-black/20 px-5 py-3 text-sm text-black",
            "transition-colors hover:bg-[#FCEABF] last:border-b-0",
          )}
        >
          <span>{item}</span>
          <MoveUpRight size={18} />
        </Link>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<"event" | "kabinet" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileEventOpen, setMobileEventOpen] = useState(false);
  const [mobileKabinetOpen, setMobileKabinetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isTransparentState = isScrolled;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textClass = isTransparentState ? "text-white" : "text-black";
  const textOutlineStyle = isTransparentState
    ? ({
        textShadow: "-0.6px 0 #000, 0 0.6px #000, 0.6px 0 #000, 0 -0.6px #000",
      } as const)
    : undefined;

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: isTransparentState ? "transparent" : "#FCD704",
      }}
    >
      <div className="w-full px-4 py-3 md:px-8 md:py-3">
        <div className="mx-auto flex w-full max-w-[1720px] items-center justify-between">
          <Link
            href="/"
            className={`text-3xl font-extrabold leading-none md:text-4xl ${textClass}`}
            style={textOutlineStyle}
          >
            BEM FTEIC
          </Link>

          <div className="relative md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1 text-sm font-semibold uppercase ${textClass} ${isTransparentState ? "hover:text-white/80" : "hover:text-black/70"}`}
              style={textOutlineStyle}
            >
              Menu
              {mobileMenuOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {mobileMenuOpen ? (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 border border-black/20 bg-[#FCD704] text-black">
                <Link
                  href="/blog"
                  className="block border-b border-black/20 px-4 py-3 text-sm font-semibold uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <div className="border-b border-black/20">
                  <button
                    type="button"
                    className={clsxm(
                      "flex w-full items-center justify-between px-4 py-3 text-sm font-semibold uppercase transition-colors",
                      mobileEventOpen ? "bg-[#FCEABF]" : "bg-[#FCD704]",
                    )}
                    onClick={() => {
                      setMobileEventOpen((prev) => !prev);
                      setMobileKabinetOpen(false);
                    }}
                  >
                    Event
                    {mobileEventOpen ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                  {mobileEventOpen ? (
                    <div className="border-t border-black/20 bg-[#FCD704]">
                      {eventItems.map((item) => (
                        <Link
                          key={`mobile-event-${item}`}
                          href="#"
                          className="block border-b border-black/20 bg-[#FCD704] px-4 py-2 text-xs uppercase transition-colors hover:bg-[#FCEABF] active:bg-[#FCEABF] last:border-b-0"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="border-b border-black/20">
                  <button
                    type="button"
                    className={clsxm(
                      "flex w-full items-center justify-between px-4 py-3 text-sm font-semibold uppercase transition-colors",
                      mobileKabinetOpen ? "bg-[#FCEABF]" : "bg-[#FCD704]",
                    )}
                    onClick={() => {
                      setMobileKabinetOpen((prev) => !prev);
                      setMobileEventOpen(false);
                    }}
                  >
                    Kabinet
                    {mobileKabinetOpen ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                  {mobileKabinetOpen ? (
                    <div className="border-t border-black/20 bg-[#FCD704]">
                      {kabinetItems.map((item) => (
                        <Link
                          key={`mobile-kabinet-${item}`}
                          href="#"
                          className="block border-b border-black/20 bg-[#FCD704] px-4 py-2 text-xs uppercase transition-colors hover:bg-[#FCEABF] active:bg-[#FCEABF] last:border-b-0"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
                <Link
                  href="/galeri"
                  className="block px-4 py-3 text-sm font-semibold uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Galeri
                </Link>
              </div>
            ) : null}
          </div>

          <nav
            className={`hidden items-center gap-8 text-[13px] font-medium md:mr-8 md:flex ${textClass}`}
          >
            <Link
              href="/blog"
              className={`uppercase ${isTransparentState ? "hover:text-white/80" : "hover:text-black/70"}`}
              style={textOutlineStyle}
            >
              Blog
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setOpenMenu("event")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                type="button"
                className={`inline-flex items-center gap-1 md:gap-2 ${isTransparentState ? "hover:text-white/80" : "hover:text-black/70"}`}
                style={textOutlineStyle}
              >
                EVENT
                <ChevronUp className="h-2.5 w-2.5 md:h-3 md:w-3" />
              </button>
              {openMenu === "event" ? (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                  <DropdownList items={eventItems} />
                </div>
              ) : null}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setOpenMenu("kabinet")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                type="button"
                className={`inline-flex items-center gap-1 md:gap-2 ${isTransparentState ? "hover:text-white/80" : "hover:text-black/70"}`}
                style={textOutlineStyle}
              >
                KABINET
                <ChevronUp className="h-2.5 w-2.5 md:h-3 md:w-3" />
              </button>
              {openMenu === "kabinet" ? (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                  <DropdownList items={kabinetItems} />
                </div>
              ) : null}
            </div>

            <Link
              href="/galeri"
              className={`uppercase ${isTransparentState ? "hover:text-white/80" : "hover:text-black/70"}`}
              style={textOutlineStyle}
            >
              Galeri
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
