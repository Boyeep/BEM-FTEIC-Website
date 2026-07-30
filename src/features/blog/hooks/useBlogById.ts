import { useQuery } from "@tanstack/react-query";

import { getBlogById } from "@/features/blog/api/get-blogs";
import { queryKeys } from "@/lib/queryKeys";

export function useBlogById(id: string) {
  return useQuery({
    queryKey: queryKeys.blogs.detail(id),
    queryFn: () => getBlogById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}
