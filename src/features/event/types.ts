export type EventStatus = "ONGOING" | "ENDED";

export interface EventSummary {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  coverImage: string;
  eventDate: string;
  status: EventStatus;
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
}

export interface UpsertEventPayload {
  title: string;
  description: string;
  category: string;
  eventDate: string;
  status: EventStatus;
  coverImage?: string;
}
