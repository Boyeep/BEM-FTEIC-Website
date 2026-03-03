import {
  GaleriDetailResponse,
  GaleriListParams,
  GaleriListResponse,
} from "@/features/galeri/types";
import { galeriService } from "@/features/galeri/services/galeriService";

export async function getGaleri({
  page,
  limit,
}: GaleriListParams): Promise<GaleriListResponse> {
  return galeriService.getPublicGaleri(page, limit);
}

export async function getGaleriById(id: string): Promise<GaleriDetailResponse> {
  return galeriService.getDashboardGaleriById(id);
}
