"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import DashboardNavbar from "@/features/dashboard/components/DashboardNavbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showDashboardNavbar = pathname.startsWith("/dashboard");

  return (
    <>
      {showDashboardNavbar ? <DashboardNavbar /> : null}
      <div className={showDashboardNavbar ? "pt-[56px]" : ""}>{children}</div>
    </>
  );
}
