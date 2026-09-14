import { NextRequest, NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE, adminExpectedToken, isValidAdminPassword } from "@/lib/auth";
import { getPublicOrigin } from "@/lib/origin";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const origin = getPublicOrigin(request);

  if (!(await isValidAdminPassword(password))) {
    const url = new URL("/admin", origin);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url);
  }

  const response = NextResponse.redirect(new URL("/admin", origin));
  response.cookies.set(ADMIN_AUTH_COOKIE, await adminExpectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 120,
    path: "/",
  });
  return response;
}
