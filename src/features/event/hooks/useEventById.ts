"use client";

import { useQuery } from "@tanstack/react-query";

import { getEventById } from "@/features/event/api/get-events";
import { queryKeys } from "@/lib/queryKeys";

export function useEventById(id: string) {
  return useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => getEventById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}
