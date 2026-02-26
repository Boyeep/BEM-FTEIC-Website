import { NextResponse } from "next/server";

import { getBlogById } from "@/features/blog/api/mock-blogs";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, context: RouteContext) {
  const blog = getBlogById(context.params.id);

  if (!blog) {
    return NextResponse.json(
      { message: "Blog post not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ item: blog });
}
