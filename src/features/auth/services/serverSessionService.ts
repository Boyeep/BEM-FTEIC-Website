export async function syncServerSession(accessToken: string) {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  });
  if (!response.ok) {
    throw new Error("Failed to establish secure session");
  }
}

export async function clearServerSession() {
  await fetch("/api/auth/session", { method: "DELETE" });
}
