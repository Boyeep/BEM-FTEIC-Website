import { supabase } from "@/lib/supabase";
import {
  GaleriDepartment,
  GaleriDetailResponse,
  GaleriItem,
  GaleriListResponse,
  GaleriSortBy,
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

function createUniqueUploadPath(
  userId: string,
  prefix: string,
  extension: string,
) {
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${userId}/${prefix}-${randomPart}.${extension}`;
}

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

    if (department === "teknik_elektro") {
      query = query.ilike("title", "%elektro%");
    } else if (department === "teknik_informatika") {
      query = query.ilike("title", "%informatika%");
    } else if (department === "sistem_informasi") {
      query = query.ilike("title", "%sistem informasi%");
    } else if (department === "teknik_komputer") {
      query = query.ilike("title", "%komputer%");
    } else if (department === "teknik_biomedik") {
      query = query.ilike("title", "%biomedik%");
    } else if (department === "teknologi_informasi") {
      query = query.ilike("title", "%teknologi informasi%");
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

  getDashboardGaleri: async (
    page: number,
    limit: number,
  ): Promise<GaleriListResponse> => {
    return galeriService.getPublicGaleri(page, limit);
  },

  getDashboardGaleriById: async (id: string): Promise<GaleriDetailResponse> => {
    const normalizedId = id.trim();
    const { data, error } = await supabase
      .from("galeri")
      .select("id,title,link,image_url,taken_at,created_at")
      .eq("id", normalizedId)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      throw new Error(error?.message || "Galeri item not found.");
    }

    return { item: mapRow(data as GaleriRow) };
  },

  uploadImage: async (userId: string, file: File): Promise<string> => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    let filePath = createUniqueUploadPath(userId, "galeri", extension);

    let { error: uploadError } = await supabase.storage
      .from(GALERI_BUCKET)
      .upload(filePath, file, { upsert: false });

    if (uploadError?.message?.toLowerCase().includes("lock broken")) {
      filePath = createUniqueUploadPath(userId, "galeri", extension);
      ({ error: uploadError } = await supabase.storage
        .from(GALERI_BUCKET)
        .upload(filePath, file, { upsert: false }));
    }

    if (uploadError) {
      throw new Error(
        uploadError.message ||
          "Failed to upload galeri image. Please try again.",
      );
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
  ): Promise<void> => {
    const normalizedId = id.trim();
    const { data, error } = await supabase
      .from("galeri")
      .update({
        title: payload.title,
        link: payload.link,
        image_url: payload.imageUrl,
        taken_at: payload.takenAt,
      })
      .eq("id", normalizedId)
      .select("id")
      .maybeSingle();

    if (error) {
      throw new Error(error.message || "Failed to update galeri item");
    }

    if (!data) {
      throw new Error(
        "Galeri tidak ter-update. Data ini kemungkinan bukan milik akun yang login.",
      );
    }
  },

  deleteGaleri: async (id: string): Promise<void> => {
    const { data, error } = await supabase
      .from("galeri")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      throw new Error(error.message || "Failed to delete galeri item");
    }

    if (!data || data.length === 0) {
      throw new Error("Galeri tidak terhapus. Cek policy DELETE di Supabase.");
    }
  },
};
