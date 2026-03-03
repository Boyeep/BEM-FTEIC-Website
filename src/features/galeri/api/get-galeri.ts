import {
  GaleriDetailResponse,
  GaleriListParams,
  GaleriListResponse,
} from "@/features/galeri/types";

const DEFAULT_ERROR_MESSAGE = "Unable to fetch galeri data. Please try again.";

async function parseErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string };
    return payload.message || DEFAULT_ERROR_MESSAGE;
  } catch {
    return DEFAULT_ERROR_MESSAGE;
  }
}

export async function getGaleri({
  page,
  limit,
}: GaleriListParams): Promise<GaleriListResponse> {
  const response = await fetch(`/api/galeri?page=${page}&limit=${limit}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return (await response.json()) as GaleriListResponse;
}

export async function getGaleriById(id: string): Promise<GaleriDetailResponse> {
  const response = await fetch(`/api/galeri/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return (await response.json()) as GaleriDetailResponse;
}
