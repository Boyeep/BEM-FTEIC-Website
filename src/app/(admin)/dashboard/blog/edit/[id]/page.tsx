import DashboardEditBlogPage from "@/features/dashboard/components/DashboardEditBlogPage";

interface EditBlogRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogRoute({ params }: EditBlogRouteProps) {
  return <DashboardEditBlogPage id={(await params).id} />;
}
