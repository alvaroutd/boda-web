import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, expectedToken } from "@/lib/auth";
import { addRsvp } from "@/lib/rsvp-store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  if (cookie !== (await expectedToken())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const nombre = String(body.nombre ?? "").trim();
  const asistencia = body.asistencia === "si" ? "si" : "no";
  const acompanantes = Math.max(0, Number(body.acompanantes) || 0);
  const nombresAcompanantes = String(body.nombresAcompanantes ?? "").trim();
  const alergias = String(body.alergias ?? "").trim();

  if (!nombre) {
    return NextResponse.json({ error: "Falta el nombre" }, { status: 400 });
  }

  const rsvp = await addRsvp({ nombre, asistencia, acompanantes, nombresAcompanantes, alergias });
  return NextResponse.json({ ok: true, rsvp });
}
