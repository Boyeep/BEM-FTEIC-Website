import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { ApiSuccess } from "@/types/api";

type SignupWhitelistRow = {
  id: string;
  email: string;
  created_at: string;
  created_by?: string | null;
};

export interface SignupWhitelistEntry {
  id: string;
  email: string;
  createdAt: string;
  createdBy?: string | null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

const SIGNUP_ACCESS_ERROR_MESSAGE =
  "Email ini belum di-whitelist. Hubungi admin dashboard untuk meminta akses signup.";

function mapRowToEntry(row: SignupWhitelistRow): SignupWhitelistEntry {
  return {
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
    createdBy: row.created_by ?? null,
  };
}

function mapWhitelistErrorMessage(message?: string) {
  if (!message) {
    return "Gagal memproses email whitelist.";
  }

  if (message.includes("is_signup_email_whitelisted")) {
    return "Pemeriksaan whitelist email belum dikonfigurasi di Supabase.";
  }

  if (message.includes("signup_whitelist")) {
    return "Tabel signup whitelist belum tersedia di Supabase.";
  }

  return message;
}

export const signupWhitelistService = {
  normalizeEmail,

  isValidEmail(email: string) {
    return EMAIL_PATTERN.test(normalizeEmail(email));
  },

  isEmailWhitelisted: async (email: string): Promise<boolean> => {
    const normalizedEmail = normalizeEmail(email);

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      return false;
    }

    const { data, error } = await supabase.rpc("is_signup_email_whitelisted", {
      candidate_email: normalizedEmail,
    });

    if (error) {
      throw new Error(mapWhitelistErrorMessage(error.message));
    }

    return Boolean(data);
  },

  ensureEmailCanSignUp: async (email: string): Promise<string> => {
    const normalizedEmail = normalizeEmail(email);

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      throw new Error("Masukkan email yang valid.");
    }

    const isWhitelisted =
      await signupWhitelistService.isEmailWhitelisted(normalizedEmail);

    if (!isWhitelisted) {
      throw new Error(SIGNUP_ACCESS_ERROR_MESSAGE);
    }

    return normalizedEmail;
  },

  getEntries: async (): Promise<SignupWhitelistEntry[]> => {
    const { data } =
      await api.get<ApiSuccess<SignupWhitelistRow[]>>("/admin/whitelist");
    return (data.data || []).map(mapRowToEntry);
  },

  addEntry: async (
    email: string,
    createdBy: string,
  ): Promise<SignupWhitelistEntry> => {
    const normalizedEmail = normalizeEmail(email);

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      throw new Error("Masukkan email yang valid.");
    }

    const { data } = await api.post<ApiSuccess<SignupWhitelistRow>>(
      "/admin/whitelist",
      { email: normalizedEmail },
    );
    void createdBy;
    return mapRowToEntry(data.data);
  },

  removeEntry: async (id: string): Promise<void> => {
    await api.delete(`/admin/whitelist/${id}`);
  },
};
