import DashboardEditEventPage from "@/features/dashboard/components/DashboardEditEventPage";

interface EditEventRouteProps {
  params: {
    id: string;
  };
}

export default function EditEventRoute({ params }: EditEventRouteProps) {
  return <DashboardEditEventPage id={params.id} />;
}
