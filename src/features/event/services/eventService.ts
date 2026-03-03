import { supabase } from "@/lib/supabase";
import {
  EventDetailResponse,
  EventListResponse,
  EventStatus,
  EventSummary,
  UpsertEventPayload,
} from "@/features/event/types";

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
};

const EVENT_COVER_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_EVENT_COVER_BUCKET || "event-covers";

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
  };
}

export const eventService = {
  getPublicEvents: async (
    page: number,
    limit: number,
  ): Promise<EventListResponse> => {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 8;
    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit - 1;

    const { data, count, error } = await supabase
      .from("events")
      .select(
        "id,title,description,author,category,cover_image,event_date,status,created_at",
        { count: "exact" },
      )
      .order("event_date", { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(error.message || "Failed to fetch events");
    }

    const totalItems = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
    const normalizedPage = Math.min(safePage, totalPages);

    return {
      items: ((data || []) as EventRow[]).map(mapRowToSummary),
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
    const { data, error } = await supabase
      .from("events")
      .select(
        "id,title,description,author,category,cover_image,event_date,status,created_at",
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Event not found.");
    }

    return { item: mapRowToSummary(data as EventRow) };
  },

  uploadCover: async (userId: string, file: File): Promise<string> => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${userId}/event-cover-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(EVENT_COVER_BUCKET)
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw new Error(uploadError.message || "Failed to upload event cover");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(EVENT_COVER_BUCKET).getPublicUrl(filePath);
    return publicUrl;
  },

  createEvent: async (
    payload: UpsertEventPayload,
    authorEmail: string,
    createdBy: string,
  ): Promise<EventDetailResponse> => {
    const { data, error } = await supabase
      .from("events")
      .insert({
        title: payload.title,
        description: payload.description,
        author: authorEmail,
        category: payload.category,
        cover_image: payload.coverImage || "",
        event_date: payload.eventDate,
        status: payload.status,
        created_by: createdBy,
      })
      .select(
        "id,title,description,author,category,cover_image,event_date,status,created_at",
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
  ): Promise<EventDetailResponse> => {
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
      .eq("id", id)
      .select(
        "id,title,description,author,category,cover_image,event_date,status,created_at",
      )
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to update event");
    }

    return { item: mapRowToSummary(data as EventRow) };
  },
};
