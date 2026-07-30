import { Pagination } from "@/lib/pagination";

export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface BlogSummary {
  id: string;
  title: string;
  excerpt: string;
  contentPreview?: string;
  author: string;
  authorAvatarUrl?: string | null;
  category: string;
  coverImage: string;
  publishedAt: string;
  readingTimeMinutes: number;
  status: BlogStatus;
  createdBy?: string | null;
}

export interface Blog extends BlogSummary {
  content: string;
}

export interface BlogListResponse {
  items: BlogSummary[];
  pagination: Pagination;
}

export interface BlogDetailResponse {
  item: Blog;
}

export interface BlogListParams {
  page: number;
  limit: number;
}

export interface UpsertBlogPayload {
  title: string;
  category: string;
  content: string;
  status: BlogStatus;
  coverImage?: string;
}
