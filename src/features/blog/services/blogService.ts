import {
  Blog,
  BlogDetailResponse,
  BlogListResponse,
  BlogStatus,
  BlogSummary,
  UpsertBlogPayload,
} from "@/features/blog/types";
import {
  getPlainTextFromRichContent,
  getRichContentWordCount,
} from "@/features/content/richContent";
import {
  getPublicProfileById,
  getPublicProfilesByIds,
} from "@/lib/public-profiles";
import { supabase } from "@/lib/supabase";
import { deleteImageFromAPI, uploadImageToAPI } from "@/lib/upload";
import { api } from "@/lib/api";

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

type APIEnvelope<T> = { success: boolean; data: T };

function paginateBlogs(
  rows: BlogRow[],
  page: number,
  limit: number,
): BlogListResponse {
  const safePage = Math.max(1, Math.floor(page || 1));
  const safeLimit = Math.max(1, Math.floor(limit || 10));
  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
  const normalizedPage = Math.min(safePage, totalPages);
  const start = (normalizedPage - 1) * safeLimit;
  return {
    items: rows.slice(start, start + safeLimit).map(mapRowToSummary),
    pagination: {
      page: normalizedPage,
      limit: safeLimit,
      totalItems,
      totalPages,
      hasNextPage: normalizedPage < totalPages,
      hasPreviousPage: normalizedPage > 1,
    },
  };
}

function estimateReadingTimeMinutes(content: string) {
  const words = getRichContentWordCount(content);
  return Math.max(1, Math.ceil(words / 200));
}

function mapRowToSummary(row: BlogRow): BlogSummary {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    contentPreview: buildExcerpt(row.content, 360),
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

function buildExcerpt(content: string, maxLength = 160) {
  const compact = getPlainTextFromRichContent(content);
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, Math.max(0, maxLength - 3))}...`;
}

async function uploadImage(
  _userId: string,
  file: File,
  _prefix: string,
): Promise<string> {
  return uploadImageToAPI(file);
}

async function resolveAuthorProfile(createdBy?: string | null) {
  return getPublicProfileById(createdBy);
}

async function resolveAuthorProfiles(items: BlogSummary[]) {
  const createdByIds = items
    .map((item) => item.createdBy)
    .filter((createdBy): createdBy is string => Boolean(createdBy));

  if (createdByIds.length === 0) {
    return items;
  }

  const profiles = await getPublicProfilesByIds(createdByIds);
  if (profiles.length === 0) {
    return items;
  }

  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));

  return items.map((item) => {
    const profile = item.createdBy ? profileMap.get(item.createdBy) : undefined;
    if (!profile) {
      return item;
    }

    return {
      ...item,
      author: profile.username || item.author,
      authorAvatarUrl: profile.avatar_url || null,
    };
  });
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

    const items = await resolveAuthorProfiles(
      ((data || []) as BlogRow[]).map(mapRowToSummary),
    );

    return {
      items,
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
    const { data } = await api.get<APIEnvelope<BlogRow[]>>("/admin/blogs");
    const result = paginateBlogs(data.data || [], page, limit);
    result.items = await resolveAuthorProfiles(result.items);
    return result;
  },

  getDashboardBlogById: async (id: string): Promise<BlogDetailResponse> => {
    const { data } = await api.get<APIEnvelope<BlogRow>>(
      `/admin/blogs/${id.trim()}`,
    );
    const mapped = mapRowToBlog(data.data);
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
    return uploadImage(userId, file, "cover");
  },

  uploadContentImage: async (userId: string, file: File): Promise<string> => {
    return uploadImage(userId, file, "content-image");
  },

  createBlog: async (
    payload: UpsertBlogPayload,
    authorName: string,
    createdBy: string,
  ): Promise<BlogDetailResponse> => {
    const { data } = await api.post<APIEnvelope<BlogRow>>("/admin/blogs", {
      title: payload.title,
      excerpt: buildExcerpt(payload.content),
      author: authorName.trim(),
      category: payload.category,
      cover_image: payload.coverImage || "",
      content: payload.content,
      status: payload.status,
      published_at: new Date().toISOString(),
    });
    void createdBy;
    return { item: mapRowToBlog(data.data) };
  },

  updateBlog: async (id: string, payload: UpsertBlogPayload): Promise<void> => {
    const existing = await blogService.getDashboardBlogById(id);
    await api.put(`/admin/blogs/${id.trim()}`, {
      title: payload.title,
      excerpt: buildExcerpt(payload.content),
      author: existing.item.author,
      category: payload.category,
      cover_image: payload.coverImage,
      content: payload.content,
      status: payload.status,
      published_at: existing.item.publishedAt,
    });
    if (existing.item.coverImage !== payload.coverImage) {
      await deleteImageFromAPI(existing.item.coverImage);
    }
  },

  deleteBlog: async (id: string): Promise<void> => {
    const existing = await blogService.getDashboardBlogById(id);
    await api.delete(`/admin/blogs/${id}`);
    await deleteImageFromAPI(existing.item.coverImage);
  },
};
