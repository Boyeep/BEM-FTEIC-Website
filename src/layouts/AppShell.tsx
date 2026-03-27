"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

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
  const isAuthRoute = AUTH_ROUTES.has(pathname);
  const isKabinetStrukturPage = pathname === "/kabinet/struktur";
  const isDashboardPage = pathname.startsWith("/dashboard");

  const hideNavbar = isAuthRoute || isDashboardPage;
  const hideFooter = isAuthRoute || isKabinetStrukturPage || isDashboardPage;

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

    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [pathname]);

  return (
    <>
      {!hideNavbar ? <Navbar /> : null}
      {children}
      {!hideFooter ? <Footer /> : null}
    </>
  );
}
