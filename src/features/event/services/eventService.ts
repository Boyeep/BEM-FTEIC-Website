import {
  EventDepartmentCategory,
  EventDetailResponse,
  EventListResponse,
  EventSortBy,
  EventStatus,
  EventSummary,
  UpsertEventPayload,
} from "@/features/event/types";
import {
  getPublicProfileById,
  getPublicProfilesByIds,
} from "@/lib/public-profiles";
import { supabase } from "@/lib/supabase";
import { deleteImageFromAPI, uploadImageToAPI } from "@/lib/upload";
import { api } from "@/lib/api";

type EventRow = {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  cover_image: string;
  event_date: string;
  status: EventStatus;
  created_at: string;
  created_by?: string | null;
};
type APIEnvelope<T> = { success: boolean; data: T };

function paginateEvents(
  rows: EventRow[],
  page: number,
  limit: number,
): EventListResponse {
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

function mapRowToSummary(row: EventRow): EventSummary {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    author: row.author,
    category: row.category,
    coverImage: row.cover_image,
    eventDate: row.event_date,
    status: row.status,
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

async function resolveAuthorProfile(createdBy?: string | null) {
  return getPublicProfileById(createdBy);
}

async function resolveAuthorProfiles(items: EventSummary[]) {
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
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 8;
    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit - 1;
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

    let query = supabase
      .from("events")
      .select(
        "id,title,description,author,category,cover_image,event_date,status,created_at,created_by",
        { count: "exact" },
      );
    query = query.eq("status", "PUBLISHED");

    if (startDate) {
      query = query.gte("event_date", startDate);
    }

    if (endDate) {
      query = query.lte("event_date", endDate);
    }

    if (department) {
      query = query.eq("category", department);
    }

    if (sortBy === "oldest") {
      query = query.order("event_date", { ascending: true });
    } else if (sortBy === "title_asc") {
      query = query.order("title", { ascending: true });
    } else if (sortBy === "title_desc") {
      query = query.order("title", { ascending: false });
    } else {
      query = query.order("event_date", { ascending: false });
    }

    const { data, count, error } = await query.range(from, to);

    if (error) {
      throw new Error(error.message || "Failed to fetch events");
    }

    const totalItems = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
    const normalizedPage = Math.min(safePage, totalPages);

    const items = await resolveAuthorProfiles(
      ((data || []) as EventRow[]).map(mapRowToSummary),
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

  getPublicEventById: async (id: string): Promise<EventDetailResponse> => {
    const { data, error } = await supabase
      .from("events")
      .select(
        "id,title,description,author,category,cover_image,event_date,status,created_at,created_by",
      )
      .eq("id", id.trim())
      .eq("status", "PUBLISHED")
      .maybeSingle();
    if (error || !data) throw new Error(error?.message || "Event not found.");
    const mapped = mapRowToSummary(data as EventRow);
    const profile = await resolveAuthorProfile(mapped.createdBy);
    return {
      item: {
        ...mapped,
        author: profile?.username || mapped.author,
        authorAvatarUrl: profile?.avatar_url || null,
      },
    };
  },

  getDashboardEvents: async (
    page: number,
    limit: number,
  ): Promise<EventListResponse> => {
    const { data } = await api.get<APIEnvelope<EventRow[]>>("/admin/events");
    const result = paginateEvents(data.data || [], page, limit);
    result.items = await resolveAuthorProfiles(result.items);
    return result;
  },

  getDashboardEventById: async (id: string): Promise<EventDetailResponse> => {
    const { data } = await api.get<APIEnvelope<EventRow>>(
      `/admin/events/${id.trim()}`,
    );
    const mapped = mapRowToSummary(data.data);
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
    const { data } = await api.post<APIEnvelope<EventRow>>("/admin/events", {
      title: payload.title,
      description: payload.description,
      author: authorName.trim(),
      category: payload.category,
      cover_image: payload.coverImage || "",
      event_date: payload.eventDate,
      status: payload.status,
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
    });
    if (existing.item.coverImage !== payload.coverImage) {
      await deleteImageFromAPI(existing.item.coverImage);
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    const existing = await eventService.getDashboardEventById(id);
    await api.delete(`/admin/events/${id}`);
    await deleteImageFromAPI(existing.item.coverImage);
  },
};
