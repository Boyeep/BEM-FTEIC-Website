import { User as SupabaseUser } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

type ProfileRow = {
  id: string;
  email: string;
  username: string;
  avatar_url?: string | null;
  updated_at?: string;
};

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
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,username,avatar_url,updated_at")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message || "Failed to load profile");
    }

    return data;
  },

  ensureForUser: async (user: SupabaseUser): Promise<ProfileRow> => {
    const existing = await profileService.getById(user.id);
    if (existing) return existing;

    const fallback = mapFallbackProfile(user);
    const { data, error } = await supabase
      .from("profiles")
      .upsert(fallback, { onConflict: "id" })
      .select("id,email,username,avatar_url,updated_at")
      .single();

    if (error) {
      throw new Error(error.message || "Failed to create profile");
    }

    return data;
  },

  updateName: async (userId: string, username: string): Promise<ProfileRow> => {
    const { data, error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", userId)
      .select("id,email,username,avatar_url,updated_at")
      .single();

    if (error) {
      throw new Error(error.message || "Failed to update profile name");
    }

    return data;
  },

  uploadAvatar: async (userId: string, file: File): Promise<ProfileRow> => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET || "avatars";
    const filePath = `${userId}/avatar-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw new Error(uploadError.message || "Failed to upload avatar");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    const { data, error } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId)
      .select("id,email,username,avatar_url,updated_at")
      .single();

    if (error) {
      throw new Error(error.message || "Failed to save avatar URL");
    }

    return data;
  },
};
