import { redirect } from "next/navigation";

import DashboardEditBlogPage from "@/features/dashboard/components/DashboardEditBlogPage";

interface EditBlogPageProps {
  searchParams: {
    id?: string | string[];
  };
}

export default function EditBlogPage({ searchParams }: EditBlogPageProps) {
  const id =
    typeof searchParams.id === "string"
      ? searchParams.id
      : searchParams.id?.[0];

  if (!id?.trim()) {
    redirect("/dashboard/blog/overview");
  }

  return <DashboardEditBlogPage id={id.trim()} />;
}
