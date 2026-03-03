import {
  EventDetailResponse,
  EventListParams,
  EventListResponse,
} from "@/features/event/types";

const DEFAULT_ERROR_MESSAGE = "Unable to fetch event data. Please try again.";

async function parseErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string };
    return payload.message || DEFAULT_ERROR_MESSAGE;
  } catch {
    return DEFAULT_ERROR_MESSAGE;
  }
}

export async function getEvents({
  page,
  limit,
}: EventListParams): Promise<EventListResponse> {
  const response = await fetch(`/api/events?page=${page}&limit=${limit}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return (await response.json()) as EventListResponse;
}

export async function getEventById(id: string): Promise<EventDetailResponse> {
  const response = await fetch(`/api/events/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return (await response.json()) as EventDetailResponse;
}
