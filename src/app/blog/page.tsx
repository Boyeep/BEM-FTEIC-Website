"use client";

import { useState } from "react";

import BlogPageContent from "@/features/blog/components/BlogPageContent";
import BlogPageError from "@/features/blog/components/BlogPageError";
import BlogPageHeader from "@/features/blog/components/BlogPageHeader";
import BlogPageLoadingGrid from "@/features/blog/components/BlogPageLoadingGrid";
import Pagination from "@/features/blog/components/Pagination";
import { useBlogs } from "@/features/blog/hooks/useBlogs";

const PAGE_SIZE = 11;

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error, refetch, isFetching } = useBlogs({
    page,
    limit: PAGE_SIZE,
  });

  return (
    <main className="min-h-screen bg-white px-4 py-16">
      <section className="mx-auto w-full max-w-6xl">
        <BlogPageHeader />

        {isError ? (
          <BlogPageError message={error.message} onRetry={() => refetch()} />
        ) : null}

        {isPending ? (
          <BlogPageLoadingGrid size={PAGE_SIZE} />
        ) : (
          <BlogPageContent items={data?.items.slice(0, PAGE_SIZE) ?? []} />
        )}

        {isFetching && !isPending ? (
          <p className="mt-4 text-sm text-slate-500">Updating posts...</p>
        ) : null}

        {data ? (
          <Pagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={(nextPage) => setPage(nextPage)}
          />
        ) : null}
      </section>
    </main>
  );
}
