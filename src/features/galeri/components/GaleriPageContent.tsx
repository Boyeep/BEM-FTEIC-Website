"use client";

import { useCallback, useState } from "react";

import GaleriFilters from "@/features/galeri/components/GaleriFilters";
import GaleriGrid from "@/features/galeri/components/GaleriGrid";
import GaleriPagination from "@/features/galeri/components/GaleriPagination";
import { useGaleri } from "@/features/galeri/hooks/useGaleri";
import { GaleriSortBy } from "@/features/galeri/types";

export default function GaleriPageContent() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<GaleriSortBy>("latest");
  const { data, isPending, isError, error } = useGaleri({
    page,
    limit: 12,
    sortBy,
  });

  const handleSortChange = useCallback((nextSort: GaleriSortBy) => {
    setSortBy(nextSort);
    setPage(1);
  }, []);

  return (
    <main className="min-h-screen bg-[#F3F3F3] px-6 pb-16 pt-32">
      <section className="mx-auto w-full max-w-6xl">
        <GaleriFilters onSortChange={handleSortChange} />
        {isPending ? (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <article key={`galeri-skeleton-${idx}`}>
                <div className="h-56 w-full animate-pulse bg-slate-200" />
                <div className="mt-3 h-4 w-24 animate-pulse bg-slate-200" />
                <div className="mt-3 h-8 w-5/6 animate-pulse bg-slate-200" />
              </article>
            ))}
          </div>
        ) : null}
        {isError ? (
          <p className="mt-8 text-sm text-red-600">{error.message}</p>
        ) : null}
        {!isPending && !isError ? (
          <GaleriGrid items={data?.items || []} />
        ) : null}
        {data ? (
          <GaleriPagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={(nextPage) => setPage(nextPage)}
          />
        ) : null}
      </section>
    </main>
  );
}
