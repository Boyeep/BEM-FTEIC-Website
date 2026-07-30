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

const blogRow = {
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
};

const page = {
  items: [blogRow],
  pagination: {
    page: 1,
    page_size: 6,
    total_items: 1,
    total_pages: 1,
    has_next_page: false,
    has_previous_page: false,
  },
};

const server = setupServer(
  http.get("https://api.test/blogs/", () =>
    HttpResponse.json({
      success: true,
      data: page,
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

  it("normalizes the backend error envelope", async () => {
    server.use(
      http.get("https://api.test/blogs/missing", () =>
        HttpResponse.json(
          {
            success: false,
            error: { code: "NOT_FOUND", message: "blog not found" },
            request_id: "request-error",
          },
          { status: 404 },
        ),
      ),
    );
    vi.stubEnv("NEXT_PUBLIC_RUN_MODE", "production");
    vi.stubEnv("NEXT_PUBLIC_API_URL_PROD", "https://api.test");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://supabase.test");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
    vi.resetModules();
    const { blogService } = await import("./blogService");
    await expect(blogService.getPublicBlogById("missing")).rejects.toThrow(
      "blog not found",
    );
  });

  it("covers public and admin detail/list response contracts", async () => {
    server.use(
      http.get("https://api.test/blogs/blog-id", () =>
        HttpResponse.json({ success: true, data: blogRow }),
      ),
      http.get("https://api.test/admin/blogs", () =>
        HttpResponse.json({ success: true, data: page }),
      ),
      http.get("https://api.test/admin/blogs/blog-id", () =>
        HttpResponse.json({ success: true, data: blogRow }),
      ),
    );
    vi.stubEnv("NEXT_PUBLIC_RUN_MODE", "production");
    vi.stubEnv("NEXT_PUBLIC_API_URL_PROD", "https://api.test");
    vi.resetModules();
    const { blogService } = await import("./blogService");

    const [publicDetail, adminList, adminDetail] = await Promise.all([
      blogService.getPublicBlogById(" blog-id "),
      blogService.getDashboardBlogs(1, 6),
      blogService.getDashboardBlogById(" blog-id "),
    ]);
    expect(publicDetail.item.author).toBe("Admin BEM");
    expect(adminList.pagination.totalItems).toBe(1);
    expect(adminDetail.item.id).toBe(blogRow.id);
  });

  it("covers create, update, and delete request contracts", async () => {
    const requests: Array<{ method: string; body?: unknown }> = [];
    server.use(
      http.post("https://api.test/admin/blogs", async ({ request }) => {
        requests.push({ method: "POST", body: await request.json() });
        return HttpResponse.json(
          { success: true, data: blogRow },
          { status: 201 },
        );
      }),
      http.get("https://api.test/admin/blogs/blog-id", () =>
        HttpResponse.json({ success: true, data: blogRow }),
      ),
      http.put("https://api.test/admin/blogs/blog-id", async ({ request }) => {
        requests.push({ method: "PUT", body: await request.json() });
        return HttpResponse.json({ success: true, data: blogRow });
      }),
      http.delete("https://api.test/admin/blogs/blog-id", () => {
        requests.push({ method: "DELETE" });
        return new HttpResponse(null, { status: 204 });
      }),
    );
    vi.stubEnv("NEXT_PUBLIC_RUN_MODE", "production");
    vi.stubEnv("NEXT_PUBLIC_API_URL_PROD", "https://api.test");
    vi.resetModules();
    const { blogService } = await import("./blogService");
    const payload = {
      title: "Kontrak Blog",
      category: "FTEIC",
      content: "Konten pengujian kontrak",
      status: "PUBLISHED" as const,
      coverImage: "https://example.com/cover.jpg",
    };

    await blogService.createBlog(payload, " Admin BEM ", "creator-id");
    await blogService.updateBlog("blog-id", payload);
    await blogService.deleteBlog("blog-id");

    expect(requests.map(({ method }) => method)).toEqual([
      "POST",
      "PUT",
      "DELETE",
    ]);
    expect(requests[0].body).toMatchObject({
      author: "Admin BEM",
      status: "PUBLISHED",
    });
    expect(requests[1].body).toMatchObject({
      author: "Admin BEM",
      published_at: blogRow.published_at,
    });
  });
});
