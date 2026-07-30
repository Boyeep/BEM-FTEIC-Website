import { User as SupabaseUser } from "@supabase/supabase-js";

import { api } from "@/lib/api";
import { deleteImageFromAPI, uploadImageToAPI } from "@/lib/upload";
import { ApiSuccess } from "@/types/api";

export type Profile = {
  id: string;
  email: string;
  username: string;
  avatar_url?: string | null;
  updated_at?: string;
  role?: "member" | "admin";
};

const mapFallbackProfile = (user: SupabaseUser): Profile => ({
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
  getById: async (userId: string): Promise<Profile | null> => {
    const { data } = await api.get<ApiSuccess<Profile>>("/me");
    void userId;
    return data.data;
  },

  ensureForUser: async (user: SupabaseUser): Promise<Profile> => {
    const existing = await profileService.getById(user.id);
    return existing || mapFallbackProfile(user);
  },

  updateName: async (userId: string, username: string): Promise<Profile> => {
    const current = await profileService.getById(userId);
    const { data } = await api.put<ApiSuccess<Profile>>("/me", {
      username,
      avatar_url: current?.avatar_url || "",
    });
    return data.data;
  },

  uploadAvatar: async (userId: string, file: File): Promise<Profile> => {
    const publicUrl = await uploadImageToAPI(file);

    const current = await profileService.getById(userId);
    const { data } = await api.put<ApiSuccess<Profile>>("/me", {
      username: current?.username || "Admin",
      avatar_url: publicUrl,
    });
    await deleteImageFromAPI(current?.avatar_url);
    return data.data;
  },
};
