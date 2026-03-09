"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { blogService } from "@/features/blog/services/blogService";

interface UseDashboardBlogsOptions {
  page: number;
  limit?: number;
}

export function useDashboardBlogs({
  page,
  limit = 10,
}: UseDashboardBlogsOptions) {
  return useQuery({
    queryKey: ["dashboard-blogs", page, limit],
    queryFn: () => blogService.getDashboardBlogs(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
}
