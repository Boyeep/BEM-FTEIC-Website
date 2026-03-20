"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { visitorService } from "@/features/analytics/services/visitorService";
import Footer from "@/layouts/Footer";
import Navbar from "@/layouts/Navbar";

const AUTH_ROUTES = new Set([
  "/login",
  "/signup",
  "/check-inbox",
  "/confirm-email",
]);

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const isAuthRoute = AUTH_ROUTES.has(pathname);
  const isReadBlogPage = pathname.startsWith("/blog/");
  const isReadEventPage = pathname.startsWith("/event/read/");
  const isKabinetStrukturPage = pathname === "/kabinet/struktur";
  const isDashboardPage = pathname.startsWith("/dashboard");

  const hideNavbar =
    isAuthRoute || isReadBlogPage || isReadEventPage || isDashboardPage;
  const hideFooter =
    isAuthRoute ||
    isReadBlogPage ||
    isReadEventPage ||
    isKabinetStrukturPage ||
    isDashboardPage;

  useEffect(() => {
    void visitorService.trackVisit(pathname);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsNavigating(true);
    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    });
    const timeoutId = window.setTimeout(() => setIsNavigating(false), 320);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [pathname]);

  return (
    <>
      <div
        className={[
          "pointer-events-none fixed left-0 right-0 top-0 z-[70] h-[3px] origin-left bg-[#FCD704] transition-transform duration-300 ease-out",
          isNavigating ? "scale-x-100" : "scale-x-0",
        ].join(" ")}
      />
      {!hideNavbar ? <Navbar /> : null}
      {children}
      {!hideFooter ? <Footer /> : null}
    </>
  );
}
