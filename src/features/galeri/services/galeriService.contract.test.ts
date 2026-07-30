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

const galleryRow = {
  id: "44444444-4444-4444-8444-444444444444",
  title: "Gallery",
  link: "https://example.com/gallery",
  image_url: "https://example.com/gallery.jpg",
  category: "teknik_informatika",
  taken_at: "2026-08-01",
  created_at: "2026-07-30T00:00:00Z",
};

const page = {
  items: [galleryRow],
  pagination: {
    page: 1,
    page_size: 12,
    total_items: 1,
    total_pages: 1,
    has_next_page: false,
    has_previous_page: false,
  },
};

const server = setupServer(
  http.get("https://api.test/gallery/", ({ request }) => {
    const url = new URL(request.url);
    expect(url.searchParams.get("page_size")).toBe("12");
    expect(url.searchParams.get("sort")).toBe("latest");
    expect(url.searchParams.has("category")).toBe(false);
    return HttpResponse.json({
      success: true,
      data: page,
    });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("gallery API contract", () => {
  it("maps category, date, and pagination", async () => {
    vi.stubEnv("NEXT_PUBLIC_RUN_MODE", "production");
    vi.stubEnv("NEXT_PUBLIC_API_URL_PROD", "https://api.test");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://supabase.test");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
    vi.resetModules();
    const { galeriService } = await import("./galeriService");
    const result = await galeriService.getPublicGaleri(1, 12, {});
    expect(result.items[0]).toMatchObject({
      category: "teknik_informatika",
      takenAt: "2026-08-01",
    });
    expect(result.pagination.totalItems).toBe(1);
  });

  it("covers public and admin detail/list response contracts", async () => {
    server.use(
      http.get("https://api.test/gallery/gallery-id", () =>
        HttpResponse.json({ success: true, data: galleryRow }),
      ),
      http.get("https://api.test/admin/gallery", () =>
        HttpResponse.json({ success: true, data: page }),
      ),
      http.get("https://api.test/admin/gallery/gallery-id", () =>
        HttpResponse.json({ success: true, data: galleryRow }),
      ),
    );
    vi.stubEnv("NEXT_PUBLIC_RUN_MODE", "production");
    vi.stubEnv("NEXT_PUBLIC_API_URL_PROD", "https://api.test");
    vi.resetModules();
    const { galeriService } = await import("./galeriService");

    const [publicDetail, adminList, adminDetail] = await Promise.all([
      galeriService.getPublicGaleriById(" gallery-id "),
      galeriService.getDashboardGaleri(1, 12),
      galeriService.getDashboardGaleriById(" gallery-id "),
    ]);
    expect(publicDetail.item.link).toBe("https://example.com/gallery");
    expect(adminList.pagination.totalItems).toBe(1);
    expect(adminDetail.item.category).toBe("teknik_informatika");
  });

  it("covers create, update, and delete request contracts", async () => {
    const requests: Array<{ method: string; body?: unknown }> = [];
    server.use(
      http.post("https://api.test/admin/gallery", async ({ request }) => {
        requests.push({ method: "POST", body: await request.json() });
        return HttpResponse.json(
          { success: true, data: galleryRow },
          { status: 201 },
        );
      }),
      http.put(
        "https://api.test/admin/gallery/gallery-id",
        async ({ request }) => {
          requests.push({ method: "PUT", body: await request.json() });
          return HttpResponse.json({ success: true, data: galleryRow });
        },
      ),
      http.delete("https://api.test/admin/gallery/gallery-id", () => {
        requests.push({ method: "DELETE" });
        return new HttpResponse(null, { status: 204 });
      }),
    );
    vi.stubEnv("NEXT_PUBLIC_RUN_MODE", "production");
    vi.stubEnv("NEXT_PUBLIC_API_URL_PROD", "https://api.test");
    vi.resetModules();
    const { galeriService } = await import("./galeriService");
    const payload = {
      title: "Gallery",
      link: "example.com/gallery",
      imageUrl: "https://example.com/gallery.jpg",
      takenAt: "2026-08-01",
      category: "teknik_informatika" as const,
    };

    await galeriService.createGaleri(payload, "creator-id");
    await galeriService.updateGaleri("gallery-id", payload);
    await galeriService.deleteGaleri("gallery-id");

    expect(requests.map(({ method }) => method)).toEqual([
      "POST",
      "PUT",
      "DELETE",
    ]);
    expect(requests[0].body).toMatchObject({
      link: "https://example.com/gallery",
      category: "teknik_informatika",
    });
    expect(requests[1].body).toMatchObject({
      taken_at: "2026-08-01",
      image_url: "https://example.com/gallery.jpg",
    });
  });
});
