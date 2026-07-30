import DashboardEditGaleriPage from "@/features/dashboard/components/DashboardEditGaleriPage";

interface EditGaleriRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditGaleriRoute({
  params,
}: EditGaleriRouteProps) {
  return <DashboardEditGaleriPage id={(await params).id} />;
}
