"use client";

import { useQuery } from "@tanstack/react-query";

import { blogService } from "@/features/blog/services/blogService";

export function useDashboardBlogById(id: string) {
  return useQuery({
    queryKey: ["dashboard-blog", id],
    queryFn: () => blogService.getDashboardBlogById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}
