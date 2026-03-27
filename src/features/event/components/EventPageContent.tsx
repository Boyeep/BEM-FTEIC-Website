"use client";

import { useCallback, useState } from "react";

import ScrollReveal from "@/components/ScrollReveal";
import EventCardGrid from "@/features/event/components/EventCardGrid";
import EventFilters from "@/features/event/components/EventFilters";
import EventHeader from "@/features/event/components/EventHeader";
import EventPagination from "@/features/event/components/EventPagination";
import { getEventDepartmentByCategory } from "@/features/event/department";
import { useEvents } from "@/features/event/hooks/useEvents";
import { EventDepartmentCategory, EventSortBy } from "@/features/event/types";

interface EventPageContentProps {
  initialDepartment?: EventDepartmentCategory;
}

export default function EventPageContent({
  initialDepartment,
}: EventPageContentProps) {
  const headerDepartment = getEventDepartmentByCategory(initialDepartment);
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const [sortBy, setSortBy] = useState<EventSortBy>("latest");
  const { data, isPending, isError, error } = useEvents({
    page,
    limit: 10,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    sortBy,
    department: initialDepartment,
  });

  const handleDateRangeChange = useCallback(
    (nextRange: { startDate?: string; endDate?: string }) => {
      setDateRange(nextRange);
      setPage(1);
    },
    [],
  );

  const handleSortChange = useCallback((nextSort: EventSortBy) => {
    setSortBy(nextSort);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#F3F3F3] px-6 pb-16 pt-32">
      <section className="mx-auto w-full max-w-6xl">
        <ScrollReveal delay={40}>
          <EventHeader department={headerDepartment} />
        </ScrollReveal>
        <ScrollReveal delay={70}>
          <EventFilters
            onDateRangeChange={handleDateRangeChange}
            onSortChange={handleSortChange}
          />
        </ScrollReveal>
        {isPending ? (
          <ScrollReveal delay={90}>
            <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, idx) => (
                <article
                  key={`event-skeleton-${idx}`}
                  className="grid grid-cols-[180px_1fr] gap-4"
                >
                  <div className="h-48 w-full animate-pulse bg-slate-200" />
                  <div>
                    <div className="h-4 w-24 animate-pulse bg-slate-200" />
                    <div className="mt-3 h-10 w-4/5 animate-pulse bg-slate-200" />
                    <div className="mt-3 h-5 w-full animate-pulse bg-slate-200" />
                    <div className="mt-2 h-5 w-3/4 animate-pulse bg-slate-200" />
                  </div>
                </article>
              ))}
            </div>
          </ScrollReveal>
        ) : null}
        {isError ? (
          <ScrollReveal delay={90}>
            <p className="mt-8 text-sm text-red-600">{error.message}</p>
          </ScrollReveal>
        ) : null}
        {!isPending && !isError ? (
          <ScrollReveal delay={90}>
            <EventCardGrid items={data?.items || []} />
          </ScrollReveal>
        ) : null}
        {data ? (
          <ScrollReveal delay={120}>
            <EventPagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </ScrollReveal>
        ) : null}
      </section>
    </main>
  );
}
