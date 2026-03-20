import {
  EventDepartmentCategory,
  EventDetailResponse,
  EventListResponse,
  EventSortBy,
  EventStatus,
  EventSummary,
  UpsertEventPayload,
} from "@/features/event/types";
import { supabase } from "@/lib/supabase";

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

type ProfileRow = {
  id: string;
  username: string;
  avatar_url?: string | null;
};

const EVENT_COVER_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_EVENT_COVER_BUCKET || "event-covers";

function createUniqueUploadPath(
  userId: string,
  prefix: string,
  extension: string,
) {
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${userId}/${prefix}-${randomPart}.${extension}`;
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

async function resolveAuthorProfile(createdBy?: string | null) {
  if (!createdBy) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id,username,avatar_url")
    .eq("id", createdBy)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as ProfileRow;
}

async function resolveAuthorProfiles(items: EventSummary[]) {
  const createdByIds = items
    .map((item) => item.createdBy)
    .filter((createdBy): createdBy is string => Boolean(createdBy));

  if (createdByIds.length === 0) {
    return items;
  }

  const uniqueIds = Array.from(new Set(createdByIds));
  const { data, error } = await supabase
    .from("profiles")
    .select("id,username,avatar_url")
    .in("id", uniqueIds);

  if (error || !data) {
    return items;
  }

  const profileMap = new Map(
    ((data || []) as ProfileRow[]).map((profile) => [profile.id, profile]),
  );

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

  getDashboardEvents: async (
    page: number,
    limit: number,
  ): Promise<EventListResponse> => {
    return eventService.getPublicEvents(page, limit);
  },

  getDashboardEventById: async (id: string): Promise<EventDetailResponse> => {
    const normalizedId = id.trim();
    const { data, error } = await supabase
      .from("events")
      .select(
        "id,title,description,author,category,cover_image,event_date,status,created_at,created_by",
      )
      .eq("id", normalizedId)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      throw new Error(error?.message || "Event not found.");
    }

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

  uploadCover: async (userId: string, file: File): Promise<string> => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    let filePath = createUniqueUploadPath(userId, "event-cover", extension);

    let { error: uploadError } = await supabase.storage
      .from(EVENT_COVER_BUCKET)
      .upload(filePath, file, { upsert: false });

    if (uploadError?.message?.toLowerCase().includes("lock broken")) {
      filePath = createUniqueUploadPath(userId, "event-cover", extension);
      ({ error: uploadError } = await supabase.storage
        .from(EVENT_COVER_BUCKET)
        .upload(filePath, file, { upsert: false }));
    }

    if (uploadError) {
      throw new Error(
        uploadError.message ||
          "Failed to upload event cover. Please try again.",
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(EVENT_COVER_BUCKET).getPublicUrl(filePath);
    return publicUrl;
  },

  createEvent: async (
    payload: UpsertEventPayload,
    authorName: string,
    createdBy: string,
  ): Promise<EventDetailResponse> => {
    const { data, error } = await supabase
      .from("events")
      .insert({
        title: payload.title,
        description: payload.description,
        author: authorName.trim(),
        category: payload.category,
        cover_image: payload.coverImage || "",
        event_date: payload.eventDate,
        status: payload.status,
        created_by: createdBy,
      })
      .select(
        "id,title,description,author,category,cover_image,event_date,status,created_at,created_by",
      )
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to create event");
    }

    return { item: mapRowToSummary(data as EventRow) };
  },

  updateEvent: async (
    id: string,
    payload: UpsertEventPayload,
  ): Promise<void> => {
    const normalizedId = id.trim();
    const { data, error } = await supabase
      .from("events")
      .update({
        title: payload.title,
        description: payload.description,
        category: payload.category,
        cover_image: payload.coverImage,
        event_date: payload.eventDate,
        status: payload.status,
      })
      .eq("id", normalizedId)
      .select("id")
      .maybeSingle();

    if (error) {
      throw new Error(error.message || "Failed to update event");
    }

    if (!data) {
      throw new Error(
        "Event tidak ter-update. Data ini kemungkinan bukan milik akun yang login.",
      );
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    const { data, error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      throw new Error(error.message || "Failed to delete event");
    }

    if (!data || data.length === 0) {
      throw new Error("Event tidak terhapus. Cek policy DELETE di Supabase.");
    }
  },
};
