import { Pagination } from "@/lib/pagination";

export type EventStatus = "UPCOMING" | "ONGOING" | "ENDED";
export type PublicationStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
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
  publicationStatus: PublicationStatus;
  createdBy?: string | null;
}

export interface EventListResponse {
  items: EventSummary[];
  pagination: Pagination;
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
  publicationStatus: PublicationStatus;
  coverImage?: string;
}
