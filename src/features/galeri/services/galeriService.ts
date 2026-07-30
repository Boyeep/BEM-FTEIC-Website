import {
  GaleriDepartment,
  GaleriDetailResponse,
  GaleriItem,
  GaleriListResponse,
  GaleriSortBy,
  UpsertGaleriPayload,
} from "@/features/galeri/types";
import { api } from "@/lib/api";
import { listParams, mapApiPagination } from "@/lib/pagination";
import { uploadImageToAPI } from "@/lib/upload";
import { ApiPage, ApiSuccess } from "@/types/api";

type GaleriRow = {
  id: string;
  title: string;
  link: string;
  image_url: string;
  taken_at: string;
  created_at: string;
  category?: GaleriDepartment;
};
function normalizeExternalLink(rawLink: string) {
  const trimmed = rawLink.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function mapRow(row: GaleriRow): GaleriItem {
  return {
    id: row.id,
    title: row.title,
    link: normalizeExternalLink(row.link),
    imageUrl: row.image_url,
    takenAt: row.taken_at,
    category: row.category || "all",
  };
}

export const galeriService = {
  getPublicGaleri: async (
    page: number,
    limit: number,
    filters?: { sortBy?: GaleriSortBy; department?: GaleriDepartment },
  ): Promise<GaleriListResponse> => {
    const sortBy: GaleriSortBy = filters?.sortBy || "latest";
    const department: GaleriDepartment = filters?.department || "all";
    const { data } = await api.get<ApiSuccess<ApiPage<GaleriRow>>>(
      "/gallery/",
      {
        params: {
          ...listParams(page, limit),
          category: department === "all" ? undefined : department,
          sort: sortBy,
        },
      },
    );
    return {
      items: data.data.items.map(mapRow),
      pagination: mapApiPagination(data.data),
    };
  },

  getPublicGaleriById: async (id: string): Promise<GaleriDetailResponse> => {
    const { data } = await api.get<ApiSuccess<GaleriRow>>(
      `/gallery/${id.trim()}`,
    );
    return { item: mapRow(data.data) };
  },

  getDashboardGaleri: async (
    page: number,
    limit: number,
  ): Promise<GaleriListResponse> => {
    const { data } = await api.get<ApiSuccess<ApiPage<GaleriRow>>>(
      "/admin/gallery",
      { params: listParams(page, limit) },
    );
    return {
      items: data.data.items.map(mapRow),
      pagination: mapApiPagination(data.data),
    };
  },

  getDashboardGaleriById: async (id: string): Promise<GaleriDetailResponse> => {
    const { data } = await api.get<ApiSuccess<GaleriRow>>(
      `/admin/gallery/${id.trim()}`,
    );
    return { item: mapRow(data.data) };
  },

  uploadImage: async (_userId: string, file: File): Promise<string> => {
    return uploadImageToAPI(file);
  },

  createGaleri: async (
    payload: UpsertGaleriPayload,
    userId: string,
  ): Promise<GaleriDetailResponse> => {
    const { data } = await api.post<ApiSuccess<GaleriRow>>("/admin/gallery", {
      title: payload.title,
      link: normalizeExternalLink(payload.link),
      image_url: payload.imageUrl || "",
      taken_at: payload.takenAt,
      category: payload.category,
    });
    void userId;
    return { item: mapRow(data.data) };
  },

  updateGaleri: async (
    id: string,
    payload: UpsertGaleriPayload,
  ): Promise<void> => {
    await api.put(`/admin/gallery/${id.trim()}`, {
      title: payload.title,
      link: normalizeExternalLink(payload.link),
      image_url: payload.imageUrl,
      taken_at: payload.takenAt,
      category: payload.category,
    });
  },

  deleteGaleri: async (id: string): Promise<void> => {
    await api.delete(`/admin/gallery/${id}`);
  },
};
