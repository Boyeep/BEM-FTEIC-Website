import { cookies } from "next/headers";

import { signupWhitelistService } from "@/features/auth/services/signupWhitelistService";
import { supabase } from "@/lib/supabase";

function getAuthCookieToken() {
  return (
    cookies().get("flexoo_token")?.value ||
    cookies().get("@flexoo/token")?.value ||
    null
  );
}

export async function getWhitelistedDashboardUser() {
  const token = getAuthCookieToken();

  if (!token) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user?.email) {
    return null;
  }

  try {
    await signupWhitelistService.ensureEmailWhitelisted(
      data.user.email,
      "session",
    );
  } catch {
    return null;
  }

  return data.user;
}
