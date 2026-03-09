import { galeriService } from "@/features/galeri/services/galeriService";
import {
  GaleriDetailResponse,
  GaleriListParams,
  GaleriListResponse,
} from "@/features/galeri/types";

export async function getGaleri({
  page,
  limit,
  sortBy,
  department,
}: GaleriListParams): Promise<GaleriListResponse> {
  return galeriService.getPublicGaleri(page, limit, { sortBy, department });
}

export async function getGaleriById(id: string): Promise<GaleriDetailResponse> {
  return galeriService.getDashboardGaleriById(id);
}
