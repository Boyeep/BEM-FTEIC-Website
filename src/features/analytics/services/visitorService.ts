import { api } from "@/lib/api";
import { ApiSuccess } from "@/types/api";

const VISITOR_ID_KEY = "site_visitor_id";

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

    await api.post("/visitors", {
      id: visitorId,
      path: pathname,
      user_agent:
        typeof window !== "undefined" ? window.navigator.userAgent : "",
    });
  },

  getVisitorCount: async (): Promise<number> => {
    const { data } =
      await api.get<ApiSuccess<{ count: number }>>("/visitors/count");
    return Number(data.data.count) || 0;
  },
};
