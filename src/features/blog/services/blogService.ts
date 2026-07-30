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
import { api } from "@/lib/api";
import { listParams, mapApiPagination } from "@/lib/pagination";
import {
  getPublicProfileById,
  getPublicProfilesByIds,
} from "@/lib/public-profiles";
import { uploadImageToAPI } from "@/lib/upload";
import { ApiPage, ApiSuccess } from "@/types/api";

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
    const { data } = await api.get<ApiSuccess<ApiPage<BlogRow>>>("/blogs/", {
      params: listParams(page, limit),
    });
    const items = await resolveAuthorProfiles(
      data.data.items.map(mapRowToSummary),
    );
    return {
      items,
      pagination: mapApiPagination(data.data),
    };
  },

  getPublicBlogById: async (id: string): Promise<BlogDetailResponse> => {
    const { data } = await api.get<ApiSuccess<BlogRow>>(`/blogs/${id.trim()}`);
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

  getDashboardBlogs: async (
    page: number,
    limit: number,
  ): Promise<BlogListResponse> => {
    const { data } = await api.get<ApiSuccess<ApiPage<BlogRow>>>(
      "/admin/blogs",
      { params: listParams(page, limit) },
    );
    return {
      items: await resolveAuthorProfiles(data.data.items.map(mapRowToSummary)),
      pagination: mapApiPagination(data.data),
    };
  },

  getDashboardBlogById: async (id: string): Promise<BlogDetailResponse> => {
    const { data } = await api.get<ApiSuccess<BlogRow>>(
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
    const { data } = await api.post<ApiSuccess<BlogRow>>("/admin/blogs", {
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
  },

  deleteBlog: async (id: string): Promise<void> => {
    await api.delete(`/admin/blogs/${id}`);
  },
};
