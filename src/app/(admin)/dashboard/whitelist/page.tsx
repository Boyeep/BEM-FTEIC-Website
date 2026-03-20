import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DashboardWhitelistPage from "@/features/dashboard/components/DashboardWhitelistPage";

export default function DashboardWhitelistRoute() {
  const token =
    cookies().get("flexoo_token")?.value ||
    cookies().get("@flexoo/token")?.value;

  if (!token) {
    redirect("/login");
  }

  return <DashboardWhitelistPage />;
}
