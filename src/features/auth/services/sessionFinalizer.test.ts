import { User as SupabaseUser } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";

const ensureEmailWhitelisted = vi.fn();
const ensureForUser = vi.fn();
const assertAdmin = vi.fn();
const rejectSession = vi.fn();
const syncServerSession = vi.fn();

vi.mock("./signupWhitelistService", () => ({
  signupWhitelistService: { ensureEmailWhitelisted },
}));
vi.mock("./profileService", () => ({
  profileService: { ensureForUser },
}));
vi.mock("./adminAccessPolicy", () => ({
  adminAccessPolicy: { assertAdmin, rejectSession },
}));
vi.mock("./serverSessionService", () => ({ syncServerSession }));

const user = {
  id: "user-1",
  email: "admin@example.com",
  created_at: "2026-07-30T00:00:00Z",
  user_metadata: { username: "Admin" },
} as unknown as SupabaseUser;

describe("finalizeAdminSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ensureEmailWhitelisted.mockResolvedValue(undefined);
    ensureForUser.mockResolvedValue({
      id: "user-1",
      email: "admin@example.com",
      username: "Admin BEM",
      role: "admin",
    });
    assertAdmin.mockResolvedValue(undefined);
    syncServerSession.mockResolvedValue(undefined);
  });

  it("enforces whitelist and role before syncing the server session", async () => {
    const { finalizeAdminSession } = await import("./sessionFinalizer");
    const result = await finalizeAdminSession(user, "access-token");
    expect(ensureEmailWhitelisted).toHaveBeenCalledWith(
      "admin@example.com",
      "session",
    );
    expect(assertAdmin).toHaveBeenCalledWith("admin");
    expect(syncServerSession).toHaveBeenCalledWith("access-token");
    expect(result.username).toBe("Admin BEM");
    expect(ensureEmailWhitelisted.mock.invocationCallOrder[0]).toBeLessThan(
      ensureForUser.mock.invocationCallOrder[0],
    );
    expect(ensureForUser.mock.invocationCallOrder[0]).toBeLessThan(
      assertAdmin.mock.invocationCallOrder[0],
    );
    expect(assertAdmin.mock.invocationCallOrder[0]).toBeLessThan(
      syncServerSession.mock.invocationCallOrder[0],
    );
  });

  it("rejects and terminates a session when whitelist validation fails", async () => {
    const failure = new Error("not whitelisted");
    ensureEmailWhitelisted.mockRejectedValueOnce(failure);
    rejectSession.mockRejectedValueOnce(failure);
    const { finalizeAdminSession } = await import("./sessionFinalizer");
    await expect(finalizeAdminSession(user, "token")).rejects.toThrow(
      "not whitelisted",
    );
    expect(rejectSession).toHaveBeenCalledWith(failure);
    expect(syncServerSession).not.toHaveBeenCalled();
  });

  it("does not misclassify profile API failures as a missing admin role", async () => {
    const failure = new Error("authentication service unavailable");
    ensureForUser.mockRejectedValueOnce(failure);
    const { finalizeAdminSession } = await import("./sessionFinalizer");
    await expect(finalizeAdminSession(user, "token")).rejects.toBe(failure);
    expect(assertAdmin).not.toHaveBeenCalled();
    expect(syncServerSession).not.toHaveBeenCalled();
  });

  it("does not sync a server session when admin authorization fails", async () => {
    assertAdmin.mockRejectedValueOnce(new Error("admin role required"));
    const { finalizeAdminSession } = await import("./sessionFinalizer");
    await expect(finalizeAdminSession(user, "token")).rejects.toThrow(
      "admin role required",
    );
    expect(syncServerSession).not.toHaveBeenCalled();
  });

  it("propagates server-session synchronization failures", async () => {
    syncServerSession.mockRejectedValueOnce(new Error("session sync failed"));
    const { finalizeAdminSession } = await import("./sessionFinalizer");
    await expect(finalizeAdminSession(user, "token")).rejects.toThrow(
      "session sync failed",
    );
  });

  it("validates a missing auth email as an empty whitelist identity", async () => {
    const { finalizeAdminSession } = await import("./sessionFinalizer");
    await finalizeAdminSession(
      { ...user, email: undefined } as unknown as SupabaseUser,
      "token",
    );
    expect(ensureEmailWhitelisted).toHaveBeenCalledWith("", "session");
  });

  it("shares one finalization across concurrent auth listeners", async () => {
    const { finalizeAdminSession } = await import("./sessionFinalizer");
    const first = finalizeAdminSession(user, "shared-token");
    const second = finalizeAdminSession(user, "shared-token");
    expect(second).toBe(first);
    await Promise.all([first, second]);
    expect(ensureEmailWhitelisted).toHaveBeenCalledTimes(1);
    expect(ensureForUser).toHaveBeenCalledTimes(1);
    expect(syncServerSession).toHaveBeenCalledTimes(1);
  });
});
