import { redirect } from "next/navigation";

import DashboardEditGaleriPage from "@/features/dashboard/components/DashboardEditGaleriPage";

interface EditGaleriPageProps {
  searchParams: Promise<{
    id?: string | string[];
  }>;
}

export default async function EditGaleriPage({
  searchParams,
}: EditGaleriPageProps) {
  const resolved = await searchParams;
  const id = typeof resolved.id === "string" ? resolved.id : resolved.id?.[0];

  if (!id?.trim()) {
    redirect("/dashboard/galeri/overview");
  }

  return <DashboardEditGaleriPage id={id.trim()} />;
}
