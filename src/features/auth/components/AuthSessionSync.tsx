"use client";

import { type Session, User as SupabaseUser } from "@supabase/supabase-js";
import { useEffect } from "react";

import { profileService } from "@/features/auth/services/profileService";
import { signupWhitelistService } from "@/features/auth/services/signupWhitelistService";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { type User } from "@/features/auth/types";
import { setToken } from "@/lib/cookies";
import { supabase } from "@/lib/supabase";

const mapUser = async (source: SupabaseUser): Promise<User> => {
  let profile = null;
  try {
    profile = await profileService.ensureForUser(source);
  } catch {
    profile = null;
  }

  return {
    id: source.id,
    email: profile?.email || source.email || "",
    username:
      profile?.username ||
      (typeof source.user_metadata?.username === "string"
        ? source.user_metadata.username
        : source.email || ""),
    avatarUrl:
      profile?.avatar_url ||
      (typeof source.user_metadata?.avatar_url === "string"
        ? source.user_metadata.avatar_url
        : null),
    createdAt: source.created_at,
  };
};

export default function AuthSessionSync() {
  const { logout, setUser, setAccessToken } = useAuthStore();

  useEffect(() => {
    let cancelled = false;

    const clearLocalSession = () => {
      if (cancelled) return;
      logout();
    };

    const applySession = async (session: Session | null) => {
      if (!session?.user) {
        clearLocalSession();
        return;
      }

      try {
        await signupWhitelistService.ensureEmailWhitelisted(
          session.user.email || "",
          "session",
        );
      } catch {
        await supabase.auth.signOut();
        clearLocalSession();
        return;
      }

      const mappedUser = await mapUser(session.user);
      if (cancelled) return;

      setUser(mappedUser);
      setAccessToken(session.access_token);
      setToken(session.access_token);
    };

    const bootstrap = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        clearLocalSession();
        return;
      }

      await applySession(data.session ?? null);
    };

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [logout, setAccessToken, setUser]);

  return null;
}
