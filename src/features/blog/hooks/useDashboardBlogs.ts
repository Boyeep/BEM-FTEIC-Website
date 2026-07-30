"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { blogService } from "@/features/blog/services/blogService";
import { queryKeys } from "@/lib/queryKeys";

interface UseDashboardBlogsOptions {
  page: number;
  limit?: number;
}

export function useDashboardBlogs({
  page,
  limit = 10,
}: UseDashboardBlogsOptions) {
  return useQuery({
    queryKey: queryKeys.blogs.admin.list(page, limit),
    queryFn: () => blogService.getDashboardBlogs(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
}
