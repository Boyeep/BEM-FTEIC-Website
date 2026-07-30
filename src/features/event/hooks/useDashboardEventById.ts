"use client";

import { useQuery } from "@tanstack/react-query";

import { eventService } from "@/features/event/services/eventService";
import { queryKeys } from "@/lib/queryKeys";

export function useDashboardEventById(id: string) {
  return useQuery({
    queryKey: queryKeys.events.admin.detail(id),
    queryFn: () => eventService.getDashboardEventById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}
