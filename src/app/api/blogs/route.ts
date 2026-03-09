import { NextRequest, NextResponse } from "next/server";

import { blogService } from "@/features/blog/services/blogService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "6");

    const response = await blogService.getPublicBlogs(page, limit);
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch blogs.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
