import { supabaseAuthGateway } from "./supabaseAuthGateway";

export const adminAccessPolicy = {
  assertAdmin: async (role?: string | null) => {
    if (role === "admin") return;
    await supabaseAuthGateway.signOut();
    throw new Error("Akun ini tidak memiliki role admin.");
  },
  rejectSession: async (error: unknown): Promise<never> => {
    await supabaseAuthGateway.signOut();
    throw error;
  },
};
