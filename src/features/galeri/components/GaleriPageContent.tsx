"use client";

import { useState } from "react";

import GaleriFilters from "@/features/galeri/components/GaleriFilters";
import GaleriGrid from "@/features/galeri/components/GaleriGrid";
import GaleriPagination from "@/features/galeri/components/GaleriPagination";
import { useGaleri } from "@/features/galeri/hooks/useGaleri";

export default function GaleriPageContent() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error } = useGaleri({ page, limit: 12 });

  return (
    <main className="min-h-screen bg-[#F3F3F3] px-6 py-16">
      <section className="mx-auto w-full max-w-6xl">
        <GaleriFilters />
        {isPending ? (
          <p className="mt-8 text-sm text-black/70">Loading photos...</p>
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
