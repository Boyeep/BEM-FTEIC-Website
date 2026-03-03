import { NextResponse } from "next/server";

import { eventService } from "@/features/event/services/eventService";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const response = await eventService.getDashboardEventById(
      context.params.id,
    );
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Event not found.";
    return NextResponse.json(
      { message },
      { status: message.toLowerCase().includes("not found") ? 404 : 500 },
    );
  }
}
