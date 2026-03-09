import { supabase } from "@/lib/supabase";
import {
  Blog,
  BlogDetailResponse,
  BlogListResponse,
  BlogStatus,
  BlogSummary,
  UpsertBlogPayload,
} from "@/features/blog/types";

type BlogRow = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  cover_image: string;
  published_at: string;
  content: string;
  status: BlogStatus;
  created_at: string;
  created_by?: string | null;
};

type ProfileRow = {
  username: string;
  avatar_url?: string | null;
};

const BLOG_COVER_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_BLOG_COVER_BUCKET || "blog-covers";

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

function estimateReadingTimeMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function mapRowToSummary(row: BlogRow): BlogSummary {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    author: row.author,
    category: row.category,
    coverImage: row.cover_image,
    publishedAt: row.published_at,
    readingTimeMinutes: estimateReadingTimeMinutes(row.content),
    status: row.status,
    createdBy: row.created_by ?? null,
  };
}

function mapRowToBlog(row: BlogRow): Blog {
  return {
    ...mapRowToSummary(row),
    content: row.content,
  };
}

function buildExcerpt(content: string) {
  const compact = content.replace(/\s+/g, " ").trim();
  if (compact.length <= 160) return compact;
  return `${compact.slice(0, 157)}...`;
}

async function resolveAuthorProfile(createdBy?: string | null) {
  if (!createdBy) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("username,avatar_url")
    .eq("id", createdBy)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as ProfileRow;
}

export const blogService = {
  getPublicBlogs: async (
    page: number,
    limit: number,
  ): Promise<BlogListResponse> => {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 6;
    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit - 1;

    const { data, count, error } = await supabase
      .from("blogs")
      .select(
        "id,title,excerpt,author,category,cover_image,published_at,content,status,created_at,created_by",
        { count: "exact" },
      )
      .eq("status", "PUBLISHED")
      .order("published_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(error.message || "Failed to fetch blogs");
    }

    const totalItems = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
    const normalizedPage = Math.min(safePage, totalPages);

    return {
      items: ((data || []) as BlogRow[]).map(mapRowToSummary),
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

  getPublicBlogById: async (id: string): Promise<BlogDetailResponse> => {
    const normalizedId = id.trim();
    const { data, error } = await supabase
      .from("blogs")
      .select(
        "id,title,excerpt,author,category,cover_image,published_at,content,status,created_at,created_by",
      )
      .eq("id", normalizedId)
      .eq("status", "PUBLISHED")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      throw new Error(error?.message || "Blog post not found.");
    }

    const mapped = mapRowToBlog(data as BlogRow);
    const profile = await resolveAuthorProfile(mapped.createdBy);

    return {
      item: {
        ...mapped,
        author: profile?.username || mapped.author,
        authorAvatarUrl: profile?.avatar_url || null,
      },
    };
  },

  getDashboardBlogs: async (
    page: number,
    limit: number,
  ): Promise<BlogListResponse> => {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit - 1;

    const { data, count, error } = await supabase
      .from("blogs")
      .select(
        "id,title,excerpt,author,category,cover_image,published_at,content,status,created_at,created_by",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(error.message || "Failed to fetch dashboard blogs");
    }

    const totalItems = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
    const normalizedPage = Math.min(safePage, totalPages);

    return {
      items: ((data || []) as BlogRow[]).map(mapRowToSummary),
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

  getDashboardBlogById: async (id: string): Promise<BlogDetailResponse> => {
    const normalizedId = id.trim();
    const { data, error } = await supabase
      .from("blogs")
      .select(
        "id,title,excerpt,author,category,cover_image,published_at,content,status,created_at,created_by",
      )
      .eq("id", normalizedId)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      throw new Error(error?.message || "Blog post not found.");
    }

    const mapped = mapRowToBlog(data as BlogRow);
    const profile = await resolveAuthorProfile(mapped.createdBy);

    return {
      item: {
        ...mapped,
        author: profile?.username || mapped.author,
        authorAvatarUrl: profile?.avatar_url || null,
      },
    };
  },

  uploadCover: async (userId: string, file: File): Promise<string> => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    let filePath = createUniqueUploadPath(userId, "cover", extension);

    let { error: uploadError } = await supabase.storage
      .from(BLOG_COVER_BUCKET)
      .upload(filePath, file, { upsert: false });

    if (uploadError?.message?.toLowerCase().includes("lock broken")) {
      filePath = createUniqueUploadPath(userId, "cover", extension);
      ({ error: uploadError } = await supabase.storage
        .from(BLOG_COVER_BUCKET)
        .upload(filePath, file, { upsert: false }));
    }

    if (uploadError) {
      throw new Error(
        uploadError.message ||
          "Failed to upload cover image. Please try again.",
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BLOG_COVER_BUCKET).getPublicUrl(filePath);

    return publicUrl;
  },

  createBlog: async (
    payload: UpsertBlogPayload,
    authorEmail: string,
    createdBy: string,
  ): Promise<BlogDetailResponse> => {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("blogs")
      .insert({
        title: payload.title,
        excerpt: buildExcerpt(payload.content),
        author: authorEmail,
        category: payload.category,
        cover_image: payload.coverImage || "",
        content: payload.content,
        status: payload.status,
        published_at: now,
        created_by: createdBy,
      })
      .select(
        "id,title,excerpt,author,category,cover_image,published_at,content,status,created_at,created_by",
      )
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to create blog");
    }

    return { item: mapRowToBlog(data as BlogRow) };
  },

  updateBlog: async (id: string, payload: UpsertBlogPayload): Promise<void> => {
    const normalizedId = id.trim();
    const { data, error } = await supabase
      .from("blogs")
      .update({
        title: payload.title,
        excerpt: buildExcerpt(payload.content),
        category: payload.category,
        cover_image: payload.coverImage,
        content: payload.content,
        status: payload.status,
      })
      .eq("id", normalizedId)
      .select("id")
      .maybeSingle();

    if (error) {
      throw new Error(error.message || "Failed to update blog");
    }

    if (!data) {
      throw new Error(
        "Blog tidak ter-update. Data ini kemungkinan bukan milik akun yang login.",
      );
    }
  },

  deleteBlog: async (id: string): Promise<void> => {
    const { data, error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      throw new Error(error.message || "Failed to delete blog");
    }

    if (!data || data.length === 0) {
      throw new Error("Blog tidak terhapus. Cek policy DELETE di Supabase.");
    }
  },
};
