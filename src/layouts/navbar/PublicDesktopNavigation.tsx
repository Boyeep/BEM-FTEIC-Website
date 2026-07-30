"use client";

import { ChevronUp, MoveUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { EVENT_NAV_ITEMS } from "@/features/event/department";
import { KABINET_NAV_ITEMS } from "@/features/kabinet/navigation";
import clsxm from "@/lib/clsxm";

type Menu = "event" | "kabinet";

export function PublicDesktopNavigation({
  transparent,
}: {
  transparent: boolean;
}) {
  const [open, setOpen] = useState<Menu | null>(null);
  const text = transparent ? "text-white" : "text-black";
  const itemClass = clsxm(
    "inline-flex min-h-11 items-center gap-2 pb-1 focus-visible:ring-2 focus-visible:ring-current",
    transparent
      ? "hover:[filter:drop-shadow(0_0_10px_rgba(255,255,255,0.65))]"
      : "hover:[filter:drop-shadow(0_0_10px_rgba(0,0,0,0.28))]",
  );
  const underline = clsxm(
    "relative inline-block after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-200 hover:after:w-full",
    transparent ? "after:bg-white" : "after:bg-black",
  );

  return (
    <nav
      aria-label="Navigasi utama"
      className={clsxm(
        "hidden items-center gap-8 text-[13px] font-medium md:mr-8 md:flex",
        text,
      )}
    >
      <Link href="/blog" className={itemClass}>
        <span className={underline}>BLOG</span>
      </Link>
      <DesktopDropdown
        label="EVENT"
        items={EVENT_NAV_ITEMS}
        open={open === "event"}
        itemClass={itemClass}
        underlineClass={underline}
        onOpen={() => setOpen("event")}
        onClose={() => setOpen(null)}
      />
      <DesktopDropdown
        label="KABINET"
        items={KABINET_NAV_ITEMS}
        open={open === "kabinet"}
        itemClass={itemClass}
        underlineClass={underline}
        onOpen={() => setOpen("kabinet")}
        onClose={() => setOpen(null)}
      />
      <Link href="/galeri" className={itemClass}>
        <span className={underline}>GALERI</span>
      </Link>
    </nav>
  );
}

function DesktopDropdown({
  label,
  items,
  open,
  itemClass,
  underlineClass,
  onOpen,
  onClose,
}: {
  label: string;
  items: readonly { label: string; href: string }[];
  open: boolean;
  itemClass: string;
  underlineClass: string;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        className={itemClass}
        aria-expanded={open}
        onFocus={onOpen}
      >
        <span className={clsxm(underlineClass, open && "after:w-full")}>
          {label}
        </span>
        <ChevronUp
          aria-hidden
          className={clsxm(
            "h-3 w-3 transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={clsxm(
          "absolute left-1/2 top-full w-[320px] -translate-x-1/2 pt-2 transition-all duration-200",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <div className="border border-black/20 bg-[#FCD704] shadow-lg">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center justify-between border-b border-black/20 px-5 py-3 text-sm text-black transition-colors last:border-b-0 hover:bg-black hover:text-[#FCD704] focus-visible:bg-black focus-visible:text-[#FCD704]"
            >
              {item.label}
              <MoveUpRight aria-hidden size={18} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
