"use client";

import { useQuery } from "@tanstack/react-query";

import { visitorService } from "@/features/analytics/services/visitorService";

export function useVisitorCount() {
  return useQuery({
    queryKey: ["visitor-count"],
    queryFn: visitorService.getVisitorCount,
    staleTime: 1000 * 30,
  });
}
