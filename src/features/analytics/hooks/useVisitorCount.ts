"use client";

import { useQuery } from "@tanstack/react-query";

import { visitorService } from "@/features/analytics/services/visitorService";
import { queryKeys } from "@/lib/queryKeys";

export function useVisitorCount() {
  return useQuery({
    queryKey: queryKeys.visitors.count,
    queryFn: visitorService.getVisitorCount,
    staleTime: 1000 * 30,
  });
}
