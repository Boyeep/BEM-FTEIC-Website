import {
  BlogDetailResponse,
  BlogListParams,
  BlogListResponse,
} from "@/features/blog/types";

const DEFAULT_ERROR_MESSAGE = "Unable to fetch blog data. Please try again.";

async function parseErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string };
    return payload.message || DEFAULT_ERROR_MESSAGE;
  } catch {
    return DEFAULT_ERROR_MESSAGE;
  }
}

export async function getBlogs({
  page,
  limit,
}: BlogListParams): Promise<BlogListResponse> {
  const response = await fetch(`/api/blogs?page=${page}&limit=${limit}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return (await response.json()) as BlogListResponse;
}

export async function getBlogById(id: string): Promise<BlogDetailResponse> {
  const response = await fetch(`/api/blogs/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return (await response.json()) as BlogDetailResponse;
}
