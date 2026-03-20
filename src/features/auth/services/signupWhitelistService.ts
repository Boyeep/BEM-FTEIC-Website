import { supabase } from "@/lib/supabase";

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
    return "Gagal memproses signup whitelist.";
  }

  if (message.includes("is_signup_email_whitelisted")) {
    return "Whitelist signup belum dikonfigurasi di Supabase.";
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

  getEntries: async (): Promise<SignupWhitelistEntry[]> => {
    const { data, error } = await supabase
      .from("signup_whitelist")
      .select("id,email,created_at,created_by")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(mapWhitelistErrorMessage(error.message));
    }

    return ((data || []) as SignupWhitelistRow[]).map(mapRowToEntry);
  },

  addEntry: async (
    email: string,
    createdBy: string,
  ): Promise<SignupWhitelistEntry> => {
    const normalizedEmail = normalizeEmail(email);

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      throw new Error("Masukkan email yang valid.");
    }

    const { data, error } = await supabase
      .from("signup_whitelist")
      .insert({
        email: normalizedEmail,
        created_by: createdBy,
      })
      .select("id,email,created_at,created_by")
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new Error("Email ini sudah ada di whitelist.");
      }

      throw new Error(mapWhitelistErrorMessage(error.message));
    }

    return mapRowToEntry(data as SignupWhitelistRow);
  },

  removeEntry: async (id: string): Promise<void> => {
    const { data, error } = await supabase
      .from("signup_whitelist")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      throw new Error(mapWhitelistErrorMessage(error.message));
    }

    if (!data || data.length === 0) {
      throw new Error("Email whitelist tidak berhasil dihapus.");
    }
  },
};
