import { AxiosError } from "axios";

import {
  BlogDetailResponse,
  BlogListParams,
  BlogListResponse,
} from "@/features/blog/types";
import api from "@/lib/api";

interface ApiErrorPayload {
  message?: string | string[] | Record<string, string[]>;
}

const DEFAULT_ERROR_MESSAGE = "Unable to fetch blog data. Please try again.";

function mapAxiosError(error: unknown): Error {
  if (error instanceof AxiosError) {
    const payload = error.response?.data as ApiErrorPayload | undefined;
    const message = payload?.message;

    if (typeof message === "string") {
      return new Error(message);
    }

    if (Array.isArray(message) && message[0]) {
      return new Error(message[0]);
    }

    if (message && typeof message === "object") {
      const firstEntry = Object.values(message)[0];
      if (Array.isArray(firstEntry) && firstEntry[0]) {
        return new Error(firstEntry[0]);
      }
    }

    if (error.message) {
      return new Error(error.message);
    }
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error(DEFAULT_ERROR_MESSAGE);
}

export async function getBlogs({
  page,
  limit,
}: BlogListParams): Promise<BlogListResponse> {
  try {
    const { data } = await api.get<BlogListResponse>("/api/blogs", {
      params: { page, limit },
    });

    return data;
  } catch (error) {
    throw mapAxiosError(error);
  }
}

export async function getBlogById(id: string): Promise<BlogDetailResponse> {
  try {
    const { data } = await api.get<BlogDetailResponse>(`/api/blogs/${id}`);
    return data;
  } catch (error) {
    throw mapAxiosError(error);
  }
}
