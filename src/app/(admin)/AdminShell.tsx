"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import AuthSessionSync from "@/features/auth/components/AuthSessionSync";
import DashboardNavbar from "@/features/dashboard/components/DashboardNavbar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showDashboardNavbar = pathname.startsWith("/dashboard");

  return (
    <>
      <AuthSessionSync />
      {showDashboardNavbar ? <DashboardNavbar /> : null}
      <div className={showDashboardNavbar ? "pt-[56px]" : ""}>{children}</div>
    </>
  );
}
