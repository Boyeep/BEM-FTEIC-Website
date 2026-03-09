import { NextRequest, NextResponse } from "next/server";

import { galeriService } from "@/features/galeri/services/galeriService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "12");
    const sortBy = searchParams.get("sortBy") ?? undefined;
    const department = searchParams.get("department") ?? undefined;

    const response = await galeriService.getPublicGaleri(page, limit, {
      sortBy:
        sortBy === "oldest" ||
        sortBy === "title_asc" ||
        sortBy === "title_desc" ||
        sortBy === "latest"
          ? sortBy
          : undefined,
      department:
        department === "teknik_elektro" ||
        department === "teknik_informatika" ||
        department === "sistem_informasi" ||
        department === "teknik_komputer" ||
        department === "teknik_biomedik" ||
        department === "teknologi_informasi" ||
        department === "all"
          ? department
          : undefined,
    });
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch galeri.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
