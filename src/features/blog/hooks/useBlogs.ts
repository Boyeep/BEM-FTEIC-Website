import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getBlogs } from "@/features/blog/api/get-blogs";

interface UseBlogsOptions {
  page: number;
  limit?: number;
}

export function useBlogs({ page, limit = 6 }: UseBlogsOptions) {
  return useQuery({
    queryKey: ["blogs", page, limit],
    queryFn: () => getBlogs({ page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
}
