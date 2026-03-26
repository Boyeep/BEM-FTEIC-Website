import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getWhitelistedDashboardUser } from "@/features/auth/services/serverAuthAccess";

import AdminShell from "./AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getWhitelistedDashboardUser();

  if (!user) {
    redirect("/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
