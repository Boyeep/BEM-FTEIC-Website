import { NextRequest, NextResponse } from "next/server";

import { getPaginatedBlogs } from "@/features/blog/api/mock-blogs";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "6");

  const response = getPaginatedBlogs(page, limit);
  return NextResponse.json(response);
}
