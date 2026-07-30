import { ApiPage } from "@/types/api";

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function mapApiPagination<T>(page: ApiPage<T>): Pagination {
  return {
    page: page.pagination.page,
    limit: page.pagination.page_size,
    totalItems: page.pagination.total_items,
    totalPages: page.pagination.total_pages,
    hasNextPage: page.pagination.has_next_page,
    hasPreviousPage: page.pagination.has_previous_page,
  };
}

export function listParams(page: number, pageSize: number) {
  return {
    page: Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1,
    page_size: Number.isFinite(pageSize)
      ? Math.max(1, Math.floor(pageSize))
      : 1,
  };
}
