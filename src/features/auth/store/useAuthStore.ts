// useAuthStore
// Global authentication state management using Zustand.
// Stores user data, tokens, and authentication status.

"use client";

import { User } from "@/features/auth/types";
import { removeToken, setToken } from "@/lib/cookies";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: (user: User, accessToken: string) => {
        setToken(accessToken);
        set({
          user,
          accessToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        removeToken();
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: user !== null,
        });
      },

      setAccessToken: (token: string | null) => {
        set({
          accessToken: token,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
