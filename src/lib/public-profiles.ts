import { supabase } from "@/lib/supabase";

export type PublicProfileRow = {
  id: string;
  username: string;
  avatar_url?: string | null;
};

async function querySingleProfile(
  source: "public_profiles" | "profiles",
  id: string,
) {
  const { data, error } = await supabase
    .from(source)
    .select("id,username,avatar_url")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as PublicProfileRow;
}

async function queryProfileList(
  source: "public_profiles" | "profiles",
  ids: string[],
) {
  const { data, error } = await supabase
    .from(source)
    .select("id,username,avatar_url")
    .in("id", ids);

  if (error || !data) {
    return [];
  }

  return (data || []) as PublicProfileRow[];
}

export async function getPublicProfileById(id?: string | null) {
  if (!id) return null;

  const fromPublicView = await querySingleProfile("public_profiles", id);
  if (fromPublicView) {
    return fromPublicView;
  }

  return querySingleProfile("profiles", id);
}

export async function getPublicProfilesByIds(ids: string[]) {
  if (ids.length === 0) {
    return [];
  }

  const uniqueIds = Array.from(new Set(ids));
  const fromPublicView = await queryProfileList("public_profiles", uniqueIds);
  if (fromPublicView.length > 0) {
    return fromPublicView;
  }

  return queryProfileList("profiles", uniqueIds);
}
