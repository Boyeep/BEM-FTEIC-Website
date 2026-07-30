import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DashboardWhitelistPage from "@/features/dashboard/components/DashboardWhitelistPage";

export default async function DashboardWhitelistRoute() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bem_fteic_session")?.value;

  if (!token) {
    redirect("/login");
  }

  return <DashboardWhitelistPage />;
}
