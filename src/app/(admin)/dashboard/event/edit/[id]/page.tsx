import DashboardEditEventPage from "@/features/dashboard/components/DashboardEditEventPage";

interface EditEventRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventRoute({ params }: EditEventRouteProps) {
  return <DashboardEditEventPage id={(await params).id} />;
}
