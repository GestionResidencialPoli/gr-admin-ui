import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_TOKEN_COOKIE = "access_token";
const API_PREFIX = "/api/";
const SSO_CALLBACK_PATH = "/auth/sso/callback";
const commonUiUrl =
  process.env.COMMON_UI_URL || process.env.NEXT_PUBLIC_COMMON_UI_URL || "http://localhost:3000";

function forwardToBackend(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.delete("origin");
  headers.delete("referer");
  return NextResponse.next({ request: { headers } });
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith(API_PREFIX)) return forwardToBackend(request);

  if (request.nextUrl.pathname === SSO_CALLBACK_PATH) {
    return NextResponse.next({ headers: { "Referrer-Policy": "no-referrer" } });
  }

  if (!request.cookies.has(ACCESS_TOKEN_COOKIE)) {
    return NextResponse.redirect(new URL("/login", commonUiUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next|favicon.ico|.*\\..*).*)"],
};
