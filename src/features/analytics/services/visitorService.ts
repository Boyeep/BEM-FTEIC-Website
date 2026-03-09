import { supabase } from "@/lib/supabase";

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

    const payload = {
      id: visitorId,
      last_seen_at: new Date().toISOString(),
      last_path: pathname,
      user_agent:
        typeof window !== "undefined" ? window.navigator.userAgent : null,
    };

    await supabase.from("site_visitors").upsert(payload, { onConflict: "id" });
  },

  getVisitorCount: async (): Promise<number> => {
    const { count, error } = await supabase
      .from("site_visitors")
      .select("id", { count: "exact", head: true });

    if (error) {
      throw new Error(error.message || "Failed to fetch visitor count");
    }

    return count || 0;
  },
};
