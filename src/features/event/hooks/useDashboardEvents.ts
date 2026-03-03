"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { eventService } from "@/features/event/services/eventService";

interface UseDashboardEventsOptions {
  page: number;
  limit?: number;
}

export function useDashboardEvents({
  page,
  limit = 8,
}: UseDashboardEventsOptions) {
  return useQuery({
    queryKey: ["dashboard-events", page, limit],
    queryFn: () => eventService.getDashboardEvents(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
}
