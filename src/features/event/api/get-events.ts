import {
  EventDetailResponse,
  EventListParams,
  EventListResponse,
} from "@/features/event/types";
import { eventService } from "@/features/event/services/eventService";

export async function getEvents({
  page,
  limit,
  startDate,
  endDate,
  sortBy,
  department,
}: EventListParams): Promise<EventListResponse> {
  return eventService.getPublicEvents(page, limit, {
    startDate,
    endDate,
    sortBy,
    department,
  });
}

export async function getEventById(id: string): Promise<EventDetailResponse> {
  return eventService.getDashboardEventById(id);
}
