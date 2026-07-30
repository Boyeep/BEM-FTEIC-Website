import { api } from "@/lib/api";
import { ApiSuccess } from "@/types/api";

export type PublicProfileRow = {
  id: string;
  username: string;
  avatar_url?: string | null;
};

export async function getPublicProfilesByIds(ids: string[]) {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
  if (uniqueIds.length === 0) {
    return [];
  }
  const { data } = await api.get<ApiSuccess<PublicProfileRow[]>>("/profiles", {
    params: { ids: uniqueIds.join(",") },
  });
  return data.data;
}

export async function getPublicProfileById(id?: string | null) {
  if (!id) {
    return null;
  }
  const profiles = await getPublicProfilesByIds([id]);
  return profiles[0] || null;
}
