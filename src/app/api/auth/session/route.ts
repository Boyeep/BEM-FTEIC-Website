import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

const COOKIE_NAME = "bem_fteic_session";

export async function POST(request: Request) {
  const { accessToken } = (await request.json()) as { accessToken?: string };
  if (!accessToken) {
    return NextResponse.json({ message: "Missing token" }, { status: 400 });
  }
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  const store = await cookies();
  store.set(COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  return NextResponse.json({ success: true });
}
