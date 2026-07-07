import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { CANONICAL_HOSTNAME, REDIRECT_HOSTNAMES } from "@/lib/site";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");

  if (!host) {
    return NextResponse.next();
  }

  const hostname = host.split(":")[0]?.toLowerCase();

  if (!hostname || !REDIRECT_HOSTNAMES.has(hostname)) {
    return NextResponse.next();
  }

  const redirectUrl = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    `https://${CANONICAL_HOSTNAME}`,
  );

  return NextResponse.redirect(redirectUrl, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
