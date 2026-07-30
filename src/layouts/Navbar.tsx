"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { NavbarBrand } from "./navbar/NavbarBrand";
import { PublicDesktopNavigation } from "./navbar/PublicDesktopNavigation";
import { PublicMobileNavigation } from "./navbar/PublicMobileNavigation";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const transparent = pathname === "/" && !scrolled;

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300 motion-reduce:transition-none"
      style={{ backgroundColor: transparent ? "transparent" : "#FCD704" }}
    >
      <div className="w-full px-4 py-3 md:px-8">
        <div className="mx-auto flex w-full max-w-[1720px] items-center justify-between">
          <NavbarBrand transparent={transparent} />
          <PublicMobileNavigation transparent={transparent} />
          <PublicDesktopNavigation transparent={transparent} />
        </div>
      </div>
    </header>
  );
}
