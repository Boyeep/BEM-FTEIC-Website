"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { galeriService } from "@/features/galeri/services/galeriService";
import { queryKeys } from "@/lib/queryKeys";

interface UseDashboardGaleriOptions {
  page: number;
  limit?: number;
}

export function useDashboardGaleri({
  page,
  limit = 6,
}: UseDashboardGaleriOptions) {
  return useQuery({
    queryKey: queryKeys.gallery.admin.list(page, limit),
    queryFn: () => galeriService.getDashboardGaleri(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
}
