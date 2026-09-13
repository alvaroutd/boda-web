import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, expectedToken, isValidPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/");

  if (!(await isValidPassword(password))) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("from", from);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = from || "/";
  url.search = "";
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
