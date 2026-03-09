import { NextResponse } from "next/server";

import { galeriService } from "@/features/galeri/services/galeriService";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const response = await galeriService.getDashboardGaleriById(
      context.params.id,
    );
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Galeri item not found.";
    return NextResponse.json(
      { message },
      { status: message.toLowerCase().includes("not found") ? 404 : 500 },
    );
  }
}
