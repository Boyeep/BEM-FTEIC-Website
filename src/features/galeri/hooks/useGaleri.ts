"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getGaleri } from "@/features/galeri/api/get-galeri";

interface UseGaleriOptions {
  page: number;
  limit?: number;
}

export function useGaleri({ page, limit = 12 }: UseGaleriOptions) {
  return useQuery({
    queryKey: ["galeri", page, limit],
    queryFn: () => getGaleri({ page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
}
