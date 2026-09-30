import { NextRequest, NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE, adminExpectedToken } from "@/lib/auth";
import { getRsvps, deleteRsvp } from "@/lib/rsvp-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  if (cookie !== (await adminExpectedToken())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const rsvps = await getRsvps();
  return NextResponse.json({ rsvps });
}

export async function DELETE(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  if (cookie !== (await adminExpectedToken())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = (await request.json()) as { id: string };
  await deleteRsvp(id);
  return NextResponse.json({ ok: true });
}
