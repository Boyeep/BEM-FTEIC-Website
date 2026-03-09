import {
  BlogDetailResponse,
  BlogListParams,
  BlogListResponse,
} from "@/features/blog/types";
import { blogService } from "@/features/blog/services/blogService";

export async function getBlogs({
  page,
  limit,
}: BlogListParams): Promise<BlogListResponse> {
  return blogService.getPublicBlogs(page, limit);
}

export async function getBlogById(id: string): Promise<BlogDetailResponse> {
  return blogService.getPublicBlogById(id);
}
