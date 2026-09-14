import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, expectedToken, isValidPassword } from "@/lib/auth";
import { getPublicOrigin } from "@/lib/origin";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/");
  const origin = getPublicOrigin(request);

  if (!(await isValidPassword(password))) {
    const url = new URL("/entrar", origin);
    url.searchParams.set("from", from);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url);
  }

  const url = new URL(from || "/", origin);
  const response = NextResponse.redirect(url);
  response.cookies.set(AUTH_COOKIE, await expectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 120, // 120 días, hasta pasada la boda
    path: "/",
  });
  return response;
}
