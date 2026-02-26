"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

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
  const isHomepage = pathname === "/";
  const isDepartemenPage = pathname.startsWith("/departemen");
  const isGaleriPage = pathname.startsWith("/galeri");

  const hideNavbar = isAuthRoute;
  const hideFooter = isAuthRoute || isReadBlogPage;
  const needsNavbarSpacer = !hideNavbar && !isHomepage;
  const spacerBackground =
    isDepartemenPage || isGaleriPage ? "#F3F3F3" : "#FFFFFF";

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
