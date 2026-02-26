"use client";

import BlogDetail from "@/features/blog/components/BlogDetail";
import BlogDetailSkeleton from "@/features/blog/components/BlogDetailSkeleton";
import { useBlogById } from "@/features/blog/hooks/useBlogById";

interface BlogDetailContainerProps {
  id: string;
}

export default function BlogDetailContainer({ id }: BlogDetailContainerProps) {
  const { data, isPending, isError, error, refetch } = useBlogById(id);

  if (isPending) {
    return <BlogDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <p className="text-sm text-red-600">{error.message}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-md bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return <BlogDetail blog={data.item} />;
}
