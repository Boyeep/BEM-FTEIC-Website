"use client";

import { useQuery } from "@tanstack/react-query";

import { blogService } from "@/features/blog/services/blogService";
import { queryKeys } from "@/lib/queryKeys";

export function useDashboardBlogById(id: string) {
  return useQuery({
    queryKey: queryKeys.blogs.admin.detail(id),
    queryFn: () => blogService.getDashboardBlogById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}
