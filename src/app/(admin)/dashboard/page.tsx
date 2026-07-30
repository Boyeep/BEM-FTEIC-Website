import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DashboardOverviewPage from "@/features/dashboard/components/DashboardOverviewPage";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bem_fteic_session")?.value;

  if (!token) {
    redirect("/login");
  }

  return <DashboardOverviewPage />;
}
