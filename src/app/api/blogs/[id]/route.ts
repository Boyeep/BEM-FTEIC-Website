import { NextResponse } from "next/server";

import { blogService } from "@/features/blog/services/blogService";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const response = await blogService.getPublicBlogById(context.params.id);
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Blog post not found.";
    return NextResponse.json(
      { message },
      { status: message.toLowerCase().includes("not found") ? 404 : 500 },
    );
  }
}
