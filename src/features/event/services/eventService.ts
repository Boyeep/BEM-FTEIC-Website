import {
  EventDepartmentCategory,
  EventDetailResponse,
  EventListResponse,
  EventSortBy,
  EventStatus,
  EventSummary,
  UpsertEventPayload,
} from "@/features/event/types";
import { api } from "@/lib/api";
import { listParams, mapApiPagination } from "@/lib/pagination";
import { uploadImageToAPI } from "@/lib/upload";
import { ApiPage, ApiSuccess } from "@/types/api";

type EventRow = {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  cover_image: string;
  event_date: string;
  status: EventStatus;
  publication_status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  created_at: string;
  created_by?: string | null;
  author_profile?: {
    id: string;
    username: string;
    avatar_url?: string | null;
  } | null;
};
function mapRowToSummary(row: EventRow): EventSummary {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    author: row.author_profile?.username || row.author,
    authorAvatarUrl: row.author_profile?.avatar_url || null,
    category: row.category,
    coverImage: row.cover_image,
    eventDate: row.event_date,
    status: row.status,
    publicationStatus: row.publication_status,
    createdBy: row.created_by ?? null,
  };
}

async function uploadImage(
  _userId: string,
  file: File,
  _prefix: string,
): Promise<string> {
  return uploadImageToAPI(file);
}

export const eventService = {
  getPublicEvents: async (
    page: number,
    limit: number,
    filters?: {
      startDate?: string;
      endDate?: string;
      sortBy?: EventSortBy;
      department?: EventDepartmentCategory;
    },
  ): Promise<EventListResponse> => {
    const isValidDate = (value?: string) =>
      Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
    const rawStartDate = isValidDate(filters?.startDate)
      ? filters?.startDate
      : undefined;
    const rawEndDate = isValidDate(filters?.endDate)
      ? filters?.endDate
      : undefined;
    const hasBoth = Boolean(rawStartDate && rawEndDate);
    const startDate =
      hasBoth && rawStartDate && rawEndDate && rawStartDate > rawEndDate
        ? rawEndDate
        : rawStartDate;
    const endDate =
      hasBoth && rawStartDate && rawEndDate && rawStartDate > rawEndDate
        ? rawStartDate
        : rawEndDate;
    const sortBy: EventSortBy = filters?.sortBy || "latest";
    const department = filters?.department;

    const { data } = await api.get<ApiSuccess<ApiPage<EventRow>>>("/events/", {
      params: {
        ...listParams(page, limit),
        category: department,
        start_date: startDate,
        end_date: endDate,
        sort: sortBy,
      },
    });
    const items = data.data.items.map(mapRowToSummary);
    return {
      items,
      pagination: mapApiPagination(data.data),
    };
  },

  getPublicEventById: async (id: string): Promise<EventDetailResponse> => {
    const { data } = await api.get<ApiSuccess<EventRow>>(
      `/events/${id.trim()}`,
    );
    return { item: mapRowToSummary(data.data) };
  },

  getDashboardEvents: async (
    page: number,
    limit: number,
  ): Promise<EventListResponse> => {
    const { data } = await api.get<ApiSuccess<ApiPage<EventRow>>>(
      "/admin/events",
      { params: listParams(page, limit) },
    );
    return {
      items: data.data.items.map(mapRowToSummary),
      pagination: mapApiPagination(data.data),
    };
  },

  getDashboardEventById: async (id: string): Promise<EventDetailResponse> => {
    const { data } = await api.get<ApiSuccess<EventRow>>(
      `/admin/events/${id.trim()}`,
    );
    return { item: mapRowToSummary(data.data) };
  },

  uploadCover: async (userId: string, file: File): Promise<string> => {
    return uploadImage(userId, file, "event-cover");
  },

  uploadContentImage: async (userId: string, file: File): Promise<string> => {
    return uploadImage(userId, file, "event-content-image");
  },

  createEvent: async (
    payload: UpsertEventPayload,
    authorName: string,
    createdBy: string,
  ): Promise<EventDetailResponse> => {
    const { data } = await api.post<ApiSuccess<EventRow>>("/admin/events", {
      title: payload.title,
      description: payload.description,
      author: authorName.trim(),
      category: payload.category,
      cover_image: payload.coverImage || "",
      event_date: payload.eventDate,
      status: payload.status,
      publication_status: payload.publicationStatus,
    });
    void createdBy;
    return { item: mapRowToSummary(data.data) };
  },

  updateEvent: async (
    id: string,
    payload: UpsertEventPayload,
  ): Promise<void> => {
    const existing = await eventService.getDashboardEventById(id);
    await api.put(`/admin/events/${id.trim()}`, {
      title: payload.title,
      description: payload.description,
      author: existing.item.author,
      category: payload.category,
      cover_image: payload.coverImage,
      event_date: payload.eventDate,
      status: payload.status,
      publication_status: payload.publicationStatus,
    });
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/admin/events/${id}`);
  },
};
