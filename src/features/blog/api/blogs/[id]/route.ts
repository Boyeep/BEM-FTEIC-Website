import { NextResponse } from "next/server";

import { getBlogById } from "@/features/blog/api/mock-blogs";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const blog = getBlogById(params.id);

  if (!blog) {
    return NextResponse.json(
      { message: "Blog post not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ item: blog });
}
