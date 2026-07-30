import { profileService } from "@/features/auth/services/profileService";
import { finalizeAdminSession } from "@/features/auth/services/sessionFinalizer";
import { signupWhitelistService } from "@/features/auth/services/signupWhitelistService";
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "@/features/auth/types";
import { supabaseAuthGateway } from "./supabaseAuthGateway";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const normalizedEmail = await signupWhitelistService.ensureEmailWhitelisted(
      credentials.email,
      "login",
    );

    const { data, error } = await supabaseAuthGateway.signIn(
      normalizedEmail,
      credentials.password,
    );

    if (error || !data.session || !data.user) {
      throw new Error(error?.message || "Login failed");
    }

    return {
      user: await finalizeAdminSession(data.user, data.session.access_token),
      accessToken: data.session.access_token,
    };
  },

  signup: async (payload: SignupRequest): Promise<SignupResponse> => {
    const normalizedEmail = await signupWhitelistService.ensureEmailWhitelisted(
      payload.email,
      "signup",
    );

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { data, error } = await supabaseAuthGateway.signUp(
      normalizedEmail,
      payload.password,
      payload.username.trim(),
      `${siteUrl}/confirm-email`,
    );

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
      const { error } = await supabaseAuthGateway.exchangeCode(payload.code);
      if (error) {
        throw new Error(error.message || "Email verification failed");
      }
    } else if (payload.accessToken && payload.refreshToken) {
      const { error } = await supabaseAuthGateway.setSession(
        payload.accessToken,
        payload.refreshToken,
      );
      if (error) {
        throw new Error(error.message || "Email verification failed");
      }
    } else if (payload.tokenHash && payload.type) {
      const { error } = await supabaseAuthGateway.verifyOtp(
        payload.tokenHash,
        payload.type,
      );
      if (error) {
        throw new Error(error.message || "Email verification failed");
      }
    } else {
      throw new Error("Missing verification parameters");
    }

    const { data, error } = await supabaseAuthGateway.getSession();
    const session = data.session;
    const user = session?.user;

    if (error || !session || !user) {
      throw new Error(error?.message || "Failed to create session");
    }

    return {
      message: "Email verified successfully!",
      user: await finalizeAdminSession(user, session.access_token),
      accessToken: session.access_token,
    };
  },
};
