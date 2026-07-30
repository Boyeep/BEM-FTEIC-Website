import { User as SupabaseUser } from "@supabase/supabase-js";

import { deleteImageFromAPI, uploadImageToAPI } from "@/lib/upload";
import { api } from "@/lib/api";

type ProfileRow = {
  id: string;
  email: string;
  username: string;
  avatar_url?: string | null;
  updated_at?: string;
  role?: "member" | "admin";
};
type APIEnvelope<T> = { success: boolean; data: T };

const mapFallbackProfile = (user: SupabaseUser): ProfileRow => ({
  id: user.id,
  email: user.email || "",
  username:
    typeof user.user_metadata?.username === "string"
      ? user.user_metadata.username
      : user.email || "",
  avatar_url:
    typeof user.user_metadata?.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : null,
});

export const profileService = {
  getById: async (userId: string): Promise<ProfileRow | null> => {
    const { data } = await api.get<APIEnvelope<ProfileRow>>("/me");
    void userId;
    return data.data;
  },

  ensureForUser: async (user: SupabaseUser): Promise<ProfileRow> => {
    const existing = await profileService.getById(user.id);
    return existing || mapFallbackProfile(user);
  },

  updateName: async (userId: string, username: string): Promise<ProfileRow> => {
    const current = await profileService.getById(userId);
    const { data } = await api.put<APIEnvelope<ProfileRow>>("/me", {
      username,
      avatar_url: current?.avatar_url || "",
    });
    return data.data;
  },

  uploadAvatar: async (userId: string, file: File): Promise<ProfileRow> => {
    const publicUrl = await uploadImageToAPI(file);

    const current = await profileService.getById(userId);
    const { data } = await api.put<APIEnvelope<ProfileRow>>("/me", {
      username: current?.username || "Admin",
      avatar_url: publicUrl,
    });
    await deleteImageFromAPI(current?.avatar_url);
    return data.data;
  },
};
