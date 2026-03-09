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

  return (
    <>
      {!hideNavbar ? <Navbar /> : null}
      {children}
      {!hideFooter ? <Footer /> : null}
    </>
  );
}
