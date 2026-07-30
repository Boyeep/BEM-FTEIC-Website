import { redirect } from "next/navigation";

import DashboardEditBlogPage from "@/features/dashboard/components/DashboardEditBlogPage";

interface EditBlogPageProps {
  searchParams: Promise<{
    id?: string | string[];
  }>;
}

export default async function EditBlogPage({
  searchParams,
}: EditBlogPageProps) {
  const resolved = await searchParams;
  const id = typeof resolved.id === "string" ? resolved.id : resolved.id?.[0];

  if (!id?.trim()) {
    redirect("/dashboard/blog/overview");
  }

  return <DashboardEditBlogPage id={id.trim()} />;
}
