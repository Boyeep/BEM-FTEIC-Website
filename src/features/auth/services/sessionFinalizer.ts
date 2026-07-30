import { User as SupabaseUser } from "@supabase/supabase-js";

import { adminAccessPolicy } from "./adminAccessPolicy";
import { mapAuthenticatedUser } from "./authenticatedUserMapper";
import { profileService } from "./profileService";
import { syncServerSession } from "./serverSessionService";
import { signupWhitelistService } from "./signupWhitelistService";

export async function finalizeAdminSession(
  user: SupabaseUser,
  accessToken: string,
) {
  try {
    await signupWhitelistService.ensureEmailWhitelisted(
      user.email || "",
      "session",
    );
  } catch (error) {
    return adminAccessPolicy.rejectSession(error);
  }

  const profile = await profileService.ensureForUser(user).catch(() => null);
  await adminAccessPolicy.assertAdmin(profile?.role);
  await syncServerSession(accessToken);
  return mapAuthenticatedUser(user, profile);
}
