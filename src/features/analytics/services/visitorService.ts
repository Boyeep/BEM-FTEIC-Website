import { ApiSuccess } from "@/types/api";

const VISITOR_ID_KEY = "site_visitor_id";
const PUBLIC_API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_URL_DEV
    : process.env.NEXT_PUBLIC_API_URL_PROD;

function getPublicApiUrl(path: string) {
  if (!PUBLIC_API_BASE_URL) {
    throw new Error("Missing public API base URL");
  }

  return new URL(
    path.replace(/^\//, ""),
    `${PUBLIC_API_BASE_URL.replace(/\/$/, "")}/`,
  ).toString();
}

async function assertSuccessfulResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Visitor API request failed with ${response.status}`);
  }
}

function getBrowserVisitorId() {
  if (typeof window === "undefined") return null;

  const existing = window.localStorage.getItem(VISITOR_ID_KEY);
  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(VISITOR_ID_KEY, generated);
  return generated;
}

export const visitorService = {
  trackVisit: async (pathname: string) => {
    const visitorId = getBrowserVisitorId();
    if (!visitorId) return;

    const response = await fetch(getPublicApiUrl("/visitors"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: visitorId,
        path: pathname,
        user_agent:
          typeof window !== "undefined" ? window.navigator.userAgent : "",
      }),
      credentials: "omit",
      keepalive: true,
    });
    await assertSuccessfulResponse(response);
  },

  getVisitorCount: async (): Promise<number> => {
    const response = await fetch(getPublicApiUrl("/visitors/count"), {
      credentials: "omit",
    });
    await assertSuccessfulResponse(response);
    const data = (await response.json()) as ApiSuccess<{ count: number }>;
    return Number(data.data.count) || 0;
  },
};
