import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const server = setupServer(
  http.get("https://api.test/blogs/", () =>
    HttpResponse.json({
      success: true,
      data: {
        items: [
          {
            id: "18f34d9a-9824-43c7-a479-b758714df7fd",
            title: "Kontrak Blog",
            excerpt: "",
            author: "Legacy author",
            category: "FTEIC",
            cover_image: "https://example.com/cover.jpg",
            published_at: "2026-07-30T00:00:00Z",
            content: "Konten pengujian kontrak",
            status: "PUBLISHED",
            created_at: "2026-07-30T00:00:00Z",
            created_by: "09bf3f48-6ea7-412d-86f7-8f4f8bca8a47",
            author_profile: {
              id: "09bf3f48-6ea7-412d-86f7-8f4f8bca8a47",
              username: "Admin BEM",
              avatar_url: "https://example.com/avatar.jpg",
            },
          },
        ],
        pagination: {
          page: 1,
          page_size: 6,
          total_items: 1,
          total_pages: 1,
          has_next_page: false,
          has_previous_page: false,
        },
      },
      request_id: "request-1",
    }),
  ),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("blog API contract", () => {
  it("maps pagination and embedded author without a profile request", async () => {
    vi.stubEnv("NEXT_PUBLIC_RUN_MODE", "production");
    vi.stubEnv("NEXT_PUBLIC_API_URL_PROD", "https://api.test");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://supabase.test");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
    vi.resetModules();
    const { blogService } = await import("./blogService");

    const result = await blogService.getPublicBlogs(1, 6);

    expect(result.pagination.totalItems).toBe(1);
    expect(result.items[0]).toMatchObject({
      author: "Admin BEM",
      authorAvatarUrl: "https://example.com/avatar.jpg",
    });
  });
});
