"use client";

import { ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { EVENT_NAV_ITEMS } from "@/features/event/department";
import { KABINET_NAV_ITEMS } from "@/features/kabinet/navigation";
import clsxm from "@/lib/clsxm";

export function PublicMobileNavigation({
  transparent,
}: {
  transparent: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<"event" | "kabinet" | null>(null);
  const close = () => {
    setOpen(false);
    setSection(null);
  };

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="public-mobile-navigation"
        className={clsxm(
          "inline-flex min-h-11 items-center gap-1 px-2 text-sm font-semibold uppercase focus-visible:ring-2 focus-visible:ring-current",
          transparent ? "text-white" : "text-black",
        )}
      >
        Menu
        <ChevronUp
          aria-hidden
          className={clsxm(
            "h-4 w-4 transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      <nav
        id="public-mobile-navigation"
        aria-label="Navigasi utama mobile"
        aria-hidden={!open}
        className={clsxm(
          "absolute right-0 top-full z-50 mt-2 w-64 origin-top-right border border-black/20 bg-[#FCD704] text-black shadow-xl transition-all duration-200",
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0",
        )}
      >
        <MobileLink href="/blog" onClick={close}>
          Blog
        </MobileLink>
        <MobileSection
          label="Event"
          open={section === "event"}
          items={EVENT_NAV_ITEMS}
          onToggle={() =>
            setSection((current) => (current === "event" ? null : "event"))
          }
          onNavigate={close}
        />
        <MobileSection
          label="Kabinet"
          open={section === "kabinet"}
          items={KABINET_NAV_ITEMS}
          onToggle={() =>
            setSection((current) => (current === "kabinet" ? null : "kabinet"))
          }
          onNavigate={close}
        />
        <MobileLink href="/galeri" onClick={close}>
          Galeri
        </MobileLink>
      </nav>
    </div>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex min-h-11 items-center border-b border-black/20 px-4 py-3 text-sm font-semibold uppercase focus-visible:bg-black focus-visible:text-[#FCD704]"
    >
      {children}
    </Link>
  );
}

function MobileSection({
  label,
  open,
  items,
  onToggle,
  onNavigate,
}: {
  label: string;
  open: boolean;
  items: readonly { label: string; href: string }[];
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="border-b border-black/20">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center justify-between px-4 py-3 text-sm font-semibold uppercase focus-visible:ring-2 focus-visible:ring-black"
      >
        {label}
        <ChevronUp
          aria-hidden
          className={clsxm(
            "h-3 w-3 transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div className="border-t border-black/20">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="flex min-h-11 items-center border-b border-black/20 px-4 py-2 text-xs uppercase last:border-b-0 hover:bg-black hover:text-[#FCD704] focus-visible:bg-black focus-visible:text-[#FCD704]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
