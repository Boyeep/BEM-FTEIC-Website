"use client";

import { useQuery } from "@tanstack/react-query";

import { eventService } from "@/features/event/services/eventService";

export function useDashboardEventById(id: string) {
  return useQuery({
    queryKey: ["dashboard-event", id],
    queryFn: () => eventService.getDashboardEventById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}
