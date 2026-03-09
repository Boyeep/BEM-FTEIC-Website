import DashboardEditGaleriPage from "@/features/dashboard/components/DashboardEditGaleriPage";

interface EditGaleriRouteProps {
  params: {
    id: string;
  };
}

export default function EditGaleriRoute({ params }: EditGaleriRouteProps) {
  return <DashboardEditGaleriPage id={params.id} />;
}
