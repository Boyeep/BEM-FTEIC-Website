import { User as SupabaseUser } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";

const normalizeEmail = vi.fn((email: string) => email.trim().toLowerCase());
const isValidEmail = vi.fn(() => true);
const ensureEmailCanSignUp = vi.fn();
const signIn = vi.fn();
const signUp = vi.fn();
const finalizeAdminSession = vi.fn();

vi.mock("./signupWhitelistService", () => ({
  signupWhitelistService: {
    normalizeEmail,
    isValidEmail,
    ensureEmailCanSignUp,
  },
}));
vi.mock("./supabaseAuthGateway", () => ({
  supabaseAuthGateway: { signIn, signUp },
}));
vi.mock("./sessionFinalizer", () => ({ finalizeAdminSession }));
vi.mock("./profileService", () => ({
  profileService: { ensureForUser: vi.fn() },
}));

const supabaseUser = {
  id: "admin-1",
  email: "admin@example.com",
  created_at: "2026-08-18T00:00:00Z",
} as unknown as SupabaseUser;

const mappedUser = {
  id: "admin-1",
  email: "admin@example.com",
  username: "Admin BEM",
  createdAt: "2026-08-18T00:00:00Z",
};

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://bem-fteic.com");
    isValidEmail.mockReturnValue(true);
    ensureEmailCanSignUp.mockResolvedValue("new-admin@example.com");
    signIn.mockResolvedValue({
      data: {
        user: supabaseUser,
        session: { access_token: "access-token" },
      },
      error: null,
    });
    finalizeAdminSession.mockResolvedValue(mappedUser);
  });

  it("logs in an existing admin without consulting the signup whitelist", async () => {
    const { authService } = await import("./authService");

    const result = await authService.login({
      email: " Admin@Example.com ",
      password: "secret123",
    });

    expect(signIn).toHaveBeenCalledWith("admin@example.com", "secret123");
    expect(ensureEmailCanSignUp).not.toHaveBeenCalled();
    expect(finalizeAdminSession).toHaveBeenCalledWith(
      supabaseUser,
      "access-token",
    );
    expect(result).toEqual({ user: mappedUser, accessToken: "access-token" });
  });

  it("still requires the signup whitelist when creating an account", async () => {
    signUp.mockResolvedValue({ data: { user: null }, error: null });
    const { authService } = await import("./authService");

    await authService.signup({
      username: "Admin Baru",
      email: "new-admin@example.com",
      password: "secret123",
    });

    expect(ensureEmailCanSignUp).toHaveBeenCalledWith("new-admin@example.com");
    expect(signUp).toHaveBeenCalledWith(
      "new-admin@example.com",
      "secret123",
      "Admin Baru",
      expect.stringMatching(/\/confirm-email$/),
    );
  });
});
