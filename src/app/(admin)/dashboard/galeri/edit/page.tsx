import { redirect } from "next/navigation";

import DashboardEditGaleriPage from "@/features/dashboard/components/DashboardEditGaleriPage";

interface EditGaleriPageProps {
  searchParams: {
    id?: string;
  };
}

export default function EditGaleriPage({ searchParams }: EditGaleriPageProps) {
  if (!searchParams.id) {
    redirect("/dashboard/galeri/overview");
  }

  return <DashboardEditGaleriPage id={searchParams.id} />;
}
