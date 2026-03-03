import { redirect } from "next/navigation";

import DashboardEditEventPage from "@/features/dashboard/components/DashboardEditEventPage";

interface EditEventPageProps {
  searchParams: {
    id?: string;
  };
}

export default function EditEventPage({ searchParams }: EditEventPageProps) {
  if (!searchParams.id) {
    redirect("/dashboard/event/overview");
  }

  return <DashboardEditEventPage id={searchParams.id} />;
}
