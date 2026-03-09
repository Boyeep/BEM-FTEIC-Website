export type EventStatus = "ONGOING" | "ENDED";
export type EventSortBy = "latest" | "oldest" | "title_asc" | "title_desc";
export type EventDepartmentCategory =
  | "FTEIC"
  | "TEKNIK ELEKTRO"
  | "TEKNIK INFORMATIKA"
  | "SISTEM INFORMASI"
  | "TEKNIK KOMPUTER"
  | "TEKNIK BIOMEDIK"
  | "TEKNOLOGI INFORMASI";

export interface EventSummary {
  id: string;
  title: string;
  description: string;
  author: string;
  authorAvatarUrl?: string | null;
  category: string;
  coverImage: string;
  eventDate: string;
  status: EventStatus;
  createdBy?: string | null;
}

export interface EventPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface EventListResponse {
  items: EventSummary[];
  pagination: EventPagination;
}

export interface EventDetailResponse {
  item: EventSummary;
}

export interface EventListParams {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
  sortBy?: EventSortBy;
  department?: EventDepartmentCategory;
}

export interface UpsertEventPayload {
  title: string;
  description: string;
  category: string;
  eventDate: string;
  status: EventStatus;
  coverImage?: string;
}
