import { useQuery } from "@tanstack/react-query";

import { getBlogById } from "@/features/blog/api/get-blogs";

export function useBlogById(id: string) {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}
