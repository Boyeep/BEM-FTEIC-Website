import { supabase } from "@/lib/supabase";
import {
  GaleriDetailResponse,
  GaleriItem,
  GaleriListResponse,
  UpsertGaleriPayload,
} from "@/features/galeri/types";

type GaleriRow = {
  id: string;
  title: string;
  link: string;
  image_url: string;
  taken_at: string;
  created_at: string;
};

const GALERI_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_GALERI_BUCKET || "galeri-images";

function mapRow(row: GaleriRow): GaleriItem {
  return {
    id: row.id,
    title: row.title,
    link: row.link,
    imageUrl: row.image_url,
    takenAt: row.taken_at,
  };
}

export const galeriService = {
  getPublicGaleri: async (
    page: number,
    limit: number,
  ): Promise<GaleriListResponse> => {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 12;
    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit - 1;

    const { data, count, error } = await supabase
      .from("galeri")
      .select("id,title,link,image_url,taken_at,created_at", { count: "exact" })
      .order("taken_at", { ascending: false })
      .range(from, to);

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

  getDashboardGaleri: async (
    page: number,
    limit: number,
  ): Promise<GaleriListResponse> => {
    return galeriService.getPublicGaleri(page, limit);
  },

  getDashboardGaleriById: async (id: string): Promise<GaleriDetailResponse> => {
    const { data, error } = await supabase
      .from("galeri")
      .select("id,title,link,image_url,taken_at,created_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Galeri item not found.");
    }

    return { item: mapRow(data as GaleriRow) };
  },

  uploadImage: async (userId: string, file: File): Promise<string> => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${userId}/galeri-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(GALERI_BUCKET)
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw new Error(uploadError.message || "Failed to upload galeri image");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(GALERI_BUCKET).getPublicUrl(filePath);
    return publicUrl;
  },

  createGaleri: async (
    payload: UpsertGaleriPayload,
    userId: string,
  ): Promise<GaleriDetailResponse> => {
    const { data, error } = await supabase
      .from("galeri")
      .insert({
        title: payload.title,
        link: payload.link,
        image_url: payload.imageUrl || "",
        taken_at: payload.takenAt,
        created_by: userId,
      })
      .select("id,title,link,image_url,taken_at,created_at")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to create galeri item");
    }

    return { item: mapRow(data as GaleriRow) };
  },

  updateGaleri: async (
    id: string,
    payload: UpsertGaleriPayload,
  ): Promise<GaleriDetailResponse> => {
    const { data, error } = await supabase
      .from("galeri")
      .update({
        title: payload.title,
        link: payload.link,
        image_url: payload.imageUrl,
        taken_at: payload.takenAt,
      })
      .eq("id", id)
      .select("id,title,link,image_url,taken_at,created_at")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to update galeri item");
    }

    return { item: mapRow(data as GaleriRow) };
  },
};
