import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DashboardOverviewPage from "@/features/dashboard/components/DashboardOverviewPage";

export default function DashboardPage() {
  const token =
    cookies().get("flexoo_token")?.value ||
    cookies().get("@flexoo/token")?.value;

  if (!token) {
    redirect("/login");
  }

  return <DashboardOverviewPage />;
}
