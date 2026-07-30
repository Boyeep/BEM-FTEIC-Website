"use client";

import { useQuery } from "@tanstack/react-query";

import { galeriService } from "@/features/galeri/services/galeriService";
import { queryKeys } from "@/lib/queryKeys";

export function useDashboardGaleriById(id: string) {
  return useQuery({
    queryKey: queryKeys.gallery.admin.detail(id),
    queryFn: () => galeriService.getDashboardGaleriById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}
