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
  const isHomepage = pathname === "/";
  const isEventPage = pathname.startsWith("/event");
  const isGaleriPage = pathname.startsWith("/galeri");
  const isDashboardPage = pathname.startsWith("/dashboard");

  const hideNavbar = isAuthRoute || isDashboardPage;
  const hideFooter =
    isAuthRoute || isReadBlogPage || isReadEventPage || isDashboardPage;
  const needsNavbarSpacer = !hideNavbar && !isHomepage;
  const spacerBackground = isEventPage || isGaleriPage ? "#F3F3F3" : "#FFFFFF";

  useEffect(() => {
    void visitorService.trackVisit(pathname);
  }, [pathname]);

  return (
    <>
      {!hideNavbar ? <Navbar /> : null}
      {needsNavbarSpacer ? (
        <div
          className="h-[76px]"
          style={{ backgroundColor: spacerBackground }}
        />
      ) : null}
      {children}
      {!hideFooter ? <Footer /> : null}
    </>
  );
}
