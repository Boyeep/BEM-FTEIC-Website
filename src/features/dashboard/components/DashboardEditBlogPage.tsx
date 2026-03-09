"use client";

import { useDashboardBlogById } from "@/features/blog/hooks/useDashboardBlogById";
import DashboardBlogForm from "@/features/dashboard/components/DashboardBlogForm";

interface DashboardEditBlogPageProps {
  id: string;
}

export default function DashboardEditBlogPage({
  id,
}: DashboardEditBlogPageProps) {
  const { data, isPending, isError, error } = useDashboardBlogById(id);

  if (isPending) {
    return (
      <main className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-8">
        <p className="mx-auto max-w-[1280px] text-sm text-black/70">
          Loading...
        </p>
      </main>
    );
  }

  if (isError || !data?.item) {
    return (
      <main className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-8">
        <p className="mx-auto max-w-[1280px] text-sm text-red-600">
          {error?.message || "Blog tidak ditemukan."}
        </p>
      </main>
    );
  }

  return (
    <DashboardBlogForm
      mode="edit"
      blogId={id}
      initialValues={{
        title: data.item.title,
        category: data.item.category,
        content: data.item.content,
        coverImage: data.item.coverImage,
        status: data.item.status,
      }}
    />
  );
}
