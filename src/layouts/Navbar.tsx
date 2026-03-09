"use client";

import { ChevronDown, ChevronUp, MoveUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { EVENT_NAV_ITEMS } from "@/features/event/department";
import clsxm from "@/lib/clsxm";

const kabinetItems = [
  { label: "STRUKTUR", href: "/kabinet/struktur" },
  { label: "BPH", href: "/kabinet/bph" },
  { label: "ORGANIZATIONAL AFFAIRS", href: "/kabinet/organizational-affairs" },
  { label: "DEPARTMENT SECRETARY", href: "/kabinet/department-secretary" },
  { label: "INTERNAL AFFAIRS", href: "/kabinet/internal-affairs" },
  { label: "EXTERNAL AFFAIRS", href: "/kabinet/external-affairs" },
  { label: "ENTREPRENEURSHIP", href: "/kabinet/entrepreneurship" },
  {
    label: "STUDENT RESOURCE DEVELOPMENT",
    href: "/kabinet/student-resource-development",
  },
  {
    label: "SOCIAL AFFAIRS AND COMMUNITY",
    href: "/kabinet/social-affairs-and-community",
  },
  {
    label: "RESEARCH AND TECHNOLOGY",
    href: "/kabinet/research-and-technology",
  },
];

function DropdownList({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return (
    <div className="w-[320px] border border-black/20 bg-[#FCD704]">
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={clsxm(
            "flex items-center justify-between border-b border-black/20 px-5 py-3 text-sm text-black",
            "transition-colors hover:bg-[#FCEABF] last:border-b-0",
          )}
        >
          <span>{item.label}</span>
          <MoveUpRight size={18} />
        </Link>
      ))}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<"event" | "kabinet" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileEventOpen, setMobileEventOpen] = useState(false);
  const [mobileKabinetOpen, setMobileKabinetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomepage = pathname === "/";
  const isTransparentState = isHomepage && !isScrolled;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textClass = isTransparentState ? "text-white" : "text-black";
  const desktopNavItemClass = clsxm(
    "inline-flex items-center gap-1 pb-1 md:gap-2",
    isTransparentState ? "hover:text-white/80" : "hover:text-black/70",
  );
  const desktopNavTextClass = clsxm(
    "relative inline-block",
    "after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-200",
    "hover:after:w-full",
    isTransparentState ? "after:bg-white" : "after:bg-black",
  );

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
          >
            BEM FTEIC
          </Link>

          <div className="relative md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1 text-sm font-semibold uppercase ${textClass} ${isTransparentState ? "hover:text-white/80" : "hover:text-black/70"}`}
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
                      {EVENT_NAV_ITEMS.map((item) => (
                        <Link
                          key={`mobile-event-${item.label}`}
                          href={item.href}
                          className="block border-b border-black/20 bg-[#FCD704] px-4 py-2 text-xs uppercase transition-colors hover:bg-[#FCEABF] active:bg-[#FCEABF] last:border-b-0"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
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
                          key={`mobile-kabinet-${item.label}`}
                          href={item.href}
                          className="block border-b border-black/20 bg-[#FCD704] px-4 py-2 text-xs uppercase transition-colors hover:bg-[#FCEABF] active:bg-[#FCEABF] last:border-b-0"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
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
              className={clsxm(desktopNavItemClass, "uppercase")}
            >
              <span className={desktopNavTextClass}>Blog</span>
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setOpenMenu("event")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button type="button" className={clsxm(desktopNavItemClass)}>
                <span
                  className={clsxm(
                    desktopNavTextClass,
                    openMenu === "event" ? "after:w-full" : "",
                  )}
                >
                  EVENT
                </span>
                <ChevronUp className="h-2.5 w-2.5 md:h-3 md:w-3" />
              </button>
              {openMenu === "event" ? (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                  <DropdownList items={EVENT_NAV_ITEMS} />
                </div>
              ) : null}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setOpenMenu("kabinet")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button type="button" className={clsxm(desktopNavItemClass)}>
                <span
                  className={clsxm(
                    desktopNavTextClass,
                    openMenu === "kabinet" ? "after:w-full" : "",
                  )}
                >
                  KABINET
                </span>
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
              className={clsxm(desktopNavItemClass, "uppercase")}
            >
              <span className={desktopNavTextClass}>Galeri</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
