"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getGaleri } from "@/features/galeri/api/get-galeri";
import { GaleriDepartment, GaleriSortBy } from "@/features/galeri/types";
import { queryKeys } from "@/lib/queryKeys";

interface UseGaleriOptions {
  page: number;
  limit?: number;
  sortBy?: GaleriSortBy;
  department?: GaleriDepartment;
}

export function useGaleri({
  page,
  limit = 12,
  sortBy = "latest",
  department = "all",
}: UseGaleriOptions) {
  return useQuery({
    queryKey: queryKeys.gallery.list(page, limit, sortBy, department),
    queryFn: () => getGaleri({ page, limit, sortBy, department }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
}
