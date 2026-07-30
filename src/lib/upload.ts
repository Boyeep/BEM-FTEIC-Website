import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export async function uploadImageToAPI(file: File): Promise<string> {
  const apiURL = process.env.NEXT_PUBLIC_API_URL_PROD?.replace(/\/$/, "");
  if (!apiURL) {
    throw new Error("NEXT_PUBLIC_API_URL_PROD is not configured");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("You must be signed in to upload an image");
  }

  const body = new FormData();
  body.append("file", file);

  const response = await fetch(`${apiURL}/uploads/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body,
  });
  const payload = (await response.json()) as {
    data?: { url?: string };
    error?: { message?: string };
  };
  if (!response.ok || !payload.data?.url) {
    throw new Error(payload.error?.message || "Failed to upload image");
  }
  return payload.data.url;
}

export async function deleteImageFromAPI(url?: string | null): Promise<void> {
  if (!url || !url.includes("/uploads/")) return;
  await api.delete("/uploads/images", { params: { url } });
}
