// authService
// Contains authentication-related API calls (login, signup, verify email).
// Centralizes all auth HTTP requests.

import { profileService } from "@/features/auth/services/profileService";
import { signupWhitelistService } from "@/features/auth/services/signupWhitelistService";
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "@/features/auth/types";
import { supabase } from "@/lib/supabase";

async function ensureCurrentSessionIsWhitelisted(email?: string | null) {
  try {
    await signupWhitelistService.ensureEmailWhitelisted(email || "", "session");
  } catch (error) {
    await supabase.auth.signOut();
    throw error;
  }
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const normalizedEmail = await signupWhitelistService.ensureEmailWhitelisted(
      credentials.email,
      "login",
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: credentials.password,
    });

    if (error || !data.session || !data.user) {
      throw new Error(error?.message || "Login failed");
    }

    await ensureCurrentSessionIsWhitelisted(data.user.email);

    let profile = null;
    try {
      profile = await profileService.ensureForUser(data.user);
    } catch {
      profile = null;
    }

    const fallbackUsername =
      typeof data.user.user_metadata?.username === "string"
        ? data.user.user_metadata.username
        : data.user.email || "";

    return {
      user: {
        id: data.user.id,
        email: profile?.email || data.user.email || "",
        username: profile?.username || fallbackUsername,
        avatarUrl:
          profile?.avatar_url ||
          (typeof data.user.user_metadata?.avatar_url === "string"
            ? data.user.user_metadata.avatar_url
            : null),
        createdAt: data.user.created_at,
      },
      accessToken: data.session.access_token,
    };
  },

  signup: async (payload: SignupRequest): Promise<SignupResponse> => {
    const normalizedEmail = await signupWhitelistService.ensureEmailWhitelisted(
      payload.email,
      "signup",
    );

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: payload.password,
      options: {
        data: {
          username: payload.username.trim(),
        },
        emailRedirectTo: `${siteUrl}/confirm-email`,
      },
    });

    if (error) {
      throw new Error(error.message || "Signup failed");
    }

    if (data.user) {
      try {
        await profileService.ensureForUser(data.user);
      } catch {
        // No-op: auth signup should continue even if profile table is not ready.
      }
    }

    return {
      message: "Account created! Check your inbox.",
    };
  },

  verifyEmail: async (
    payload: VerifyEmailRequest,
  ): Promise<VerifyEmailResponse> => {
    if (payload.code) {
      const { error } = await supabase.auth.exchangeCodeForSession(
        payload.code,
      );
      if (error) {
        throw new Error(error.message || "Email verification failed");
      }
    } else if (payload.accessToken && payload.refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: payload.accessToken,
        refresh_token: payload.refreshToken,
      });
      if (error) {
        throw new Error(error.message || "Email verification failed");
      }
    } else if (payload.tokenHash && payload.type) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: payload.tokenHash,
        type: payload.type,
      });
      if (error) {
        throw new Error(error.message || "Email verification failed");
      }
    } else {
      throw new Error("Missing verification parameters");
    }

    const { data, error } = await supabase.auth.getSession();
    const session = data.session;
    const user = session?.user;

    if (error || !session || !user) {
      throw new Error(error?.message || "Failed to create session");
    }

    await ensureCurrentSessionIsWhitelisted(user.email);

    let profile = null;
    try {
      profile = await profileService.ensureForUser(user);
    } catch {
      profile = null;
    }

    const fallbackUsername =
      typeof user.user_metadata?.username === "string"
        ? user.user_metadata.username
        : user.email || "";

    return {
      message: "Email verified successfully!",
      user: {
        id: user.id,
        email: profile?.email || user.email || "",
        username: profile?.username || fallbackUsername,
        avatarUrl:
          profile?.avatar_url ||
          (typeof user.user_metadata?.avatar_url === "string"
            ? user.user_metadata.avatar_url
            : null),
        createdAt: user.created_at,
      },
      accessToken: session.access_token,
    };
  },
};
