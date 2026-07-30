"use client";

import { type Session } from "@supabase/supabase-js";
import { useEffect } from "react";

import { clearServerSession } from "@/features/auth/services/serverSessionService";
import { finalizeAdminSession } from "@/features/auth/services/sessionFinalizer";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { supabase } from "@/lib/supabase";

export default function AuthSessionSync() {
  const { logout, setUser, setAccessToken } = useAuthStore();

  useEffect(() => {
    let cancelled = false;

    const clearLocalSession = () => {
      if (cancelled) return;
      logout();
      void clearServerSession();
    };

    const applySession = async (session: Session | null) => {
      if (!session?.user) {
        clearLocalSession();
        return;
      }

      try {
        const user = await finalizeAdminSession(
          session.user,
          session.access_token,
        );
        if (cancelled) return;
        setUser(user);
        setAccessToken(session.access_token);
      } catch {
        clearLocalSession();
      }
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
