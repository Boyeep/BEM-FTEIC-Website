"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { galeriService } from "@/features/galeri/services/galeriService";

interface UseDashboardGaleriOptions {
  page: number;
  limit?: number;
}

export function useDashboardGaleri({
  page,
  limit = 6,
}: UseDashboardGaleriOptions) {
  return useQuery({
    queryKey: ["dashboard-galeri", page, limit],
    queryFn: () => galeriService.getDashboardGaleri(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
}
