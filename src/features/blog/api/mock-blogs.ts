import { Blog, BlogListResponse, BlogSummary } from "@/features/blog/types";

const BLOG_IMAGE =
  "https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?auto=format&fit=crop&w=1200&q=80";

const BASE_CONTENT =
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.\n\nNeque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.";

const BASE_TITLE = "Bringing Humanized Intelligent Technology for Society";
const BASE_EXCERPT =
  "el illum qui dolorem eum fugiat quo voluptas lorem ipsum lorem ipsum lorem ipsum...";

const MOCK_BLOGS: Blog[] = Array.from({ length: 18 }, (_, index) => ({
  id: String(index + 1),
  title: BASE_TITLE,
  excerpt: BASE_EXCERPT,
  author: "Lorem Ipsum",
  category: "NEWS",
  coverImage: BLOG_IMAGE,
  publishedAt: new Date(2025, 7, 11 + index).toISOString(),
  readingTimeMinutes: 8,
  content: BASE_CONTENT,
}));

export function getAllBlogs(): Blog[] {
  return [...MOCK_BLOGS];
}

export function getBlogById(id: string): Blog | undefined {
  return MOCK_BLOGS.find((blog) => blog.id === id);
}

export function getPaginatedBlogs(
  page: number,
  limit: number,
): BlogListResponse {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 6;
  const totalItems = MOCK_BLOGS.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
  const normalizedPage = Math.min(safePage, totalPages);
  const startIndex = (normalizedPage - 1) * safeLimit;
  const endIndex = startIndex + safeLimit;

  const items: BlogSummary[] = MOCK_BLOGS.slice(startIndex, endIndex).map(
    ({ content, ...summary }) => summary,
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
}
