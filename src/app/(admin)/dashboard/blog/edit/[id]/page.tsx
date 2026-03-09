import DashboardEditBlogPage from "@/features/dashboard/components/DashboardEditBlogPage";

interface EditBlogRouteProps {
  params: {
    id: string;
  };
}

export default function EditBlogRoute({ params }: EditBlogRouteProps) {
  return <DashboardEditBlogPage id={params.id} />;
}
