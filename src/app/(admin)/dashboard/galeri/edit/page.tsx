import { redirect } from "next/navigation";

import DashboardEditGaleriPage from "@/features/dashboard/components/DashboardEditGaleriPage";

interface EditGaleriPageProps {
  searchParams: {
    id?: string | string[];
  };
}

export default function EditGaleriPage({ searchParams }: EditGaleriPageProps) {
  const id =
    typeof searchParams.id === "string"
      ? searchParams.id
      : searchParams.id?.[0];

  if (!id?.trim()) {
    redirect("/dashboard/galeri/overview");
  }

  return <DashboardEditGaleriPage id={id.trim()} />;
}
