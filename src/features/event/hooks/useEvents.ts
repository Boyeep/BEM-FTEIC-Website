"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getEvents } from "@/features/event/api/get-events";
import { EventDepartmentCategory, EventSortBy } from "@/features/event/types";

interface UseEventsOptions {
  page: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: EventSortBy;
  department?: EventDepartmentCategory;
}

export function useEvents({
  page,
  limit = 8,
  startDate,
  endDate,
  sortBy = "latest",
  department,
}: UseEventsOptions) {
  return useQuery({
    queryKey: ["events", page, limit, startDate, endDate, sortBy, department],
    queryFn: () =>
      getEvents({ page, limit, startDate, endDate, sortBy, department }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
}
