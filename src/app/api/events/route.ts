import { NextRequest, NextResponse } from "next/server";

import { isEventDepartmentCategory } from "@/features/event/department";
import { eventService } from "@/features/event/services/eventService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "8");
    const startDate = searchParams.get("startDate") ?? undefined;
    const endDate = searchParams.get("endDate") ?? undefined;
    const sortBy = searchParams.get("sortBy") ?? undefined;
    const department = searchParams.get("department") ?? undefined;

    const response = await eventService.getPublicEvents(page, limit, {
      startDate,
      endDate,
      sortBy:
        sortBy === "oldest" ||
        sortBy === "title_asc" ||
        sortBy === "title_desc" ||
        sortBy === "latest"
          ? sortBy
          : undefined,
      department: isEventDepartmentCategory(department)
        ? department
        : undefined,
    });
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch events.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
