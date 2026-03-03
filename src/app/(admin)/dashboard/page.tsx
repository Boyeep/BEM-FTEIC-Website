import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DashboardOverviewPage from "@/features/dashboard/components/DashboardOverviewPage";

export default function DashboardPage() {
  const token = cookies().get("@nexttemplate/token")?.value;

  if (!token) {
    redirect("/login");
  }

  return <DashboardOverviewPage />;
}
