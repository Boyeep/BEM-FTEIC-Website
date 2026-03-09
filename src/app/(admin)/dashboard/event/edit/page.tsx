import { redirect } from "next/navigation";

import DashboardEditEventPage from "@/features/dashboard/components/DashboardEditEventPage";

interface EditEventPageProps {
  searchParams: {
    id?: string | string[];
  };
}

export default function EditEventPage({ searchParams }: EditEventPageProps) {
  const id =
    typeof searchParams.id === "string"
      ? searchParams.id
      : searchParams.id?.[0];

  if (!id?.trim()) {
    redirect("/dashboard/event/overview");
  }

  return <DashboardEditEventPage id={id.trim()} />;
}
