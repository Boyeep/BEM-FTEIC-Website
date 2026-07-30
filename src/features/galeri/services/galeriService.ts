import {
  GaleriDepartment,
  GaleriDetailResponse,
  GaleriItem,
  GaleriListResponse,
  GaleriSortBy,
  UpsertGaleriPayload,
} from "@/features/galeri/types";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { deleteImageFromAPI, uploadImageToAPI } from "@/lib/upload";

type GaleriRow = {
  id: string;
  title: string;
  link: string;
  image_url: string;
  taken_at: string;
  created_at: string;
  category?: GaleriDepartment;
};
type APIEnvelope<T> = { success: boolean; data: T };

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
  };
}

export const galeriService = {
  getPublicGaleri: async (
    page: number,
    limit: number,
    filters?: { sortBy?: GaleriSortBy; department?: GaleriDepartment },
  ): Promise<GaleriListResponse> => {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 12;
    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit - 1;
    const sortBy: GaleriSortBy = filters?.sortBy || "latest";
    const department: GaleriDepartment = filters?.department || "all";

    let query = supabase
      .from("galeri")
      .select("id,title,link,image_url,taken_at,created_at", {
        count: "exact",
      });

    if (department !== "all") {
      query = query.eq("category", department);
    }

    if (sortBy === "oldest") {
      query = query.order("taken_at", { ascending: true });
    } else if (sortBy === "title_asc") {
      query = query.order("title", { ascending: true });
    } else if (sortBy === "title_desc") {
      query = query.order("title", { ascending: false });
    } else {
      query = query.order("taken_at", { ascending: false });
    }

    const { data, count, error } = await query.range(from, to);

    if (error) {
      throw new Error(error.message || "Failed to fetch galeri data");
    }

    const totalItems = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
    const normalizedPage = Math.min(safePage, totalPages);

    return {
      items: ((data || []) as GaleriRow[]).map(mapRow),
      pagination: {
        page: normalizedPage,
        limit: safeLimit,
        totalItems,
        totalPages,
        hasNextPage: normalizedPage < totalPages,
        hasPreviousPage: normalizedPage > 1,
      },
    };
  },

  getPublicGaleriById: async (id: string): Promise<GaleriDetailResponse> => {
    const { data, error } = await supabase
      .from("galeri")
      .select("id,title,link,image_url,taken_at,created_at,category")
      .eq("id", id.trim())
      .maybeSingle();
    if (error || !data)
      throw new Error(error?.message || "Galeri item not found.");
    return { item: mapRow(data as GaleriRow) };
  },

  getDashboardGaleri: async (
    page: number,
    limit: number,
  ): Promise<GaleriListResponse> => {
    const { data } = await api.get<APIEnvelope<GaleriRow[]>>("/admin/gallery");
    const safeLimit = Math.max(1, Math.floor(limit || 10));
    const totalItems = data.data.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
    const normalizedPage = Math.min(
      Math.max(1, Math.floor(page || 1)),
      totalPages,
    );
    const start = (normalizedPage - 1) * safeLimit;
    return {
      items: data.data.slice(start, start + safeLimit).map(mapRow),
      pagination: {
        page: normalizedPage,
        limit: safeLimit,
        totalItems,
        totalPages,
        hasNextPage: normalizedPage < totalPages,
        hasPreviousPage: normalizedPage > 1,
      },
    };
  },

  getDashboardGaleriById: async (id: string): Promise<GaleriDetailResponse> => {
    const { data } = await api.get<APIEnvelope<GaleriRow>>(
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
    const { data } = await api.post<APIEnvelope<GaleriRow>>("/admin/gallery", {
      title: payload.title,
      link: normalizeExternalLink(payload.link),
      image_url: payload.imageUrl || "",
      taken_at: payload.takenAt,
      category: "all",
    });
    void userId;
    return { item: mapRow(data.data) };
  },

  updateGaleri: async (
    id: string,
    payload: UpsertGaleriPayload,
  ): Promise<void> => {
    const existing = await galeriService.getDashboardGaleriById(id);
    await api.put(`/admin/gallery/${id.trim()}`, {
      title: payload.title,
      link: normalizeExternalLink(payload.link),
      image_url: payload.imageUrl,
      taken_at: payload.takenAt,
    });
    if (existing.item.imageUrl !== payload.imageUrl) {
      await deleteImageFromAPI(existing.item.imageUrl);
    }
  },

  deleteGaleri: async (id: string): Promise<void> => {
    const existing = await galeriService.getDashboardGaleriById(id);
    await api.delete(`/admin/gallery/${id}`);
    await deleteImageFromAPI(existing.item.imageUrl);
  },
};
