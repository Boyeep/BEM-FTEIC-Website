import { cookies } from "next/headers";

import { supabase } from "@/lib/supabase";

async function getAuthCookieToken() {
  const cookieStore = await cookies();
  return cookieStore.get("bem_fteic_session")?.value || null;
}

export async function getWhitelistedDashboardUser() {
  const token = await getAuthCookieToken();

  if (!token) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user?.email) {
    return null;
  }

  const apiURL = process.env.NEXT_PUBLIC_API_URL_PROD?.replace(/\/$/, "");
  if (!apiURL) {
    return null;
  }
  const profileResponse = await fetch(`${apiURL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!profileResponse.ok) return null;
  const profile = (await profileResponse.json()) as {
    data?: { role?: string };
  };
  if (profile.data?.role !== "admin") return null;

  return data.user;
}
