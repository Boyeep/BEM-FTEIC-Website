import { User as SupabaseUser } from "@supabase/supabase-js";

import { User } from "../types";
import { Profile } from "./profileService";

export function mapAuthenticatedUser(
  user: SupabaseUser,
  profile: Profile | null,
): User {
  const metadataUsername =
    typeof user.user_metadata?.username === "string"
      ? user.user_metadata.username
      : user.email || "";
  const metadataAvatar =
    typeof user.user_metadata?.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : null;
  return {
    id: user.id,
    email: profile?.email || user.email || "",
    username: profile?.username || metadataUsername,
    avatarUrl: profile?.avatar_url || metadataAvatar,
    createdAt: user.created_at,
  };
}
