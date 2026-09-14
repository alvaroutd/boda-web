import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, expectedToken } from "./lib/auth";
import { getPublicOrigin } from "./lib/origin";

const PUBLIC_PATHS = ["/entrar", "/api/entrar", "/admin", "/api/admin", "/api/hero-image"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.svg"
  ) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  const expected = await expectedToken();

  if (cookie && cookie === expected) {
    return NextResponse.next();
  }

  const url = new URL("/entrar", getPublicOrigin(request));
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
