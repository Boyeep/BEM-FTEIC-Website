"use client";

import { useQuery } from "@tanstack/react-query";

import { galeriService } from "@/features/galeri/services/galeriService";

export function useDashboardGaleriById(id: string) {
  return useQuery({
    queryKey: ["dashboard-galeri-item", id],
    queryFn: () => galeriService.getDashboardGaleriById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}
