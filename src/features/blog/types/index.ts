export interface BlogSummary {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  coverImage: string;
  publishedAt: string;
  readingTimeMinutes: number;
}

export interface Blog extends BlogSummary {
  content: string;
}

export interface BlogPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BlogListResponse {
  items: BlogSummary[];
  pagination: BlogPagination;
}

export interface BlogDetailResponse {
  item: Blog;
}

export interface BlogListParams {
  page: number;
  limit: number;
}
