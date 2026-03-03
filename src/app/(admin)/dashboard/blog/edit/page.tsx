import { redirect } from "next/navigation";

import DashboardEditBlogPage from "@/features/dashboard/components/DashboardEditBlogPage";

interface EditBlogPageProps {
  searchParams: {
    id?: string;
  };
}

export default function EditBlogPage({ searchParams }: EditBlogPageProps) {
  if (!searchParams.id) {
    redirect("/dashboard/blog/overview");
  }

  return <DashboardEditBlogPage id={searchParams.id} />;
}
