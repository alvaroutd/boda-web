import { NextRequest, NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE, adminExpectedToken } from "@/lib/auth";
import { getContent, saveContent, SiteContent } from "@/lib/content-store";

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  if (cookie !== (await adminExpectedToken())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<SiteContent>;
  const current = await getContent();
  const updated: SiteContent = { ...current, ...body };
  await saveContent(updated);

  return NextResponse.json({ ok: true });
}
