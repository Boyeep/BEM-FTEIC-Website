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

const eventRow = {
  id: "33333333-3333-4333-8333-333333333333",
  title: "Event",
  description: "Description",
  author: "Legacy",
  category: "FTEIC",
  cover_image: "https://example.com/event.jpg",
  event_date: "2026-08-01",
  status: "UPCOMING",
  publication_status: "PUBLISHED",
  created_at: "2026-07-30T00:00:00Z",
  author_profile: {
    id: "11111111-1111-4111-8111-111111111111",
    username: "Admin BEM",
    avatar_url: null,
  },
};

const page = {
  items: [eventRow],
  pagination: {
    page: 1,
    page_size: 8,
    total_items: 1,
    total_pages: 1,
    has_next_page: false,
    has_previous_page: false,
  },
};

const server = setupServer(
  http.get("https://api.test/events/", ({ request }) => {
    const url = new URL(request.url);
    expect(url.searchParams.get("page_size")).toBe("8");
    expect(url.searchParams.get("start_date")).toBe("2026-08-01");
    expect(url.searchParams.get("end_date")).toBe("2026-08-10");
    expect(url.searchParams.get("category")).toBe("FTEIC");
    expect(url.searchParams.get("sort")).toBe("oldest");
    return HttpResponse.json({
      success: true,
      data: page,
    });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("event API contract", () => {
  it("maps lifecycle, publication, pagination, and embedded author", async () => {
    vi.stubEnv("NEXT_PUBLIC_RUN_MODE", "production");
    vi.stubEnv("NEXT_PUBLIC_API_URL_PROD", "https://api.test");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://supabase.test");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
    vi.resetModules();
    const { eventService } = await import("./eventService");
    const result = await eventService.getPublicEvents(1, 8, {
      startDate: "2026-08-10",
      endDate: "2026-08-01",
      department: "FTEIC",
      sortBy: "oldest",
    });
    expect(result.items[0]).toMatchObject({
      status: "UPCOMING",
      publicationStatus: "PUBLISHED",
      author: "Admin BEM",
    });
    expect(result.pagination.totalItems).toBe(1);
  });

  it("covers public and admin detail/list response contracts", async () => {
    server.use(
      http.get("https://api.test/events/event-id", () =>
        HttpResponse.json({ success: true, data: eventRow }),
      ),
      http.get("https://api.test/admin/events", () =>
        HttpResponse.json({ success: true, data: page }),
      ),
      http.get("https://api.test/admin/events/event-id", () =>
        HttpResponse.json({ success: true, data: eventRow }),
      ),
    );
    vi.stubEnv("NEXT_PUBLIC_RUN_MODE", "production");
    vi.stubEnv("NEXT_PUBLIC_API_URL_PROD", "https://api.test");
    vi.resetModules();
    const { eventService } = await import("./eventService");

    const [publicDetail, adminList, adminDetail] = await Promise.all([
      eventService.getPublicEventById(" event-id "),
      eventService.getDashboardEvents(1, 8),
      eventService.getDashboardEventById(" event-id "),
    ]);
    expect(publicDetail.item.author).toBe("Admin BEM");
    expect(adminList.pagination.totalItems).toBe(1);
    expect(adminDetail.item.publicationStatus).toBe("PUBLISHED");
  });

  it("covers create, update, and delete request contracts", async () => {
    const requests: Array<{ method: string; body?: unknown }> = [];
    server.use(
      http.post("https://api.test/admin/events", async ({ request }) => {
        requests.push({ method: "POST", body: await request.json() });
        return HttpResponse.json(
          { success: true, data: eventRow },
          { status: 201 },
        );
      }),
      http.get("https://api.test/admin/events/event-id", () =>
        HttpResponse.json({ success: true, data: eventRow }),
      ),
      http.put(
        "https://api.test/admin/events/event-id",
        async ({ request }) => {
          requests.push({ method: "PUT", body: await request.json() });
          return HttpResponse.json({ success: true, data: eventRow });
        },
      ),
      http.delete("https://api.test/admin/events/event-id", () => {
        requests.push({ method: "DELETE" });
        return new HttpResponse(null, { status: 204 });
      }),
    );
    vi.stubEnv("NEXT_PUBLIC_RUN_MODE", "production");
    vi.stubEnv("NEXT_PUBLIC_API_URL_PROD", "https://api.test");
    vi.resetModules();
    const { eventService } = await import("./eventService");
    const payload = {
      title: "Event",
      description: "Description",
      category: "FTEIC",
      coverImage: "https://example.com/event.jpg",
      eventDate: "2026-08-01",
      status: "UPCOMING" as const,
      publicationStatus: "PUBLISHED" as const,
    };

    await eventService.createEvent(payload, " Admin BEM ", "creator-id");
    await eventService.updateEvent("event-id", payload);
    await eventService.deleteEvent("event-id");

    expect(requests.map(({ method }) => method)).toEqual([
      "POST",
      "PUT",
      "DELETE",
    ]);
    expect(requests[0].body).toMatchObject({
      author: "Admin BEM",
      event_date: "2026-08-01",
      publication_status: "PUBLISHED",
    });
    expect(requests[1].body).toMatchObject({
      author: "Admin BEM",
      status: "UPCOMING",
    });
  });
});
