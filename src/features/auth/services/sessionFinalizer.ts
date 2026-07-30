import { User as SupabaseUser } from "@supabase/supabase-js";

import { adminAccessPolicy } from "./adminAccessPolicy";
import { mapAuthenticatedUser } from "./authenticatedUserMapper";
import { profileService } from "./profileService";
import { syncServerSession } from "./serverSessionService";
import { signupWhitelistService } from "./signupWhitelistService";

type PendingFinalization = {
  key: string;
  promise: ReturnType<typeof runFinalization>;
};

let pendingFinalization: PendingFinalization | null = null;

async function runFinalization(user: SupabaseUser, accessToken: string) {
  try {
    await signupWhitelistService.ensureEmailWhitelisted(
      user.email || "",
      "session",
    );
  } catch (error) {
    return adminAccessPolicy.rejectSession(error);
  }

  const profile = await profileService.ensureForUser(user);
  await adminAccessPolicy.assertAdmin(profile?.role);
  await syncServerSession(accessToken);
  return mapAuthenticatedUser(user, profile);
}

export function finalizeAdminSession(user: SupabaseUser, accessToken: string) {
  const key = `${user.id}:${accessToken}`;
  if (pendingFinalization?.key === key) {
    return pendingFinalization.promise;
  }

  const promise = runFinalization(user, accessToken);
  pendingFinalization = { key, promise };
  void promise.then(
    () => {
      if (pendingFinalization?.promise === promise) pendingFinalization = null;
    },
    () => {
      if (pendingFinalization?.promise === promise) pendingFinalization = null;
    },
  );
  return promise;
}
