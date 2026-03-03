"use client";

import { useState } from "react";

import EventCardGrid from "@/features/event/components/EventCardGrid";
import EventFilters from "@/features/event/components/EventFilters";
import EventHeader from "@/features/event/components/EventHeader";
import EventPagination from "@/features/event/components/EventPagination";
import { useEvents } from "@/features/event/hooks/useEvents";

export default function EventPageContent() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error } = useEvents({ page, limit: 10 });

  return (
    <main className="min-h-screen bg-[#F3F3F3] px-6 py-16">
      <section className="mx-auto w-full max-w-6xl">
        <EventHeader />
        <EventFilters />
        {isPending ? (
          <p className="mt-8 text-sm text-black/70">Loading events...</p>
        ) : null}
        {isError ? (
          <p className="mt-8 text-sm text-red-600">{error.message}</p>
        ) : null}
        {!isPending && !isError ? (
          <EventCardGrid items={data?.items || []} />
        ) : null}
        {data ? (
          <EventPagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={(nextPage) => setPage(nextPage)}
          />
        ) : null}
      </section>
    </main>
  );
}
