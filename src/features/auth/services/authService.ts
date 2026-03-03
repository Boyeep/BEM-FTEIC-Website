// authService
// Contains authentication-related API calls (login, signup, verify email).
// Centralizes all auth HTTP requests.

import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "@/features/auth/types";
import { supabase } from "@/lib/supabase";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.session || !data.user) {
      throw new Error(error?.message || "Login failed");
    }

    const username =
      typeof data.user.user_metadata?.username === "string"
        ? data.user.user_metadata.username
        : data.user.email || "";

    return {
      user: {
        id: data.user.id,
        email: data.user.email || "",
        username,
        createdAt: data.user.created_at,
      },
      accessToken: data.session.access_token,
    };
  },

  signup: async (payload: SignupRequest): Promise<SignupResponse> => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          username: payload.username,
        },
        emailRedirectTo: `${siteUrl}/confirm-email`,
      },
    });

    if (error) {
      throw new Error(error.message || "Signup failed");
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

    const username =
      typeof user.user_metadata?.username === "string"
        ? user.user_metadata.username
        : user.email || "";

    return {
      message: "Email verified successfully!",
      user: {
        id: user.id,
        email: user.email || "",
        username,
        createdAt: user.created_at,
      },
      accessToken: session.access_token,
    };
  },
};
