import { redirect } from "next/navigation";

import DashboardEditEventPage from "@/features/dashboard/components/DashboardEditEventPage";

interface EditEventPageProps {
  searchParams: Promise<{
    id?: string | string[];
  }>;
}

export default async function EditEventPage({
  searchParams,
}: EditEventPageProps) {
  const resolved = await searchParams;
  const id = typeof resolved.id === "string" ? resolved.id : resolved.id?.[0];

  if (!id?.trim()) {
    redirect("/dashboard/event/overview");
  }

  return <DashboardEditEventPage id={id.trim()} />;
}
