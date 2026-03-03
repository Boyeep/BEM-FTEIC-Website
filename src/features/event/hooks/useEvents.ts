"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getEvents } from "@/features/event/api/get-events";

interface UseEventsOptions {
  page: number;
  limit?: number;
}

export function useEvents({ page, limit = 8 }: UseEventsOptions) {
  return useQuery({
    queryKey: ["events", page, limit],
    queryFn: () => getEvents({ page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
}
