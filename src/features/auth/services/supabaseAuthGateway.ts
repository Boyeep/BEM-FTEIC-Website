import { supabase } from "@/lib/supabase";

export const supabaseAuthGateway = {
  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),
  signUp: (
    email: string,
    password: string,
    username: string,
    emailRedirectTo: string,
  ) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: { username }, emailRedirectTo },
    }),
  exchangeCode: (code: string) => supabase.auth.exchangeCodeForSession(code),
  setSession: (accessToken: string, refreshToken: string) =>
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    }),
  verifyOtp: (tokenHash: string, type: "signup" | "email") =>
    supabase.auth.verifyOtp({ token_hash: tokenHash, type }),
  getSession: () => supabase.auth.getSession(),
  signOut: () => supabase.auth.signOut(),
};
